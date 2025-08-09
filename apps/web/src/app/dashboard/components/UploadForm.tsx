// apps/web/src/app/dashboard/components/UploadForm.tsx
'use client';
import { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import styles from './UploadForm.module.css';
import { FileUp, LoaderCircle, File as FileIcon, Trash2 } from 'lucide-react';

// A prop agora se chama 'onUpload' e espera um 'File'
export default function UploadForm({ onUpload, isProcessing }: { onUpload: (file: File) => void, isProcessing: boolean }) {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Por favor, selecione um arquivo primeiro.");
      return;
    }
    onUpload(file); 
    removeFile();
  };

  const handleDrag = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); if (e.type === "dragenter" || e.type === "dragover") setDragActive(true); else if (e.type === "dragleave") setDragActive(false); };
  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]); };
  const removeFile = () => { setFile(null); if (inputRef.current) inputRef.current.value = ""; };
  const formatFileSize = (bytes: number) => { if (bytes === 0) return '0 Bytes'; const k = 1024; const i = Math.floor(Math.log(bytes) / Math.log(k)); return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + ['Bytes', 'KB', 'MB', 'GB'][i]; };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}><FileUp size={20} /> Upload de Documento</h2>
      </div>
      <div className={styles.cardContent}>
        <form onSubmit={handleSubmit}>
          <label htmlFor="fileInput" className={`${styles.uploadArea} ${dragActive ? styles.dragover : ''}`} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
            <div className={styles.uploadIcon}>📁</div>
            <div className={styles.uploadText}>Arraste e solte seu arquivo aqui</div>
            <div className={styles.uploadSubtext}>ou clique para selecionar (PDF, JPG, PNG)</div>
            <input type="file" ref={inputRef} id="fileInput" className={styles.fileInput} onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png"/>
          </label>
          {file && (
            <div className={styles.selectedFile}>
              <div className={styles.fileIcon}><FileIcon size={20}/></div>
              <div className={styles.fileInfo}>
                <div className={styles.fileName}>{file.name}</div>
                <div className={styles.fileSize}>{formatFileSize(file.size)}</div>
              </div>
              <button type="button" className={styles.removeFile} onClick={removeFile} aria-label="Remover arquivo"><Trash2 size={16}/></button>
            </div>
          )}
          <button type="submit" className={`${styles.btn} ${styles.btnPrimary} ${styles.btnFull}`} disabled={!file || isProcessing}>
            {isProcessing ? <><LoaderCircle size={16} className={styles.spinner} /> <span>Processando...</span></> : <span>Processar Documento</span>}
          </button>
        </form>
      </div>
    </div>
  );
}