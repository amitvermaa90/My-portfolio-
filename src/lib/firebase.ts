/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  query, 
  where, 
  orderBy,
  getDocFromServer
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Project, Setting, Skill, Service, Testimonial, ContactMessage } from '../types';
import { DEFAULT_SETTING, DEFAULT_PROJECTS, DEFAULT_SKILLS, DEFAULT_SERVICES, DEFAULT_TESTIMONIALS } from '../data/defaultData';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId); /* CRITICAL: The app will break without this line */
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Standardized Operation Types for Error Handler
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

// Mandatory Firestore Error Handler conforming to specification
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection Validation - required by rules
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}

// Authentication Helpers
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
}

export async function logOut() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
}

// Core Database Fetchers
export async function fetchSettings(): Promise<Setting> {
  const path = 'settings/website_config';
  try {
    const docRef = doc(db, 'settings', 'website_config');
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return snapshot.data() as Setting;
    } else {
      // Seed on first load if settings don't exist yet
      await setDoc(docRef, DEFAULT_SETTING);
      return DEFAULT_SETTING;
    }
  } catch (error) {
    return handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function saveSettings(settings: Setting): Promise<void> {
  const path = 'settings/website_config';
  try {
    const docRef = doc(db, 'settings', 'website_config');
    await setDoc(docRef, settings);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function fetchProjects(): Promise<Project[]> {
  const path = 'projects';
  try {
    const colRef = collection(db, 'projects');
    const q = query(colRef, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      // Seed default projects if none exist
      const list: Project[] = [];
      for (const proj of DEFAULT_PROJECTS) {
        await setDoc(doc(db, 'projects', proj.id), proj);
        list.push(proj);
      }
      return list;
    }
    return snapshot.docs.map(doc => doc.data() as Project);
  } catch (error) {
    return handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function saveProject(project: Project): Promise<void> {
  const path = `projects/${project.id}`;
  try {
    await setDoc(doc(db, 'projects', project.id), project);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteProject(projectId: string): Promise<void> {
  const path = `projects/${projectId}`;
  try {
    await deleteDoc(doc(db, 'projects', projectId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function fetchSkills(): Promise<Skill[]> {
  const path = 'skills';
  try {
    const colRef = collection(db, 'skills');
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) {
      const list: Skill[] = [];
      for (const skill of DEFAULT_SKILLS) {
        await setDoc(doc(db, 'skills', skill.id), skill);
        list.push(skill);
      }
      return list;
    }
    return snapshot.docs.map(doc => doc.data() as Skill);
  } catch (error) {
    return handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function saveSkill(skill: Skill): Promise<void> {
  const path = `skills/${skill.id}`;
  try {
    await setDoc(doc(db, 'skills', skill.id), skill);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteSkill(skillId: string): Promise<void> {
  const path = `skills/${skillId}`;
  try {
    await deleteDoc(doc(db, 'skills', skillId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function fetchServices(): Promise<Service[]> {
  const path = 'services';
  try {
    const colRef = collection(db, 'services');
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) {
      const list: Service[] = [];
      for (const service of DEFAULT_SERVICES) {
        await setDoc(doc(db, 'services', service.id), service);
        list.push(service);
      }
      return list;
    }
    return snapshot.docs.map(doc => doc.data() as Service);
  } catch (error) {
    return handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function saveService(service: Service): Promise<void> {
  const path = `services/${service.id}`;
  try {
    await setDoc(doc(db, 'services', service.id), service);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteService(serviceId: string): Promise<void> {
  const path = `services/${serviceId}`;
  try {
    await deleteDoc(doc(db, 'services', serviceId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
  const path = 'testimonials';
  try {
    const colRef = collection(db, 'testimonials');
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) {
      const list: Testimonial[] = [];
      for (const test of DEFAULT_TESTIMONIALS) {
        await setDoc(doc(db, 'testimonials', test.id), test);
        list.push(test);
      }
      return list;
    }
    return snapshot.docs.map(doc => doc.data() as Testimonial);
  } catch (error) {
    return handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function saveTestimonial(testimonial: Testimonial): Promise<void> {
  const path = `testimonials/${testimonial.id}`;
  try {
    await setDoc(doc(db, 'testimonials', testimonial.id), testimonial);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteTestimonial(testimonialId: string): Promise<void> {
  const path = `testimonials/${testimonialId}`;
  try {
    await deleteDoc(doc(db, 'testimonials', testimonialId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Inbound contact messages
export async function submitContactMessage(message: Omit<ContactMessage, 'id' | 'status' | 'createdAt'>): Promise<void> {
  const id = `msg_${Date.now()}`;
  const path = `contacts/${id}`;
  const fullMsg: ContactMessage = {
    ...message,
    id,
    status: 'unread',
    createdAt: new Date().toISOString()
  };
  try {
    await setDoc(doc(db, 'contacts', id), fullMsg);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function fetchContactMessages(): Promise<ContactMessage[]> {
  const path = 'contacts';
  try {
    const colRef = collection(db, 'contacts');
    const q = query(colRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as ContactMessage);
  } catch (error) {
    return handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function updateContactStatus(messageId: string, status: string): Promise<void> {
  const path = `contacts/${messageId}`;
  try {
    await updateDoc(doc(db, 'contacts', messageId), { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteContactMessage(messageId: string): Promise<void> {
  const path = `contacts/${messageId}`;
  try {
    await deleteDoc(doc(db, 'contacts', messageId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
export async function initializeDatabase() {
  await testConnection();
}
