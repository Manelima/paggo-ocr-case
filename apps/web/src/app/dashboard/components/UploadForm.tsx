// apps/web/src/app/dashboard/components/UploadForm.tsx
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

export default function UploadForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error('Por favor, selecione um arquivo.');
      return;
    }

    setIsUploading(true);
    const loadingToast = toast.loading('Enviando arquivo...');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const accessToken = (session as any)?.accessToken;
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/documents/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      console.log('Resposta da API de upload:', res.data);
      const { documentId } = res.data;
      console.log('Redirecionando para a URL:', `/documents/${documentId}`);

      toast.dismiss(loadingToast);
      toast.success('Upload concluído! Processando documento...');
      
      router.push(`/documents/${documentId}`);

    } catch (error) {
      setIsUploading(false);
      toast.dismiss(loadingToast);
      toast.error('Falha no upload. Tente novamente.');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Toaster />
      <input
        type="file"
        onChange={handleFileChange}
        accept=".pdf,.png,.jpg,.jpeg"
        className="block w-full text-sm text-slate-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100"
      />
      <button
        type="submit"
        disabled={isUploading}
        className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-slate-400 transition-colors"
      >
        {isUploading ? 'Enviando...' : 'Enviar e Processar'}
      </button>
    </form>
  );
}