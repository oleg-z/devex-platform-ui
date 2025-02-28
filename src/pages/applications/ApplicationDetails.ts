import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import ApplicationService from "@/services/ApplicationService";
import ConfigurationService from "@/services/ConfigurationService";
import ConfigurationDetails from "@/pages/configurations/ConfigurationDetails.vue"
import Deployments from "@/pages/deployments/Deployments.vue"

import { VaCard, VaSidebar, VaSidebarItem, VaButton, VaInput, VaForm } from "vuestic-ui";

export default {
  components: {
    ConfigurationDetails,
    Deployments
  },
  setup() {
    const route = useRoute();
    const applicationId = route.params.id;
    const application = ref({});
    const selectedTab = ref("overview");
    const isEditing = ref(false);
    const editingField = ref(null);
    const originalApplication = ref({});
    const originalConfiguration = ref({});

    // Fetch specific application details
    const fetchApplication = async () => {
      try {
        application.value = await ApplicationService.getById(applicationId);
        originalApplication.value = { ...application.value };
      } catch (error) {
        console.error("Error fetching application details:", error);
      }
    };

    // Enable editing for specific field
    const editField = (field) => {
      editingField.value = field;
    };

    // Save edited application fields
    const saveApplication = async () => {
      try {
        await ApplicationService.update(applicationId, { ...application.value });
        isEditing.value = false;
        editingField.value = null;
        originalApplication.value = { ...application.value };
      } catch (error) {
        console.error("Error saving application:", error);
      }
    };

    // configurations related code
    const isConfigModalOpen = ref(false);
    const newConfig = ref({ name: "", definition: "config: {}", version: "", application_id: applicationId });
    const configId = ref(String)
    const configurations = ref([]);

    const configurationSelected = (id) => {
      configId.value = id;
      selectedTab.value = 'configurations';
    };

    const selectedConfiguration = () => {
      return configId;
    }

    const createConfiguration = async () => {
      if (!newConfig.value.name || !newConfig.value.version) {
        alert("Please enter name and version");
        return;
      }
      try {
        await ConfigurationService.create(newConfig.value);
        isConfigModalOpen.value = false;
        newConfig.value = { name: "", definition: "", version: "" }; // Reset form
        fetchConfigurations(); // Refresh list
      } catch (error) {
        console.error("Error creating configuration:", error);
      }
    };

    const fetchConfigurations = async () => {
      try {
        configurations.value = await ConfigurationService.getApplicationConfigurations(applicationId);
      } catch (error) {
        console.error("Error fetching configurations:", error);
      }
    }

    // Cancel editing and restore original application details
    const cancelEdit = () => {
      application.value = { ...originalApplication.value };
      isEditing.value = false;
      editingField.value = null;
    };

    onMounted(fetchApplication);
    onMounted(fetchConfigurations);

    return {
      application,
      selectedTab,
      isEditing,
      editingField,
      editField,
      saveApplication,
      cancelEdit,
      selectedConfiguration,
      configurationSelected,
      newConfig,
      configId,
      configurations,
      isConfigModalOpen,
      createConfiguration,
    };
  }
};