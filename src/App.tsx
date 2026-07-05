/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, 
  X, 
  Sparkles, 
  ShieldAlert, 
  ExternalLink 
} from 'lucide-react';

// Components
import CustomCursor from './components/CustomCursor';
import Loader from './components/Loader';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Portfolio from './components/Portfolio';
import Services from './components/Services';
import Process from './components/Process';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';

// Types and Data
import { Project, Setting, Skill, Service, Testimonial } from './types';
import { defaultData } from './data/defaultData';

// Firebase Helpers
import { 
  fetchSettings, 
  fetchProjects, 
  fetchSkills, 
  fetchServices, 
  fetchTestimonials
} from './lib/firebase';

export default function App() {
  // Master Site Data
  const [settings, setSettings] = useState<Setting>(defaultData.settings);
  const [projects, setProjects] = useState<Project[]>(defaultData.projects);
  const [skills, setSkills] = useState<Skill[]>(defaultData.skills);
  const [services, setServices] = useState<Service[]>(defaultData.services);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultData.testimonials);

  // States
  const [loading, setLoading] = useState(true);
  const [adminOpen, setAdminOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Load Data
  const loadData = async () => {
    try {
      // Fetch dynamic content from Firestore
      const [dbSettings, dbProjects, dbSkills, dbServices, dbTestimonials] = await Promise.all([
        fetchSettings(),
        fetchProjects(),
        fetchSkills(),
        fetchServices(),
        fetchTestimonials()
      ]);

      if (dbSettings) setSettings(dbSettings);
      if (dbProjects && dbProjects.length > 0) {
        // Sort by order rank ascending
        setProjects(dbProjects.sort((a, b) => (a.order || 0) - (b.order || 0)));
      }
      if (dbSkills && dbSkills.length > 0) setSkills(dbSkills);
      if (dbServices && dbServices.length > 0) setServices(dbServices);
      if (dbTestimonials && dbTestimonials.length > 0) setTestimonials(dbTestimonials);

    } catch (err) {
      console.warn('Firestore fetch failed. Falling back gracefully to premium default local data.', err);
      // Fallback is already initialized in state with defaultData
    } finally {
      // Keep loader visible for a minimum elegant duration
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }
  };

  useEffect(() => {
    loadData();

    // Scroll listener for header style changes
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    // Dynamic SEO update based on retrieved settings
    document.title = settings.seoTitle || 'Amit Verma | Elite Graphic Designer';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', settings.seoDescription || '');
    }

    // Monitor url paths for direct /admin URL entry
    const handleLocationChange = () => {
      if (window.location.pathname === '/admin' || window.location.hash === '#admin') {
        setAdminOpen(true);
      } else {
        setAdminOpen(false);
      }
    };
    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, [settings.seoTitle, settings.seoDescription]);

  // Support live-updating the UI state before committing to Firestore (Live Preview Mode)
  const handleTemporaryUpdate = (newData: {
    settings?: Setting;
    projects?: Project[];
    skills?: Skill[];
    services?: Service[];
    testimonials?: Testimonial[];
  }) => {
    if (newData.settings) setSettings(newData.settings);
    if (newData.projects) setProjects(newData.projects.sort((a, b) => (a.order || 0) - (b.order || 0)));
    if (newData.skills) setSkills(newData.skills);
    if (newData.services) setServices(newData.services);
    if (newData.testimonials) setTestimonials(newData.testimonials);
  };

  const toggleAdmin = (open: boolean) => {
    setAdminOpen(open);
    if (open) {
      window.history.pushState(null, '', '/admin');
    } else {
      window.history.pushState(null, '', '/');
    }
  };

  return (
    <div className="bg-[#050505] text-white min-h-screen relative selection:bg-blue-500 selection:text-white overflow-x-hidden">
      
      {/* 1. Custom Interactive Tracker Cursor */}
      <CustomCursor themeAccent={settings.themeAccent} />

      {/* 2. Premium Loader / Brand intro */}
      <AnimatePresence>
        {loading && (
          <Loader onComplete={() => setLoading(false)} />
        )}
      </AnimatePresence>

      {/* 3. Floating Glass Navigation Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled 
            ? 'py-4 bg-[#050505]/70 backdrop-blur-md border-b border-white/5' 
            : 'py-6 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          {/* Logo Brand Title */}
          <a href="#" className="font-display font-black text-lg tracking-widest text-white uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            {settings.logoText}
          </a>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-8 text-[11px] font-mono tracking-widest uppercase">
            {settings.sectionsVisibility.portfolio && <a href="#portfolio" className="hover:text-blue-400 transition-colors">Portfolios</a>}
            {settings.sectionsVisibility.about && <a href="#about" className="hover:text-blue-400 transition-colors">Biographies</a>}
            {settings.sectionsVisibility.skills && <a href="#skills" className="hover:text-blue-400 transition-colors">Expertise</a>}
            {settings.sectionsVisibility.services && <a href="#services" className="hover:text-blue-400 transition-colors">Pricing</a>}
            {settings.sectionsVisibility.process && <a href="#process" className="hover:text-blue-400 transition-colors">Methods</a>}
            {settings.sectionsVisibility.testimonials && <a href="#testimonials" className="hover:text-blue-400 transition-colors">Reviews</a>}
            {settings.sectionsVisibility.contact && <a href="#contact" className="hover:text-blue-400 transition-colors">Contact</a>}
          </nav>

          {/* Desktop Right CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => toggleAdmin(true)}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-[10px] font-mono tracking-widest uppercase transition-all cursor-pointer"
            >
              CMS PORTAL
            </button>
            <a 
              href="#contact" 
              className="px-5 py-2.5 bg-white text-black font-display font-bold text-[10px] tracking-widest uppercase rounded-lg hover:bg-white/90 transition-all"
            >
              HIRE ME
            </a>
          </div>

          {/* Mobile Menu Toggle button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white/80 hover:text-white cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* 4. Mobile Menu Drawer overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-30 bg-[#050505] pt-24 px-6 md:hidden flex flex-col justify-between"
          >
            <nav className="flex flex-col gap-6 text-xl font-display font-black tracking-wider uppercase">
              {settings.sectionsVisibility.portfolio && <a href="#portfolio" onClick={() => setMobileMenuOpen(false)} className="hover:text-blue-400">Portfolio</a>}
              {settings.sectionsVisibility.about && <a href="#about" onClick={() => setMobileMenuOpen(false)} className="hover:text-blue-400">Biography</a>}
              {settings.sectionsVisibility.skills && <a href="#skills" onClick={() => setMobileMenuOpen(false)} className="hover:text-blue-400">Expertise</a>}
              {settings.sectionsVisibility.services && <a href="#services" onClick={() => setMobileMenuOpen(false)} className="hover:text-blue-400">Pricing</a>}
              {settings.sectionsVisibility.process && <a href="#process" onClick={() => setMobileMenuOpen(false)} className="hover:text-blue-400">Methods</a>}
              {settings.sectionsVisibility.testimonials && <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="hover:text-blue-400">Reviews</a>}
              {settings.sectionsVisibility.contact && <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="hover:text-blue-400">Contact</a>}
            </nav>

            <div className="pb-12 space-y-4">
              <button 
                onClick={() => { setMobileMenuOpen(false); toggleAdmin(true); }}
                className="w-full py-3.5 bg-white/5 border border-white/5 rounded-xl font-mono text-[11px] tracking-widest uppercase text-center"
              >
                CMS PORTAL
              </button>
              <a 
                href="#contact" 
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full py-3.5 bg-white text-black font-display font-bold text-xs tracking-widest uppercase text-center rounded-xl"
              >
                COMMISSION WORK
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. HERO HIGHLIGHTS BANNER */}
      <Hero settings={settings} />

      {/* 6. PORTFOLIO SHOWCASE GALLERY */}
      {settings.sectionsVisibility.portfolio && (
        <Portfolio projects={projects} themeAccent={settings.themeAccent} />
      )}

      {/* 7. ABOUT & BIO CHRONICLES */}
      {settings.sectionsVisibility.about && (
        <About settings={settings} />
      )}

      {/* 8. SKILLS MATRICES */}
      {settings.sectionsVisibility.skills && (
        <Skills skills={skills} themeAccent={settings.themeAccent} />
      )}

      {/* 9. SERVICES & FLAT RATES TIERS */}
      {settings.sectionsVisibility.services && (
        <Services services={services} themeAccent={settings.themeAccent} />
      )}

      {/* 10. CREATIVE RHYTHM ENGINE */}
      {settings.sectionsVisibility.process && (
        <Process />
      )}

      {/* 11. CLIENT TESTIMONIAL COMMENDATIONS */}
      {settings.sectionsVisibility.testimonials && (
        <Testimonials testimonials={testimonials} themeAccent={settings.themeAccent} />
      )}

      {/* 12. DIRECT CONVERSIONS CONTACT FORM */}
      {settings.sectionsVisibility.contact && (
        <Contact settings={settings} />
      )}

      {/* 13. MINIMAL MASTER FOOTER */}
      <Footer settings={settings} onAdminClick={() => toggleAdmin(true)} />

      {/* 14. ADMIN PANEL MANAGEMENT HUD */}
      <AnimatePresence>
        {adminOpen && (
          <AdminPanel 
            settings={settings}
            projects={projects}
            skills={skills}
            services={services}
            testimonials={testimonials}
            onClose={() => toggleAdmin(false)}
            onRefreshData={loadData}
            onTemporaryUpdate={handleTemporaryUpdate}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
