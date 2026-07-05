/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Sliders, 
  Eye, 
  Check, 
  MessageSquare, 
  Calendar,
  Layers
} from 'lucide-react';
import { Project } from '../types';

interface PortfolioProps {
  projects: Project[];
  themeAccent: string;
}

const CATEGORIES = [
  'All',
  'Brand Identity',
  'Logo Design',
  'Poster',
  'Packaging',
  'Social Media',
  'Business Card',
  'Flyer',
  'Banner',
  'Print Design'
];

export default function Portfolio({ projects, themeAccent }: PortfolioProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [beforeAfterSplit, setBeforeAfterSplit] = useState(50); // percentage for visual comparison slider
  const [isBeforeAfterHovered, setIsBeforeAfterHovered] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Filter projects based on category
  const filteredProjects = selectedCategory === 'All' 
    ? projects 
    : projects.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());

  const handleSliderMove = (clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setBeforeAfterSplit(percentage);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      handleSliderMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleSliderMove(e.clientX);
  };

  return (
    <section 
      id="portfolio" 
      className="py-24 px-6 md:px-16 lg:px-24 bg-[#0d0d0d] text-white border-b border-white/5 relative z-10"
      style={{ '--theme-accent': themeAccent } as React.CSSProperties}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16 md:mb-24 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <span className="text-xs font-mono tracking-[0.3em] text-white/40 uppercase block mb-3">03 / CREATIVE ARCHIVE</span>
            <h2 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight">
              Selected Showcase
            </h2>
          </div>
          <p className="text-sm text-white/40 max-w-sm font-light">
            Crafting premium identities, meticulous packaging, and bold posters tailored for award-winning exposure.
          </p>
        </div>

        {/* Category Pill Filters */}
        <div className="flex flex-wrap gap-2.5 mb-16 pb-4 overflow-x-auto scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all duration-300 ${
                  isSelected 
                    ? 'bg-white text-black font-semibold shadow-lg shadow-white/5' 
                    : 'bg-[#121212] text-white/60 hover:text-white border border-white/5 hover:border-white/10'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Masonry Projects Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 15 }}
                transition={{ duration: 0.5, delay: index * 0.05, ease: 'easeOut' }}
                onClick={() => {
                  setActiveProject(project);
                  setActiveImageIndex(0);
                }}
                className="group cursor-pointer"
              >
                {/* Image Showcase Box */}
                <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-[#161616] border border-white/5 mb-4 group-hover:border-white/10 transition-colors">
                  {/* Hover visual scale image */}
                  <img
                    src={project.images[0]}
                    alt={project.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Gradient bottom fog */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <span className="flex items-center gap-1.5 text-xs font-mono tracking-widest text-white uppercase bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                      <Eye className="w-3.5 h-3.5" />
                      VIEW ARCHIVE
                    </span>
                  </div>

                  {/* Category overlay */}
                  <div className="absolute top-4 left-4">
                    <span className="text-[9px] font-mono tracking-wider font-semibold text-white/90 bg-[#0d0d0d]/80 backdrop-blur-sm border border-white/10 px-2.5 py-1 rounded-md uppercase">
                      {project.category}
                    </span>
                  </div>
                </div>

                {/* Typography metadata */}
                <div className="flex justify-between items-start px-2">
                  <div>
                    <h3 className="text-lg font-display font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="text-xs font-mono text-white/40 uppercase mt-0.5 tracking-wider">
                      {project.tools.slice(0, 2).join(" • ")}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {filteredProjects.length === 0 && (
          <div className="py-24 text-center border border-dashed border-white/10 rounded-2xl">
            <Layers className="w-8 h-8 text-white/20 mx-auto mb-4" />
            <p className="text-sm font-mono text-white/40">No projects archived in this division yet.</p>
          </div>
        )}
      </div>

      {/* DETAILED PROJECT MODAL OVERLAY */}
      <AnimatePresence>
        {activeProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10">
            {/* Backdrop filter cover */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveProject(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />

            {/* Modal Body Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-6xl h-[85vh] bg-[#0d0d0d] border border-white/10 rounded-3xl overflow-hidden z-10 flex flex-col"
            >
              {/* Header Nav Strip */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-white/5 bg-[#101010] relative z-20">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono tracking-widest text-white/40 bg-white/5 border border-white/5 px-2.5 py-1 rounded-md uppercase">
                    {activeProject.category}
                  </span>
                  <h3 className="text-base font-display font-bold text-white">
                    {activeProject.title}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveProject(null)}
                  className="p-2 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Content Body */}
              <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                  {/* Left Media Block (7 Columns) */}
                  <div className="lg:col-span-7 space-y-6">
                    {/* Primary Large Image Carousel Showcase */}
                    <div className="relative aspect-16/10 rounded-2xl overflow-hidden bg-[#161616] border border-white/5 group">
                      <img
                        src={activeProject.images[activeImageIndex]}
                        alt={activeProject.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />

                      {/* Carousel controls */}
                      {activeProject.images.length > 1 && (
                        <>
                          <button
                            onClick={() => setActiveImageIndex((prev) => (prev - 1 + activeProject.images.length) % activeProject.images.length)}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 backdrop-blur-md border border-white/10 hover:bg-black/80 transition-all text-white/80 cursor-pointer"
                          >
                            <ArrowLeft className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setActiveImageIndex((prev) => (prev + 1) % activeProject.images.length)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 backdrop-blur-md border border-white/10 hover:bg-black/80 transition-all text-white/80 cursor-pointer"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>

                    {/* Image Thumbnails Strip */}
                    {activeProject.images.length > 1 && (
                      <div className="flex gap-3 overflow-x-auto pb-1">
                        {activeProject.images.map((imgUrl, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveImageIndex(idx)}
                            className={`relative w-20 aspect-4/3 rounded-lg overflow-hidden border transition-all duration-300 ${
                              activeImageIndex === idx 
                                ? 'border-blue-500 scale-95 shadow-lg shadow-blue-500/10' 
                                : 'border-white/5 opacity-50 hover:opacity-100 hover:border-white/20'
                            }`}
                          >
                            <img src={imgUrl} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Interactive Before/After Visual Slider Component */}
                    {(activeProject.beforeUrl && activeProject.afterUrl) && (
                      <div className="space-y-4 pt-6 border-t border-white/5">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-mono text-white/40 tracking-wider flex items-center gap-1.5">
                            <Sliders className="w-3.5 h-3.5" />
                            INTERACTIVE DESIGN FINISH COMPARISON
                          </span>
                          <span className="text-[10px] font-mono text-white/30">DRAG MOUSE OVER SCREEN</span>
                        </div>

                        <div 
                          ref={sliderRef}
                          onMouseMove={handleMouseMove}
                          onTouchMove={handleTouchMove}
                          onMouseEnter={() => setIsBeforeAfterHovered(true)}
                          onMouseLeave={() => setIsBeforeAfterHovered(false)}
                          className="relative aspect-16/10 rounded-2xl overflow-hidden bg-[#161616] border border-white/5 cursor-ew-resize select-none"
                        >
                          {/* After (Full background image) */}
                          <img
                            src={activeProject.afterUrl}
                            alt="After Finish"
                            referrerPolicy="no-referrer"
                            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                          />

                          {/* Before (Clipped overlay image) */}
                          <div 
                            className="absolute inset-0 pointer-events-none"
                            style={{ clipPath: `polygon(0 0, ${beforeAfterSplit}% 0, ${beforeAfterSplit}% 100%, 0 100%)` }}
                          >
                            <img
                              src={activeProject.beforeUrl}
                              alt="Before Drafting"
                              referrerPolicy="no-referrer"
                              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                            />
                          </div>

                          {/* Slider Divider Bar */}
                          <div 
                            className="absolute top-0 bottom-0 w-[2px] bg-white pointer-events-none"
                            style={{ left: `${beforeAfterSplit}%` }}
                          >
                            {/* Drag handle button bubble */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white text-black border border-white flex items-center justify-center shadow-2xl">
                              <Sliders className="w-3 h-3 rotate-90" />
                            </div>
                          </div>

                          {/* Static floating badges */}
                          <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] font-mono border border-white/10 tracking-widest uppercase">
                            ORIGINAL
                          </div>
                          <div className="absolute bottom-4 right-4 bg-blue-500/80 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] font-mono border border-white/10 tracking-widest uppercase text-white">
                            FINAL FINISH
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Description Column (5 Columns) */}
                  <div className="lg:col-span-5 space-y-8">
                    {/* Project Bio */}
                    <div>
                      <span className="text-xs font-mono text-blue-400 uppercase tracking-widest mb-1.5 block">PROJECT OVERVIEW</span>
                      <h4 className="text-2xl font-display font-extrabold text-white tracking-tight mb-4">
                        {activeProject.title}
                      </h4>
                      <p className="text-sm text-white/75 leading-relaxed font-light">
                        {activeProject.description}
                      </p>
                    </div>

                    {/* Tools Used Section */}
                    <div>
                      <span className="text-xs font-mono text-white/40 uppercase tracking-widest mb-3 block">TOOLS APPLIED</span>
                      <div className="flex flex-wrap gap-2">
                        {activeProject.tools.map((tool) => (
                          <span
                            key={tool}
                            className="px-3 py-1.5 rounded-lg bg-[#141414] border border-white/5 text-xs font-mono text-white/70"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Design Process Detail (if available) */}
                    {activeProject.process && (
                      <div className="border-t border-white/5 pt-6">
                        <span className="text-xs font-mono text-blue-400 uppercase tracking-widest mb-4 block flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          DESIGN ENGINE CHRONICLES
                        </span>
                        <div className="space-y-4 text-xs font-light text-white/60 leading-relaxed max-h-60 overflow-y-auto pr-2">
                          {activeProject.process.split('\n').map((line, idx) => {
                            if (line.startsWith('**') || line.includes(':')) {
                              return (
                                <p key={idx} className="text-white/80 font-normal">
                                  {line.replace(/\*\*/g, '')}
                                </p>
                              );
                            }
                            return <p key={idx}>{line}</p>;
                          })}
                        </div>
                      </div>
                    )}

                    {/* Client Feedback Quote Block */}
                    {activeProject.clientFeedback && (
                      <div className="p-5 rounded-2xl bg-[#121212] border border-white/5 relative">
                        <MessageSquare className="w-5 h-5 text-blue-500/20 absolute right-4 top-4" />
                        <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block mb-2.5">CLIENT STATEMENT</span>
                        <blockquote className="text-xs italic text-white/70 font-light leading-relaxed">
                          {activeProject.clientFeedback}
                        </blockquote>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
