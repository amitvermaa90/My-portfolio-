/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { PenTool, Image, Layers, LucideIcon } from 'lucide-react';
import { Skill } from '../types';

interface SkillsProps {
  skills: Skill[];
  themeAccent: string;
}

// Icon mapper for dynamic icons
const ICON_MAP: { [key: string]: LucideIcon } = {
  PenTool: PenTool,
  Image: Image,
  Layers: Layers
};

interface SkillCardProps {
  skill: Skill;
  themeAccent: string;
}

function SkillCard({ skill, themeAccent }: SkillCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)');
  const [glowPosition, setGlowPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -((y - centerY) / centerY) * 12; // Maximum tilt rotation
    const rotateY = ((x - centerX) / centerX) * 12;

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.025)`);
    setGlowPosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)');
  };

  const IconComponent = ICON_MAP[skill.iconName || ''] || PenTool;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ 
        transform,
        transition: isHovered ? 'none' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className="relative p-8 rounded-3xl bg-[#0d0d0d] border border-white/5 overflow-hidden group cursor-pointer"
    >
      {/* Interactive Radial Hover Glow */}
      {isHovered && (
        <div 
          className="absolute w-56 h-56 rounded-full pointer-events-none opacity-20 blur-3xl"
          style={{
            left: `${glowPosition.x - 112}px`,
            top: `${glowPosition.y - 112}px`,
            background: `radial-gradient(circle, ${themeAccent} 0%, transparent 70%)`
          }}
        />
      )}

      {/* Subtle Border Glow */}
      <div 
        className="absolute inset-0 border border-white/0 rounded-3xl transition-colors duration-500 group-hover:border-white/10 pointer-events-none z-10"
      />

      {/* Header Info */}
      <div className="flex justify-between items-start mb-10 relative z-10">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white/80 group-hover:bg-white/10 group-hover:text-white transition-all duration-300">
          <IconComponent className="w-6 h-6" />
        </div>
        <div className="text-right font-mono">
          <span className="text-[10px] text-white/30 tracking-wider block uppercase mb-1">CRAFT LEVEL</span>
          <span className="text-3xl font-display font-black tracking-tighter text-white">
            {skill.percentage}<span className="text-sm font-mono text-white/40 ml-0.5">%</span>
          </span>
        </div>
      </div>

      {/* Skill Name */}
      <div className="relative z-10 mb-6">
        <h3 className="text-2xl font-display font-extrabold text-white tracking-tight mb-2 group-hover:text-blue-400 transition-colors duration-300">
          {skill.name}
        </h3>
        <p className="text-xs font-mono text-white/40 uppercase tracking-widest">
          {skill.projectsCount || 120}+ Core Deliverables
        </p>
      </div>

      {/* Progress Bar Container */}
      <div className="w-full h-[3px] bg-white/5 rounded-full relative overflow-hidden mb-6 z-10">
        <motion.div
          initial={{ width: '0%' }}
          whileInView={{ width: `${skill.percentage}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute left-0 top-0 bottom-0 rounded-full"
          style={{ background: `linear-gradient(to right, ${themeAccent}, #8b5cf6)` }}
        />
      </div>

      {/* Tool Showcase details */}
      <div className="flex flex-wrap gap-2 relative z-10">
        {skill.name === 'CorelDRAW' && (
          <>
            <span className="text-[10px] font-mono tracking-wider px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-white/60">Vector Layouts</span>
            <span className="text-[10px] font-mono tracking-wider px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-white/60">Large Format Print</span>
            <span className="text-[10px] font-mono tracking-wider px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-white/60">Bespoke Curves</span>
          </>
        )}
        {skill.name.includes('Photoshop') && (
          <>
            <span className="text-[10px] font-mono tracking-wider px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-white/60">Matte Painting</span>
            <span className="text-[10px] font-mono tracking-wider px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-white/60">3D Mockup Styling</span>
            <span className="text-[10px] font-mono tracking-wider px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-white/60">Color Grading</span>
          </>
        )}
        {skill.name.includes('Illustrator') && (
          <>
            <span className="text-[10px] font-mono tracking-wider px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-white/60">Golden Ratio Marks</span>
            <span className="text-[10px] font-mono tracking-wider px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-white/60">Typography Systems</span>
            <span className="text-[10px] font-mono tracking-wider px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-white/60">Brand Packaging</span>
          </>
        )}
      </div>
    </div>
  );
}

export default function Skills({ skills, themeAccent }: SkillsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  return (
    <section 
      ref={containerRef}
      id="skills"
      className="py-24 px-6 md:px-16 lg:px-24 bg-[#050505] text-white relative z-10"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16 md:mb-24">
          <span className="text-xs font-mono tracking-[0.3em] text-white/40 uppercase block mb-3">02 / CORE ARSENAL</span>
          <h2 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight">
            Creative Toolset & Mastery
          </h2>
        </div>

        {/* 3D Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <SkillCard skill={skill} themeAccent={themeAccent} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
