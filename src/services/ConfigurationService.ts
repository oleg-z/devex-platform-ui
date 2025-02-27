import CRUDApiService from "./CRUDApiService";

const API_ENDPOINT = "/api/configurations";

const ConfigurationService = {
  getAll() {
    return CRUDApiService.getAll(API_ENDPOINT);
  },

  getById(id: string) {
    API_ENDPOINT
    return CRUDApiService.getById(API_ENDPOINT, id);
  },

  create(data: object) {
    return CRUDApiService.create(API_ENDPOINT, data);
  },

  update(id: string, data: object) {
    return CRUDApiService.update(API_ENDPOINT, id, data);
  },

  delete(id: string) {
    return CRUDApiService.delete(API_ENDPOINT, id);
  }
};

export default ConfigurationService;
