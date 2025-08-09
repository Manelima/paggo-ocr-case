// apps/web/src/app/dashboard/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { LogOut, User as UserIcon, FileText } from 'lucide-react';

import styles from './Dashboard.module.css';
import UploadForm from './components/UploadForm';
import ResultsCard from './components/ResultsCards';
import DocumentList from './components/DocumentList';

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

export default function DashboardPage() {
  const { data: session, status } = useSession({ required: true });

  const [activeDocument, setActiveDocument] = useState<DocumentData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [documents, setDocuments] = useState<DocumentData[]>([]);

  const fetchDocumentList = useCallback(async () => {
    if (!session?.accessToken) return;
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/documents`,
        { headers: { Authorization: `Bearer ${session.accessToken}` } }
      );
      setDocuments(res.data);
    } catch {
      toast.error('Não foi possível carregar a lista de documentos.');
    }
  }, [session]);

  const fetchDocument = useCallback(async (docId: string) => {
    if (!session?.accessToken) return;
    setIsProcessing(true);
    setActiveDocument({ id: docId, status: 'PROCESSING', fileName: 'Carregando...', extractedText: 'Aguarde...', llmInteractions: [] });

    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/documents/${docId}`, { headers: { Authorization: `Bearer ${session.accessToken}` } });
      setActiveDocument(res.data);
      if (res.data.status.includes('PROCESSING')) {
        setTimeout(() => fetchDocument(docId), 3000);
      } else {
        setIsProcessing(false);
        fetchDocumentList();
      }
    } catch {
      toast.error('Não foi possível carregar os detalhes do documento.');
      setActiveDocument(null);
      setIsProcessing(false);
    }
  }, [session, fetchDocumentList]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchDocumentList();
    }
  }, [status, session, fetchDocumentList]);

  const handleUpload = async (file: File) => {
    if (!session?.accessToken) return;
    setIsProcessing(true);
    const toastId = toast.loading('Enviando arquivo...');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/documents/upload`,
        formData,
        { headers: { Authorization: `Bearer ${session.accessToken}` } }
      );
      toast.success('Upload concluído! Processando OCR...', { id: toastId });
      fetchDocument(res.data.documentId);
    } catch {
      toast.error('Falha no upload.', { id: toastId });
      setIsProcessing(false);
    }
  };

  if (status === 'loading') {
    return <div className={styles.loadingScreen}>Carregando...</div>;
  }

  return (
    <div className={styles.pageWrapper}>
      <Toaster position="top-center" />
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}><FileText size={20} color="white"/></div>
            <span className={styles.logoText}>Paggo OCR</span>
          </div>
          <div className={styles.userMenu}>
            <div className={styles.userInfo}><UserIcon size={16} /><span>{session?.user?.email}</span></div>
            <button className={styles.logoutBtn} onClick={() => signOut({ callbackUrl: '/' })}><LogOut size={16} /><span>Sair</span></button>
          </div>
        </div>
      </header>
      <main className={styles.main}>
        <div className={styles.welcome}>
          <h1 className={styles.welcomeTitle}>Dashboard OCR</h1>
          <p className={styles.welcomeSubtitle}>Transforme seus documentos em dados inteligentes com IA</p>
        </div>
        <div className={styles.dashboardGrid}>
          <div className={styles.leftColumn}>
            <UploadForm onUpload={handleUpload} isProcessing={isProcessing} />
            <DocumentList documents={documents} onDocumentSelect={fetchDocument} />
          </div>
          <div className={styles.rightColumn}>
           <ResultsCard 
  document={activeDocument} 
  refreshDocument={() => {
    if (activeDocument) fetchDocument(activeDocument.id);
  }}
/>
          </div>
        </div>
      </main>
    </div>
  );
}
