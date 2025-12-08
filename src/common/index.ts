
export const util = {
    processProjects(data: any[]) {
        // Usamos un Map para agrupar los objetos por ID
        const groupedData = new Map();

        data.forEach(item => {
            const { id, name, role, ...commonData } = item;

            if (!groupedData.has(id)) {
                // Si el ID no existe, creamos un nuevo objeto con los datos comunes y los arrays vacíos
                groupedData.set(id, {
                    id,
                    ...commonData,
                    professionals: [],
                    specialist: []
                });
            }

            // Agregamos el nombre al array correspondiente según el rol
            const project = groupedData.get(id);
            if (role === 'professional') {
                project.professionals.push(name);
            } else if (role === 'specialist') {
                project.specialist.push(name);
            }
        });

        // Convertimos el Map de nuevo a un array de objetos
        return Array.from(groupedData.values());
    }
}