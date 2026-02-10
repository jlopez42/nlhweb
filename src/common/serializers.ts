export function serializeUser(user: User): object {
  return {
    id: user.id,
    username: user.username,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar || null,
  };
}

export function deserializeUser(data: any): User {
  return {
    id: data.id,
    username: data.username,
    name: data.name,
    email: data.email,
    role: data.role,
    avatar: data.avatar || null,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}

export function serializeProject(project: Project): object {
  return {
    id: project.id,
    title: project.title,
    description: project.description,
    location: project.location,
    quantity: project.quantity,
    floor: project.floor,
    materiality: project.materiality,
    surface: project.surface,
    enclosure: project.enclosure,
    principal1: project.principal1,
    principal2: project.principal2,
    additionalInfo: project.additionalInfo || null,
    userId: project.userId,
    projectTypeId: project.projectTypeId,
    status: project.status,
    created_at: project.created_at,
    updated_at: project.updated_at,
    projectTypeName: project.projectTypeName,
  };
}

export function deserializeProject(data: any): Project {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    location: data.location,
    quantity: data.quantity,
    floor: data.floor,
    materiality: data.materiality,
    surface: data.surface,
    enclosure: data.enclosure,
    principal1: data.principal1,
    principal2: data.principal2,
    additionalInfo: data.additionalInfo || null,
    userId: data.userId,
    projectTypeId: data.projectTypeId,
    status: data.status,
    created_at: data.created_at,
    updated_at: data.updated_at,
    projectTypeName: data.projectTypeName,
  };
}

// Additional serializers and deserializers for other types can be added here.