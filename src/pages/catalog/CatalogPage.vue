<template>
  <va-card>
    <va-card-title class="header">
      <h2>Applications</h2>
      <va-button color="primary" @click="openNewApplicationModal">New Application</va-button>
    </va-card-title>

    <!-- Search Bar and Filter Button (Same Line) -->
    <va-card-content class="search-bar">
      <va-input v-model="filters.name" placeholder="Search by name" class="search-input" />
      <va-button @click="fetchApplications">Filter</va-button>
    </va-card-content>

    <!-- Applications Table -->
    <va-data-table :items="filteredApplications" :columns="columns" class="mt-4">
      <template #cell(name)="{ row }">
        <RouterLink :to="`/catalog/applications/${row.rowData.id}`" class="app-link">{{ row.rowData.name }}</RouterLink>
      </template>
      <template #cell(actions)="{ row }">
        <va-button size="small" color="danger" @click="deleteApplication(row.rowData.id)">Delete</va-button>
      </template>
    </va-data-table>

    <!-- New Application Modal -->
    <va-modal v-model="isNewApplicationModalOpen" title="Create New Application" okText="Create"
      @ok="createApplication">
      <va-input v-model="newApplication.name" placeholder="Application Name" class="mt-2" />
      <va-input v-model="newApplication.version" placeholder="Version" class="mt-2" />
    </va-modal>
  </va-card>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import ApplicationService from "@/services/ApplicationService";

export default {
  setup() {
    const applications = ref([]);
    const filters = ref({ name: "" });
    const isNewApplicationModalOpen = ref(false);
    const newApplication = ref({ name: "", version: "", definition: "{{spec template}}" });
    const router = useRouter();

    // Fetch applications from the API
    const fetchApplications = async () => {
      try {
        applications.value = await ApplicationService.getAll();
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    // Filter applications based on user input
    const filteredApplications = computed(() => {
      return applications.value.filter(app => {
        return (
          filters.value.name === "" || app.name.toLowerCase().includes(filters.value.name.toLowerCase())
        );
      });
    });

    // Delete an application
    const deleteApplication = async (id) => {
      try {
        await ApplicationService.delete(id);
        fetchApplications(); // Refresh list
      } catch (error) {
        console.error("Error deleting application:", error);
      }
    };

    // Open the "New Application" modal
    const openNewApplicationModal = () => {
      newApplication.value = { name: "", version: "", definition: "{{spec template}}" };
      isNewApplicationModalOpen.value = true;
    };

    // Create a new application
    const createApplication = async () => {
      if (!newApplication.value.name || !newApplication.value.version) {
        alert("Please enter name and version");
        return;
      }
      try {
        await ApplicationService.create(newApplication.value);
        isNewApplicationModalOpen.value = false;
        fetchApplications(); // Refresh list
      } catch (error) {
        console.error("Error creating application:", error);
      }
    };

    onMounted(fetchApplications);

    return {
      applications,
      filters,
      fetchApplications,
      filteredApplications,
      deleteApplication,
      isNewApplicationModalOpen,
      newApplication,
      openNewApplicationModal,
      createApplication
    };
  },
  data() {
    return {
      columns: [
        { key: "name", label: "Application Name", sortable: true },
        { key: "version", label: "Version", sortable: true },
        { key: "actions", label: "Actions", sortable: false },
      ]
    };
  }
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  /* Adds spacing between input and button */
}

.search-input {
  flex-grow: 1;
}

.app-link {
  text-decoration: none;
  color: var(--va-primary);
  font-weight: bold;
  cursor: pointer;
}

.app-link:hover {
  text-decoration: underline;
}
</style>
