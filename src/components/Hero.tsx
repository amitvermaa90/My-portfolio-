/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { Setting } from '../types';

interface HeroProps {
  settings: Setting;
}

export default function Hero({ settings }: HeroProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const words = settings.heroTitle.split(" ");

  return (
    <section 
      ref={containerRef}
      id="hero"
      className="relative min-h-screen flex flex-col justify-between pt-32 pb-16 px-6 md:px-16 lg:px-24 bg-[#050505] text-white overflow-hidden grid-lines"
      style={{ '--theme-accent': settings.themeAccent } as React.CSSProperties}
    >
      {/* Dynamic Glow Spotlight trailing mouse */}
      <div 
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none opacity-30 blur-[130px] transition-all duration-300 hidden md:block"
        style={{
          left: `${mousePosition.x - 300}px`,
          top: `${mousePosition.y - 300}px`,
          background: `radial-gradient(circle, ${settings.themeAccent} 0%, rgba(139, 92, 246, 0.1) 50%, transparent 100%)`
        }}
      />

      {/* Floating abstract geometric elements */}
      <div className="absolute top-[20%] right-[10%] w-72 h-72 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-[15%] left-[5%] w-96 h-96 bg-gradient-to-tr from-indigo-500/5 to-purple-500/5 rounded-full blur-3xl animate-pulse pointer-events-none" />

      {/* Hero content */}
      <div className="my-auto max-w-5xl relative z-10">
        {/* Upper Micro-Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono tracking-widest text-white/70 uppercase mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          AVAILABLE FOR GLOBAL FREELANCE
        </motion.div>

        {/* Large animated headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tight leading-[0.95] mb-8">
          {words.map((word, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 30, filter: 'blur(5px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0)' }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="inline-block mr-4 md:mr-6"
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Dynamic subtext */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="text-lg md:text-xl text-white/60 font-sans font-light max-w-2xl leading-relaxed mb-12"
        >
          {settings.heroSubtitle}
        </motion.p>

        {/* CTA buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="flex flex-wrap gap-5"
        >
          <button 
            onClick={() => scrollToSection('portfolio')}
            className="group relative flex items-center gap-2.5 px-8 py-4 bg-white text-black font-display font-medium rounded-full overflow-hidden transition-all duration-300 hover:scale-105"
            style={{ id: 'cta-portfolio' }}
          >
            {/* Hover sliding bg */}
            <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors duration-300">
              View Portfolio
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </span>
          </button>

          <button 
            onClick={() => scrollToSection('contact')}
            className="group relative px-8 py-4 bg-[#0d0d0d] hover:bg-[#111111] border border-white/15 text-white font-display font-medium rounded-full overflow-hidden transition-all duration-300 hover:border-white/40"
            style={{ id: 'cta-hire' }}
          >
            <span className="relative z-10 flex items-center gap-2">
              Hire Me
            </span>
          </button>
        </motion.div>
      </div>

      {/* Bottom info row & Scroll Indicator */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 1, delay: 1.3 }}
          className="flex gap-12 text-[10px] md:text-xs font-mono tracking-widest uppercase text-white/80"
        >
          <div>
            <div className="text-white/40 mb-1">FOCUS</div>
            <div>VISUAL STRATEGY</div>
          </div>
          <div>
            <div className="text-white/40 mb-1">CRAFT</div>
            <div>SWISS MODERNISM</div>
          </div>
        </motion.div>

        {/* Scroll down mouse wheel */}
        <motion.button 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 1, 
            delay: 1.5,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
          onClick={() => scrollToSection('about')}
          className="self-center md:self-auto flex flex-col items-center gap-2 group cursor-pointer"
        >
          <span className="text-[10px] font-mono tracking-[0.2em] text-white/40 group-hover:text-white transition-colors">SCROLL DOWN</span>
          <ChevronDown className="w-4 h-4 text-white/30 group-hover:text-white transition-colors" />
        </motion.button>
      </div>
    </section>
  );
}
