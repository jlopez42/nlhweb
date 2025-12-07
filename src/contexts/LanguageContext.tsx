import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'es' ;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    'nav.services': 'Services',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.login': 'Login',
    
    // Landing Page
    'landing.hero.title': 'NLH - Nosotros Lo Hacemos',
    'landing.hero.subtitle': 'Project Advisory and Management - Project Development - Construction, Remodeling, and Tenant Improvements',
    'landing.hero.subtitle2': 'Online Platform - Tender and Budget Management - Project Control',
    'landing.services.title': 'Our Services',
    
    // Landing Page Contact Section
    'landing.contact.title': 'Contact Us',
    'landing.contact.name': 'Name',
    'landing.contact.email': 'Email',
    'landing.contact.message': 'Message',
    'landing.contact.submit': 'Send Message',
    'landing.contact.phone': 'Phone',
    'landing.contact.phone.number': '+56 9 8866-9996',
    'landing.contact.email.address': 'contact@nlh.com',
    'landing.contact.whatsapp': 'WhatsApp',
    'landing.contact.whatsapp.number': 'Number: +56 9 8866-9996',
    
    // Landing Page About Section
    'landing.about.title': 'About Us',
    'landing.about.description': 'We are a company with 15 years of experience in Santiago and Regions, which has made us a real solution for our clients, both in construction, remodeling and habilitation services, as well as in management and consulting, all this with significant support from our online WEB platform, which facilitates bidding processes, inspection and collaboration, control and monitoring of projects, etc., keeping the information within everyone\'s reach, anywhere and at any time.',
    'landing.about.team' : 'Expert Team',

    // Landing Page Services Section
    'landing.services.subtitle1': 'Project Advisory and Management',
    'landing.services.description1': 'Provides expert guidance and oversight throughout the entire project lifecycle, from initial concept to completion.',
    'landing.services.subtitle2': 'Project Development, Architecture, Engineering, and Specialties',
    'landing.services.description2': 'This includes everything from initial planing and site preparation to the final touches and projects handover.',
    'landing.services.subtitle3': 'Construction, Remodeling, and Tenant Improvements',
    'landing.services.description3': 'Transform existing spaces to meet new needs, improve functionality, or update aesthetics.',
    'landing.services.subtitle4': 'Online Platform',
    'landing.services.description4': 'A centralized, cloud-based solution that digitizes and streamlines a company\'s entire project workflow.',
    'landing.services.subtitle5': 'Tender and Budget Management',
    'landing.services.description5': 'Comprehensive management of the tendering process, from preparing and issuing tender documents to evaluating bids and awarding contracts.',
    'landing.services.subtitle6': 'Project Control',
    'landing.services.description6': 'A systematics approach to managing and monitoring a project\'s performance to ensure it stays on budget and schedule.',

    
    // Login
    'login.title': 'Login to Your Account',
    'login.username': 'Username',
    'login.password': 'Password',
    'login.submit': 'Sign In',
    'login.error': 'Invalid username or password',
    'login.test': 'Demo Credentials',
    
    // Dashboard
    'dashboard.profile': 'Profile',
    'dashboard.projects': 'Projects',
    'dashboard.license': 'License',
    'dashboard.settings': 'Settings',
    'dashboard.logout': 'Logout',

    // Dashboard Projects
    'dashboard.projects.subtitle': 'Manage your construction projects',
    'dashboard.projects.notfound': ' No projects found',
    'dashboard.projects.location': 'Location',
    'dashboard.projects.type': 'Type',
    'dashboard.projects.start': 'Start',
    'dashboard.projects.surface': 'Surface',
    'dashboard.projects.delete.title': 'Confirm Delete',
    'dashboard.projects.delete.confirmation': 'Are you sure you want to delete this project? This action cannot be undone',

    // Tab
    'tab.general': 'General',
    'tab.deadline': 'Deadline',
    'tab.files': 'Files',
    'tab.qa': 'Q&A',
    'tab.download': 'Download',

    // Profile
    'project.profile.title': 'Manage your account settings',
    'project.password.change': 'Change Password',
    'project.password.current': 'Current Password',
    'project.password.new': 'New Password',
    'project.password.confirm': 'Confirm New Password',

    // Profile validation
    'project.password.match': 'New passwords do not match',
    'project.password.long': 'Password must be at least 6 characters long',
    'project.password.success': 'Password updated successfully',

    // Profile Button
    'project.password.updating': 'Updating...',
    'project.password.update': 'Update Password',
    
    // Projects
    'projects.title.new': 'New Project',
    'projects.title.edit': 'Edit Project',
    'projects.new': 'New Project',
    'projects.edit': 'Edit',
    'projects.delete': 'Delete',
    'projects.view': 'View Details',

    // Project General Section
    'project.general.notfound': 'Project not found',
    'project.general.title': 'General Information',
    'project.general.name': 'Title',
    'project.general.location': 'Location',
    'project.general.description': 'Description',
    
    // Project Detail Section
    'project.detail.title': 'Project Details',
    'project.detail.view': 'Project Information',
    'project.detail.type': 'Type',
    'project.detail.quantity': 'Quantity',
    'project.detail.surface': 'Surface',
    'project.detail.floor': 'Floor',
    'project.detail.materiality': 'Materiality',
    'project.detail.enclosure': 'Enclosure',

    // Project Select Type
    'project.select.commercial': 'Commercial',
    'project.select.residential': 'Residential',
    'project.select.industrial': 'Industrial',
    'project.select.infrastructure': 'Infrastructure',

    // Project Officer Section
    'project.officer.title': 'Responsible Parties',
    'project.officer.principal1': 'Principal 1',
    'project.officer.principal2': 'Principal 2',
    'project.officer.professional': 'Professionals',
    'project.officer.professional.add': 'Add Professional',
    'project.officer.specialist': 'Specialists',
    'project.officer.specialist.add': 'Add Specialist',
    'project.officer.contact': 'Contact',

    // Project Addionally Section
    'project.addition.title': 'Additional Information',
    'project.addition.user': 'User',
    'project.addition.binding': 'Binding',

    // Deadline 
    'project.deadline.date': 'Project Dates',
    'project.deadline.publication': 'Publication Date',
    'project.deadline.start': 'Start Date',
    'project.deadline.end': 'Finish Date',
    
    'project.deadline.limits': 'Project Limits',
    'project.deadline.offers': 'Offers Limit',
    'project.deadline.ask': 'Asks Limit',
    'project.deadline.response': 'Response Limit',

    // Archivos
    'project.files.title': 'Project Files',
    'project.files.upload': 'Upload Files',
    'project.files.support': 'Supported File Types',
    'project.files.documents': 'Documents: PDF, DOC, DOCX',
    'project.files.cad': 'CAD Files: DWG',
    'project.files.images': 'Images: JPG, JPEG, PNG',
    'project.files.size': 'Maximum file size: 10MB per file',
    'project.files.without': 'No files uploaded yet',
    'project.files.attach': 'Upload files to attach them to this project',

    'project.files.table.file': 'File',
    'project.files.table.date': 'Upload Date',
    'project.files.table.by': 'Uploaded By',
    'project.files.table.size': 'Size',
    'project.files.table.action': 'Action',

    'project.files.message': 'ready to be associated with this project',

    // Project Button
    'project.button.save': 'Save Project',
    'project.button.update': 'Update Project',

    // Binding
    'project.binding.title': 'Manage your professional licenses',
    'project.binding.without': 'No licenses found',
    'project.binding.authority': 'Issuing Authority',
    'project.binding.date': 'Issue Date',
    'project.binding.expiry': 'Expiry Date',
    'project.binding.confirm': 'Are you sure you want to delete this license? This action cannot be undone.',

    'project.binding.add': 'New License',
    'project.binding.edit': 'Edit License',
    'project.binding.name': 'License Name',
    
    // Binding Select Type
    'project.binding.type': 'Type',
    'project.binding.construction': 'Construction',
    'project.binding.electrical': 'Electrical',
    'project.binding.plumbing': 'Plumbing',
    'project.binding.hvac': 'HVAC',
    'project.binding.engineering': 'Engineering',
    'project.binding.architecture': 'Architecture',  

    'project.binding.issuing': 'Issuing Authority',
    'project.binding.date.issue': 'Issue Date',
    'project.binding.date.expiry': 'Expiry Date',

    // Binding Button
    'project.binding.new': 'New License',
    'project.binding.save': 'Save License',

    // Q&A
    'project.qa.title': 'Ask a Question',
    'project.qa.subject': 'Subject',
    'project.qa.type': 'Question Type',
    'project.qa.question': 'Question',
    'project.qa.technical': 'Technical',
    'project.qa.procurement': 'Procurement',
    'project.qa.schedule': 'Schedule',
    'project.qa.general': 'General',

    'project.qa.list' : 'Questions & Answers',
    'project.qa.without' : 'No questions asked yet',
    'project.qa.ask.by': 'Asked by ',
    'project.qa.response.by': 'Responded by ',
    
    // Q&A Button
    'project.qa.response': 'Respond',
    'project.qa.send': 'Send',
    'project.qa.clear': 'Clear',

    // Download
    'project.download.title': 'Download Reports',
    'project.download.complete': 'Complete Report',
    'project.download.complete.description': 'Download a comprehensive project report',
    'project.download.questions': 'Questions Report',
    'project.download.questions.description': 'Download all questions and answers',
    
    // Download Button
    'project.download.button': 'Download',

    // Setting
    'project.setting.title': 'Settings',
    'project.setting.description': 'Manage system configuration and users',

    // Setting tabs
    'project.setting.tab.user': 'User Management',
    'project.setting.tab.project': 'Project Templates',
    'project.setting.tab.backup': 'System Backup',

    // Setting User
    'project.setting.user.add': 'Create New User',
    'project.setting.user.edit': 'Edit User',
    'project.setting.user.create': 'Create User',
    'project.setting.user.name': 'Name',
    'project.setting.user.email': 'Email',
    'project.setting.user.username': 'Company',
    'project.setting.user.password': 'Password',
    
    'project.setting.user.role': 'Role',
    'project.setting.user.administrator': 'Administrator',
    'project.setting.user.customer': 'Customer',
    'project.setting.user.provider': 'Provider',
    'project.setting.user.professional': 'Profesional',

    'project.setting.user.table.user': 'User',
    'project.setting.user.table.role': 'Role',
    'project.setting.user.table.username': 'Company',
    'project.setting.user.table.actions': 'Actions',

    // Setting Project Template
    'project.setting.template.title': 'Project Templates',
    'project.setting.template.description': 'Configure default project templates and settings',
    'project.setting.template.without': 'No templates configured',
    'project.setting.template.create': 'Create Template',

    // Setting Backup
    'project.setting.backup.title': 'System Backup',
    'project.setting.backup.description': 'Manage system backups and data export.',
    'project.setting.backup.create': 'Create Backup',
    'project.setting.backup.export': 'Export Backup',

    'project.setting.denied': 'Access denied. Administrator privileges required.',

    // Setting Button
    'project.setting.new': 'New User',
    'project.setting.save': 'Create',
    'project.setting.update': 'Update',

    // Common
    'common.save': 'Save',
    'common.saveing': 'Saving...',
    'common.cancel': 'Cancel',
    'common.close': 'Close',
    'common.loading': 'Loading...',
    'common.select': 'Select Type',
    'common.delete': 'Delete',
    'common.delete.confirm': 'Confirm Delete',
  },
  es: {
    // Navigation
    'nav.services': 'Servicios',
    'nav.about': 'Nosotros',
    'nav.contact': 'Contacto',
    'nav.login': 'Iniciar Sesión',
    
    // Landing Page
    'landing.hero.title': 'NLH - Nosotros Lo Hacemos',
    'landing.hero.subtitle': 'Asesorias y Gestión de Proyectos - Desarrollo de Proyectos - Construcción, Remodelación y Habilitaciones',
    'landing.hero.subtitle2': 'Plataforma Online - Gestión de Licitaciones y Presupuestos - Control de Obras',
    'landing.services.title': 'Nuestros Servicios',
    
    // Landing Page Contact Section
    'landing.contact.title': 'Contáctanos',
    'landing.contact.name': 'Nombre',
    'landing.contact.email': 'Correo Electrónico',
    'landing.contact.message': 'Mensaje',
    'landing.contact.submit': 'Enviar Mensaje',
    'landing.contact.phone': 'Teléfono',
    'landing.contact.phone.number': '+56 9 8866-9996',
    'landing.contact.email.address': 'contacto@nlh.com',
    'landing.contact.whatsapp': 'WhatsApp',
    'landing.contact.whatsapp.number': 'Número: +56 9 8866-9996',
    'landing.contact.whatsapp.link': 'https://wa.me/+56981805075?text=',
    'landing.contact.whatsapp.text': `Hola 👋, somos NLH,¡Gracias por contactarnos!
Estamos aquí para resolver tus dudas, brindarte información o atender tu
solicitud lo antes posible.

Por favor, indícanos:
🔹 Tu nombre
🔹 Lo que necesitas

¡Estaremos encantados de ayudarte! 😊`,
    
    // Landing Page About Section
    'landing.about.title': 'Acerca de Nosotros',
    'landing.about.description': 'Somos una empresa con 15 años de experiencia en Santiago y Regiones, lo que nos ha convertido en una solución real para nuestros clientes, tanto en los servicios de construcción, remodelación y habilitación, como en la gestión y asesoría, todo esto con un importante apoyo de nuestra plataforma WEB on-line, que facilita procesos de licitación, inspección y colaboración, control y seguimiento de proyectos, etc. manteniendo la información al alcancde de todos, en cualquier lugar y en todo momento.',
    'landing.about.team' : 'Equipo de Expertos',
    
    // Lading Page Services Section
    'landing.services.subtitle1': 'Asesoría y Gestión de Proyectos',
    'landing.services.description1': 'Proporciona orientación experta y supervisión durante todo el ciclo de vida del proyecto, desde el concepto inicial hasta la finalización.',
    'landing.services.description1ext': `Ofrecemos un servicio integral de asesoría y gestión diseñado para lograr optimizar desde la planificación inicial hasta
la entrega final de un proyecto, poniendo enfasis en puntos relevantes necesarios para cumplir objetivos tales como:
Supervisión y control: Monitoreamos de cerca la ejecución del proyecto, asegurando que se cumplan
los estándares de calidad y los plazos establecidos.
Coordinación de equipos: Actuamos como un puente de comunicación entre todas las partes involucradas
(proveedores, contratistas, etc.) y así generar una colaboración fluida.
Optimización de recursos: Buscamos la manera más eficiente de utilizar tu presupuesto con los distintos profesionales
y equipos que formaran parte del proyecto.
Reportes y comunicacion: Te mantenemos informado con informes claros y periódicos sobre el avance
y los indicadores claves del proyecto.
Control total: Te proporcionamos la visibilidad y el control que necesitas sobre el progreso, los recursos y los riesgos de tu proyecto.
La gestión exitosa de un proyecto requiere más que solo una buena idea.
Requiere una planificación meticulosa, una ejecución rigurosa y un control constante.
Con nuestra experiencia, convertimos lo que puede ser complejo para algunos,
en un proceso claro y controlado para establecer bases sólidas desde el inicio.`,
    'landing.services.subtitle2': 'Desarrollo de Proyectos, Arquitectura, Ingeniería y Especialidades',
    'landing.services.description2': `Contamos con un equipo de profesionales con basta experiencia en arquitectura, ingeniería y especialidades, y así nos aseguramos de que su visión se haga realidad con eficiencia y calidad en cada proyecto.
Combinamos la creatividad arquitectónica con la precisión de la ingeniería, para ofrecer soluciones integrales de diseño y construcción que no solo cumplen, sino que superan las expectativas.
Con años de experiencia y un enfoque en la calidad y sostenibilidad, diseñamos y ejecutamos soluciones en conjunto con nuestros clientes para crear espacios que no solo son estéticamente atractivos, sino también funcionales.`,
    'landing.services.subtitle3': 'Construcción, Remodelación y Habilitación',
    'landing.services.description3': `Te apoyamos en la concreción de tus proyectos, gestionando y desarrollando obras de construcción para los proyectos corporativos que tu empresa necesita, abordando Obras Civiles, Estructurales, Eléctricas, Climatización, Redes, Seguridad, Sanitario, Mobiliario, etc.
Ejecutamos proyectos de Remodelación y Habilitación, tanto para locales comerciales como oficinas corporativas, considerando todas las especialidades que forman parte de un proyecto, de manera que puedan potenciar tu productividad, optimizar tu flujo de trabajo y proyectar una imagen profesional y moderna.` ,
    'landing.services.subtitle4': 'Plataforma Online',
    'landing.services.description4': `En NLH creamos nuestra plataforma On Line para que sea una herramienta practica, útil y sencilla, que facilite no solo procesos de licitación, sino que también permita llevar el control y seguimiento de tus proyectos a través de servicios de inspección técnica (ITO) y Control de Obras, manteniendo la información al alcance de todos, en cualquier lugar y en todo momento.
Buscamos una real interacción
con nuestros clientes, y la de ellos con sus
proveedores,
respondiendo y aclarando On Line en cualquier momento, para así garantizar que disminuyan los retrasos, se cumplan los plazos establecidos y todo con total transparencia.
La Plataforma ofrece:
- Subida y descarga de archivos.
- Portal de Consultas y Respuestas.
- Seguimiento en tiempo real: control, notificaciones, aclaraciones, etc.
- Documentos e Historial del proyecto cuando sea requerido.
- Soporte 24/7 mientras el proyecto este activo.
- Reportes finales de cada proceso desarrollado.`,
    'landing.services.subtitle5': 'Gestión de Licitaciones y Presupuestos',
    'landing.services.description5': `En el dinámico entorno empresarial actual, la eficiencia y la reducción de costos son cruciales para mantener la competitividad. Es por eso que creamos una solución integral para digitalizar y optimizar sus procesos de adquisición y licitación. Esta herramienta de e-procurement le permite gestionar sus procesos de manera electrónica, segura y transparente, permitiendo:
Ahorrar tiempo y recursos: Agilice la elaboración y gestión de sus procesos de licitación.
Garantizar transparencia: Asegure un proceso justo y auditable con registro completo del historial de cada licitación.
Ampliar su red de proveedores: Conecte con una comunidad más amplia de proveedores, fomentando la competitividad y obteniendo mejores condiciones de precio-calidad.
Tomar decisiones informadas: Acceda a datos y métricas para evaluar propuestas y seleccionar la oferta más conveniente.`,
    'landing.services.subtitle6': 'Control de Obras',
    'landing.services.description6': `Durante estos 15 años con experiencia en distintos proyectos de Construcción, hemos logrado ganar la confianza de nuestros clientes en servicios de Inspección Técnica y Control de Obras, ya que nuestra mirada imparcial, rigurosa y proactiva nos permite tomar decisiones informadas, minimizar riesgos, evitar
sobrecostos, retrasos y vicios ocultos.
Ofrecemos un servicio integral de control y supervisión de obras con apoyo permanente de nuestra
Plataforma On Line, diseñado para brindarle transparencia, eficiencia y mejor visibilidad a cada proyecto.
Realizamos entre otras actividades:|
- Supervisión técnica continua en obra, con inspecciones programadas y no programadas.
- Verificación del cumplimiento de planos, especificaciones técnicas y normativas vigentes
- Control de avances físicos y cronogramas: seguimiento real vs. planificado
- Gestión y evaluación de la calidad de materiales y mano de obra
- Control de costos: detección temprana de desviaciones presupuestarias
- Emisión de informes técnicos periódicos con hallazgos, recomendaciones y fotografías
- Coordinación con contratistas, inspectores y autoridades competentes
- Apoyo en la recepción final y levantamiento de observaciones`,
    
    // Login
    'login.title': 'Iniciar Sesión en tu Cuenta',
    'login.username': 'Usuario',
    'login.password': 'Contraseña',
    'login.submit': 'Ingresar',
    'login.error': 'Usuario o contraseña inválidos',
    'login.test': 'Datos de Prueba',
    
    // Dashboard
    'dashboard.profile': 'Perfil',
    'dashboard.projects': 'GESTION DE PROYECTOS',
    'dashboard.license': 'Licitación',
    'dashboard.settings': 'Configuración',
    'dashboard.logout': 'Cerrar Sesión',

    // Dashboard Projects
    'dashboard.projects.title': 'Proyectos',
    'dashboard.projects.subtitle': ' ',
    'dashboard.projects.notfound': 'No hay proyectos',
    'dashboard.projects.location': 'Localización',
    'dashboard.projects.type': 'Tipo',
    'dashboard.projects.start': 'Iniciado',
    'dashboard.projects.surface': 'Superficie',
    'dashboard.projects.delete.title': 'Confirma Eliminación',
    'dashboard.projects.delete.confirmation': 'Esta seguro que desea eliminar este projecto? Esta acción no puede ser deshecha',

     // Tab
    'tab.general': 'General',
    'tab.deadline': 'Plazos y Fechas',
    'tab.files': 'Archivos',
    'tab.qa': 'Portal Consultas',
    'tab.download': 'Descargas',

    // Profile
    'project.profile.title': 'Administra la configuración de tu cuenta',
    'project.password.change': 'Cambiar Contraseña',
    'project.password.current': 'Contraseña Actual',
    'project.password.new': 'Contraseña Nueva',
    'project.password.confirm': 'Confirmar Nueva Contraseña',

    // Profile validation
    'project.password.match': 'La nueva contraseña no coinciden',
    'project.password.long': 'La contraseña debe tener al menos 6 caracteres.',
    'project.password.success': 'Contraseña actualizada exitosamente',

    // Profile Button
    'project.password.updating': 'Actualizando...',
    'project.password.update': 'Actualizar contraseña',
    
    // Projects
    'projects.title.new': 'Nuevo Proyecto',
    'projects.title.edit': 'Editar Proyecto',
    'projects.new': 'Nuevo Proyecto',
    'projects.edit': 'Editar',
    'projects.delete': 'Eliminar',
    'projects.view': 'Ver Detalles',

    // Project General Section
    'project.general.title': 'Información General',
    'project.general.name': 'Titulo',
    'project.general.location': 'Localización',
    'project.general.description': 'Descripción',
    
    // Project Detail Section
    'project.detail.title': 'Detalle Proyecto',
    'project.detail.view': 'Información del Proyecto',
    'project.detail.type': 'Tipo',
    'project.detail.quantity': 'Cantidad',
    'project.detail.surface': 'Superficie',
    'project.detail.floor': 'Nro de Piso',
    'project.detail.materiality': 'Materialidad',
    'project.detail.enclosure': 'Recinto',

    // Project Select Type
    'project.select.commercial': 'Commercial',
    'project.select.residential': 'Residential',
    'project.select.industrial': 'Industrial',
    'project.select.infrastructure': 'Infrastructure',

    // Project Officer Section
    'project.officer.title': 'Responsables',
    'project.officer.principal1': 'Mandante 1',
    'project.officer.principal2': 'Mandante 2',
    'project.officer.professional': 'Profesional',
    'project.officer.professional.add': '+',
    'project.officer.specialist': 'Especialista',
    'project.officer.specialist.add': '+',
    'project.officer.contact': 'Contacto',

    // Project Addionally Section
    'project.addition.title': 'Información Adicional',
    'project.addition.user': 'Cliente',
    'project.addition.binding': 'Licitación',

    // Deadline 
    'project.deadline.date': 'Fechas del proyecto',
    'project.deadline.publication': 'Fecha de publicación',
    'project.deadline.start': 'Fecha de inicio',
    'project.deadline.end': 'Fecha de finalización',
    
    'project.deadline.limits': 'Límites del proyecto',
    'project.deadline.offers': 'Límite de ofertas',
    'project.deadline.ask': 'Límite de consultas',
    'project.deadline.response': 'Límite de respuesta',

    // Archivos
    'project.files.title': 'Archivos de proyecto',
    'project.files.upload': 'Subir archivos',
    'project.files.support': 'Tipos de archivos admitidos',
    'project.files.documents': 'Documentos: PDF, DOC, DOCX',
    'project.files.cad': 'Archivos CAD: DWG',
    'project.files.images': 'Imagenes: JPG, JPEG, PNG',
    'project.files.size': 'Tamaño máximo de archivo: 10MB por archivo',
    'project.files.without': 'Aún no se han cargado archivos',
    'project.files.attach': 'Subir archivos para adjuntarlos a este proyecto',

    'project.files.table.file': 'Archivo',
    'project.files.table.date': 'Fecha de carga',
    'project.files.table.by': 'Subido por',
    'project.files.table.size': 'Tamaño',
    'project.files.table.action': 'Acción',

    'project.files.message': 'Listo para asociarse con este proyectot',

    // Project Button
    'project.button.save': 'Guardar Proyecto',
    'project.button.update': 'Actualizar Proyecto',

     // Binding
    'project.binding.title': 'Gestiona tus Licitaciones',
    'project.binding.without': 'No se encontraron licitaciones.',
    'project.binding.authority': 'Autoridad emisora',
    'project.binding.date': 'Fecha de Emisión',
    'project.binding.expiry': 'Fecha de Expiración',
    'project.binding.confirm': '¿Está seguro de que desea eliminar esta licitación? Esta acción no se puede deshacer.',

    'project.binding.add': 'Nueva Licitación',
    'project.binding.edit': 'Editar Licitación',
    'project.binding.name': 'Nombre Licitación',
    
    'project.binding.type': 'Tipo',
    'project.binding.construction': 'Construcción',
    'project.binding.electrical': 'Electrica',
    'project.binding.plumbing': 'Plomería',
    'project.binding.hvac': 'HVAC',
    'project.binding.engineering': 'Ingeniería',
    'project.binding.architecture': 'Arquitectura',  

    'project.binding.issuing': 'Authoridad',
    'project.binding.date.issue': 'Fecha Licitación',
    'project.binding.date.expiry': 'Expiración Licitación',

    // Binding Button
    'project.binding.new': 'Nueva Licitación',
    'project.binding.save': 'Guardar Licitación',

    // Q&A
    'project.qa.title': 'Haz una pregunta',
    'project.qa.subject': 'Asunto',
    'project.qa.type': 'Tipo de pregunta',
    'project.qa.question': 'Pregunta',
    'project.qa.technical': 'Técnico',
    'project.qa.procurement': 'Administrativo',
    'project.qa.schedule': 'Aclaración',
    'project.qa.general': 'General',

    'project.qa.list' : 'Preguntas y respuestas',
    'project.qa.without' : 'Aún no se han hecho preguntas',
    'project.qa.ask.by': 'Preguntado por ',
    'project.qa.response.by': 'Respondido por ',
    
    // Q&A Button
    'project.qa.response': 'Responder',
    'project.qa.send': 'Enviar',
    'project.qa.clear': 'Limpiar',

    // Download
    'project.download.title': 'Descargar Informes',
    'project.download.complete': 'Informe completo',
    'project.download.complete.description': 'Descargue un informe completo del proyecto',
    'project.download.questions': 'Informe de preguntas',
    'project.download.questions.description': 'Descargar todas las preguntas y respuestas',
    
    // Download Button
    'project.download.button': 'Descargar',

    // Setting
    'project.setting.title': 'Ajustes',
    'project.setting.description': 'Administrar la configuración del sistema y los usuarios',

    // Setting tabs
    'project.setting.tab.user': 'Gestión de usuarios',
    'project.setting.tab.project': 'Plantillas de proyectos',
    'project.setting.tab.backup': 'Copia de seguridad del sistema',

    // Setting User
    'project.setting.user.add': 'Crear nuevo usuario',
    'project.setting.user.edit': 'Editar usuario',
    'project.setting.user.create': 'Nuevo usuario',
    'project.setting.user.name': 'Nombre',
    'project.setting.user.email': 'Email',
    'project.setting.user.username': 'Nombre de Empresa',
    'project.setting.user.password': 'Contraseña',
    
    'project.setting.user.role': 'Rol',
    'project.setting.user.administrator': 'Administrador',
    'project.setting.user.customer': 'Cliente',
    'project.setting.user.provider': 'Provedor',
    'project.setting.user.professional': 'Profesional',

    'project.setting.user.table.user': 'Usuario',
    'project.setting.user.table.role': 'Rol',
    'project.setting.user.table.username': 'Nombre de Empresa',
    'project.setting.user.table.actions': 'Acciones',

    // Setting Project Template
    'project.setting.template.title': 'Plantillas de proyectos',
    'project.setting.template.description': 'Configurar plantillas y configuraciones de proyecto predeterminadas',
    'project.setting.template.without': 'No hay plantillas configuradas',
    'project.setting.template.create': 'Crear plantilla',

    // Setting Backup
    'project.setting.backup.title': 'Copia de seguridad del sistema',
    'project.setting.backup.description': 'Administrar copias de seguridad del sistema y exportación de datos.',
    'project.setting.backup.create': 'Crear copia de seguridad',
    'project.setting.backup.export': 'Exportar copia de seguridad',

    'project.setting.denied': 'Acceso denegado. Se requieren privilegios de administrador.',

    // Setting Button
    'project.setting.new': 'Nuevo usuario',
    'project.setting.save': 'Crear',
    'project.setting.update': 'Actualizar',
    
    // Common
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.close': 'Cerrar',
    'common.loading': 'Cargando...',
    'common.select': 'Seleccionar Tipo',
    'common.delete': 'Eliminar',
    'common.delete.confirm': 'Confirmar Eliminación',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('es');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};