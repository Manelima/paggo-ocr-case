// apps/web/src/app/dashboard/components/ResultsCard.tsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import styles from './ResultsCard.module.css'; 
import { Bot, User as UserIcon, Send, LoaderCircle } from 'lucide-react';

// Tipos para nossos dados
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

// O componente agora aceita 'document' como nulo
export default function ResultsCard({ document, refreshDocument }: { document: DocumentData | null, refreshDocument: () => void }) {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('ocr');
  const [prompt, setPrompt] = useState('');
  const [isQuerying, setIsQuerying] = useState(false);
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  // Efeito para rolar para a última mensagem quando as interações mudam
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
      const accessToken = (session as any).accessToken;
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/documents/${document.id}/query`,
        { prompt },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      setPrompt('');
      toast.dismiss(loadingToast);
      toast.success('Resposta recebida!');
      refreshDocument(); // Avisa o pai para buscar os dados atualizados
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Falha ao comunicar com a IA.');
      console.error(error);
    } finally {
      setIsQuerying(false);
    }
  };

  // Se não houver documento ativo, mostra o placeholder
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

  // Se houver um documento, renderize a interface completa
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>{document.fileName}</h2>
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