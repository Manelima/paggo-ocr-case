// apps/web/src/components/landing/HeroSection.tsx
'use client';

import React from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ExternalLink, Github, FileText, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from './HeroSection.module.css';

export const HeroSection: React.FC = () => {
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.push(path);
  };

const features = [
  { icon: '✅', text: 'Tesseract.js OCR', textColor: '#4ade80' }, // Cor verde
  { icon: '✅', text: 'Google Gemini LLM', textColor: '#4ade80' }  // Cor verde
];

  return (
    <section className={`${styles.section} gradient-bg hero-pattern`}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.textContent}>
            <div className={styles.badge}>
              <Badge variant="warning">
                🚀 Desafio Técnico Paggo Group
              </Badge>
            </div>
            <h1 className={styles.title}>
              Transforme seus
              <span className={styles.highlight}> documentos</span>
              <br />em dados inteligentes
            </h1>
            <p className={styles.subtitle}>
              Solução fullstack completa com OCR + LLM usando Next.js, NestJS e Prisma.
              Extraia texto de faturas e interaja com IA para análises detalhadas.
            </p>
            <div className={styles.features}>
              {features.map((feature, index) => (
               <div key={index} className={styles.feature}>
    {}
    <span className={styles.featureIcon} style={{ color: feature.textColor }}>
        {feature.icon}
    </span>
    {}
    <span className={styles.featureText} style={{ color: feature.textColor }}>
        {feature.text}
    </span>
</div>
              ))}
            </div>
            <div className={styles.buttonGroup}>
              <Button onClick={() => handleNavigate('/login')}>
                <ExternalLink className="w-5 h-5" />
                <span>Acessar Aplicação</span>
              </Button>
              <Button
                variant="secondary"
                href="https://github.com/Manelima/paggo-ocr-case"
              >
                <Github className="w-5 h-5" />
                <span>Ver Código</span>
              </Button>
            </div>
          </div>
          <div className={styles.cardContainer}>
            <div className={`${styles.floatingCard} card-hover`} onClick={() => handleNavigate('/login')} style={{cursor: 'pointer'}}>
              <Card>
                <div className={styles.cardContent}>
                  <div className={styles.cardIcon}>
                    <FileText />
                  </div>
                  <h3 className={styles.cardTitle}>Upload de Faturas</h3>
                  <p className={styles.cardSubtitle}>Arraste e solte seus documentos</p>
                </div>
                <div className={styles.uploadArea}>
                  <div className={styles.uploadIcon}>
                    <Upload />
                  </div>
                  <p className={styles.uploadText}>PDF, JPG, PNG</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};