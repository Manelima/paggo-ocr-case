// apps/web/src/app/dashboard/components/ResultsCard.tsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import styles from './ResultsCard.module.css'; 
import { Bot, User as UserIcon, Send, LoaderCircle } from 'lucide-react';
import { FileText, FileJson } from 'lucide-react'; 

type LlmInteraction = { 
  prompt: string; 
  answer: string; 
};
type DocumentData = {
  id: string;
  fileName: string;
  status: string;
  extractedText: string | null;
  llmInteractions: LlmInteraction[];
};

export default function ResultsCard({ document, refreshDocument }: { document: DocumentData | null, refreshDocument: () => void }) {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('ocr');
  const [prompt, setPrompt] = useState('');
  const [isQuerying, setIsQuerying] = useState(false);
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [document?.llmInteractions]);

  const handleQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || !document) return;

    setIsQuerying(true);
    const loadingToast = toast.loading('Perguntando à IA...');

    try {
const accessToken = session?.accessToken;
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/documents/${document.id}/query`,
        { prompt },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      setPrompt('');
      toast.dismiss(loadingToast);
      toast.success('Resposta recebida!');
      refreshDocument(); 
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Falha ao comunicar com a IA.');
      console.error(error);
    } finally {
      setIsQuerying(false);
    }
  };

  if (!document) {
    return (
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}><Bot size={20} /> Análise Inteligente</h2>
        </div>
        <div className={styles.cardContent} style={{ textAlign: 'center', margin: 'auto', color: '#6b7280' }}>
          <p>Faça o upload de um documento para ver a análise aqui...</p>
        </div>
      </div>
    );
  }



const handleDownload = async (format: 'txt' | 'pdf') => {
  if (!document || !session) return;
  const toastId = toast.loading(`Preparando seu .${format}...`);
  try {
    const accessToken = session.accessToken;
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/documents/${document.id}/download?format=${format}`,
      { 
        headers: { Authorization: `Bearer ${accessToken}` },
        responseType: 'blob',
      }
    );
    const url = window.URL.createObjectURL(response.data);
    const link = window.document.createElement('a');
    link.href = url;
    link.setAttribute('download', `relatorio-${document.fileName}.${format}`);
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    toast.success("Download iniciado!", { id: toastId });
  } catch {
    toast.error("Falha ao baixar o relatório.", { id: toastId });
  }
};

  return (
    <div className={styles.card}>
   <div className={styles.cardHeader}>
    <h2 className={styles.cardTitle}>{document.fileName}</h2>
    
    {/* Grupo de botões de download */}
    <div className={styles.downloadButtonGroup}>
        <button onClick={() => handleDownload('txt')} className={styles.downloadButton} disabled={document.status !== 'COMPLETED'}>
            <FileText size={16} />
            <span>.txt</span>
        </button>
        <button onClick={() => handleDownload('pdf')} className={styles.downloadButton} disabled={document.status !== 'COMPLETED'}>
            <FileJson size={16} />
            <span>.pdf</span>
        </button>
    </div>
</div>
      <div className={styles.cardContent}>
        <div className={styles.resultTabs}>
          <button 
            className={`${styles.tab} ${activeTab === 'ocr' ? styles.active : ''}`} 
            onClick={() => setActiveTab('ocr')}
          >
            Texto Extraído
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'chat' ? styles.active : ''}`} 
            onClick={() => setActiveTab('chat')}
          >
            Chat com IA
          </button>
        </div>

        {/* Conteúdo da Aba OCR */}
        <div className={`${styles.tabContent} ${activeTab === 'ocr' ? styles.active : ''}`}>
          <pre className={styles.ocrResult}>
            {document.status.includes('PROCESSING') ? 'Processando texto... Por favor, aguarde.' : document.extractedText || 'Nenhum texto foi extraído.'}
          </pre>
        </div>

        {/* Conteúdo da Aba Chat */}
        <div className={`${styles.tabContent} ${activeTab === 'chat' ? styles.active : ''}`}>
          <div className={styles.chatContainer}>
            <div className={styles.chatMessages} ref={chatMessagesRef}>
              {document.llmInteractions.length === 0 && (
                <div className={`${styles.message} ${styles.assistant}`}>
                  <div className={styles.messageAvatar}><Bot size={16}/></div>
                  <div className={styles.messageContent}>Olá! O texto foi extraído. Faça uma pergunta sobre o documento.</div>
                </div>
              )}
              {document.llmInteractions.map((interaction, index) => (
                <div key={index}>
                  <div className={`${styles.message} ${styles.user}`}>
                    <div className={styles.messageAvatar}><UserIcon size={16}/></div>
                    <div className={styles.messageContent}>{interaction.prompt}</div>
                  </div>
                  <div className={`${styles.message} ${styles.assistant}`}>
                    <div className={styles.messageAvatar}><Bot size={16}/></div>
                    <div className={styles.messageContent}>{interaction.answer}</div>
                  </div>
                </div>
              ))}
            </div>
            <form className={styles.chatInputContainer} onSubmit={handleQuerySubmit}>
              <input
                type="text"
                className={styles.chatInput}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Faça uma pergunta..."
                disabled={document.status !== 'COMPLETED' || isQuerying}
              />
              <button type="submit" className={styles.sendBtn} disabled={document.status !== 'COMPLETED' || isQuerying}>
                {isQuerying ? <LoaderCircle size={16} className={styles.spinner}/> : <Send size={16}/>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}