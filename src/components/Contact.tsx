/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Send, 
  Mail, 
  Phone, 
  Instagram, 
  Linkedin, 
  MessageSquare,
  Sparkles,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { submitContactMessage } from '../lib/firebase';
import { Setting } from '../types';

interface ContactProps {
  settings: Setting;
}

export default function Contact({ settings }: ContactProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setErrorMsg('All fields are required.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      await submitContactMessage({
        name,
        email,
        message
      });

      setSuccess(true);
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: [settings.themeAccent, '#8b5cf6', '#ffffff']
      });

      // Clear fields
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to deliver message. Please retry shortly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section 
      id="contact" 
      className="py-24 px-6 md:px-16 lg:px-24 bg-[#0d0d0d] text-white border-t border-white/5 relative z-10"
      style={{ '--theme-accent': settings.themeAccent } as React.CSSProperties}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          
          {/* Left Block: Contact Details & Info (5 columns) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono tracking-[0.3em] text-white/40 uppercase block mb-3">07 / COLLABORATION GATE</span>
              <h2 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight mb-8">
                Let's Craft Something Iconic.
              </h2>
              <p className="text-sm text-white/50 font-light leading-relaxed mb-12 max-w-sm">
                Have a premium project, a design consultation requirement, or want to discuss packaging grids? Reach out directly via coordinates below or drop a secure message.
              </p>

              {/* Secure contacts coordinates details */}
              <div className="space-y-6">
                <a 
                  href={`mailto:${settings.contactEmail}`}
                  className="flex items-center gap-4 group p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-white/30 tracking-widest block uppercase">EMAIL ENVELOPE</span>
                    <span className="text-sm font-display font-bold text-white group-hover:text-blue-400 transition-colors">
                      {settings.contactEmail}
                    </span>
                  </div>
                </a>

                {settings.contactPhone && (
                  <a 
                    href={`tel:${settings.contactPhone}`}
                    className="flex items-center gap-4 group p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-white/30 tracking-widest block uppercase">MOBILE COORDINATES</span>
                      <span className="text-sm font-display font-bold text-white group-hover:text-blue-400 transition-colors">
                        {settings.contactPhone}
                      </span>
                    </div>
                  </a>
                )}
              </div>
            </div>

            {/* Premium Social Links Bar */}
            <div className="mt-16 pt-12 border-t border-white/10">
              <span className="text-xs font-mono text-white/40 tracking-wider block mb-4">DIGITAL FOOTPRINTS</span>
              <div className="flex flex-wrap gap-3">
                {settings.socialInstagram && (
                  <a 
                    href={settings.socialInstagram} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="p-3.5 rounded-xl bg-[#111111] hover:bg-blue-500 hover:text-white border border-white/5 hover:border-blue-500 transition-all text-white/60 cursor-pointer"
                  >
                    <Instagram className="w-4.5 h-4.5" />
                  </a>
                )}
                {settings.socialBehance && (
                  <a 
                    href={settings.socialBehance} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="p-3.5 rounded-xl bg-[#111111] hover:bg-blue-500 hover:text-white border border-white/5 hover:border-blue-500 transition-all text-white/60 cursor-pointer flex items-center justify-center"
                  >
                    <span className="font-display font-black text-xs">Bē</span>
                  </a>
                )}
                {settings.socialLinkedIn && (
                  <a 
                    href={settings.socialLinkedIn} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="p-3.5 rounded-xl bg-[#111111] hover:bg-blue-500 hover:text-white border border-white/5 hover:border-blue-500 transition-all text-white/60 cursor-pointer"
                  >
                    <Linkedin className="w-4.5 h-4.5" />
                  </a>
                )}
                {settings.socialWhatsApp && (
                  <a 
                    href={settings.socialWhatsApp} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="p-3.5 rounded-xl bg-[#111111] hover:bg-blue-500 hover:text-white border border-white/5 hover:border-blue-500 transition-all text-white/60 cursor-pointer"
                  >
                    <MessageSquare className="w-4.5 h-4.5" />
                  </a>
                )}
              </div>
            </div>

          </div>

          {/* Right Block: Elegant Contact Form (7 columns) */}
          <div className="lg:col-span-7 bg-[#050505] p-8 md:p-12 rounded-3xl border border-white/5">
            <span className="text-xs font-mono text-white/30 uppercase tracking-widest block mb-8 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500" />
              SECURE ENCRYPTED TRANSMISSION
            </span>

            {success ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center"
              >
                <CheckCircle className="w-14 h-14 text-emerald-500 mx-auto mb-6" />
                <h3 className="text-2xl font-display font-extrabold text-white mb-2">Transmission Successful</h3>
                <p className="text-sm text-white/50 font-light max-w-sm mx-auto mb-8">
                  Your design inquiry has bypassed standard routing and landed directly in Amit's priority inbox. Expect a response within 12 hours.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs font-mono hover:bg-white/10 hover:border-white/20 transition-all"
                >
                  SEND ANOTHER ENVELOPE
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Form Fields */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono tracking-widest text-white/40 uppercase block">CLIENT NAME / AGENCY</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Julianne Vance"
                    required
                    disabled={loading}
                    className="w-full px-5 py-4 bg-[#0d0d0d] border border-white/5 focus:border-blue-500/50 rounded-xl text-sm font-sans focus:outline-none transition-colors duration-300 placeholder-white/20 disabled:opacity-50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono tracking-widest text-white/40 uppercase block">EMAIL ENVELOPE COORDINATES</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. julianne@auracosmetics.com"
                    required
                    disabled={loading}
                    className="w-full px-5 py-4 bg-[#0d0d0d] border border-white/5 focus:border-blue-500/50 rounded-xl text-sm font-sans focus:outline-none transition-colors duration-300 placeholder-white/20 disabled:opacity-50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono tracking-widest text-white/40 uppercase block">PROJECT DISCOURSE & SCOPE</label>
                  <textarea
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your design challenge or specific project guidelines..."
                    required
                    disabled={loading}
                    className="w-full px-5 py-4 bg-[#0d0d0d] border border-white/5 focus:border-blue-500/50 rounded-xl text-sm font-sans focus:outline-none transition-colors duration-300 placeholder-white/20 disabled:opacity-50 resize-none"
                  />
                </div>

                {/* Error Banner */}
                {errorMsg && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-mono text-red-400 flex items-center gap-3">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full relative py-4 bg-white text-black font-display font-medium text-xs tracking-widest uppercase rounded-xl overflow-hidden transition-all duration-300 hover:scale-102 flex items-center justify-center gap-2.5 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      TRANSMIT MESSAGE
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
