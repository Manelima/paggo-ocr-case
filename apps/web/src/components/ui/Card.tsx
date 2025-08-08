
// apps/web/src/components/ui/Card.tsx
'use client';

import React from 'react';
import styles from './Card.module.css';

type CardProps = {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
};

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = true 
}) => {
  const hoverClass = hover ? styles.cardHover : '';
  
  return (
    <div className={`${styles.card} ${hoverClass} ${className}`}>
      {children}
    </div>
  );
};