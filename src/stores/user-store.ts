import { defineStore } from 'pinia'
import axios from "axios";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
    token: localStorage.getItem("authToken") || "",
    userId: localStorage.getItem("userId") || "",
  }),

  actions: {
    async fetchUser() {
      if (this.user) return;

      try {
        const response = await axios.get(
          `/api/users/${this.userId}/`,
          { headers: { Authorization: `Bearer ${this.token}` } }
        );
        this.user = response.data;
      } catch (error) {
      }
    },

    logout() {
      this.user = null;
      this.token = "";
      this.userId = "";

      localStorage.removeItem("authToken");
      localStorage.removeItem("userId");
    },
  },
});
