<template>
  <VaCard class="application-details">
    <VaCardContent>
      <!-- Main Content -->

      <VaCard class="configuration-details">
        <VaCardTitle>
          Configuration: {{ currentConfiguration.name }}, Version: {{ currentConfiguration.version }}
        </VaCardTitle>
        <VaCardContent>
          <div v-if="isEditingConfig" class="definition-editor">
            <textarea v-model="currentConfiguration.definition" class="code-editor" :autosize="true" :min-rows="10">
            </textarea>
            <div align="right">
              <VaButton class=" mt-2" size="small" color="primary" @click="saveDefinition">Save</VaButton>
              <VaButton class="mt-2 ml-2" size="small" color="danger" @click="cancelEdit">Cancel</VaButton>
            </div>
          </div>
          <pre v-else @click="isEditingConfig = true"
            class="code-display">{{ currentConfiguration.definition || "No definition available" }}</pre>
        </VaCardContent>
      </VaCard>
    </VaCardContent>
  </VaCard>
</template>

<script>
import { watch, computed, onMounted, ref } from 'vue';
import ConfigurationService from "@/services/ConfigurationService";
import { VaFormField } from 'vuestic-ui';

export default {
  props: ['configuration', 'configId'],
  setup(props) {
    // Cancel editing and restore original application details
    const isEditingConfig = ref(false);
    const configurationId = ref(props.configId);
    const currentConfiguration = ref({})
    const originalConfiguration = ref({})
    const reload = computed(() => fetchConfiguration(configurationId))

    const fetchConfiguration = async (id) => {
      try {
        currentConfiguration.value = await ConfigurationService.getById(configurationId.value);
        originalConfiguration.value = await ConfigurationService.getById(configurationId.value);

      } catch (error) {
        console.error("Error fetching configuration details:", error);
      }
    };

    const cancelEdit = () => {
      currentConfiguration.value = { ...originalConfiguration.value };
      isEditingConfig.value = false;
    };

    // Save edited definition
    const saveDefinition = async () => {
      try {
        await ConfigurationService.update(configurationId.value, { ...currentConfiguration.value });
        isEditingConfig.value = false;
        originalConfiguration.value = { ...currentConfiguration.value };
      } catch (error) {
        console.error("Error saving configuration definition:", error);
      }
    };

    onMounted(fetchConfiguration);
    watch(
      configurationId,
      fetchConfiguration
    )


    return {
      reload,
      configurationId,
      fetchConfiguration,
      currentConfiguration,
      isEditingConfig,
      cancelEdit,
      saveDefinition
    };
  }
}
</script>

<style scoped>
.application-details {
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

.definition-editor .code-editor {
  width: 100%;
  height: 300px;
  font-family: monospace;
  background-color: #2d2d2d;
  color: #f8f8f2;
  border: none;
  padding: 10px;
  border-radius: 5px;
}

.editable-field {
  margin-bottom: 10px;
  cursor: pointer;
}
</style>
