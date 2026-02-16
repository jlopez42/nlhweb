import { User, Project, License, ProjectFile, Question } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    name: 'John Smith',
    email: 'admin@constructpro.com',
    role: 'administrador',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '2',
    username: 'customer1',
    password: 'customer123',
    name: 'Maria Rodriguez',
    email: 'maria@example.com',
    role: 'cliente',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '3',
    username: 'provider1',
    password: 'provider123',
    name: 'Carlos Silva',
    email: 'carlos@example.com',
    role: 'proveedor',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150'
  }
];

export const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Downtown Office Complex',
    description: 'Modern 15-story office building with underground parking',
    location: 'Downtown Business District',
    type: 'Licitación',
    quantity: 1,
    floor: '15 floors + basement',
    materiality: 'Steel and Glass',
    surface: 12000,
    enclosure: 'Full glass facade',
    principal1: 'John Smith',
    principal2: 'Sarah Johnson',
    professionals: ['Licensed Architect', 'Structural Engineer'],
    specialists: ['HVAC Specialist', 'Electrical Engineer'],
    contact: 'project1@constructpro.com',
    additionalInfo: 'LEED Gold certification required LEED Gold certification requiredLEED Gold certification required LEED Gold certification required',
    userId: '1',
    licenseId: '1',
    status: 'Activo',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    publicationDate: new Date('2024-02-01'),
    startDate: new Date('2024-03-01'),
    finishDate: new Date('2024-12-31'),
    offersLimit: new Date('2024-12-31'),
    asksLimit: new Date('2024-12-31'),
    responseLimit: new Date('2024-12-31')
  },
  {
    id: '2',
    title: 'Residential Housing Development',
    description: 'Luxury residential complex with 50 units',
    location: 'Suburban Area North',
    type: 'Control de Obras',
    quantity: 50,
    floor: '3 floors per building',
    materiality: 'Brick and Concrete',
    surface: 8500,
    enclosure: 'Traditional brick facade',
    principal1: 'Maria Rodriguez',
    principal2: 'Robert Wilson',
    professionals: ['Licensed Architect', 'Civil Engineer'],
    specialists: ['Landscape Architect', 'Interior Designer'],
    contact: 'project2@constructpro.com',
    additionalInfo: 'Energy efficient design with solar panels',
    userId: '2',
    licenseId: '2',
    status: 'Pendiente',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-25'),
    publicationDate: new Date('2024-02-15'),
    startDate: new Date('2024-04-01'),
    finishDate: new Date('2025-02-28'),
    offersLimit: new Date('2024-12-31'),
    asksLimit: new Date('2024-12-31'),
    responseLimit: new Date('2024-12-31')
  }
];

export const mockLicenses: License[] = [
  {
    id: '1',
    name: 'General Contractor License',
    type: 'Construction',
    issuingAuthority: 'State Construction Board',
    issueDate: new Date('2022-01-15'),
    expiryDate: new Date('2025-01-15'),
    status: 'active',
    userId: '1'
  },
  {
    id: '2',
    name: 'Electrical Contractor License',
    type: 'Electrical',
    issuingAuthority: 'Electrical Contractors Board',
    issueDate: new Date('2023-06-01'),
    expiryDate: new Date('2024-06-01'),
    status: 'expiring',
    userId: '2'
  }
];

export const mockProjectFiles: ProjectFile[] = [
  {
    id: '1',
    projectId: '1',
    filename: 'architectural-plans.pdf',
    originalName: 'Downtown Office - Architectural Plans.pdf',
    size: 2.5 * 1024 * 1024, // 2.5 MB
    type: 'application/pdf',
    uploadDate: new Date('2024-01-16'),
    uploadedBy: 'John Smith'
  },
  {
    id: '2',
    projectId: '1',
    filename: 'structural-drawings.dwg',
    originalName: 'Structural Drawings v2.dwg',
    size: 4.1 * 1024 * 1024, // 4.1 MB
    type: 'application/acad',
    uploadDate: new Date('2024-01-18'),
    uploadedBy: 'Sarah Johnson'
  }
];

export const mockQuestions: Question[] = [
  {
    id: '1',
    projectId: '1',
    subject: 'Foundation Requirements',
    question: 'What are the specific requirements for the foundation given the soil conditions?',
    questionType: 'Technical',
    askedBy: 'Carlos Silva',
    askedAt: new Date('2024-01-20'),
    response: 'Based on the geotechnical report, we require reinforced concrete foundations with steel pilings.',
    respondedBy: 'John Smith',
    respondedAt: new Date('2024-01-21')
  },
  {
    id: '2',
    projectId: '1',
    subject: 'Material Specifications',
    question: 'Are there preferred suppliers for the glass facade materials?',
    questionType: 'Procurement',
    askedBy: 'Maria Rodriguez',
    askedAt: new Date('2024-01-22')
  }
];

export const mockQuestionsSpanish: Question[] = [
  {
    id: '1',
    projectId: '1',
    subject: 'Requisitos de Fundación',
    question: '¿Cuáles son los requisitos específicos para la fundación dados las condiciones del suelo?',
    questionType: 'Técnico',
    askedBy: 'Carlos Silva',
    askedAt: new Date('2024-01-20'),
    response: 'Según el informe geotécnico, requerimos fundaciones de concreto reforzado con pilotes de acero.',
    respondedBy: 'John Smith',
    respondedAt: new Date('2024-01-21')
  },
  {
    id: '2',
    projectId: '1',
    subject: 'Especificaciones de Materiales',
    question: '¿Hay proveedores preferidos para los materiales de la fachada de vidrio?',
    questionType: 'Intervención',
    askedBy: 'Maria Rodriguez',
    askedAt: new Date('2024-01-22')
  }
];