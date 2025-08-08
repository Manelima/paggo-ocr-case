// apps/web/src/app/page.tsx
'use client'; 

import { useEffect } from 'react';
import {Header} from '@/components/landing/Header';
import { HeroSection } from '@/components/landing/HeroSection';
 import  {AboutSection}  from '@/components/landing/AboutSection';
 import { TechSection } from '@/components/landing/TechSection';
 import  {ArchitectureSection}  from '@/components/landing/ArchitectureSection';
 import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
 import { CTASection } from '@/components/landing/CTASection';
 import  Footer  from '@/components/landing/Footer';

export default function HomePage() {
  useEffect(() => {
    const handleSmoothScroll = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement;
      const href = target.getAttribute('href');
      if (href?.startsWith('#')) {
        e.preventDefault();
        const targetElement = document.querySelector(href);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    };

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', handleSmoothScroll as EventListener);
    });

    return () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.removeEventListener('click', handleSmoothScroll as EventListener);
        });
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <TechSection />
        <ArchitectureSection />
        <HowItWorksSection />
        <CTASection /> 
      </main>
       <Footer />
    </div>
  );
}