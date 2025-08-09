// apps/web/src/app/documents/[id]/page.tsx
'use client';

import { use, useEffect, useState } from 'react'; 
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import ResultsCard from '../../dashboard/components/ResultsCards';
import styles from './DocumentDetail.module.css'; // Crie este arquivo CSS


type LlmInteraction = {
  prompt: string;
  answer: string;
  timestamp: string;
};
type DocumentData = {
  id: string;
  fileName: string;
  status: string;
  extractedText: string | null;
  llmInteractions: LlmInteraction[];
};

export default function DocumentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const { data: session, status } = useSession({ required: true });
  const router = useRouter();

  const [document, setDocument] = useState<DocumentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [prompt, setPrompt] = useState('');
  const [isQuerying, setIsQuerying] = useState(false);

  const fetchDocument = async () => {

    if (!session) return;
    
    try {
      const accessToken = (session as any).accessToken;
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/documents/${id}`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      setDocument(res.data);
      
      if (res.data.status.includes('PROCESSING')) {
        setTimeout(fetchDocument, 3000);
      }
    } catch (error) {
      toast.error('Não foi possível carregar o documento.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchDocument();
    }
  }, [status, session, id]); 

  const handleQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsQuerying(true);
    const loadingToast = toast.loading('Perguntando à IA...');

    try {
      const accessToken = (session as any).accessToken;
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/documents/${id}/query`,
        { prompt },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      setPrompt('');
      toast.dismiss(loadingToast);
      toast.success('Resposta recebida!');
      fetchDocument(); 
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Falha ao comunicar com a IA.');
      console.error(error);
    } finally {
      setIsQuerying(false);
    }
  };

  if (isLoading) return <p className="p-8">Carregando documento...</p>;
  if (!document) return <p className="p-8">Documento não encontrado.</p>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8 text-slate-900 dark:text-slate-50">
      <Toaster position='top-center'/>
      <header className="mb-8">
        <button onClick={() => router.push('/dashboard')} className="text-blue-500 hover:underline">
          &larr; Voltar para o Dashboard
        </button>
        <h1 className="text-3xl font-bold mt-2">{document.fileName}</h1>
        <p className="text-sm text-slate-500">Status: {document.status}</p>

        <a 
  href={`${process.env.NEXT_PUBLIC_API_URL}/documents/${id}/download`} 
  target="_blank"
  rel="noopener noreferrer"
  className={styles.downloadButton} 
>
  Baixar Relatório
</a>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Texto Extraído (OCR)</h2>
          <pre className="whitespace-pre-wrap font-sans text-sm bg-slate-100 dark:bg-slate-700 p-4 rounded-md overflow-auto max-h-96">
            {document.extractedText || 'Processando texto...'}
          </pre>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Pergunte ao Documento</h2>
          <div className="space-y-4 mb-4 overflow-auto max-h-80 pr-2">
            {document.llmInteractions.map((interaction, index) => (
              <div key={index}>
                <p className="font-semibold text-blue-500">Você:</p>
                <p className="mb-2 bg-slate-100 dark:bg-slate-700 p-2 rounded-md">{interaction.prompt}</p>
                <p className="font-semibold text-green-500">IA:</p>
                <p className="bg-slate-100 dark:bg-slate-700 p-2 rounded-md">{interaction.answer}</p>
              </div>
            ))}
          </div>
          <form onSubmit={handleQuerySubmit}>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Qual o valor total da fatura?"
              className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700"
              rows={3}
              disabled={document.status !== 'COMPLETED' || isQuerying}
            />
            <button
              type="submit"
              disabled={document.status !== 'COMPLETED' || isQuerying}
              className="mt-2 w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-slate-400 transition-colors"
            >
              {isQuerying ? 'Pensando...' : 'Perguntar à IA'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}