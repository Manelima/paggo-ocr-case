
// apps/web/src/components/landing/ArchitectureSection.tsx
'use client';

import React from 'react';
import { Layers, Clock, Shield, Lightbulb, CheckCircle2 } from 'lucide-react';
import styles from './ArchitectureSection.module.css';

type Decision = {
  icon: React.ElementType; 
  iconClass: string;
  cardClass: string;
  benefitClass: string;
  title: string;
  description: string;
  benefit: string;
};

export const ArchitectureSection: React.FC = () => { 
  const decisions: Decision[] = [
    {
      icon: Layers, 
      iconClass: styles.blueIcon,
      cardClass: styles.blueCard,
      benefitClass: styles.blueBenefit,
      title: 'Monorepo com PNPM',
      description: 'Facilita o compartilhamento de tipos entre frontend e backend, especialmente os tipos gerados pelo Prisma, garantindo consistência e evitando duplicação.',
      benefit: 'Compartilhamento de tipos TypeScript'
    },
    {
      icon: Clock, 
      iconClass: styles.greenIcon,
      cardClass: styles.greenCard,
      benefitClass: styles.greenBenefit,
      title: 'OCR Assíncrono',
      description: 'Processamento em background para não bloquear requisições do usuário. Melhora significativamente a experiência durante extração de texto.',
      benefit: 'Processamento não-bloqueante'
    },
    {
      icon: Shield, 
      iconClass: styles.purpleIcon,
      cardClass: styles.purpleCard,
      benefitClass: styles.purpleBenefit,
      title: 'NextAuth.js',
      description: 'Gerenciamento de sessão no cliente com integração simples ao Next.js, enquanto o NestJS valida tokens JWT mantendo serviços desacoplados.',
      benefit: 'Autenticação JWT desacoplada'
    },
    {
      icon: Lightbulb, 
      iconClass: styles.yellowIcon,
      cardClass: styles.yellowCard,
      benefitClass: styles.yellowBenefit,
      title: 'Google Gemini LLM',
      description: 'Escolhido pela alta qualidade e generoso nível gratuito, perfeito para protótipos funcionais sem custos de desenvolvimento.',
      benefit: 'API gratuita e alta qualidade'
    }
  ];

  return (
    <section id="arquitetura" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            Decisões de Arquitetura
          </h2>
          <p className={styles.subtitle}>
            Escolhas técnicas pensadas para escalabilidade e manutenibilidade
          </p>
        </div>
        
        <div className={styles.decisionsGrid}>
          {decisions.map((decision) => (
            <div
              key={decision.title}
              className={`${styles.decisionCard} ${decision.cardClass}`}
            >
              <div className={styles.cardHeader}>
                <div className={`${styles.iconContainer} ${decision.iconClass}`}>
                  <decision.icon />
                </div>
                <h3 className={styles.cardTitle}>{decision.title}</h3>
              </div>
              <p className={styles.cardDescription}>{decision.description}</p>
              <div className={`${styles.benefitContainer} ${decision.benefitClass}`}>
                <CheckCircle2 />
                {decision.benefit}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};