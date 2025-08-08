
// apps/web/src/components/landing/CTASection.tsx
'use client';

import React from 'react';
import { Button } from '../ui/Button';
import { ExternalLink, Github } from 'lucide-react';
import styles from './CTASection.module.css';
import { useRouter } from 'next/navigation'; 


export const CTASection: React.FC = () => {
   const router = useRouter();  

  const handleAccessApp = () => {
    router.push('/login');
  };


  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          Pronto para testar?
        </h2>
        <p className={styles.subtitle}>
          Explore a aplicação completa e veja o OCR + LLM em ação
        </p>
        
        <div id="auth-section" className={styles.authSection}>
          <Button onClick={handleAccessApp}>
            <ExternalLink className="w-5 h-5" />
            <span>Acessar Aplicação</span>
          </Button>
          
          <Button 
            variant="secondary" 
            href="https://github.com/Manelima/paggo-ocr-case"
          >
            <Github className="w-5 h-5" />
            <span>Ver no GitHub</span>
          </Button>
        </div>
      </div>
    </section>
  );
};