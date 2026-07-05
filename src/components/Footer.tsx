/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ArrowUp, Lock } from 'lucide-react';
import { Setting } from '../types';

interface FooterProps {
  settings: Setting;
}

export default function Footer({ settings }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#050505] text-white/50 border-t border-white/5 py-12 px-6 md:px-16 lg:px-24 relative z-10 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Left Side: Brand name and Copyright */}
        <div className="flex flex-col md:flex-row items-center gap-4 text-xs">
          <span className="font-display font-black text-white tracking-widest text-sm">{settings.logoText}</span>
          <span className="hidden md:block text-white/10">|</span>
          <span className="font-mono text-[11px] tracking-wider">© {new Date().getFullYear()} ALL RIGHT RESERVED. PORTFOLIO ENGINE V4.0</span>
        </div>

        {/* Right Side: Back to Top and Admin lock link */}
        <div className="flex items-center gap-6">
          {/* Smooth Scroll to Top */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-[10px] font-mono tracking-widest hover:text-white transition-colors uppercase group cursor-pointer"
          >
            BACK TO HIGHEST
            <div className="p-2 rounded-full bg-white/5 border border-white/5 group-hover:bg-white group-hover:text-black transition-all">
              <ArrowUp className="w-3 h-3" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}
