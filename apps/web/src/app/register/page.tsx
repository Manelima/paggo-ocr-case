// apps/web/src/app/register/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import styles from './Register.module.css'; // Importa nosso novo CSS!

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Inicia o estado de loading
    const loadingToast = toast.loading('Criando sua conta...');

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        { email, password }
      );

      toast.dismiss(loadingToast);
      toast.success('Conta criada com sucesso! Redirecionando...');

      setTimeout(() => {
        router.push('/login');
      }, 2000);

    } catch (error: any) {
      toast.dismiss(loadingToast);
      const errorMessage = 
        error.response?.data?.message || 
        'Falha ao criar conta. Tente novamente.';
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setIsLoading(false); // Finaliza o estado de loading
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <Toaster />
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
                placeholder="Mínimo 6 caracteres"
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