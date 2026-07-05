/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project, Setting, Skill, Service, Testimonial } from '../types';

export const DEFAULT_SETTING: Setting = {
  id: 'website_config',
  designerName: 'Amit Verma',
  profession: 'Graphic Designer',
  heroTitle: 'Design That Speaks Before Words.',
  heroSubtitle: 'Hi, I\'m Amit Verma. An elite Graphic Designer specializing in branding, high-end visual identities, premium social media creatives, bespoke packaging, and editorial print graphics.',
  aboutText: 'Based in India and serving clients worldwide, I create premium design systems that elevate brands from ordinary to iconic. My creative philosophy is rooted in architectural discipline, Swiss modernism, and a relentless attention to typographic detail. Over the last several years, I have crafted bespoke visual identities and campaigns for internationally recognized agencies, boutique brands, and high-growth ventures.\n\nI believe that graphic design is not merely decoration—it is visual engineering. Every line, curve, and choice of negative space serves a strategic purpose: to command attention, articulate value, and inspire action.',
  resumeUrl: '#',
  logoText: 'AMIT.VERMA',
  seoTitle: 'Amit Verma | Elite Graphic Designer Portfolio',
  seoDescription: 'Premium, award-winning graphic design portfolio of Amit Verma. Specializing in Brand Identity, Luxury Packaging, Poster Art, and High-End Digital Assets.',
  themeBg: '#050505',
  themeAccent: '#3b82f6', // electric blue
  contactEmail: 'amtverma01@gmail.com',
  contactPhone: '+91 98765 43210',
  socialInstagram: 'https://instagram.com/amitverma',
  socialBehance: 'https://behance.net/amitverma',
  socialLinkedIn: 'https://linkedin.com/in/amitverma',
  socialWhatsApp: 'https://wa.me/919876543210',
  sectionsVisibility: {
    about: true,
    skills: true,
    portfolio: true,
    services: true,
    process: true,
    testimonials: true,
    contact: true,
  }
};

export const DEFAULT_SKILLS: Skill[] = [
  {
    id: 'coreldraw',
    name: 'CorelDRAW',
    percentage: 95,
    projectsCount: 140,
    iconName: 'PenTool'
  },
  {
    id: 'photoshop',
    name: 'Adobe Photoshop',
    percentage: 98,
    projectsCount: 320,
    iconName: 'Image'
  },
  {
    id: 'illustrator',
    name: 'Adobe Illustrator',
    percentage: 97,
    projectsCount: 280,
    iconName: 'Layers'
  }
];

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'equinox-coffee-branding',
    title: 'Equinox Artisan Coffee',
    category: 'Brand Identity',
    description: 'A complete luxury brand identity and visual ecosystem designed for a high-end specialty coffee roaster based in Milan. The design features minimalist Swiss typography paired with gold-embossed geometric lunar phases.',
    images: [
      'https://images.unsplash.com/photo-1509343256512-d77a5cb3791b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497515114629-f71d768fd07c?auto=format&fit=crop&w=1200&q=80'
    ],
    tools: ['Adobe Illustrator', 'Adobe Photoshop', 'CorelDRAW'],
    process: '1. **Discovery & Discovery**: Identified Equinox\'s target demographic as affluent coffee connoisseurs. Established a theme around "Precision and Time".\n2. **Moodboarding**: Selected a premium dark palette with warm metallic accents.\n3. **Logo Iteration**: Built a multi-layered geometric logo representing lunar alignments and coffee beans.\n4. **Collateral Design**: Designed custom foil-pressed bags, takeaway cups, and brand guidelines.',
    clientFeedback: '"Amit didn\'t just design a logo; he created an entire atmosphere. Our packaging has won multiple design accolades, and customers frequently tell us they keep our coffee bags purely for display. Simply outstanding."',
    beforeUrl: 'https://images.unsplash.com/photo-1511556820780-d912e42b4980?auto=format&fit=crop&w=800&q=80',
    afterUrl: 'https://images.unsplash.com/photo-1509343256512-d77a5cb3791b?auto=format&fit=crop&w=800&q=80',
    featured: true,
    order: 1
  },
  {
    id: 'aura-luxury-skincare',
    title: 'AURA Organic Cosmetics',
    category: 'Packaging',
    description: 'Bespoke container and packaging concept for a premium plant-based skincare line. Rooted in sustainable luxury, we utilized textured matte glass vials, neutral sandstone tones, and pristine de-bossed typography.',
    images: [
      'https://images.unsplash.com/photo-1608248597481-496100c8c836?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=1200&q=80'
    ],
    tools: ['Adobe Illustrator', 'Adobe Photoshop'],
    process: '1. **Concept**: Centered the visual identity around "Pure Translucency".\n2. **Material Study**: Selected custom sand-blasted glass renders to display the skincare formulas.\n3. **Typography**: Applied a high-contrast combination of a bespoke serif font and an ultra-thin sans-serif.\n4. **Compliance Layout**: Engineered beautiful box designs that incorporated all ingredients and certifications gracefully.',
    clientFeedback: '"The reaction to our AURA relaunch has been breathtaking. Sales increased by 140% in our first month, driven almost entirely by the shelf-presence and unboxing experience crafted by Amit."',
    beforeUrl: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=800&q=80',
    afterUrl: 'https://images.unsplash.com/photo-1608248597481-496100c8c836?auto=format&fit=crop&w=800&q=80',
    featured: true,
    order: 2
  },
  {
    id: 'neo-noir-film-festival',
    title: 'CineNoir Festival Posters',
    category: 'Poster',
    description: 'An evocative series of collector\'s posters for the Tokyo Neo-Noir Film Festival. Developed with brutalist architectural shapes, high-contrast halftones, and vibrant electric blue neon highlights.',
    images: [
      'https://images.unsplash.com/photo-1561070791-26c113006238?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'
    ],
    tools: ['CorelDRAW', 'Adobe Photoshop', 'Adobe Illustrator'],
    process: '1. **Creative Direction**: Inspired by 1980s retro-futurism and brutalism.\n2. **Sourcing Imagery**: Curated cinematic photographs, transforming them into high-contrast half-tone vector artwork in CorelDRAW.\n3. **Color Composition**: Balanced intense voids of black with razor-thin electric blue neon glow highlights.\n4. **Grid Alignment**: Designed a multi-lingual layout displaying titles in English and Japanese kanji.',
    clientFeedback: '"Amit\'s posters were a sensation. We had attendees peeling them off street walls to keep as memorabilia. He perfectly captured the dark, moody spirit of our film festival."',
    featured: true,
    order: 3
  },
  {
    id: 'ignite-beverage-can',
    title: 'Ignite Energy Brew',
    category: 'Packaging',
    description: 'A striking aluminum can design with multi-layered color gradients and sharp, holographic vector lines designed to reflect high performance and pure raw energy.',
    images: [
      'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=1200&q=80'
    ],
    tools: ['Adobe Illustrator', 'CorelDRAW'],
    process: '1. **Anatomy of a Can**: Studied standard can wraps to ensure perfect alignment at the seams.\n2. **Color Psychology**: Combined electric magenta and ultra-violet gradients to project intense activity.\n3. **Holographic Layers**: Specified a selective metallic foil underlay to make the vector accents shine on the physical can.',
    clientFeedback: '"Amit has a phenomenal command of packaging materials. He guided us through the entire print production setup, ensuring the glowing neon colors translated perfectly onto physical aluminum."',
    featured: false,
    order: 4
  },
  {
    id: 'veloce-editorial-flyer',
    title: 'Veloce Cycling Journal',
    category: 'Flyer',
    description: 'A modern, editorial grid-based layout for high-end cycling culture. Employs asymmetric typography, spacious padding, and high-contrast monochrome photographs.',
    images: [
      'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=1200&q=80'
    ],
    tools: ['Adobe Illustrator', 'Adobe Photoshop'],
    process: '1. **Layout Strategy**: Leveraged whitespace as an active design element to replicate speed.\n2. **Type Pairing**: Paired an aggressive gothic serif with technical monospace elements.\n3. **Print Finishing**: Prepared print-ready vector files with custom varnish layers.',
    featured: false,
    order: 5
  },
  {
    id: 'vertex-minimalist-logos',
    title: 'Vertex Identity Suite',
    category: 'Logo Design',
    description: 'A collection of award-winning, ultra-minimalist vector marks developed using golden ratio geometries, strict mathematical alignments, and custom-crafted lettering.',
    images: [
      'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80'
    ],
    tools: ['CorelDRAW', 'Adobe Illustrator'],
    process: '1. **Golden Grid**: Drafted every mark on a strict grid conforming to Fibonacci ratios.\n2. **Optical Tuning**: Adjusted shapes manually to resolve visual distortion at smaller scales.\n3. **Typography**: Hand-drawn letterforms to ensure 100% unique brand marks.',
    featured: true,
    order: 6
  }
];

export const DEFAULT_SERVICES: Service[] = [
  {
    id: 'brand-identity',
    name: 'Logo & Brand Identity',
    description: 'A complete custom visual system including signature logo marks, color psychology, typographic pairings, asset libraries, and comprehensive digital brand guidelines.',
    price: '$1,800+',
    features: [
      '3 Bespoke Logo Concepts',
      'Golden-Ratio Vector Construction',
      'Custom Lettering/Typography',
      'Full Color System & Brand Board',
      '100-page Digital Style Guide',
      'Original CorelDRAW/AI Files'
    ]
  },
  {
    id: 'premium-packaging',
    name: 'Luxury Product Packaging',
    description: 'High-end product wraps, boxes, jars, or bottles designed with structural engineering, premium paper selections, metallic foil specifications, and unboxing-experience details.',
    price: '$2,200+',
    features: [
      '3D Realistic Bottle/Box Mockups',
      'Custom Print Matte Finishing Specs',
      'Die-cut & Structural Templates',
      'Print-ready CMYK Separations',
      'Sourcing & Press Collaboration',
      'Unlimited Revisions for Integrity'
    ]
  },
  {
    id: 'poster-editorial',
    name: 'Cinematic Posters & Print',
    description: 'High-contrast collector-grade event posters, brochures, magazines, flyers, and premium large-format billboards crafted with Swiss grid precision and custom graphic designs.',
    price: '$950+',
    features: [
      'Bespoke Vector Graphic Design',
      'Swiss Grid Editorial Architecture',
      'Rich Half-tone or Neon Styling',
      'Large Format Print Optimization',
      'Commercial Distribution Rights',
      'Source Vector files (CDR, AI)'
    ]
  }
];

export const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    clientName: 'Julianne Vance',
    clientRole: 'Creative Director',
    clientCompany: 'Aura Cosmetics Ltd',
    feedback: 'Amit is the absolute pinnacle of graphic design. He possesses a rare, dual-sided mastery of raw, imaginative creative vision and precise, industrial production excellence. Our brand transition was flawless, resulting in immediate organic press features.',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80'
  },
  {
    id: 't2',
    clientName: 'Hiroto Takahashi',
    clientRole: 'Lead Organizer',
    clientCompany: 'Tokyo Neo-Noir Film Festival',
    feedback: 'The posters Amit crafted for CineNoir Tokyo were true works of art. Thousands of prints were grabbed as collector pieces. His use of CorelDRAW vector shapes paired with premium neon glow is unlike anything else in the industry.',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80'
  },
  {
    id: 't3',
    clientName: 'Matteo Rossini',
    clientRole: 'Founder',
    clientCompany: 'Equinox Artisan Coffee',
    feedback: 'Working with Amit Verma transformed our boutique Milanese roaster into an internationally recognizable name. The gold-foil geometric design system is an absolute masterpiece of minimalist visual storytelling.',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80'
  }
];

export const defaultData = {
  settings: DEFAULT_SETTING,
  projects: DEFAULT_PROJECTS,
  skills: DEFAULT_SKILLS,
  services: DEFAULT_SERVICES,
  testimonials: DEFAULT_TESTIMONIALS
};

