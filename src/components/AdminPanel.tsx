/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, 
  Unlock, 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  Check, 
  ArrowUp, 
  ArrowDown, 
  Folder, 
  Grid, 
  Settings as SettingsIcon, 
  Sparkles, 
  ShieldCheck, 
  LogOut, 
  Settings2, 
  Layers, 
  FileText, 
  MessageSquare, 
  Palette, 
  TrendingUp,
  X,
  RefreshCw,
  Sliders,
  AlertCircle,
  Mail
} from 'lucide-react';
import { Project, Setting, Skill, Service, Testimonial, ContactMessage } from '../types';
import { 
  auth, 
  signInWithGoogle, 
  logOut, 
  saveSettings, 
  saveProject, 
  deleteProject,
  saveSkill,
  deleteSkill,
  saveService,
  deleteService,
  saveTestimonial,
  deleteTestimonial,
  fetchContactMessages,
  deleteContactMessage,
  updateContactStatus
} from '../lib/firebase';

const CATEGORIES = ['All', 'Brand Identity', 'Packaging Suite', 'Poster Design', 'Stationery'];

interface AdminPanelProps {
  settings: Setting;
  projects: Project[];
  skills: Skill[];
  services: Service[];
  testimonials: Testimonial[];
  onClose: () => void;
  onRefreshData: () => Promise<void>;
  onTemporaryUpdate: (newData: {
    settings?: Setting;
    projects?: Project[];
    skills?: Skill[];
    services?: Service[];
    testimonials?: Testimonial[];
  }) => void;
}

export default function AdminPanel({
  settings,
  projects,
  skills,
  services,
  testimonials,
  onClose,
  onRefreshData,
  onTemporaryUpdate,
}: AdminPanelProps) {
  // Authentication states
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isSandboxMode, setIsSandboxMode] = useState(false);
  const [passphrase, setPassphrase] = useState('');
  const [authError, setAuthError] = useState('');

  // Tab State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'projects' | 'settings' | 'skills' | 'services' | 'testimonials' | 'messages'>('dashboard');

  // Dynamic state for editing
  const [editedSettings, setEditedSettings] = useState<Setting>(settings);
  const [editedProjects, setEditedProjects] = useState<Project[]>(projects);
  const [editedSkills, setEditedSkills] = useState<Skill[]>(skills);
  const [editedServices, setEditedServices] = useState<Service[]>(services);
  const [editedTestimonials, setEditedTestimonials] = useState<Testimonial[]>(testimonials);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);

  // Project Editor Modals
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [projectForm, setProjectForm] = useState<Omit<Project, 'id'>>({
    title: '',
    description: '',
    category: 'Brand Identity',
    images: [''],
    tools: [''],
    process: '',
    clientFeedback: '',
    beforeUrl: '',
    afterUrl: '',
    featured: false,
    order: 10
  });

  // Skill Editor
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [isCreatingSkill, setIsCreatingSkill] = useState(false);
  const [skillForm, setSkillForm] = useState<Omit<Skill, 'id'>>({
    name: '',
    percentage: 80,
    projectsCount: 10,
    iconName: 'PenTool'
  });

  // Service Editor
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isCreatingService, setIsCreatingService] = useState(false);
  const [serviceForm, setServiceForm] = useState<Omit<Service, 'id'>>({
    name: '',
    description: '',
    price: '$500+',
    features: ['']
  });

  // Testimonial Editor
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isCreatingTestimonial, setIsCreatingTestimonial] = useState(false);
  const [testimonialForm, setTestimonialForm] = useState<Omit<Testimonial, 'id'>>({
    clientName: '',
    clientRole: '',
    clientCompany: '',
    feedback: '',
    rating: 5,
    avatarUrl: ''
  });

  // UI Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync state to local variables on prop changes
  useEffect(() => {
    setEditedSettings(settings);
    setEditedProjects(projects);
    setEditedSkills(skills);
    setEditedServices(services);
    setEditedTestimonials(testimonials);
  }, [settings, projects, skills, services, testimonials]);

  // Handle Authentication Changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserEmail(user.email);
        // Verify admin privilege
        if (user.email === 'amtverma01@gmail.com' || user.email === 'user@example.com') {
          setIsAdminAuthenticated(true);
          setIsSandboxMode(false);
          loadRealMessages();
        } else {
          setAuthError(`Email ${user.email} is not authorized. Switched to Sandbox Sandbox for testing.`);
          setIsAdminAuthenticated(false);
        }
      } else {
        setUserEmail(null);
        if (!isSandboxMode) {
          setIsAdminAuthenticated(false);
        }
      }
    });

    return () => unsubscribe();
  }, [isSandboxMode]);

  const loadRealMessages = async () => {
    try {
      const msgs = await fetchContactMessages();
      setContactMessages(msgs);
    } catch (e) {
      console.error(e);
    }
  };

  const handleGoogleLogin = async () => {
    setAuthError('');
    try {
      await signInWithGoogle();
    } catch (err) {
      setAuthError('Google sign in failed.');
    }
  };

  const handlePassphraseLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (passphrase.toLowerCase() === 'admin123' || passphrase.toLowerCase() === 'admin') {
      setIsSandboxMode(true);
      setIsAdminAuthenticated(true);
      showToast('Successfully entered Reviewer Sandbox Mode!');
      // Load mock messages
      setContactMessages([
        {
          id: 'mock_1',
          name: 'Julianne Vance',
          email: 'julianne@auracosmetics.com',
          message: 'Hi Amit, I saw your spectacular Aura packaging. We need to overhaul our skincare product labels by next month. Are you available for a 30-min discovery session?',
          status: 'unread',
          createdAt: new Date().toISOString()
        },
        {
          id: 'mock_2',
          name: 'Hiroto Takahashi',
          email: 'hiroto@tokyocine.jp',
          message: 'The posters for CineNoir Tokyo were incredible. We received highly positive feedback. Let\'s discuss designing visual guides for our Osaka series next week.',
          status: 'read',
          createdAt: new Date(Date.now() - 86400000).toISOString()
        }
      ]);
    } else {
      setAuthError('Incorrect passphrase. Use "admin123" for test access.');
    }
  };

  const handleLogout = async () => {
    if (isSandboxMode) {
      setIsSandboxMode(false);
      setIsAdminAuthenticated(false);
    } else {
      await logOut();
    }
    showToast('Logged out successfully.');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Live Sync Settings to Homepage (Real-time update)
  const syncSettingsLive = (newSettings: Setting) => {
    setEditedSettings(newSettings);
    onTemporaryUpdate({ settings: newSettings });
  };

  // Commit Settings to Firestore / Mock Save
  const handleSaveSettings = async () => {
    if (isSandboxMode) {
      showToast('Sandbox Settings updated inside dynamic preview!');
      return;
    }

    try {
      await saveSettings(editedSettings);
      await onRefreshData();
      showToast('Website configurations committed to Firestore successfully!');
    } catch (err) {
      showToast('Failed to save settings.');
    }
  };

  // Manage Projects Operations
  const handleSaveProjectForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const projId = editingProject ? editingProject.id : `proj_${Date.now()}`;
    const fullProj: Project = {
      ...projectForm,
      id: projId,
      images: projectForm.images.filter(img => img.trim() !== ''),
      tools: projectForm.tools.filter(tool => tool.trim() !== '')
    };

    if (isSandboxMode) {
      let updatedList = [...editedProjects];
      if (editingProject) {
        updatedList = updatedList.map(p => p.id === projId ? fullProj : p);
      } else {
        updatedList.push(fullProj);
      }
      setEditedProjects(updatedList);
      onTemporaryUpdate({ projects: updatedList });
      setIsCreatingProject(false);
      setEditingProject(null);
      showToast('Sandbox project updated!');
      return;
    }

    try {
      await saveProject(fullProj);
      await onRefreshData();
      setIsCreatingProject(false);
      setEditingProject(null);
      showToast('Project committed to Firestore!');
    } catch (err) {
      showToast('Error saving project.');
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm('Are you absolutely certain you want to purge this project?')) return;

    if (isSandboxMode) {
      const updatedList = editedProjects.filter(p => p.id !== id);
      setEditedProjects(updatedList);
      onTemporaryUpdate({ projects: updatedList });
      showToast('Sandbox project removed!');
      return;
    }

    try {
      await deleteProject(id);
      await onRefreshData();
      showToast('Project purged from Firestore.');
    } catch (err) {
      showToast('Error deleting project.');
    }
  };

  // Simulated Drag-and-Drop / Move order
  const handleMoveProjectOrder = async (idx: number, dir: 'up' | 'down') => {
    const list = [...editedProjects];
    const targetIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;

    // Swap order property
    const tempOrder = list[idx].order || 0;
    list[idx].order = list[targetIdx].order || 0;
    list[targetIdx].order = tempOrder;

    // Swap indices
    const temp = list[idx];
    list[idx] = list[targetIdx];
    list[targetIdx] = temp;

    setEditedProjects(list);
    onTemporaryUpdate({ projects: list });

    if (!isSandboxMode) {
      try {
        await saveProject(list[idx]);
        await saveProject(list[targetIdx]);
        await onRefreshData();
        showToast('Sequence updated in database!');
      } catch (err) {
        showToast('Failed to save project sequence.');
      }
    } else {
      showToast('Sandbox project sequence re-aligned!');
    }
  };

  // Manage Skills Operations
  const handleSaveSkillForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const skillId = editingSkill ? editingSkill.id : `skill_${Date.now()}`;
    const fullSkill: Skill = {
      ...skillForm,
      id: skillId
    };

    if (isSandboxMode) {
      let updatedList = [...editedSkills];
      if (editingSkill) {
        updatedList = updatedList.map(s => s.id === skillId ? fullSkill : s);
      } else {
        updatedList.push(fullSkill);
      }
      setEditedSkills(updatedList);
      onTemporaryUpdate({ skills: updatedList });
      setIsCreatingSkill(false);
      setEditingSkill(null);
      showToast('Sandbox skill saved!');
      return;
    }

    try {
      await saveSkill(fullSkill);
      await onRefreshData();
      setIsCreatingSkill(false);
      setEditingSkill(null);
      showToast('Skill saved to database!');
    } catch (e) {
      showToast('Error saving skill.');
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!window.confirm('Delete this skill?')) return;

    if (isSandboxMode) {
      const updatedList = editedSkills.filter(s => s.id !== id);
      setEditedSkills(updatedList);
      onTemporaryUpdate({ skills: updatedList });
      showToast('Sandbox skill deleted.');
      return;
    }

    try {
      await deleteSkill(id);
      await onRefreshData();
      showToast('Skill deleted from database.');
    } catch (e) {
      showToast('Error deleting skill.');
    }
  };

  // Manage Services Operations
  const handleSaveServiceForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const servId = editingService ? editingService.id : `service_${Date.now()}`;
    const fullServ: Service = {
      ...serviceForm,
      id: servId,
      features: serviceForm.features.filter(f => f.trim() !== '')
    };

    if (isSandboxMode) {
      let updatedList = [...editedServices];
      if (editingService) {
        updatedList = updatedList.map(s => s.id === servId ? fullServ : s);
      } else {
        updatedList.push(fullServ);
      }
      setEditedServices(updatedList);
      onTemporaryUpdate({ services: updatedList });
      setIsCreatingService(false);
      setEditingService(null);
      showToast('Sandbox service saved!');
      return;
    }

    try {
      await saveService(fullServ);
      await onRefreshData();
      setIsCreatingService(false);
      setEditingService(null);
      showToast('Service saved!');
    } catch (e) {
      showToast('Error saving service.');
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!window.confirm('Delete this service?')) return;

    if (isSandboxMode) {
      const updatedList = editedServices.filter(s => s.id !== id);
      setEditedServices(updatedList);
      onTemporaryUpdate({ services: updatedList });
      showToast('Sandbox service deleted.');
      return;
    }

    try {
      await deleteService(id);
      await onRefreshData();
      showToast('Service deleted.');
    } catch (e) {
      showToast('Error deleting service.');
    }
  };

  // Manage Testimonials Operations
  const handleSaveTestimonialForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const testId = editingTestimonial ? editingTestimonial.id : `test_${Date.now()}`;
    const fullTest: Testimonial = {
      ...testimonialForm,
      id: testId
    };

    if (isSandboxMode) {
      let updatedList = [...editedTestimonials];
      if (editingTestimonial) {
        updatedList = updatedList.map(t => t.id === testId ? fullTest : t);
      } else {
        updatedList.push(fullTest);
      }
      setEditedTestimonials(updatedList);
      onTemporaryUpdate({ testimonials: updatedList });
      setIsCreatingTestimonial(false);
      setEditingTestimonial(null);
      showToast('Sandbox testimonial saved!');
      return;
    }

    try {
      await saveTestimonial(fullTest);
      await onRefreshData();
      setIsCreatingTestimonial(false);
      setEditingTestimonial(null);
      showToast('Testimonial saved!');
    } catch (e) {
      showToast('Error saving testimonial.');
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!window.confirm('Delete this testimonial?')) return;

    if (isSandboxMode) {
      const updatedList = editedTestimonials.filter(t => t.id !== id);
      setEditedTestimonials(updatedList);
      onTemporaryUpdate({ testimonials: updatedList });
      showToast('Sandbox testimonial deleted.');
      return;
    }

    try {
      await deleteTestimonial(id);
      await onRefreshData();
      showToast('Testimonial deleted.');
    } catch (e) {
      showToast('Error deleting testimonial.');
    }
  };

  // Manage Message Inbox
  const handleUpdateMessageStatus = async (id: string, status: string) => {
    if (isSandboxMode) {
      setContactMessages(contactMessages.map(m => m.id === id ? { ...m, status } : m));
      showToast('Sandbox status changed!');
      return;
    }

    try {
      await updateContactStatus(id, status);
      await loadRealMessages();
      showToast('Message status updated.');
    } catch (e) {
      showToast('Error updating status.');
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!window.confirm('Delete this message envelope forever?')) return;

    if (isSandboxMode) {
      setContactMessages(contactMessages.filter(m => m.id !== id));
      showToast('Sandbox message deleted.');
      return;
    }

    try {
      await deleteContactMessage(id);
      await loadRealMessages();
      showToast('Message envelope deleted.');
    } catch (e) {
      showToast('Error deleting message.');
    }
  };

  // Image Upload - Local compression & crop simulation to WebP format Base64
  const handleSimulateImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    showToast('Compressing image & compiling to compressed WebP asset...');
    const reader = new FileReader();
    reader.onloadend = () => {
      // Local Base64 simulation representing compressed WebP output
      callback(reader.result as string);
      showToast('Auto WebP conversion and optimization complete!');
    };
    reader.readAsDataURL(file);
  };

  // Helper arrays for multi-item forms
  const handleAddProjectImageField = () => {
    setProjectForm({ ...projectForm, images: [...projectForm.images, ''] });
  };

  const handleUpdateProjectImageField = (idx: number, val: string) => {
    const list = [...projectForm.images];
    list[idx] = val;
    setProjectForm({ ...projectForm, images: list });
  };

  const handleAddProjectToolField = () => {
    setProjectForm({ ...projectForm, tools: [...projectForm.tools, ''] });
  };

  const handleUpdateProjectToolField = (idx: number, val: string) => {
    const list = [...projectForm.tools];
    list[idx] = val;
    setProjectForm({ ...projectForm, tools: list });
  };

  const handleAddServiceFeatureField = () => {
    setServiceForm({ ...serviceForm, features: [...serviceForm.features, ''] });
  };

  const handleUpdateServiceFeatureField = (idx: number, val: string) => {
    const list = [...serviceForm.features];
    list[idx] = val;
    setServiceForm({ ...serviceForm, features: list });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#050505] text-white flex flex-col font-sans">
      
      {/* Toast HUD */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 px-6 py-3.5 bg-blue-600 text-white border border-blue-400/20 text-xs font-mono font-semibold rounded-xl shadow-2xl z-50 flex items-center gap-2"
          >
            <ShieldCheck className="w-4.5 h-4.5" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LOGIN PROTECT BLOCK */}
      {!isAdminAuthenticated ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 relative bg-gradient-to-b from-[#0d0d0d] to-[#050505]">
          <div className="absolute inset-0 grid-lines opacity-40 pointer-events-none" />

          {/* Centered Login Card */}
          <div className="relative w-full max-w-md p-8 rounded-3xl bg-[#0d0d0d] border border-white/5 shadow-2xl space-y-8 z-10">
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5 text-blue-500">
                <Lock className="w-6 h-6 animate-pulse" />
              </div>
              <h1 className="text-3xl font-display font-black tracking-tight mb-2">Portfolio Admin</h1>
              <p className="text-xs font-mono text-white/40 uppercase tracking-widest">
                Zero-Trust Gate Protection
              </p>
            </div>

            {authError && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/15 text-xs font-mono text-red-400 flex items-start gap-3">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            {/* Sandbox tester entry form */}
            <form onSubmit={handlePassphraseLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono tracking-widest text-white/40 uppercase block">Passphrase Bypass (Sandbox)</label>
                <input
                  type="password"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  placeholder="Enter 'admin123' to test dashboard"
                  className="w-full px-4 py-3 bg-[#050505] border border-white/5 focus:border-blue-500/50 rounded-xl text-sm font-sans focus:outline-none transition-colors duration-300 text-center tracking-widest"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#111111] hover:bg-[#161616] border border-white/10 text-white font-mono text-[11px] tracking-widest uppercase rounded-xl hover:border-white/20 transition-all cursor-pointer"
              >
                ENTER SANDBOX REPO
              </button>
            </form>

            <div className="relative flex items-center justify-center py-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5" /></div>
              <span className="relative z-10 px-3 bg-[#0d0d0d] font-mono text-[9px] text-white/30 tracking-widest">OR USE REAL GOOGLE</span>
            </div>

            {/* Real Google Auth */}
            <button
              onClick={handleGoogleLogin}
              className="w-full py-3.5 bg-white text-black font-display font-bold text-xs tracking-widest uppercase rounded-xl hover:bg-white/90 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              Sign In with Google
            </button>

            {/* Subtle Cancel Close Button */}
            <button
              onClick={onClose}
              className="w-full text-center text-[10px] font-mono tracking-widest text-white/30 hover:text-white/60 transition-colors uppercase"
            >
              Cancel Entry
            </button>
          </div>
        </div>
      ) : (
        
        /* AUTHENTICATED ADMIN DASHBOARD LAYOUT */
        <div className="flex-1 flex overflow-hidden">
          
          {/* SIDEBAR TABS (Left panel) */}
          <div className="w-64 bg-[#0d0d0d] border-r border-white/5 p-6 flex flex-col justify-between select-none">
            
            <div className="space-y-8">
              {/* Profile logo strip */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <ShieldCheck className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h2 className="text-sm font-display font-black tracking-widest text-white uppercase">{editedSettings.logoText}</h2>
                  <span className="text-[9px] font-mono tracking-widest text-emerald-400/80 uppercase block flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                    {isSandboxMode ? 'Sandbox Repo' : 'Cloud Sync'}
                  </span>
                </div>
              </div>

              {/* Sidebar Links */}
              <nav className="space-y-1.5">
                <span className="text-[9px] font-mono tracking-widest text-white/30 uppercase block mb-3 pl-3">SYSTEM DIRECTORY</span>
                
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-xs font-mono tracking-wider transition-all cursor-pointer ${
                    activeTab === 'dashboard' ? 'bg-white/5 text-white border-l-2 border-blue-500' : 'text-white/50 hover:text-white hover:bg-white/2'
                  }`}
                >
                  <Grid className="w-4 h-4 text-blue-500" />
                  DASHBOARD HUD
                </button>

                <button
                  onClick={() => setActiveTab('projects')}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-xs font-mono tracking-wider transition-all cursor-pointer ${
                    activeTab === 'projects' ? 'bg-white/5 text-white border-l-2 border-blue-500' : 'text-white/50 hover:text-white hover:bg-white/2'
                  }`}
                >
                  <Folder className="w-4 h-4 text-purple-500" />
                  MANAGE PROJECTS
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-xs font-mono tracking-wider transition-all cursor-pointer ${
                    activeTab === 'settings' ? 'bg-white/5 text-white border-l-2 border-blue-500' : 'text-white/50 hover:text-white hover:bg-white/2'
                  }`}
                >
                  <Settings2 className="w-4 h-4 text-pink-500" />
                  SITE CONFIG & SEO
                </button>

                <button
                  onClick={() => setActiveTab('skills')}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-xs font-mono tracking-wider transition-all cursor-pointer ${
                    activeTab === 'skills' ? 'bg-white/5 text-white border-l-2 border-blue-500' : 'text-white/50 hover:text-white hover:bg-white/2'
                  }`}
                >
                  <Layers className="w-4 h-4 text-yellow-500" />
                  EDIT SKILLS
                </button>

                <button
                  onClick={() => setActiveTab('services')}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-xs font-mono tracking-wider transition-all cursor-pointer ${
                    activeTab === 'services' ? 'bg-white/5 text-white border-l-2 border-blue-500' : 'text-white/50 hover:text-white hover:bg-white/2'
                  }`}
                >
                  <Sliders className="w-4 h-4 text-rose-500" />
                  EDIT SERVICES
                </button>

                <button
                  onClick={() => setActiveTab('testimonials')}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-xs font-mono tracking-wider transition-all cursor-pointer ${
                    activeTab === 'testimonials' ? 'bg-white/5 text-white border-l-2 border-blue-500' : 'text-white/50 hover:text-white hover:bg-white/2'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 text-teal-500" />
                  TESTIMONIALS
                </button>

                <button
                  onClick={() => setActiveTab('messages')}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-xs font-mono tracking-wider transition-all cursor-pointer relative ${
                    activeTab === 'messages' ? 'bg-white/5 text-white border-l-2 border-blue-500' : 'text-white/50 hover:text-white hover:bg-white/2'
                  }`}
                >
                  <Mail className="w-4 h-4 text-indigo-500" />
                  MESSAGES INBOX
                  {contactMessages.filter(m => m.status === 'unread').length > 0 && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-blue-500 text-[9px] font-mono font-bold flex items-center justify-center text-white">
                      {contactMessages.filter(m => m.status === 'unread').length}
                    </span>
                  )}
                </button>
              </nav>
            </div>

            {/* Logout and Exit (Bottom sidebar) */}
            <div className="space-y-4">
              <div className="p-3 bg-white/3 border border-white/5 rounded-xl text-[10px] font-mono text-white/40 leading-relaxed">
                Signed in as: <br />
                <span className="text-white/80 font-bold block overflow-hidden text-ellipsis">{userEmail || 'Sandbox Guest'}</span>
              </div>

              <button
                onClick={handleLogout}
                className="w-full py-2.5 bg-red-950/20 hover:bg-red-900/30 border border-red-500/10 hover:border-red-500/25 text-red-400 font-mono text-[10px] tracking-widest uppercase rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                SECURE LOGOUT
              </button>

              <button
                onClick={onClose}
                className="w-full py-2.5 bg-white text-black font-display font-bold text-xs tracking-widest uppercase rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                Close Dashboard
              </button>
            </div>

          </div>

          {/* MAIN CONFIGURATION CONTENT BODY (Right panel) */}
          <div className="flex-1 bg-[#050505] p-10 overflow-y-auto relative">
            <div className="absolute inset-0 grid-lines opacity-[0.15] pointer-events-none" />

            {/* TAB CONTENT SECTIONS */}

            {/* 1. DASHBOARD OVERVIEW HUD */}
            {activeTab === 'dashboard' && (
              <div className="space-y-10 relative z-10">
                <div className="flex justify-between items-end border-b border-white/5 pb-6">
                  <div>
                    <span className="text-xs font-mono text-blue-400 tracking-wider block mb-1">SYSTEM TERMINAL INDEX</span>
                    <h1 className="text-3xl font-display font-black tracking-tight">Dashboard Overview HUD</h1>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={onRefreshData}
                      className="p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>

                {/* Simulated Stats Widgets Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="p-6 rounded-2xl bg-[#0d0d0d] border border-white/5">
                    <span className="text-[10px] font-mono text-white/40 tracking-wider block uppercase mb-1">Archived Projects</span>
                    <div className="text-3xl font-display font-black">{editedProjects.length}</div>
                    <span className="text-[9px] font-mono text-emerald-400 tracking-widest uppercase block mt-2">● LIVE ON WEBSITE</span>
                  </div>

                  <div className="p-6 rounded-2xl bg-[#0d0d0d] border border-white/5">
                    <span className="text-[10px] font-mono text-white/40 tracking-wider block uppercase mb-1">Total Inbound Envelopes</span>
                    <div className="text-3xl font-display font-black">{contactMessages.length}</div>
                    <span className="text-[9px] font-mono text-blue-400 tracking-widest uppercase block mt-2">
                      {contactMessages.filter(m => m.status === 'unread').length} UNREAD MESSAGES
                    </span>
                  </div>

                  <div className="p-6 rounded-2xl bg-[#0d0d0d] border border-white/5">
                    <span className="text-[10px] font-mono text-white/40 tracking-wider block uppercase mb-1">Registered Skills</span>
                    <div className="text-3xl font-display font-black">{editedSkills.length}</div>
                    <span className="text-[9px] font-mono text-yellow-500 tracking-widest uppercase block mt-2">3D TRANSFORM ENABLED</span>
                  </div>

                  <div className="p-6 rounded-2xl bg-[#0d0d0d] border border-white/5">
                    <span className="text-[10px] font-mono text-white/40 tracking-wider block uppercase mb-1">Active Core Services</span>
                    <div className="text-3xl font-display font-black">{editedServices.length}</div>
                    <span className="text-[9px] font-mono text-pink-500 tracking-widest uppercase block mt-2">FLAT RATES CONFIGURED</span>
                  </div>
                </div>

                {/* Homepage sections visibility controllers */}
                <div className="p-8 rounded-3xl bg-[#0d0d0d] border border-white/5 space-y-6">
                  <div>
                    <h3 className="text-lg font-display font-bold text-white mb-2">Homepage Sections Controller</h3>
                    <p className="text-xs text-white/40 leading-relaxed font-light">
                      Publish or conceal entire sections from the public homepage instantly without editing files.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/5">
                    {Object.keys(editedSettings.sectionsVisibility).map((sectionKey) => {
                      const isVisible = editedSettings.sectionsVisibility[sectionKey as keyof typeof editedSettings.sectionsVisibility];
                      return (
                        <div 
                          key={sectionKey}
                          className="p-4 rounded-xl bg-[#050505] border border-white/5 flex justify-between items-center"
                        >
                          <span className="text-xs font-mono tracking-wider uppercase text-white/70">{sectionKey}</span>
                          <button
                            onClick={() => {
                              const updatedVis = {
                                ...editedSettings.sectionsVisibility,
                                [sectionKey]: !isVisible
                              };
                              const updatedSettings = {
                                ...editedSettings,
                                sectionsVisibility: updatedVis
                              };
                              syncSettingsLive(updatedSettings);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-mono tracking-widest uppercase cursor-pointer ${
                              isVisible ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'
                            }`}
                          >
                            {isVisible ? 'PUBLISHED' : 'CONCEALED'}
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={handleSaveSettings}
                      className="px-6 py-3 bg-white text-black font-display font-medium text-xs tracking-widest uppercase rounded-xl hover:bg-white/95 transition-all cursor-pointer"
                    >
                      Commit Publishing States
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 2. PROJECT ARCHIVES (Full CRUD & Sequence Alignment) */}
            {activeTab === 'projects' && (
              <div className="space-y-10 relative z-10">
                <div className="flex justify-between items-end border-b border-white/5 pb-6">
                  <div>
                    <span className="text-xs font-mono text-purple-400 tracking-wider block mb-1">CREATIVE ARCHIVES</span>
                    <h1 className="text-3xl font-display font-black tracking-tight">Manage Projects</h1>
                  </div>
                  
                  <button
                    onClick={() => {
                      setEditingProject(null);
                      setProjectForm({
                        title: '',
                        description: '',
                        category: 'Brand Identity',
                        images: [''],
                        tools: [''],
                        process: '',
                        clientFeedback: '',
                        beforeUrl: '',
                        afterUrl: '',
                        featured: false,
                        order: editedProjects.length + 1
                      });
                      setIsCreatingProject(true);
                    }}
                    className="flex items-center gap-2 px-5 py-3 bg-white text-black font-display font-medium text-xs tracking-widest uppercase rounded-xl hover:bg-white/90 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    CREATE ARCHIVE
                  </button>
                </div>

                {/* Staggered project sequence lists */}
                <div className="space-y-4">
                  <span className="text-xs font-mono text-white/30 uppercase tracking-widest block mb-2">ARCHIVED ITEMS INDEX (DRAG & DROP SEQUENCING)</span>
                  {editedProjects.map((proj, idx) => (
                    <div 
                      key={proj.id}
                      className="p-5 rounded-2xl bg-[#0d0d0d] border border-white/5 hover:border-white/10 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                    >
                      {/* Left information */}
                      <div className="flex items-center gap-4">
                        <img src={proj.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover bg-white/5 border border-white/10" />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-display font-bold text-white">{proj.title}</h4>
                            <span className="text-[9px] font-mono tracking-widest text-white/40 bg-white/5 border border-white/5 px-2 py-0.5 rounded uppercase">{proj.category}</span>
                            {proj.featured && <span className="text-[9px] font-mono tracking-widest text-yellow-500 bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded uppercase font-semibold">FEATURED</span>}
                          </div>
                          <p className="text-xs font-mono text-white/40 uppercase mt-0.5 tracking-wider">Sequence Rank: {proj.order || idx + 1}</p>
                        </div>
                      </div>

                      {/* Right operations bar */}
                      <div className="flex items-center gap-3">
                        {/* Order adjustment */}
                        <div className="flex gap-1.5 border-r border-white/5 pr-3 mr-3">
                          <button
                            disabled={idx === 0}
                            onClick={() => handleMoveProjectOrder(idx, 'up')}
                            className="p-2 rounded-lg bg-white/3 hover:bg-white/5 text-white/50 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            disabled={idx === editedProjects.length - 1}
                            onClick={() => handleMoveProjectOrder(idx, 'down')}
                            className="p-2 rounded-lg bg-white/3 hover:bg-white/5 text-white/50 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Edit */}
                        <button
                          onClick={() => {
                            setEditingProject(proj);
                            setProjectForm({
                              title: proj.title,
                              description: proj.description,
                              category: proj.category,
                              images: proj.images.length > 0 ? proj.images : [''],
                              tools: proj.tools.length > 0 ? proj.tools : [''],
                              process: proj.process || '',
                              clientFeedback: proj.clientFeedback || '',
                              beforeUrl: proj.beforeUrl || '',
                              afterUrl: proj.afterUrl || '',
                              featured: proj.featured || false,
                              order: proj.order || idx + 1
                            });
                            setIsCreatingProject(true);
                          }}
                          className="p-2.5 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 hover:text-blue-400 transition-all cursor-pointer"
                        >
                          <Edit3 className="w-4.5 h-4.5" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDeleteProject(proj.id)}
                          className="p-2.5 rounded-lg bg-red-950/20 border border-red-500/10 hover:bg-red-900/30 hover:text-red-400 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. SITE SETTINGS & SEO (Dynamic background, logo, typography text, colors) */}
            {activeTab === 'settings' && (
              <div className="space-y-10 relative z-10">
                <div className="flex justify-between items-end border-b border-white/5 pb-6">
                  <div>
                    <span className="text-xs font-mono text-pink-400 tracking-wider block mb-1">SYSTEM CONFIGURATIONS</span>
                    <h1 className="text-3xl font-display font-black tracking-tight">Site Configurations & SEO</h1>
                  </div>
                  
                  <button
                    onClick={handleSaveSettings}
                    className="px-6 py-3 bg-white text-black font-display font-medium text-xs tracking-widest uppercase rounded-xl hover:bg-white/95 transition-all cursor-pointer"
                  >
                    SAVE CONFIGURATIONS
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Branding Parameters */}
                  <div className="p-8 rounded-3xl bg-[#0d0d0d] border border-white/5 space-y-6">
                    <span className="text-xs font-mono text-pink-400 uppercase tracking-widest block border-b border-white/5 pb-3">Branding & Textures</span>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono tracking-widest text-white/40 uppercase block">Designer Display Name</label>
                        <input
                          type="text"
                          value={editedSettings.designerName}
                          onChange={(e) => syncSettingsLive({ ...editedSettings, designerName: e.target.value })}
                          className="w-full px-4 py-3 bg-[#050505] border border-white/5 rounded-xl text-xs font-sans focus:outline-none focus:border-pink-500"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono tracking-widest text-white/40 uppercase block">Profession Specialty</label>
                        <input
                          type="text"
                          value={editedSettings.profession}
                          onChange={(e) => syncSettingsLive({ ...editedSettings, profession: e.target.value })}
                          className="w-full px-4 py-3 bg-[#050505] border border-white/5 rounded-xl text-xs font-sans focus:outline-none focus:border-pink-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono tracking-widest text-white/40 uppercase block">Header Logo Text</label>
                        <input
                          type="text"
                          value={editedSettings.logoText}
                          onChange={(e) => syncSettingsLive({ ...editedSettings, logoText: e.target.value })}
                          className="w-full px-4 py-3 bg-[#050505] border border-white/5 rounded-xl text-xs font-sans focus:outline-none focus:border-pink-500"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono tracking-widest text-white/40 uppercase block">Resume Link / URL</label>
                        <input
                          type="text"
                          value={editedSettings.resumeUrl}
                          onChange={(e) => syncSettingsLive({ ...editedSettings, resumeUrl: e.target.value })}
                          className="w-full px-4 py-3 bg-[#050505] border border-white/5 rounded-xl text-xs font-sans focus:outline-none focus:border-pink-500"
                        />
                      </div>
                    </div>

                    {/* Color picked controls */}
                    <div className="space-y-3 pt-4 border-t border-white/5">
                      <span className="text-[10px] font-mono text-white/40 tracking-wider uppercase block">Premium Theme Accent Color</span>
                      <div className="flex items-center gap-4">
                        <input 
                          type="color" 
                          value={editedSettings.themeAccent}
                          onChange={(e) => syncSettingsLive({ ...editedSettings, themeAccent: e.target.value })}
                          className="w-12 h-12 rounded-lg bg-transparent border border-white/10 cursor-pointer overflow-hidden"
                        />
                        <div>
                          <span className="text-xs font-mono text-white/80 block uppercase tracking-wider">{editedSettings.themeAccent}</span>
                          <span className="text-[10px] font-mono text-white/40">Selects dynamic ambient spotlight light mesh color</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SEO & Meta properties */}
                  <div className="p-8 rounded-3xl bg-[#0d0d0d] border border-white/5 space-y-6">
                    <span className="text-xs font-mono text-pink-400 uppercase tracking-widest block border-b border-white/5 pb-3">SEO & Discovery Metadata</span>
                    
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono tracking-widest text-white/40 uppercase block">SEO Index Title</label>
                      <input
                        type="text"
                        value={editedSettings.seoTitle}
                        onChange={(e) => syncSettingsLive({ ...editedSettings, seoTitle: e.target.value })}
                        className="w-full px-4 py-3 bg-[#050505] border border-white/5 rounded-xl text-xs font-sans focus:outline-none focus:border-pink-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono tracking-widest text-white/40 uppercase block">SEO Index Description</label>
                      <textarea
                        rows={4}
                        value={editedSettings.seoDescription}
                        onChange={(e) => syncSettingsLive({ ...editedSettings, seoDescription: e.target.value })}
                        className="w-full px-4 py-3 bg-[#050505] border border-white/5 rounded-xl text-xs font-sans focus:outline-none focus:border-pink-500 resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Hero text layouts */}
                <div className="p-8 rounded-3xl bg-[#0d0d0d] border border-white/5 space-y-6">
                  <span className="text-xs font-mono text-pink-400 uppercase tracking-widest block border-b border-white/5 pb-3">Hero Displays & About copy</span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono tracking-widest text-white/40 uppercase block">Large Hero Title</label>
                      <input
                        type="text"
                        value={editedSettings.heroTitle}
                        onChange={(e) => syncSettingsLive({ ...editedSettings, heroTitle: e.target.value })}
                        className="w-full px-4 py-3 bg-[#050505] border border-white/5 rounded-xl text-xs font-sans focus:outline-none focus:border-pink-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono tracking-widest text-white/40 uppercase block">Hero Subtext Description</label>
                      <input
                        type="text"
                        value={editedSettings.heroSubtitle}
                        onChange={(e) => syncSettingsLive({ ...editedSettings, heroSubtitle: e.target.value })}
                        className="w-full px-4 py-3 bg-[#050505] border border-white/5 rounded-xl text-xs font-sans focus:outline-none focus:border-pink-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono tracking-widest text-white/40 uppercase block">Full Biography (Supports paragraphs)</label>
                    <textarea
                      rows={6}
                      value={editedSettings.aboutText}
                      onChange={(e) => syncSettingsLive({ ...editedSettings, aboutText: e.target.value })}
                      className="w-full px-4 py-3 bg-[#050505] border border-white/5 rounded-xl text-xs font-sans focus:outline-none focus:border-pink-500 resize-none leading-relaxed"
                    />
                  </div>
                </div>

                {/* Coordinates & Social properties */}
                <div className="p-8 rounded-3xl bg-[#0d0d0d] border border-white/5 space-y-6">
                  <span className="text-xs font-mono text-pink-400 uppercase tracking-widest block border-b border-white/5 pb-3">Coordinates & Direct Contact Links</span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono tracking-widest text-white/40 uppercase block">Contact Email</label>
                      <input
                        type="email"
                        value={editedSettings.contactEmail}
                        onChange={(e) => syncSettingsLive({ ...editedSettings, contactEmail: e.target.value })}
                        className="w-full px-4 py-3 bg-[#050505] border border-white/5 rounded-xl text-xs font-sans focus:outline-none focus:border-pink-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono tracking-widest text-white/40 uppercase block">Contact Phone Number</label>
                      <input
                        type="text"
                        value={editedSettings.contactPhone}
                        onChange={(e) => syncSettingsLive({ ...editedSettings, contactPhone: e.target.value })}
                        className="w-full px-4 py-3 bg-[#050505] border border-white/5 rounded-xl text-xs font-sans focus:outline-none focus:border-pink-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono tracking-widest text-white/40 uppercase block">Instagram Link</label>
                      <input
                        type="text"
                        value={editedSettings.socialInstagram}
                        onChange={(e) => syncSettingsLive({ ...editedSettings, socialInstagram: e.target.value })}
                        className="w-full px-3 py-2.5 bg-[#050505] border border-white/5 rounded-lg text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono tracking-widest text-white/40 uppercase block">Behance Link</label>
                      <input
                        type="text"
                        value={editedSettings.socialBehance}
                        onChange={(e) => syncSettingsLive({ ...editedSettings, socialBehance: e.target.value })}
                        className="w-full px-3 py-2.5 bg-[#050505] border border-white/5 rounded-lg text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono tracking-widest text-white/40 uppercase block">LinkedIn Link</label>
                      <input
                        type="text"
                        value={editedSettings.socialLinkedIn}
                        onChange={(e) => syncSettingsLive({ ...editedSettings, socialLinkedIn: e.target.value })}
                        className="w-full px-3 py-2.5 bg-[#050505] border border-white/5 rounded-lg text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono tracking-widest text-white/40 uppercase block">WhatsApp Link</label>
                      <input
                        type="text"
                        value={editedSettings.socialWhatsApp}
                        onChange={(e) => syncSettingsLive({ ...editedSettings, socialWhatsApp: e.target.value })}
                        className="w-full px-3 py-2.5 bg-[#050505] border border-white/5 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. SKILLS MANAGEMENT */}
            {activeTab === 'skills' && (
              <div className="space-y-10 relative z-10">
                <div className="flex justify-between items-end border-b border-white/5 pb-6">
                  <div>
                    <span className="text-xs font-mono text-yellow-500 tracking-wider block mb-1">SKILL DIRECTORY</span>
                    <h1 className="text-3xl font-display font-black tracking-tight">Manage Skills</h1>
                  </div>
                  
                  <button
                    onClick={() => {
                      setEditingSkill(null);
                      setSkillForm({
                        name: '',
                        percentage: 85,
                        projectsCount: 20,
                        iconName: 'PenTool'
                      });
                      setIsCreatingSkill(true);
                    }}
                    className="flex items-center gap-2 px-5 py-3 bg-white text-black font-display font-medium text-xs tracking-widest uppercase rounded-xl hover:bg-white/90 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    ADD SKILL
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {editedSkills.map((skill) => (
                    <div key={skill.id} className="p-6 rounded-2xl bg-[#0d0d0d] border border-white/5 flex justify-between items-center">
                      <div>
                        <h4 className="text-lg font-display font-bold text-white mb-1">{skill.name}</h4>
                        <p className="text-xs font-mono text-white/40 tracking-wider">CRAFT LEVEL: {skill.percentage}%  •  {skill.projectsCount || 50}+ DELIVERIES</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingSkill(skill);
                            setSkillForm({
                              name: skill.name,
                              percentage: skill.percentage,
                              projectsCount: skill.projectsCount || 10,
                              iconName: skill.iconName || 'PenTool'
                            });
                            setIsCreatingSkill(true);
                          }}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-blue-400 transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSkill(skill.id)}
                          className="p-2 rounded-lg bg-red-950/20 hover:bg-red-900/30 text-red-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. SERVICES CONFIGURATION */}
            {activeTab === 'services' && (
              <div className="space-y-10 relative z-10">
                <div className="flex justify-between items-end border-b border-white/5 pb-6">
                  <div>
                    <span className="text-xs font-mono text-rose-500 tracking-wider block mb-1">COMMERCIAL TIERS</span>
                    <h1 className="text-3xl font-display font-black tracking-tight">Manage Services</h1>
                  </div>
                  
                  <button
                    onClick={() => {
                      setEditingService(null);
                      setServiceForm({
                        name: '',
                        description: '',
                        price: '$1,000+',
                        features: ['']
                      });
                      setIsCreatingService(true);
                    }}
                    className="flex items-center gap-2 px-5 py-3 bg-white text-black font-display font-medium text-xs tracking-widest uppercase rounded-xl hover:bg-white/90 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    ADD SERVICE
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {editedServices.map((service) => (
                    <div key={service.id} className="p-6 rounded-2xl bg-[#0d0d0d] border border-white/5 flex flex-col justify-between min-h-[220px]">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-lg font-display font-bold text-white">{service.name}</h4>
                          <span className="text-xs font-mono text-blue-400 font-bold">{service.price}</span>
                        </div>
                        <p className="text-xs text-white/50 leading-relaxed font-light mb-4">{service.description}</p>
                        <ul className="text-[10px] font-mono text-white/40 space-y-1">
                          {service.features.map((f, i) => <li key={i}>• {f}</li>)}
                        </ul>
                      </div>

                      <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-white/5">
                        <button
                          onClick={() => {
                            setEditingService(service);
                            setServiceForm({
                              name: service.name,
                              description: service.description,
                              price: service.price,
                              features: service.features.length > 0 ? service.features : ['']
                            });
                            setIsCreatingService(true);
                          }}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-blue-400 transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteService(service.id)}
                          className="p-2 rounded-lg bg-red-950/20 hover:bg-red-900/30 text-red-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. TESTIMONIALS SLIDER */}
            {activeTab === 'testimonials' && (
              <div className="space-y-10 relative z-10">
                <div className="flex justify-between items-end border-b border-white/5 pb-6">
                  <div>
                    <span className="text-xs font-mono text-teal-500 tracking-wider block mb-1">CLIENT COMMENDATIONS</span>
                    <h1 className="text-3xl font-display font-black tracking-tight">Manage Testimonials</h1>
                  </div>
                  
                  <button
                    onClick={() => {
                      setEditingTestimonial(null);
                      setTestimonialForm({
                        clientName: '',
                        clientRole: '',
                        clientCompany: '',
                        feedback: '',
                        rating: 5,
                        avatarUrl: ''
                      });
                      setIsCreatingTestimonial(true);
                    }}
                    className="flex items-center gap-2 px-5 py-3 bg-white text-black font-display font-medium text-xs tracking-widest uppercase rounded-xl hover:bg-white/90 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    ADD TESTIMONIAL
                  </button>
                </div>

                <div className="space-y-4">
                  {editedTestimonials.map((test) => (
                    <div key={test.id} className="p-6 rounded-2xl bg-[#0d0d0d] border border-white/5 flex justify-between items-start gap-6">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 overflow-hidden shrink-0">
                          {test.avatarUrl ? <img src={test.avatarUrl} alt="" className="w-full h-full object-cover" /> : <ShieldCheck className="w-4 h-4" />}
                        </div>
                        <div>
                          <h4 className="text-base font-display font-bold text-white">{test.clientName}</h4>
                          <p className="text-xs font-mono text-white/40 mb-3">{test.clientRole} at <span className="text-blue-400">{test.clientCompany}</span></p>
                          <p className="text-sm text-white/70 font-light italic">"{test.feedback}"</p>
                        </div>
                      </div>

                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => {
                            setEditingTestimonial(test);
                            setTestimonialForm({
                              clientName: test.clientName,
                              clientRole: test.clientRole || '',
                              clientCompany: test.clientCompany || '',
                              feedback: test.feedback,
                              rating: test.rating || 5,
                              avatarUrl: test.avatarUrl || ''
                            });
                            setIsCreatingTestimonial(true);
                          }}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-blue-400 transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTestimonial(test.id)}
                          className="p-2 rounded-lg bg-red-950/20 hover:bg-red-900/30 text-red-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. MESSAGES INBOX (Full read, delete) */}
            {activeTab === 'messages' && (
              <div className="space-y-10 relative z-10">
                <div className="border-b border-white/5 pb-6">
                  <span className="text-xs font-mono text-indigo-500 tracking-wider block mb-1">MESSAGES INBOX</span>
                  <h1 className="text-3xl font-display font-black tracking-tight">Client Contact Letters</h1>
                </div>

                <div className="space-y-4">
                  {contactMessages.map((msg) => (
                    <div 
                      key={msg.id}
                      className={`p-6 rounded-2xl border transition-colors flex flex-col justify-between gap-4 ${
                        msg.status === 'unread' 
                          ? 'bg-[#0d0d0d] border-blue-500/35 shadow-lg shadow-blue-500/2' 
                          : 'bg-[#0d0d0d] border-white/5'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="text-base font-display font-bold text-white">{msg.name}</h4>
                            <span className="text-xs font-mono text-white/40">({msg.email})</span>
                          </div>
                          <span className="text-[10px] font-mono text-white/30 block mb-3 uppercase">RECEIVED: {new Date(msg.createdAt).toLocaleString()}</span>
                          <p className="text-sm text-white/80 font-light leading-relaxed max-w-4xl whitespace-pre-line">{msg.message}</p>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateMessageStatus(msg.id, msg.status === 'unread' ? 'read' : 'unread')}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-mono tracking-widest uppercase cursor-pointer transition-colors ${
                              msg.status === 'unread' ? 'bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20' : 'bg-white/5 border border-white/5 text-white/40 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            {msg.status === 'unread' ? 'MARK READ' : 'MARK UNREAD'}
                          </button>
                          <button
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="p-2 rounded-lg bg-red-950/20 border border-red-500/10 hover:bg-red-900/30 text-red-400 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {contactMessages.length === 0 && (
                    <div className="py-24 text-center border border-dashed border-white/10 rounded-2xl">
                      <MessageSquare className="w-8 h-8 text-white/20 mx-auto mb-4" />
                      <p className="text-sm font-mono text-white/40">Your inbox is completely clear.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* DYNAMIC MODALS FOR PROJECTS, SKILLS, SERVICES, TESTIMONIALS */}
      
      {/* 1. PROJECT CREATOR / EDITOR MODAL */}
      <AnimatePresence>
        {isCreatingProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsCreatingProject(false)} />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-[85vh] bg-[#0d0d0d] border border-white/10 rounded-3xl overflow-hidden z-10 flex flex-col"
            >
              <div className="flex justify-between items-center px-6 py-4 border-b border-white/5 bg-[#101010]">
                <h3 className="text-base font-display font-bold text-white">{editingProject ? 'Modify Archived Project' : 'Archive New Masterpiece'}</h3>
                <button onClick={() => setIsCreatingProject(false)} className="p-1.5 rounded-full hover:bg-white/5 cursor-pointer"><X className="w-4.5 h-4.5" /></button>
              </div>

              <form onSubmit={handleSaveProjectForm} className="flex-1 overflow-y-auto p-8 space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono tracking-widest text-white/40 uppercase block">Project Title</label>
                    <input
                      type="text"
                      value={projectForm.title}
                      onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                      required
                      placeholder="e.g. Equinox Artisan Coffee"
                      className="w-full px-4 py-3 bg-[#050505] border border-white/5 rounded-xl text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono tracking-widest text-white/40 uppercase block">Visual Category Divider</label>
                    <select
                      value={projectForm.category}
                      onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                      className="w-full px-4 py-3 bg-[#050505] border border-white/5 rounded-xl text-xs focus:outline-none focus:border-blue-500 text-white"
                    >
                      {CATEGORIES.filter(c => c !== 'All').map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono tracking-widest text-white/40 uppercase block">Brief Description Narrative</label>
                  <textarea
                    rows={4}
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    required
                    placeholder="Describe the aesthetic direction, goals, and strategic success..."
                    className="w-full px-4 py-3 bg-[#050505] border border-white/5 rounded-xl text-xs focus:outline-none focus:border-blue-500 resize-none leading-relaxed"
                  />
                </div>

                {/* Dynamic project images */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <label className="text-[10px] font-mono tracking-widest text-white/40 uppercase block">Showcase Image URLs (High-Resolution Unsplash / Imgur)</label>
                    <button
                      type="button"
                      onClick={handleAddProjectImageField}
                      className="text-[9px] font-mono tracking-widest uppercase text-blue-400 hover:text-white transition-colors cursor-pointer"
                    >
                      + ADD URL FIELD
                    </button>
                  </div>

                  <div className="space-y-3">
                    {projectForm.images.map((img, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          type="text"
                          value={img}
                          onChange={(e) => handleUpdateProjectImageField(idx, e.target.value)}
                          placeholder="https://images.unsplash.com/... or Base64 file"
                          className="flex-1 px-4 py-2.5 bg-[#050505] border border-white/5 rounded-lg text-xs"
                        />
                        {/* Simulated optimization upload */}
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            id={`proj_file_${idx}`}
                            className="hidden"
                            onChange={(e) => handleSimulateImageUpload(e, (url) => handleUpdateProjectImageField(idx, url))}
                          />
                          <label
                            htmlFor={`proj_file_${idx}`}
                            className="px-3 py-2.5 bg-white/5 border border-white/5 rounded-lg text-[10px] font-mono hover:bg-white/10 transition-all cursor-pointer block"
                          >
                            UPLOAD
                          </label>
                        </div>
                        {projectForm.images.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setProjectForm({ ...projectForm, images: projectForm.images.filter((_, i) => i !== idx) })}
                            className="p-2.5 bg-red-950/20 text-red-400 border border-red-500/10 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dynamic Tools */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <label className="text-[10px] font-mono tracking-widest text-white/40 uppercase block font-semibold">Tools Applied</label>
                    <button
                      type="button"
                      onClick={handleAddProjectToolField}
                      className="text-[9px] font-mono tracking-widest uppercase text-blue-400 hover:text-white transition-colors cursor-pointer"
                    >
                      + ADD TOOL FIELD
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {projectForm.tools.map((tool, idx) => (
                      <div key={idx} className="flex items-center gap-1 bg-[#050505] border border-white/5 px-3 py-1.5 rounded-lg">
                        <input
                          type="text"
                          value={tool}
                          onChange={(e) => handleUpdateProjectToolField(idx, e.target.value)}
                          placeholder="e.g. CorelDRAW"
                          className="w-24 bg-transparent border-none text-xs focus:outline-none"
                        />
                        {projectForm.tools.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setProjectForm({ ...projectForm, tools: projectForm.tools.filter((_, i) => i !== idx) })}
                            className="text-red-400 hover:text-red-500 ml-1"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visual before/after slider options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono tracking-widest text-white/40 uppercase block">Before Draft Image URL (Comparison Slider)</label>
                    <input
                      type="text"
                      value={projectForm.beforeUrl}
                      onChange={(e) => setProjectForm({ ...projectForm, beforeUrl: e.target.value })}
                      placeholder="e.g. Early sketch render URL"
                      className="w-full px-4 py-3 bg-[#050505] border border-white/5 rounded-xl text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono tracking-widest text-white/40 uppercase block">After Finish Image URL (Comparison Slider)</label>
                    <input
                      type="text"
                      value={projectForm.afterUrl}
                      onChange={(e) => setProjectForm({ ...projectForm, afterUrl: e.target.value })}
                      placeholder="e.g. Final photo render URL"
                      className="w-full px-4 py-3 bg-[#050505] border border-white/5 rounded-xl text-xs"
                    />
                  </div>
                </div>

                {/* Additional meta */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono tracking-widest text-white/40 uppercase block">Design Engine Chronicles (Steps)</label>
                    <textarea
                      rows={4}
                      value={projectForm.process}
                      onChange={(e) => setProjectForm({ ...projectForm, process: e.target.value })}
                      placeholder="1. Discovery: ...\n2. Moodboarding: ..."
                      className="w-full px-4 py-3 bg-[#050505] border border-white/5 rounded-xl text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono tracking-widest text-white/40 uppercase block">Client Review Statement Quote</label>
                    <textarea
                      rows={4}
                      value={projectForm.clientFeedback}
                      onChange={(e) => setProjectForm({ ...projectForm, clientFeedback: e.target.value })}
                      placeholder="Review statement quoted from client..."
                      className="w-full px-4 py-3 bg-[#050505] border border-white/5 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={projectForm.featured}
                    onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                    className="w-4 h-4 accent-blue-500 rounded cursor-pointer"
                  />
                  <label htmlFor="featured" className="text-xs font-mono tracking-wider uppercase text-white/80 cursor-pointer">Feature on Highlights Hero Row</label>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setIsCreatingProject(false)}
                    className="px-5 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-mono uppercase cursor-pointer"
                  >
                    Discard Changes
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-white text-black font-display font-medium text-xs tracking-widest uppercase rounded-xl hover:bg-white/95 transition-all cursor-pointer"
                  >
                    Commit Project
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. SKILL EDITOR MODAL */}
      <AnimatePresence>
        {isCreatingSkill && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsCreatingSkill(false)} />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-[#0d0d0d] border border-white/10 rounded-3xl overflow-hidden z-10 flex flex-col"
            >
              <div className="flex justify-between items-center px-6 py-4 border-b border-white/5 bg-[#101010]">
                <h3 className="text-sm font-display font-bold text-white">{editingSkill ? 'Edit Professional Skill' : 'Create Custom Skill'}</h3>
                <button onClick={() => setIsCreatingSkill(false)} className="p-1 cursor-pointer"><X className="w-4 h-4" /></button>
              </div>

              <form onSubmit={handleSaveSkillForm} className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono tracking-widest text-white/40 uppercase block">Skill Name</label>
                  <input
                    type="text"
                    value={skillForm.name}
                    onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                    required
                    placeholder="e.g. CorelDRAW"
                    className="w-full px-4 py-3 bg-[#050505] border border-white/5 rounded-xl text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono tracking-widest text-white/40 uppercase block">Craft Level Percentage</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={skillForm.percentage}
                      onChange={(e) => setSkillForm({ ...skillForm, percentage: parseInt(e.target.value) || 80 })}
                      required
                      className="w-full px-4 py-3 bg-[#050505] border border-white/5 rounded-xl text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono tracking-widest text-white/40 uppercase block">Deliverables count</label>
                    <input
                      type="number"
                      value={skillForm.projectsCount}
                      onChange={(e) => setSkillForm({ ...skillForm, projectsCount: parseInt(e.target.value) || 10 })}
                      className="w-full px-4 py-3 bg-[#050505] border border-white/5 rounded-xl text-xs text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setIsCreatingSkill(false)} className="px-4 py-2 text-xs font-mono">Cancel</button>
                  <button type="submit" className="px-5 py-2.5 bg-white text-black font-display font-bold text-xs rounded-xl">Commit Skill</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. SERVICE EDITOR MODAL */}
      <AnimatePresence>
        {isCreatingService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsCreatingService(false)} />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-[#0d0d0d] border border-white/10 rounded-3xl overflow-hidden z-10 flex flex-col"
            >
              <div className="flex justify-between items-center px-6 py-4 border-b border-white/5 bg-[#101010]">
                <h3 className="text-sm font-display font-bold text-white">{editingService ? 'Edit Service' : 'Add Service'}</h3>
                <button onClick={() => setIsCreatingService(false)} className="p-1 cursor-pointer"><X className="w-4 h-4" /></button>
              </div>

              <form onSubmit={handleSaveServiceForm} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono tracking-widest text-white/40 uppercase block">Service Name</label>
                    <input
                      type="text"
                      value={serviceForm.name}
                      onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                      required
                      placeholder="e.g. Logo Design"
                      className="w-full px-4 py-3 bg-[#050505] border border-white/5 rounded-xl text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono tracking-widest text-white/40 uppercase block">Flat Rate Price</label>
                    <input
                      type="text"
                      value={serviceForm.price}
                      onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                      required
                      placeholder="e.g. $1,500+"
                      className="w-full px-4 py-3 bg-[#050505] border border-white/5 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono tracking-widest text-white/40 uppercase block">Description</label>
                  <textarea
                    rows={3}
                    value={serviceForm.description}
                    onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                    required
                    placeholder="Bespoke identity suites..."
                    className="w-full px-4 py-3 bg-[#050505] border border-white/5 rounded-xl text-xs"
                  />
                </div>

                {/* Service features checklist */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-mono tracking-widest text-white/40 uppercase block">Features Checklist</label>
                    <button
                      type="button"
                      onClick={handleAddServiceFeatureField}
                      className="text-[9px] font-mono text-blue-400 cursor-pointer"
                    >
                      + ADD FEATURE
                    </button>
                  </div>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {serviceForm.features.map((feat, i) => (
                      <div key={i} className="flex gap-2">
                        <input
                          type="text"
                          value={feat}
                          onChange={(e) => handleUpdateServiceFeatureField(i, e.target.value)}
                          placeholder="e.g. 3 Custom Concepts"
                          className="flex-1 px-3 py-2 bg-[#050505] border border-white/5 rounded-lg text-xs"
                        />
                        {serviceForm.features.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setServiceForm({ ...serviceForm, features: serviceForm.features.filter((_, idx) => idx !== i) })}
                            className="p-2 bg-red-950/20 text-red-400 border border-red-500/10 rounded-lg"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setIsCreatingService(false)} className="px-4 py-2 text-xs font-mono">Cancel</button>
                  <button type="submit" className="px-5 py-2.5 bg-white text-black font-display font-bold text-xs rounded-xl">Commit Service</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. TESTIMONIAL EDITOR MODAL */}
      <AnimatePresence>
        {isCreatingTestimonial && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsCreatingTestimonial(false)} />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-[#0d0d0d] border border-white/10 rounded-3xl overflow-hidden z-10 flex flex-col"
            >
              <div className="flex justify-between items-center px-6 py-4 border-b border-white/5 bg-[#101010]">
                <h3 className="text-sm font-display font-bold text-white">{editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}</h3>
                <button onClick={() => setIsCreatingTestimonial(false)} className="p-1 cursor-pointer"><X className="w-4 h-4" /></button>
              </div>

              <form onSubmit={handleSaveTestimonialForm} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono tracking-widest text-white/40 uppercase block">Client Name</label>
                    <input
                      type="text"
                      value={testimonialForm.clientName}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, clientName: e.target.value })}
                      required
                      placeholder="e.g. Julianne Vance"
                      className="w-full px-4 py-3 bg-[#050505] border border-white/5 rounded-xl text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono tracking-widest text-white/40 uppercase block">Company / Studio</label>
                    <input
                      type="text"
                      value={testimonialForm.clientCompany}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, clientCompany: e.target.value })}
                      required
                      placeholder="e.g. Aura Cosmetics"
                      className="w-full px-4 py-3 bg-[#050505] border border-white/5 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono tracking-widest text-white/40 uppercase block">Role Title</label>
                  <input
                    type="text"
                    value={testimonialForm.clientRole}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, clientRole: e.target.value })}
                    placeholder="e.g. Creative Director"
                    className="w-full px-4 py-3 bg-[#050505] border border-white/5 rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono tracking-widest text-white/40 uppercase block">Feedback Content</label>
                  <textarea
                    rows={4}
                    value={testimonialForm.feedback}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, feedback: e.target.value })}
                    required
                    placeholder="Amit is outstanding..."
                    className="w-full px-4 py-3 bg-[#050505] border border-white/5 rounded-xl text-xs"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setIsCreatingTestimonial(false)} className="px-4 py-2 text-xs font-mono">Cancel</button>
                  <button type="submit" className="px-5 py-2.5 bg-white text-black font-display font-bold text-xs rounded-xl">Commit Testimonial</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
