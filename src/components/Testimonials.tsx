/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { Testimonial } from '../types';

interface TestimonialsProps {
  testimonials: Testimonial[];
  themeAccent: string;
}

const AUTOPLAY_DELAY = 6000; // 6 seconds per testimonial

export default function Testimonials({ testimonials, themeAccent }: TestimonialsProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const activeTestimonial = testimonials[activeIdx];

  const handleNext = () => {
    setProgress(0);
    setActiveIdx((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setProgress(0);
    setActiveIdx((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    if (isHovered) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }

    const stepTime = 50; // Update progress bar every 50ms
    const stepIncrement = (stepTime / AUTOPLAY_DELAY) * 100;

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + stepIncrement;
      });
    }, stepTime);

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [activeIdx, isHovered, testimonials.length]);

  return (
    <section 
      id="testimonials"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="py-24 px-6 md:px-16 lg:px-24 bg-[#050505] text-white relative z-10 overflow-hidden"
    >
      {/* Background radial soft light blobs */}
      <div className="absolute top-[30%] left-[20%] w-80 h-80 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-16 text-center">
          <span className="text-xs font-mono tracking-[0.3em] text-white/40 uppercase block mb-3">06 / CLIENT COMMENDATIONS</span>
          <h2 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight">
            Trusted by Creators & Founders
          </h2>
        </div>

        {/* Testimonials Glassmorphic Card Slider */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIdx}
              initial={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0)' }}
              exit={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="p-8 md:p-14 rounded-3xl glass-panel relative"
            >
              <Quote className="w-16 h-16 text-blue-500/10 absolute right-8 top-8" />

              {/* Stars Block */}
              <div className="flex gap-1 mb-8">
                {Array.from({ length: activeTestimonial.rating || 5 }).map((_, i) => (
                  <Star key={i} className="w-4.5 h-4.5 fill-blue-500 text-blue-500" />
                ))}
              </div>

              {/* Feedback Text Quote */}
              <blockquote className="text-xl md:text-2xl font-sans font-light leading-relaxed text-white/90 mb-10">
                "{activeTestimonial.feedback}"
              </blockquote>

              {/* Author Strip */}
              <div className="flex items-center gap-4">
                {activeTestimonial.avatarUrl ? (
                  <img
                    src={activeTestimonial.avatarUrl}
                    alt={activeTestimonial.clientName}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-full object-cover border border-white/10"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center font-display font-bold text-blue-400">
                    {activeTestimonial.clientName.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="text-base font-display font-bold text-white">
                    {activeTestimonial.clientName}
                  </h4>
                  <p className="text-xs font-mono text-white/40 mt-0.5 tracking-wider uppercase">
                    {activeTestimonial.clientRole && `${activeTestimonial.clientRole}, `}
                    <span className="text-blue-400">{activeTestimonial.clientCompany}</span>
                  </p>
                </div>
              </div>

              {/* Micro Autoplay progress bar at bottom of card */}
              <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-white/5 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-75"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Nav Controls Overlay */}
          <div className="flex gap-3 justify-end mt-8">
            <button
              onClick={handlePrev}
              className="p-3.5 rounded-full bg-[#0d0d0d] border border-white/5 hover:border-white/15 text-white/60 hover:text-white transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-3.5 rounded-full bg-[#0d0d0d] border border-white/5 hover:border-white/15 text-white/60 hover:text-white transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
