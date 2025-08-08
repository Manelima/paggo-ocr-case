// apps/web/src/components/landing/AboutSection.tsx
'use client';

import React from 'react';
import { Upload, FileText, MessageSquare } from 'lucide-react';
import styles from './AboutSection.module.css';

type Feature = {
  icon: React.ElementType; 
  iconBgClass: string;
  title: string;
  description: string;
};

export const AboutSection: React.FC = () => { 
  
  const features: Feature[] = [
    {
      icon: Upload,
      iconBgClass: styles.greenBg,
      title: 'Upload de Documentos',
      description: 'Usuários autenticados podem fazer upload de faturas e documentos para processamento via OCR.'
    },
    {
      icon: FileText, 
      iconBgClass: styles.blueBg,
      title: 'Extração OCR',
      description: 'Processamento assíncrono com pdf-parse e Tesseract.js para extrair texto com alta precisão.'
    },
    {
      icon: MessageSquare, 
      iconBgClass: styles.purpleBg,
      title: 'Interação com LLM',
      description: 'Integração com Google Gemini para explicações e análises interativas dos dados extraídos.'
    }
  ];

  return (
    <section id="sobre" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            Sobre o Projeto
          </h2>
          <p className={styles.subtitle}>
            Desafio técnico fullstack para o Paggo Group, construindo uma aplicação completa de OCR e interação com LLM
          </p>
        </div>
        
        <div className={styles.featuresGrid}>
          {features.map((feature) => ( 
            <div key={feature.title} className={styles.featureCard}>
              <div className={`${styles.iconContainer} ${feature.iconBgClass}`}>
                <feature.icon />
              </div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};