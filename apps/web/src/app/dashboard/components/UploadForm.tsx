// apps/web/src/app/dashboard/components/UploadForm.tsx
'use client';
import { useState, useRef } from 'react';
import styles from './UploadForm.module.css';
import { FileUp, File as FileIcon, Trash2, LoaderCircle } from 'lucide-react';

export default function UploadForm({ onUpload, isProcessing }: { onUpload: (file: File) => void, isProcessing: boolean }) {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
        // Validações de arquivo podem ser adicionadas aqui
        setFile(selectedFile);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const selectedFile = e.dataTransfer.files?.[0];
    if (selectedFile) {
        setFile(selectedFile);
    }
  };

  const removeFile = () => { setFile(null); if (inputRef.current) inputRef.current.value = ""; };
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (file) onUpload(file); };
  const formatFileSize = (bytes: number) => { if (bytes === 0) return '0 Bytes'; const k = 1024; const i = Math.floor(Math.log(bytes) / Math.log(k)); return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + ['Bytes', 'KB', 'MB', 'GB'][i]; };
  const handleDrag = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); if (e.type === "dragenter" || e.type === "dragover") setDragActive(true); else if (e.type === "dragleave") setDragActive(false); };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}><FileUp size={20} /> Upload de Documento</h2>
      </div>
      <div className={styles.cardContent}>
        <form onSubmit={handleSubmit}>
          <div 
            className={`${styles.uploadArea} ${dragActive ? styles.dragover : ''}`}
            onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <div className={styles.uploadIcon} >📁</div>
            <p className={styles.uploadText}>Arraste e solte seu arquivo aqui</p>
            <p className={styles.uploadSubtext}>ou clique para selecionar (PDF, JPG, PNG)</p>
            <input type="file" ref={inputRef} className={styles.fileInput} onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png"/>
          </div>

          {file && (
            <div className={styles.selectedFile}>
              <div className={styles.fileIcon}>📄</div>
              <div className={styles.fileInfo}>
                <p className={styles.fileName}>{file.name}</p>
                <p className={styles.fileSize}>{formatFileSize(file.size)}</p>
              </div>
              <button type="button" className={styles.removeFile} onClick={removeFile}><Trash2 size={16}/></button>
            </div>
          )}

          <button type="submit" className={`${styles.btn} ${styles.btnPrimary} ${styles.btnFull}`} disabled={!file || isProcessing}>
            {isProcessing ? <><div className={styles.spinner} /><span>Processando...</span></> : <span>Processar Documento</span>}
          </button>
        </form>
      </div>
    </div>
  );
}