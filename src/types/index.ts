/** Entity of type of system users */
export type UserRole = 'administrator' | 'customer' | 'provider';

/** Entity of type of managers (professionals and specialists) */
export type ManagerRole = 'professional' | 'specialist';

/** Entity of system users */
export interface User {
  id: number;
  username: string;
  password: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

/** Entity of project types */
export interface ProjectType {
  id: number;
  title: string;
}

/** Entity of project information  */
export interface Project {
  id: number;
  title: string;
  description: string;
  location: string;
  type: ProjectType;
  quantity: number;
  floor: string;
  materiality: string;
  surface: number;
  enclosure: string;
  principal1: string;
  principal2: string;
  professionals: Manager[];
  specialists: Manager[];
  additionalInfo: string;
  userId: number;
  licenseId: number;
  status: 'active' | 'completed' | 'pending';
  createdAt: Date;
  updatedAt: Date;
}

/** Entity of people in charge information */
export interface ProjectCharges {
  id: number;
  projectId: number;
  mandatory1: string;
  mandatory2: string;
  professionals: Manager[];
  specialists: Manager[];
  contact: string;
}

/** Entity of managers (professionals and specialists) */
export interface Manager {
  id: number;
  name: string;
  role: ManagerRole;
}

/** Entity of config dates projects */
export interface ProjectConfig {
  id: number;
  projectId: number;
  publicationDate: Date;
  startDate: Date;
  finishDate: Date;
  offersLimit: number;
  asksLimit: number;
  responseLimit: number;
}

/** Entity of project files could be attachment */
export interface ProjectFile {
  id: number;
  projectId: number;
  filename: string;
  originalName: string;
  size: number;
  type: string;
  uploadDate: Date;
  uploadedBy: string;
}

/** Entity of questions and answers about projects */
export interface Question {
  id: number;
  projectId: number;
  subject: string;
  question: string;
  questionType: string;
  askedBy: string;
  askedAt: Date;
  response?: string;
  respondedBy?: string;
  respondedAt?: Date;
}

/** Entity of licenses for projects */
export interface License {
  id: number;
  name: string;
  type: string;
  issuingAuthority: string;
  issueDate: Date;
  expiryDate: Date;
  status: 'active' | 'expired' | 'expiring';
  userId: number;
}

/** Entity of contact messages sent to the system */
export interface ContactMessage {
  id: number;
  subject: string;
  message: string;
  senderEmail?: string;
  sentAt: Date;
}