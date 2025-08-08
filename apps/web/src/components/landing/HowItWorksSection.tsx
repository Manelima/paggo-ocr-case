// apps/web/src/components/landing/HowItWorksSection.tsx
'use client';

import React from 'react';
import styles from './HowItWorksSection.module.css';

type Step = {
  number: number;
  title: string;
  commands: string[];
};

export const HowItWorksSection: React.FC = () => {
  const steps: Step[] = [
    {
      number: 1,
      title: 'Clone o repositório',
      commands: [
        'git clone https://github.com/Manelima/paggo-ocr-case.git',
        'cd paggo-ocr-case'
      ]
    },
    {
      number: 2,
      title: 'Configure as variáveis de ambiente',
      commands: [
        'cp .env.example .env',
        '# Preencha as variáveis: DATABASE_URL, JWT_SECRET, GEMINI_API_KEY'
      ]
    },
    {
      number: 3,
      title: 'Instale dependências e configure banco',
      commands: [
        'pnpm install',
        'docker-compose up -d',
        'pnpm --filter api prisma migrate dev'
      ]
    },
    {
      number: 4,
      title: 'Inicie a aplicação',
      commands: [
        'pnpm dev',
        '# Acesse http://localhost:3000'
      ]
    }
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            Como Rodar Localmente
          </h2>
          <p className={styles.subtitle}>
            Siga os passos para configurar o ambiente de desenvolvimento
          </p>
        </div>
        
        <div className={styles.stepsContainer}>
          <div className={styles.stepsList}>
            {steps.map((step) => (
              <div key={step.number} className={styles.step}>
                <div className={styles.stepNumber}>
                  {step.number}
                </div>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <div className={styles.codeBlock}>
                    {step.commands.map((command, index) => (
                      <span key={index} className={styles.commandLine}>
                        {command}
                        {index < step.commands.length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};