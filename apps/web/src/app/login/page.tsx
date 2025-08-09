// apps/web/src/app/login/page.tsx
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import styles from './Login.module.css'; 

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const loadingToast = toast.loading('Entrando...');

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    toast.dismiss(loadingToast);

    if (result?.ok) {
      toast.success('Login bem-sucedido!');
      router.push('/dashboard');
    } else {
      toast.error('Credenciais inválidas. Tente novamente.');
    }
    setIsLoading(false);
  };

  return (
    <div className={styles.pageWrapper}>
      <Toaster position='top-center' />
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <div className={styles.logo}>
              <div className={styles.logoIcon}>📄</div>
              <span className={styles.logoText}>Paggo OCR</span>
            </div>
            <h1 className={styles.title}>Bem-vindo de Volta!</h1>
            <p className={styles.subtitle}>Acesse sua conta para continuar</p>
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
              />
            </div>

            <button type="submit" className={styles.button} disabled={isLoading}>
              {isLoading ? <div className={styles.loadingSpinner} /> : <span>Entrar</span>}
            </button>
          </form>

          <p className={styles.footerText}>
            Não tem uma conta?{' '}
            <Link href="/register" className={styles.link}>Registre-se</Link>
          </p>
        </div>
      </div>
    </div>
  );
}