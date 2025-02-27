import axios from "axios";

const CRUDApiService = {
    /**
     * Fetch all resources from an endpoint
     * @param {string} endpoint - The API resource endpoint (e.g., "projects", "applications")
     * @returns {Promise<any[]>}
     */
    async getAll(endpoint: string): Promise<any[]> {
        try {
            const response = await axios.get(`${endpoint}/`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error);
            throw error;
        }
    },

    /**
     * Fetch a single resource by ID
     * @param {string} endpoint - The API resource endpoint
     * @param {string} id - The ID of the resource
     * @returns {Promise<any>}
     */
    async getById(endpoint: string, id: string): Promise<any> {
        try {
            const response = await axios.get(`${endpoint}/${id}/`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching ${endpoint}/${id}:`, error);
            throw error;
        }
    },

    /**
     * Create a new resource
     * @param {string} endpoint - The API resource endpoint
     * @param {Object} data - The data for the new resource
     * @returns {Promise<any>}
     */
    async create(endpoint: string, data: object): Promise<any> {
        try {
            const response = await axios.post(`${endpoint}/`, data, {
                headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
            });
            return response.data;
        } catch (error) {
            console.error(`Error creating ${endpoint}:`, error);
            throw error;
        }
    },

    /**
     * Update an existing resource
     * @param {string} endpoint - The API resource endpoint
     * @param {string} id - The ID of the resource
     * @param {Object} data - The updated data
     * @returns {Promise<any>}
     */
    async update(endpoint: string, id: string, data: object): Promise<any> {
        try {
            const response = await axios.put(`${endpoint}/${id}/`, data, {
                headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
            });
            return response.data;
        } catch (error) {
            console.error(`Error updating ${endpoint}/${id}:`, error);
            throw error;
        }
    },

    /**
     * Partially update a resource (PATCH)
     * @param {string} endpoint - The API resource endpoint
     * @param {string} id - The ID of the resource
     * @param {Object} data - The updated data
     * @returns {Promise<any>}
     */
    async patch(endpoint: string, id: string, data: object): Promise<any> {
        try {
            const response = await axios.patch(`${endpoint}/${id}/`, data, {
                headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
            });
            return response.data;
        } catch (error) {
            console.error(`Error patching ${endpoint}/${id}:`, error);
            throw error;
        }
    },

    /**
     * Delete a resource
     * @param {string} endpoint - The API resource endpoint
     * @param {string} id - The ID of the resource
     * @returns {Promise<void>}
     */
    async delete(endpoint: string, id: string): Promise<void> {
        try {
            await axios.delete(`${endpoint}/${id}/`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
            });
        } catch (error) {
            console.error(`Error deleting ${endpoint}/${id}:`, error);
            throw error;
        }
    }
};

export default CRUDApiService;
