/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Check, Flame, Star, Zap, HelpCircle } from 'lucide-react';
import { Service } from '../types';

interface ServicesProps {
  services: Service[];
  themeAccent: string;
}

const DISCIPLINES = [
  { name: 'Logo Design', desc: 'Bespoke, vector-perfect emblems designed with strict mathematical grid precision.' },
  { name: 'Brand Identity', desc: 'Complete visual guidelines, palettes, typography guidelines, and digital asset templates.' },
  { name: 'Print Design', desc: 'Pre-press optimized flyers, brochures, portfolios, catalogs, and large-format designs.' },
  { name: 'Packaging', desc: '3D structural renders, paper specification consultation, die-cuts, and product wrappers.' },
  { name: 'Social Media Design', desc: 'Stunning premium templates, covers, highlight assets, and campaign feeds.' },
  { name: 'Poster Design', desc: 'Collector-grade vector or halftoned event and film displays with unique Swiss fonts.' },
  { name: 'Flyer Design', desc: 'Asymmetric layouts optimized for reading speed and high brand aesthetic.' },
  { name: 'Business Card', desc: 'Bespoke personal stationery engineered for spot-UV, embossing, or hot-stamping.' },
  { name: 'Thumbnail Design', desc: 'High-contrast graphic templates engineered for rapid click-through and impact.' },
  { name: 'Creative Consultation', desc: 'One-on-one session discussing visual architecture, grid alignment, or print materials.' }
];

export default function Services({ services, themeAccent }: ServicesProps) {
  return (
    <section 
      id="services" 
      className="py-24 px-6 md:px-16 lg:px-24 bg-[#050505] text-white relative z-10"
      style={{ '--theme-accent': themeAccent } as React.CSSProperties}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16 md:mb-24 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <span className="text-xs font-mono tracking-[0.3em] text-white/40 uppercase block mb-3">04 / CORE CAPABILITIES</span>
            <h2 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight">
              Design Services & Pricing
            </h2>
          </div>
          <p className="text-sm text-white/40 max-w-sm font-light">
            Providing turn-key creative solutions that bridge elite conceptual design with industrial-grade physical print production.
          </p>
        </div>

        {/* Disciplines Grid */}
        <div className="mb-24">
          <span className="text-xs font-mono text-white/30 uppercase tracking-widest block mb-8">SPECIFIC EXPERTISE SUB-DIVISIONS</span>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {DISCIPLINES.map((disc, idx) => (
              <div 
                key={idx}
                className="p-6 rounded-2xl bg-[#0d0d0d] border border-white/5 hover:border-white/10 transition-colors duration-300"
              >
                <h4 className="text-sm font-display font-bold text-white tracking-tight mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  {disc.name}
                </h4>
                <p className="text-xs text-white/50 leading-relaxed font-light">
                  {disc.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Cards */}
        <div>
          <span className="text-xs font-mono text-white/30 uppercase tracking-widest block mb-8">PREMIUM COLLABORATION PACKAGES</span>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              // Highlight the middle card
              const isPopular = index === 1;
              return (
                <div
                  key={service.id}
                  className={`relative p-8 rounded-3xl overflow-hidden flex flex-col justify-between ${
                    isPopular 
                      ? 'bg-[#0d0d0d] border-2 border-blue-500 shadow-2xl shadow-blue-500/10' 
                      : 'bg-[#0d0d0d] border border-white/5'
                  }`}
                >
                  {/* Popular pill overlay */}
                  {isPopular && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-[9px] font-mono tracking-widest uppercase px-3 py-1 rounded-full font-bold flex items-center gap-1">
                      <Flame className="w-3 h-3" />
                      MOST REQUESTED
                    </div>
                  )}

                  {/* Top content */}
                  <div>
                    <span className="text-xs font-mono text-white/40 tracking-wider uppercase block mb-2">Tier 0{index + 1}</span>
                    <h3 className="text-2xl font-display font-extrabold text-white tracking-tight mb-3">
                      {service.name}
                    </h3>
                    <p className="text-sm text-white/50 font-light leading-relaxed mb-8">
                      {service.description}
                    </p>

                    {/* Pricing */}
                    <div className="flex items-baseline gap-1.5 mb-8">
                      <span className="text-4xl md:text-5xl font-display font-black text-white tracking-tight">
                        {service.price}
                      </span>
                      <span className="text-xs font-mono text-white/40 tracking-wider">/ FLAT RATE</span>
                    </div>

                    {/* Features checklist */}
                    <div className="space-y-4 pt-8 border-t border-white/5">
                      {service.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <Check className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                          <span className="text-xs text-white/70 leading-relaxed font-light">
                            {feat}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dynamic hire CTA button */}
                  <button
                    onClick={() => {
                      const el = document.getElementById('contact');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`w-full mt-10 py-3.5 rounded-xl font-display font-medium text-xs tracking-widest uppercase transition-all duration-300 ${
                      isPopular 
                        ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg shadow-blue-500/10' 
                        : 'bg-white/5 text-white hover:bg-white/10 border border-white/5'
                    }`}
                  >
                    Select Package
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
