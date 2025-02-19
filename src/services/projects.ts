import axios from "axios";
import { UUIDTypes } from "uuid";

const API_URL = "/api/projects/";

const ProjectService = {
  /**
   * Fetch all projects
   * @returns {Promise}
   */
  list(): Promise<any> {
    return axios.get(API_URL, {
      headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
    }).then((r) => r.data);;
  },

  /**
   * Fetch a single project by ID
   * @param {string} projectId
   * @returns {Promise}
   */
  get(projectId: UUIDTypes): Promise<any> {
    return axios.get(`${API_URL}${projectId}/`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
    }).then((r) => r.data);
  },

  /**
   * Create a new project
   * @param {Object} projectData
   * @returns {Promise}
   */
  create(projectData: object): Promise<any> {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("authToken")}`
    };
    return axios.post(API_URL, projectData, { headers: headers }).then((r) => r.data);
  },

  /**
   * Update an existing project
   * @param {string} projectId
   * @param {Object} projectData
   * @returns {Promise}
   */
  update(projectId: UUIDTypes, projectData: object): Promise<any> {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("authToken")}`
    };

    return axios.put(`${API_URL}${projectId}/`, projectData, { headers: headers }).then((r) => r.data);
  },

  /**
   * Delete a project by ID
   * @param {string} projectId
   * @returns {Promise}
   */
  delete(projectId: UUIDTypes): Promise<any> {
    const headers = {
      'Authorization': `Bearer ${localStorage.getItem("authToken")}`
    };

    return axios.delete(`${API_URL}${projectId}/`, { headers: headers });
  }
};

export default ProjectService;
