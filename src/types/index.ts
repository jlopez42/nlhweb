/* ============================================================
   ENUM TYPES
   ============================================================ */

export type UserRole =
  | 'administrador'
  | 'cliente'
  | 'proveedor'
  | 'arquitecto'
  | 'especialista';

export type ManagerRole =
  | 'profesional'
  | 'especialista';

export type ProjectStatus =
  | 'activo'
  | 'finalizado'
  | 'pendiente';


/* ============================================================
   BASE MODELS
   ============================================================ */

export interface User {
  id: number;
  username: string;
  password: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string | null;

  created_at: string | Date;
  updated_at: string | Date;
}

export interface ProjectType {
  id: number;
  title: string;
}


/* ============================================================
   PROJECT
   ============================================================ */

export interface Project {
  id: number;

  title: string;
  description: string;
  location: string;

  quantity: number;
  floor: string;
  materiality: string;

  surface: number;
  enclosure: string;

  additionalInfo?: string | null;

  userId: number;
  projectTypeId: number;
  
  status: ProjectStatus;
  
  created_at: string | Date;
  updated_at: string | Date;
  projectTypeName: string;
}


/* ============================================================
   PROJECT RELATIONS
   ============================================================ */

export interface ProjectProfessional {
  name: string;
  project_id: number;
}


export interface ProjectSpecialist {
  name: string;
  project_id: number;
}


/* ============================================================
   PROJECT CHARGES
   ============================================================ */

export interface ProjectCharge {
  id: number;

  projectId: number;

  mandatory1: string;
  mandatory2: string;

  contact: string;
}

/* ============================================================
   PROJECT CONFIG
   ============================================================ */

export interface ProjectConfig {
  id: number;

  projectId: number;

  publicationDate: string | Date;
  startDate: string | Date;
  finishDate: string | Date;

  offersLimit: string | Date;
  asksLimit: string | Date;
  responseLimit: string | Date;
}


/* ============================================================
   PROJECT FILES
   ============================================================ */

export interface ProjectFile {
  id: number;

  projectId: number;

  filename: string;
  originalName: string;

  file_size: number;

  extension: string;

  mime_type?: string | null;

  /** Raw binary data */
  file_content: Uint8Array;

  uploadDate: string | Date;
  uploadedBy: string | Date;
}


/* ============================================================
   QUESTIONS
   ============================================================ */

export interface Question {
  id: number;

  projectId: number;

  subject: string;
  question: string;

  questionType: string;

  askedBy: string;
  askedAt: string | Date;

  response?: string | null;

  respondedBy?: string | null;
  respondedAt?: string | Date | null;
}


/* ============================================================
   CONTACT MESSAGES
   ============================================================ */

export interface ContactMessage {
  id: number;

  subject: string;
  message: string;

  senderEmail?: string | null;

  sentAt: string | Date;
}


/* ============================================================
   PROJECT MEMBERS
   ============================================================ */

export interface ProjectMember {
  id: number;

  project_id: number;
  user_id: number;

  role: string;

  created_at: string | Date;
}


/** Entity of project with members */
export interface ProjectWithMembers extends Project {
  members: ProjectMember[];
}