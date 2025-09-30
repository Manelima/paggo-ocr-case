// apps/web/src/components/landing/Footer.tsx
'use client';

import React from 'react';
import { FileText, Github, ExternalLink } from 'lucide-react';
import styles from './Footer.module.css';

type Link = {
  href: string;
  label: string;
};

export const Footer: React.FC = () => {
  const techList = [
    'Next.js 14',
    'NestJS',
    'Prisma ORM',
    'PostgreSQL',
    'Tesseract.js',
    'Google Gemini',
    'NextAuth.js',
    'TypeScript'
  ];

  const links: Link[] = [
    { href: 'https://futurolink.com', label: 'Aplicação Live' },
    { href: 'https://github.com/Manelima/paggo-ocr-case', label: 'Código Fonte' },
    { href: '#sobre', label: 'Documentação' }
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.brandSection}>
            <div className={styles.brandHeader}>
              <div className={styles.brandIcon}>
                <FileText />
              </div>
              <span className={styles.brandName}>Paggo OCR</span>
            </div>
            <p className={styles.brandDescription}>
              Solução completa de OCR + LLM desenvolvida como desafio técnico para o Grupo Paggo. 
              Demonstra expertise em desenvolvimento fullstack moderno.
            </p>
            <div className={styles.socialLinks}>
              <a 
                href="https://github.com/Manelima/paggo-ocr-case" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.socialLink}
              >
                <Github />
              </a>
              <a 
                href="https://futurolink.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.socialLink}
              >
                <ExternalLink />
              </a>
            </div>
          </div>
          
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Tecnologias</h4>
            <ul className={styles.list}>
              {techList.map((tech, index) => (
                <li key={index} className={styles.listItem}>
                  <span className={styles.listText}>{tech}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Links</h4>
            <ul className={styles.list}>
              {links.map((link, index) => (
                <li key={index} className={styles.listItem}>
                  <a 
                    href={link.href} 
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className={styles.listLink}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className={styles.divider}>
          <p className={styles.copyright}>
            &copy; 2025 Paggo OCR Case - Desenvolvido para o Desafio Técnico Paggo Group
          </p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;