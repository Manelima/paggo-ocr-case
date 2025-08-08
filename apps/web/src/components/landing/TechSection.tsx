// apps/web/src/components/landing/TechSection.tsx
'use client';

import React from 'react';
import { Card } from '../ui/Card';
import styles from './TechSection.module.css';

type Technology = {
  name: string;
  category: string;
  colorClass: string;
  icon: string;
};

export const TechSection: React.FC = () => {
  const technologies: Technology[] = [
    { name: 'Next.js', category: 'Frontend', colorClass: styles.black, icon: '⚡' },
    { name: 'React', category: 'Frontend', colorClass: styles.blueLight, icon: '⚛️' },
    { name: 'Tailwind CSS', category: 'Frontend', colorClass: styles.cyan, icon: '🎨' },
    { name: 'NestJS', category: 'Backend', colorClass: styles.red, icon: '🏗️' },
    { name: 'TypeScript', category: 'Language', colorClass: styles.blue, icon: '📘' },
    { name: 'PostgreSQL', category: 'Database', colorClass: styles.blueDark, icon: '🐘' },
    { name: 'Prisma ORM', category: 'Database', colorClass: styles.gray, icon: '🔗' },
    { name: 'NextAuth.js', category: 'Auth', colorClass: styles.purple, icon: '🔐' },
    { name: 'Tesseract.js', category: 'OCR', colorClass: styles.green, icon: '👁️' },
    { name: 'Google Gemini', category: 'LLM', colorClass: styles.yellow, icon: '🤖' },
    { name: 'Vercel', category: 'Deploy', colorClass: styles.black, icon: '🚀' },
    { name: 'Docker', category: 'DevOps', colorClass: styles.blueVeryLight, icon: '🐳' }
  ];

  return (
    <section id="tecnologias" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            Stack Tecnológica
          </h2>
          <p className={styles.subtitle}>
            Tecnologias modernas e robustas para uma solução completa
          </p>
        </div>
        
        <div className={styles.techGrid}>
          {technologies.map((tech, index) => (
            <Card key={index} className={styles.techCard}>
              <div className={`${styles.iconContainer} ${tech.colorClass}`}>
                {tech.icon}
              </div>
              <h3 className={styles.techName}>{tech.name}</h3>
              <p className={styles.techCategory}>{tech.category}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};