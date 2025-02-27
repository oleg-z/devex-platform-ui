<template>
  <VaLayout>
    <template #top>
    </template>

    <template #left>
      <VaSidebar>
        <VaSidebarItem active-color="backgroundPrimary">
          <VaSidebarItemContent>
            <VaSidebarItemTitle class="flex justify-between items-center leading-5 font-semibold">
              {{ application.name }}
            </VaSidebarItemTitle>
          </VaSidebarItemContent>
          <VaSidebarItem :active="selectedTab === 'overview'" @click="selectedTab = 'overview'">
            <VaSidebarItemContent class="py-3 pr-2 pl-4">
              <VaSidebarItemTitle class="flex justify-between items-center leading-5 font-semibold">
                Overview
              </VaSidebarItemTitle>
            </VaSidebarItemContent>
          </VaSidebarItem>
          <VaSidebarItem :active="selectedTab === 'definition'" @click="selectedTab = 'definition'">
            <VaSidebarItemContent class="py-3 pr-2 pl-4">
              <VaSidebarItemTitle class="flex justify-between items-center leading-5 font-semibold">
                Definition
              </VaSidebarItemTitle>
            </VaSidebarItemContent>
          </VaSidebarItem>

          <VaSidebarItem @click="selectedTab = 'configurations'">
            <VaSidebarItemContent class="py-3 pr-2 pl-4">
              <VaSidebarItemTitle class="flex justify-between items-center leading-5 font-semibold">
                Configurations
              </VaSidebarItemTitle>
            </VaSidebarItemContent>
            <VaSidebarItem v-for="config in configurations" :key="config.id" @click="configurationSelected(config.id)">
              <VaSidebarItemContent>
                <VaSidebarItemTitle>{{ config.name }}</VaSidebarItemTitle>
              </VaSidebarItemContent>
            </VaSidebarItem>
            <VaSidebarItem @click="isConfigModalOpen = true">
              <VaSidebarItemContent>
                <VaSidebarItemTitle>➕ Add</VaSidebarItemTitle>
              </VaSidebarItemContent>
            </VaSidebarItem>
          </VaSidebarItem>

          <!-- Modal for Creating a New Configuration -->
          <VaModal v-model="isConfigModalOpen" title="New Configuration" okText="Create" @ok="createConfiguration">
            <VaInput v-model="newConfig.name" label="Configuration Name" class="mt-2" />
            <VaInput v-model="newConfig.version" label="Version" class="mt-2" />
          </VaModal>

          <VaSidebarItem :active="selectedTab === 'deployments'" @click="selectedTab = 'deployments'">
            <VaSidebarItemContent class="py-3 pr-2 pl-4">
              <VaSidebarItemTitle class="flex justify-between items-center leading-5 font-semibold">
                Deployments
              </VaSidebarItemTitle>
            </VaSidebarItemContent>
          </VaSidebarItem>
        </VaSidebarItem>
      </VaSidebar>
    </template>

    <!-- Main Content -->
    <template #content>
      <div v-if="selectedTab === 'overview'">
        <VaCard class="application-details">
          <VaCardTitle>Application Overview</VaCardTitle>
          <VaCardContent>
            <VaForm @submit.prevent="saveApplication">
              <div class="editable-field" @click="editField('name')">
                <VaInput label="Name" v-model="application.name" />
              </div>
              <div class="editable-field" @click="editField('version')">
                <VaInput label="Version" v-model="application.version" />
              </div>
              <VaButton v-if="editingField" type="submit" class="mt-2" color="primary">Save</VaButton>
              <VaButton v-if="editingField" class="mt-2 ml-2" color="danger" @click="cancelEdit">Cancel</VaButton>
            </VaForm>
          </VaCardContent>
        </VaCard>
      </div>

      <div v-if="selectedTab === 'definition'">
        <VaCard class="application-details">
          <VaCardTitle>Application Definition</VaCardTitle>
          <VaCardContent>
            <div v-if="isEditing" class="definition-editor">
              <textarea v-model="application.definition" class="code-editor"></textarea>
              <VaButton class="mt-2" color="primary" @click="saveApplication">Save</VaButton>
              <VaButton class="mt-2 ml-2" color="danger" @click="cancelEdit">Cancel</VaButton>
            </div>
            <pre v-else @click="isEditing = true"
              class="code-display">{{ application.definition || "No definition available" }}</pre>
          </VaCardContent>
        </VaCard>
      </div>

      <div v-if="selectedTab === 'configurations'">
        <VaCard class="application-details">
          <VaCardTitle>Configurations</VaCardTitle>
          <VaCardContent>
            <!-- Main Content -->

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
                <pre v-else @click="isEditing = true"
                  class="code-display">{{ configuration.definition || "No definition available" }}</pre>
              </VaCardContent>
            </VaCard>

          </VaCardContent>
        </VaCard>
      </div>

      <div v-if="selectedTab === 'deployments'">
        <VaCard class="application-details">
          <VaCardTitle>Application Deployments</VaCardTitle>
          <VaCardContent>

          </VaCardContent>
        </VaCard>
      </div>
    </template>
  </VaLayout>
</template>

<script lang="ts" src="./ApplicationDetails.ts" />

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

.editable-field {
  margin-bottom: 10px;
  cursor: pointer;
}
</style>
