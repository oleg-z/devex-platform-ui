import CRUDApiService from "./CRUDApiService";

const PROJECTS_ENDPOINT = "/api/projects/";

const ProjectService = {
  getAll() {
    return CRUDApiService.getAll(PROJECTS_ENDPOINT);
  },

  getById(projectId: string) {
    return CRUDApiService.getById(PROJECTS_ENDPOINT, projectId);
  },

  create(projectData: object) {
    return CRUDApiService.create(PROJECTS_ENDPOINT, projectData);
  },

  update(projectId: string, projectData: object) {
    return CRUDApiService.update(PROJECTS_ENDPOINT, projectId, projectData);
  },

  // updateProjectStatus(projectId: string, status) {
  //   return CRUDApiService.patch(PROJECTS_ENDPOINT, projectId, { status });
  // },

  delete(projectId: string) {
    return CRUDApiService.delete(PROJECTS_ENDPOINT, projectId);
  }
};

export default ProjectService;