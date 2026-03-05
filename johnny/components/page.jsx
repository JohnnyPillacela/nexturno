import React from 'react';
import Header from '@/components/landing/Header';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import HowItWorks from '@/components/landing/HowItWorks';
import Screens from '@/components/landing/Screens';
import FAQ from '@/components/landing/FAQ';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F7FAFF]">
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Screens />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}