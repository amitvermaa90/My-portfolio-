/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  Search, 
  Lightbulb, 
  PenTool, 
  Layers, 
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const STEPS = [
  {
    id: 'discovery',
    num: '01',
    name: 'Discovery',
    title: 'Brand Alignment & Auditing',
    desc: 'We kickstart the project by deep-diving into your business goals, target demographic, brand values, and core challenges. This ensures everything we design is strategically anchored.',
    deliverables: ['Creative Brief Draft', 'Audience Profiles', 'Competitor Landscape Audit'],
    icon: Compass,
    color: 'from-blue-500 to-indigo-500'
  },
  {
    id: 'research',
    num: '02',
    name: 'Research',
    title: 'Visual Study & Moodboarding',
    desc: 'Before drawing curves, we map out visual spaces. We study historical and modern typographic systems, color theories, and paper materials. This creates a cohesive creative direction.',
    deliverables: ['Visual Moodboards', 'Color & Font Direction Boards', 'Texture & Material Strategy'],
    icon: Search,
    color: 'from-indigo-500 to-purple-500'
  },
  {
    id: 'concept',
    num: '03',
    name: 'Concept',
    title: 'Geometric Sketching & Renders',
    desc: 'Translating concepts into concrete visual ideas. We construct hundreds of vector layouts, grids, and geometric alignments to find the perfect unique brand mark.',
    deliverables: ['3 Raw Conceptual Directions', 'Grid System Construction', 'Bespoke Type Mockups'],
    icon: Lightbulb,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'design',
    num: '04',
    name: 'Design',
    title: 'Precision Crafting & Vectoring',
    desc: 'Once a conceptual direction is selected, we engineered it for flawless delivery. We align vectors with golden-ratio circles, fine-tune spacing, and create high-end Mockups.',
    deliverables: ['Golden Ratio Vector Assets', '3D Photorealistic Can/Box Mockups', 'Digital Collateral Templates'],
    icon: PenTool,
    color: 'from-pink-500 to-rose-500'
  },
  {
    id: 'revision',
    num: '05',
    name: 'Revision',
    title: 'Micro-Tuning & Optical Alignment',
    desc: 'We share the high-fidelity mockups with you and gather constructive feedback. We manually adjust tracking, kerning, and visual weights to reach pixel-perfection.',
    deliverables: ['Micro-tuned Font Files', 'Finished Palette Profiles', 'Refined Die-Cut Renders'],
    icon: Layers,
    color: 'from-rose-500 to-blue-500'
  },
  {
    id: 'delivery',
    num: '06',
    name: 'Delivery',
    title: 'Production Setup & Handover',
    desc: 'The finished files are prepared for global deployment. We bundle original editable vector files, print-ready CMYK formats, web-optimized PNGs/SVGs, and style guides.',
    deliverables: ['Vector Assets (CDR, AI, EPS)', 'Print-ready Spot-UV CMYK PDFs', 'Full Brand Guidelines Document'],
    icon: CheckCircle,
    color: 'from-blue-500 to-teal-500'
  }
];

export default function Process() {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeStep = STEPS[activeIdx];
  const StepIcon = activeStep.icon;

  return (
    <section id="process" className="py-24 px-6 md:px-16 lg:px-24 bg-[#0d0d0d] text-white border-y border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16 md:mb-24 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <span className="text-xs font-mono tracking-[0.3em] text-white/40 uppercase block mb-3">05 / THE ENGINE</span>
            <h2 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight">
              Design Process & Rhythm
            </h2>
          </div>
          <p className="text-sm text-white/40 max-w-sm font-light">
            Every project follows a systematic, strategic six-phase methodology that respects timeline targets and guarantees award-winning quality.
          </p>
        </div>

        {/* Process Horizontal Stepper bar */}
        <div className="flex justify-between items-center border-b border-white/5 pb-8 mb-12 overflow-x-auto scrollbar-none gap-8">
          {STEPS.map((step, idx) => {
            const isActive = activeIdx === idx;
            return (
              <button
                key={step.id}
                onClick={() => setActiveIdx(idx)}
                className="flex items-center gap-3 shrink-0 group cursor-pointer text-left focus:outline-none"
              >
                <div 
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono text-xs font-semibold border transition-all duration-500 ${
                    isActive 
                      ? 'bg-white text-black border-white shadow-lg' 
                      : 'bg-white/5 text-white/40 border-white/5 group-hover:border-white/10 group-hover:text-white'
                  }`}
                >
                  {step.num}
                </div>
                <div className="hidden sm:block">
                  <span className={`text-[10px] font-mono block tracking-widest uppercase transition-colors duration-300 ${isActive ? 'text-blue-400' : 'text-white/30'}`}>
                    PHASE
                  </span>
                  <span className={`text-sm font-display font-bold transition-colors duration-300 ${isActive ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>
                    {step.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Focus Step Detail Section */}
        <div className="p-8 md:p-12 rounded-3xl bg-[#050505] border border-white/5 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[400px]">
          {/* Visual Step Left side (5 columns) */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-6">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80">
                  <StepIcon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-blue-400 uppercase block">ACTIVE PHASE 0{activeIdx + 1}</span>
                  <h3 className="text-xl font-display font-black text-white uppercase tracking-wider">
                    {activeStep.name}
                  </h3>
                </div>
              </div>

              <h4 className="text-2xl md:text-3xl font-display font-extrabold text-white tracking-tight leading-tight mb-4">
                {activeStep.title}
              </h4>
              <p className="text-sm text-white/60 font-light leading-relaxed">
                {activeStep.desc}
              </p>
            </div>

            {/* Stepper progress controller */}
            <div className="flex gap-4 pt-6 border-t border-white/5">
              <button
                disabled={activeIdx === 0}
                onClick={() => setActiveIdx((prev) => Math.max(0, prev - 1))}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-xs font-mono disabled:opacity-35 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                PREVIOUS
              </button>
              <button
                disabled={activeIdx === STEPS.length - 1}
                onClick={() => setActiveIdx((prev) => Math.min(STEPS.length - 1, prev + 1))}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-xs font-mono disabled:opacity-35 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                NEXT PHASE
              </button>
            </div>
          </div>

          {/* Deliverables Right Side (7 columns) */}
          <div className="lg:col-span-7 bg-[#0d0d0d] p-8 md:p-10 rounded-2xl border border-white/5 self-stretch flex flex-col justify-center">
            <span className="text-xs font-mono text-white/40 tracking-wider uppercase block mb-6">EXPECTED DELIVERABLES & OUTCOMES</span>
            <div className="space-y-4">
              {activeStep.deliverables.map((deliv, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="w-6 h-6 rounded-md bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-mono text-[10px] font-bold">
                    {index + 1}
                  </div>
                  <span className="text-sm font-display font-semibold text-white">
                    {deliv}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
