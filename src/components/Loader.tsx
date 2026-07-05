/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const WORDS = [
  'CONCEPT',
  'GRID SYSTEM',
  'MINIMALISM',
  'TYPOGRAPHY',
  'IDENTITY',
  'PACKAGING',
  'VECTOR',
  'CRAFT',
  'AMIT VERMA'
];

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const [progress, setProgress] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    // Increment progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 600);
          return 100;
        }
        const step = Math.floor(Math.random() * 8) + 4;
        return Math.min(prev + step, 100);
      });
    }, 120);

    // Swap words rapidly
    const wordInterval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % WORDS.length);
    }, 180);

    return () => {
      clearInterval(interval);
      clearInterval(wordInterval);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ 
          opacity: 0,
          y: -100,
          filter: 'blur(20px)',
          transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
        }}
        className="fixed inset-0 bg-[#050505] z-50 flex flex-col justify-between p-10 md:p-20 font-sans select-none"
      >
        {/* Top bar */}
        <div className="flex justify-between items-center text-[10px] md:text-xs font-mono text-white/40 tracking-[0.2em]">
          <div>INITIATING PORTFOLIO V4.0</div>
          <div className="text-right">© 2026 AMIT VERMA</div>
        </div>

        {/* Middle Brand Concept */}
        <div className="flex flex-col gap-4">
          <span className="text-[10px] font-mono text-white/30 tracking-[0.3em] uppercase">Creative Engine</span>
          <div className="h-20 flex items-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.span
                key={WORDS[wordIndex]}
                initial={{ y: 30, opacity: 0, filter: 'blur(4px)' }}
                animate={{ y: 0, opacity: 1, filter: 'blur(0)' }}
                exit={{ y: -30, opacity: 0, filter: 'blur(4px)' }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="text-4xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight text-white"
              >
                {WORDS[wordIndex]}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Progress Tracker */}
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-end font-mono">
            <div className="text-xs text-white/40 tracking-wider">LOADING SECURE REPOS</div>
            <div className="text-4xl md:text-5xl font-display font-light text-white tracking-tighter">
              {progress}<span className="text-sm font-mono text-white/40 ml-1">%</span>
            </div>
          </div>
          
          <div className="w-full h-[1px] bg-white/10 relative overflow-hidden">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'easeInOut' }}
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-blue-500 to-purple-600"
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
