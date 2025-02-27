
<template>
    <VaLayout>
      <template #top>
        <h2>{{ configuration.name }}</h2>
      </template>

      <template #left>
        <VaSidebar>
          <VaSidebarItem to="/configurations">
            <VaSidebarItemContent>
              <VaSidebarItemTitle>Back to Configurations</VaSidebarItemTitle>
            </VaSidebarItemContent>
          </VaSidebarItem>
        </VaSidebar>
      </template>

      <!-- Main Content -->
      <template #content>
        <VaCard class="configuration-details">
          <VaCardTitle>Configuration Overview</VaCardTitle>
          <VaCardContent>
            <VaForm>
              <VaInput v-model="configuration.name" label="Name" readonly="" />
              <VaInput v-model="configuration.version" label="Version" readonly="" />
            </VaForm>
          </VaCardContent>
        </VaCard>

        <VaCard class="configuration-details mt-4">
          <VaCardTitle>Configuration Definition</VaCardTitle>
          <VaCardContent>
            <div v-if="isEditing" class="definition-editor">
              <textarea v-model="configuration.definition" class="code-editor"></textarea>
              <VaButton class="mt-2" color="primary" @click="saveDefinition">Save</VaButton>
              <VaButton class="mt-2 ml-2" color="danger" @click="cancelEdit">Cancel</VaButton>
            </div>
            <pre v-else @click="isEditing = true" class="code-display">{{ configuration.definition || "No definition available" }}</pre>
          </VaCardContent>
        </VaCard>
      </template>
    </VaLayout>
  </template>

  <script>
  import { ref, onMounted } from "vue";
  import { useRoute } from "vue-router";
  import ConfigurationService from "@/services/ConfigurationService";
  import { VaCard, VaSidebar, VaSidebarItem, VaButton, VaInput, VaForm } from "vuestic-ui";

  export default {
    setup() {
      const route = useRoute();
      const configId = route.params.id;
      const configuration = ref({});
      const isEditing = ref(false);
      const originalConfiguration = ref({});

      // Fetch specific configuration details
      const fetchConfiguration = async () => {
        try {
          configuration.value = await ConfigurationService.getById(configId);
          originalConfiguration.value = { ...configuration.value };
        } catch (error) {
          console.error("Error fetching configuration details:", error);
        }
      };

      // Save edited definition
      const saveDefinition = async () => {
        try {
          await ConfigurationService.update(configId, { ...configuration.value });
          isEditing.value = false;
          originalConfiguration.value = { ...configuration.value };
        } catch (error) {
          console.error("Error saving configuration definition:", error);
        }
      };

      // Cancel editing and restore original configuration details
      const cancelEdit = () => {
        configuration.value = { ...originalConfiguration.value };
        isEditing.value = false;
      };

      onMounted(fetchConfiguration);

      return {
        configuration,
        isEditing,
        saveDefinition,
        cancelEdit
      };
    }
  };
  </script>

  <style scoped>
  .configuration-details {
    height: 70vh;
  }

  .code-display {
    background-color: #2d2d2d;
    color: #f8f8f2;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
    white-space: pre-wrap;
  }

  .definition-editor textarea {
    width: 100%;
    height: 300px;
    font-family: monospace;
    background-color: #2d2d2d;
    color: #f8f8f2;
    border: none;
    padding: 10px;
    border-radius: 5px;
  }
  </style>
