// apps/web/src/app/register/page.tsx
'use client';
import axios from 'axios'; 

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import styles from './Register.module.css'; 

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); 
    const loadingToastId = toast.loading('Criando sua conta...');

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        { email, password }
      );

      toast.success('Conta criada com sucesso! Redirecionando...', { id: loadingToastId });

      setTimeout(() => {
        router.push('/login');
      }, 2000);

    } catch (error) {
      let errorMessage = 'Falha ao criar conta. Tente novamente.';
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = (error.response.data as { message: string }).message || errorMessage;
      }
      toast.error(errorMessage, { id: loadingToastId });
      console.error(error);
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <Toaster position="top-center" />
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <div className={styles.logo}>
              <div className={styles.logoIcon}>📄</div>
              <span className={styles.logoText}>Paggo OCR</span>
            </div>
            <h1 className={styles.title}>Criar Conta</h1>
            <p className={styles.subtitle}>Comece a transformar seus documentos em dados inteligentes</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>Email</label>
              <input
                id="email"
                type="email"
                className={styles.input}
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>Senha</label>
              <input
                id="password"
                type="password"
                className={styles.input}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <button type="submit" className={styles.button} disabled={isLoading}>
              {isLoading ? <div className={styles.loadingSpinner} /> : <span>Criar Conta</span>}
            </button>
          </form>

          <p className={styles.footerText}>
            Já tem uma conta?{' '}
            <Link href="/login" className={styles.link}>Faça login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
