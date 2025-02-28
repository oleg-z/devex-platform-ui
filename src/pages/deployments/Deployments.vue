<template>

    <VaLayout>
        <template #content>
            <VaCard>
                <va-card-title class="header">
                    <div class="deployments-header">
                        <span>Deployments List</span>
                    </div>
                </va-card-title>
                <VaCardActions align="right">
                    <va-button size="small" color="primary" @click="isDeploymentModalOpen = true">New
                        Deployment</va-button>
                </VaCardActions>
                <VaCardContent>
                    <VaDataTable :items="deployments" :columns="columns" class="mt-4">
                        <template #cell(application)="{ rowData }">
                            {{ applicationName(rowData.application_id) }}
                        </template>
                        <template #cell(configuration)="{ rowData }">
                            {{ configurationName(rowData.configuration_id) }}
                        </template>
                        <template #cell(state)="{ rowData }">
                            <VaChip :color="getStateColor(rowData.state)"> {{ rowData.state }}</VaChip>
                        </template>
                        <template #cell(updated)="{ rowData }">
                            {{ new Date(rowData.updated).toLocaleString() }}
                        </template>
                    </VaDataTable>
                </VaCardContent>
            </VaCard>

            <!-- New Deployment Modal -->
            <VaModal v-model="isDeploymentModalOpen" title="New Deployment" okText="Create" @ok="createDeployment"
                :size="small">

                <VaSelect v-model="newDeployment.configuration_id" :options="configurations" label="Configuration"
                    class="mt-2" :valueBy="(option) => option.id" :trackBy="(option) => option.id"
                    :textBy="(option) => option.name" />
                <VaSelect v-model="newDeployment.configuration_version" :options="fetchConfigurationVersions()"
                    label="Configuration version" class="mt-2" :valueBy="(option) => option.version"
                    :textBy="(option) => option.version" :text-by="(option) => option.version" />

                <!-- <template #footer>
                        <VaButton color="danger" @click="isDeploymentModalOpen = false">Cancel</VaButton>
                        <VaButton type="submit" color="primary" :click>Create</VaButton>
                    </template> -->

            </VaModal>
        </template>
    </VaLayout>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import DeploymentService from "@/services/DeploymentService";
import ApplicationService from "@/services/ApplicationService";
import ConfigurationService from "@/services/ConfigurationService";
import { VaCard, VaCardTitle, VaCardContent, VaDataTable, VaChip, VaButton, VaModal, VaForm, VaSelect, VaInput } from "vuestic-ui";

export default {
    setup() {
        const route = useRoute();
        const deployments = ref([]);
        const applications = ref([]);
        const applicationId = ref(route.params.id);
        const configurations = ref([]);
        const isDeploymentModalOpen = ref(false);
        const newDeployment = ref({ application_id: applicationId, configuration_id: "", configuration_version: "" });

        const columns = [
            { key: "application", label: "Application Name", sortable: true },
            { key: "configuration", label: "Configuration Name", sortable: true },
            { key: "configuration_version", label: "Configuration Version", sortable: true },
            { key: "state", label: "State", sortable: true },
            { key: "updated", label: "Last update", sortable: true },
        ];

        const configurationName = (id) => {
            const config = configurations.value.find((config) => String(config.id) === String(id));
            return config ? config.name : "";
        };

        const applicationName = (id) => {
            const app = applications.value.find((app) => String(app.id) === String(id));
            return app ? app.name : "";
        };

        const fetchDeployments = async () => {
            try {
                deployments.value = await DeploymentService.getAll();
            } catch (error) {
                console.error("Error fetching deployments:", error);
            }
        };

        const fetchApplications = async () => {
            try {
                applications.value = await ApplicationService.getAll();
            } catch (error) {
                console.error("Error fetching applications:", error);
            }
        };

        const fetchConfigurations = async () => {
            try {
                configurations.value = await ConfigurationService.getApplicationConfigurations(applicationId.value);
            } catch (error) {
                console.error("Error fetching configurations:", error);
            }
        };

        const fetchConfigurationVersions = () => {
            const configurationVersions = configurations.value.filter((config) => {
                return String(config.id) === String(newDeployment.value.configuration_id);
            });
            return configurationVersions;
        }

        const createDeployment = async () => {
            if (!newDeployment.value.application_id || !newDeployment.value.configuration_id || !newDeployment.value.configuration_version) {
                alert("Please fill in all fields");
                return;
            }
            try {
                await DeploymentService.create(newDeployment.value);
                isDeploymentModalOpen.value = false;
                newDeployment.value = { application_id: "", configuration_id: "", version: "" };
                fetchDeployments();
            } catch (error) {
                console.error("Error creating deployment:", error);
            }
        };

        const getStateColor = (state) => {
            switch (state) {
                case "pending": return "warning";
                case "in_progress": return "info";
                case "successful": return "success";
                case "failed": return "danger";
                default: return "gray";
            }
        };

        onMounted(() => {
            fetchDeployments();
            fetchApplications();
            fetchConfigurations();
        });

        return {
            applicationName,
            configurationName,
            applicationId,
            deployments,
            columns,
            getStateColor,
            isDeploymentModalOpen,
            newDeployment,
            applications,
            configurations,
            createDeployment,
            fetchConfigurationVersions
        };
    }
};
</script>

<style scoped></style>