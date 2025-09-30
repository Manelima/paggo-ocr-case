
// apps/web/src/components/landing/Header.tsx
'use client';
import { useState } from 'react';
import { FileText, X, Github } from 'lucide-react';
import { Badge } from '@/components/ui/Badge'; 
import styles from './header.module.css';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navItems = [
    { href: '#sobre', label: 'Sobre' },
    { href: '#tecnologias', label: 'Tecnologias' },
    { href: '#arquitetura', label: 'Arquitetura' }
  ];

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.headerContent}>
          <div className={styles.logoSection}>
            <div className={styles.logoIcon}>
              <FileText />
            </div>
            <span className={styles.logoText}>Paggo OCR</span>
            <Badge variant="success">
               Concluído!
            </Badge>
          </div>
          
          <nav className={styles.nav}>
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={styles.navLink}
              >
                {item.label}
              </a>
            ))}
            <a
              href="https://github.com/Manelima/paggo-ocr-case"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.githubLink}
            >
              <Github />
              <span>GitHub</span>
            </a>
          </nav>

          <button
            className={styles.mobileMenuButton}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X size={24} />
            ) : (
              <div className={styles.hamburgerIcon}>
                <div className={styles.hamburgerLine}></div>
                <div className={styles.hamburgerLine}></div>
                <div className={styles.hamburgerLine}></div>
              </div>
            )}
          </button>
        </div>

        {isMenuOpen && (
          <div className={styles.mobileMenu}>
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={styles.mobileNavLink}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a
              href="https://github.com/Manelima/paggo-ocr-case"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mobileNavLink}
              onClick={() => setIsMenuOpen(false)}
            >
              GitHub
            </a>
          </div>
        )}
      </div>
    </header>
  );
};