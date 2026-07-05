/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  images: string[]; // List of URLs or base64 images
  tools: string[];
  process?: string; // Markdown/text explaining design steps
  clientFeedback?: string;
  beforeUrl?: string; // image path before
  afterUrl?: string;  // image path after
  featured?: boolean;
  order?: number;
  createdAt?: string;
}

export interface Setting {
  id: string;
  designerName: string;
  profession: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
  resumeUrl: string;
  logoText: string;
  seoTitle: string;
  seoDescription: string;
  themeBg: string; // Background color configuration
  themeAccent: string; // Accent color configuration (electric blue, gold, etc.)
  contactEmail: string;
  contactPhone: string;
  socialInstagram: string;
  socialBehance: string;
  socialLinkedIn: string;
  socialWhatsApp: string;
  sectionsVisibility: {
    about: boolean;
    skills: boolean;
    portfolio: boolean;
    services: boolean;
    process: boolean;
    testimonials: boolean;
    contact: boolean;
  };
}

export interface Skill {
  id: string;
  name: string;
  percentage: number;
  projectsCount?: number;
  iconName?: string; // Name of Lucide icon or custom
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: string;
  features: string[];
}

export interface Testimonial {
  id: string;
  clientName: string;
  clientRole?: string;
  clientCompany?: string;
  feedback: string;
  rating?: number;
  avatarUrl?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  status: string; // 'unread' | 'read' | 'archived'
  createdAt: string;
}
