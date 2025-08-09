// apps/web/src/app/dashboard/components/DocumentList.tsx
'use client';
import styles from './DocumentList.module.css';
import { FileText } from 'lucide-react';

type Document = {
  id: string;
  fileName: string;
  status: string;
};

type DocumentListProps = {
  documents: Document[];
  onDocumentSelect: (docId: string) => void;
};

export default function DocumentList({ documents, onDocumentSelect }: DocumentListProps) {
  if (!documents || documents.length === 0) {
    return <p className={styles.emptyText}>Nenhum documento enviado ainda.</p>;
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>📜 Histórico de Documentos</h2>
      </div>
      <ul className={styles.list}>
        {}
        {documents.map((doc) => (
          <li 
            key={doc.id} 
            className={styles.listItem} 
            onClick={() => onDocumentSelect(doc.id)}
          >
            <FileText className={styles.fileIcon} size={20} />
            <span className={styles.fileName}>{doc.fileName}</span>
            <span className={`${styles.status} ${styles[doc.status.toLowerCase()]}`}>
              {doc.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}