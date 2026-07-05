/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Award, Briefcase, Calendar, Star } from 'lucide-react';
import { Setting } from '../types';

interface AboutProps {
  settings: Setting;
}

const TIMELINE_EVENTS = [
  {
    year: '2024 - PRESENT',
    title: 'Elite Independent Graphic Designer',
    subtitle: 'Global Freelance & Agency Collaborations',
    desc: 'Engineering premium visual identities, luxury product packaging, and high-fidelity collateral for international consumer brands and creative studios.',
    icon: Star
  },
  {
    year: '2021 - 2024',
    title: 'Senior Brand Architect',
    subtitle: 'Vivid Graphics Studio',
    desc: 'Led a team of visual designers executing print grids, high-volume branding releases, and major event campaigns. Mastered advanced vector tooling in CorelDRAW.',
    icon: Briefcase
  },
  {
    year: '2019 - 2021',
    title: 'Visual Specialist',
    subtitle: 'Bespoke Print & Pack Co.',
    desc: 'Focused on structural box engineering, pre-press setups, CMYK alignments, and tactile material studies. Bridged digital concepts with physical production.',
    icon: Award
  },
  {
    year: '2016 - 2019',
    title: 'Academic Foundations & Craft Discovery',
    subtitle: 'Academy of Fine Arts',
    desc: 'Deep study of typography theory, editorial grid systems, and color physics. Began mastering CorelDRAW, Illustrator, and Photoshop.',
    icon: Calendar
  }
];

interface CounterProps {
  end: number;
  suffix?: string;
  duration?: number;
}

function AnimatedCounter({ end, suffix = '', duration = 2000 }: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const progressPercentage = Math.min(progress / duration, 1);
      
      setCount(Math.floor(progressPercentage * end));

      if (progressPercentage < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, isInView]);

  return (
    <div ref={ref} className="text-4xl md:text-5xl font-display font-bold text-white tracking-tighter">
      {count}{suffix}
    </div>
  );
}

export default function About({ settings }: AboutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  return (
    <section 
      ref={containerRef}
      id="about" 
      className="py-24 px-6 md:px-16 lg:px-24 bg-[#0d0d0d] text-white border-y border-white/5 relative z-10"
      style={{ '--theme-accent': settings.themeAccent } as React.CSSProperties}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-16 md:mb-24 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <span className="text-xs font-mono tracking-[0.3em] text-white/40 uppercase block mb-3">01 / BRAND DISCIPLINE</span>
            <h2 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight">
              Journey, Passion & Philosophy
            </h2>
          </div>
          <div className="text-sm font-mono text-white/40 max-w-xs tracking-wider">
            "Simplicity is the ultimate sophistication. Craft is in the details."
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left Column: Bio & Stat Counters */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <h3 className="text-xl md:text-2xl font-display font-semibold mb-6 tracking-tight">
                Architecting visual systems with surgical precision.
              </h3>
              <div className="space-y-6 text-white/60 font-light leading-relaxed">
                {settings.aboutText.split('\n\n').map((para, index) => (
                  <p key={index}>{para}</p>
                ))}
              </div>
            </div>

            {/* Micro bento-style stats counters */}
            <div className="grid grid-cols-2 gap-4 mt-12 pt-12 border-t border-white/10">
              <div className="p-5 rounded-2xl bg-[#111111] border border-white/5">
                <AnimatedCounter end={450} suffix="+" />
                <span className="text-[11px] font-mono tracking-widest text-white/40 uppercase block mt-1">Projects Completed</span>
              </div>
              <div className="p-5 rounded-2xl bg-[#111111] border border-white/5">
                <AnimatedCounter end={180} suffix="+" />
                <span className="text-[11px] font-mono tracking-widest text-white/40 uppercase block mt-1">Happy Clients</span>
              </div>
              <div className="p-5 rounded-2xl bg-[#111111] border border-white/5">
                <AnimatedCounter end={10} suffix="+" />
                <span className="text-[11px] font-mono tracking-widest text-white/40 uppercase block mt-1">Years Learning</span>
              </div>
              <div className="p-5 rounded-2xl bg-[#111111] border border-white/5">
                <AnimatedCounter end={18} suffix="K+" />
                <span className="text-[11px] font-mono tracking-widest text-white/40 uppercase block mt-1">Design Hours</span>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Timeline */}
          <div className="lg:col-span-7">
            <div className="relative pl-6 md:pl-12 border-l border-white/10 space-y-12">
              {/* Dynamic vertical glowing line */}
              <motion.div 
                initial={{ height: 0 }}
                animate={isInView ? { height: '100%' } : {}}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
                className="absolute left-0 top-0 w-[2px] bg-gradient-to-b from-blue-500 to-purple-500 origin-top"
              />

              {TIMELINE_EVENTS.map((event, index) => {
                const Icon = event.icon;
                return (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.15 }}
                    className="relative group"
                  >
                    {/* Glowing Node Icon */}
                    <div className="absolute -left-10 md:-left-16 top-1.5 w-8 h-8 rounded-full bg-[#111111] border border-white/15 flex items-center justify-center text-white/70 group-hover:border-blue-500 group-hover:text-white transition-all duration-300 z-10 shadow-lg">
                      <Icon className="w-3.5 h-3.5" />
                    </div>

                    <div className="text-xs font-mono text-blue-400 tracking-widest uppercase mb-2">
                      {event.year}
                    </div>
                    <h4 className="text-xl font-display font-bold text-white mb-1 tracking-tight group-hover:text-blue-400 transition-colors duration-300">
                      {event.title}
                    </h4>
                    <div className="text-xs font-mono text-white/40 tracking-wider mb-3">
                      {event.subtitle}
                    </div>
                    <p className="text-sm text-white/60 font-light leading-relaxed max-w-xl">
                      {event.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
