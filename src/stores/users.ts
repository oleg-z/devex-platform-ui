import { defineStore } from 'pinia'
import {
  type Filters,
  getUsers,
  Pagination,
  Sorting,
  updateUser,
  uploadAvatar,
} from '../data/pages/users'
import { User } from '../pages/users/types'
import { useUserStore } from './user-store'
import axios from 'axios'

export const useUsersStore = defineStore('users', {
  state: () => {
    return {
      items: [] as User[],
      pagination: { page: 1, perPage: 10, total: 0 },
    }
  },

  actions: {
    async getAll(options: { pagination?: Pagination; sorting?: Sorting; filters?: Partial<Filters> }) {
      const userStore = useUserStore()
      userStore.fetchUser()

      var responseData = []
      try {
        const response = await axios.get(
          `/api/users/`,
          { headers: { Authorization: `Bearer ${userStore.token}` } }
        );
        responseData = response.data;
      } catch (error) {
        return;
      }

      var users: User[] = responseData.map((user: any) => {
        return {
          id: user.id,
          fullname: `${user.first_name} ${user.last_name || ""}`,
          email: user.email,
          username: user.username,
          role: "admin",
          avatar: "",
          projects: [],
          notes: "",
          active: user.is_active,
        } as User
      });

      const { data, pagination } = getUsers(users, {
        ...options.filters,
        ...options.sorting,
        ...options.pagination,
      })

      this.items = data;
      this.pagination = pagination
    },

    async add(user: User) {
      const [newUser] = await addUser(user)
      this.items.unshift(newUser)
      return newUser
    },

    async update(user: User) {
      const [updatedUser] = await updateUser(user)
      const index = this.items.findIndex(({ id }) => id === user.id)
      this.items.splice(index, 1, updatedUser)
      return updatedUser
    },

    async remove(user: User) {
      const userStore = useUserStore(); // Get current user store
      try {
        await axios.delete(`/api/users/${user.id}/`, {
          headers: { Authorization: `Bearer ${userStore.token}` },
        });

        // Remove the user from the state only if the API call succeeds
        const index = this.items.findIndex(({ id }) => id === user.id)
        if (index !== -1) {
          this.items.splice(index, 1);
        }
      } catch (error) {
        console.error("Error deleting user", error);
      }
    },

    async uploadAvatar(formData: FormData) {
      return uploadAvatar(formData)
    },
  },
})
