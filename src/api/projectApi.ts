import http from "./http";

export const getAllProjects = () => http.get(`/projects`);
export const getProjectById = (id: string) => http.get(`/projects/${id}`);