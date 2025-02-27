import CRUDApiService from "./CRUDApiService";

const APPLICATIONS_ENDPOINT = "/api/applications";

const ApplicationService = {
  getAll() {
    return CRUDApiService.getAll(APPLICATIONS_ENDPOINT);
  },

  getById(applicationId: string) {
    return CRUDApiService.getById(APPLICATIONS_ENDPOINT, applicationId);
  },

  create(applicationData: object) {
    return CRUDApiService.create(APPLICATIONS_ENDPOINT, applicationData);
  },

  update(applicationId: string, applicationData: object) {
    return CRUDApiService.update(APPLICATIONS_ENDPOINT, applicationId, applicationData);
  },

  delete(applicationId: string) {
    return CRUDApiService.delete(APPLICATIONS_ENDPOINT, applicationId);
  }
};

export default ApplicationService;
