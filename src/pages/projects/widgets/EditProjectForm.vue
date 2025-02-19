<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { EmptyProject, Project } from '../types'
import { SelectOption } from 'vuestic-ui'
import ProjectStatusBadge from '../components/ProjectStatusBadge.vue'
import UserAvatar from '../../users/widgets/UserAvatar.vue'
import { useUsersStore } from '../../../stores/users'

const props = defineProps<{
  project: Project | null
  saveButtonLabel: string
}>()

defineEmits<{
  (event: 'save', project: Project): void
  (event: 'close'): void
}>()

const defaultNewProject: EmptyProject = {
  name: '',
  owners: [],
  team: undefined,
  status: undefined,
}

const newProject = ref({ ...defaultNewProject })

const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newProject.value).some((key) => {
    if (key === 'team') {
      return false
    }

    return (
      newProject.value[key as keyof EmptyProject] !== (props.project ?? defaultNewProject)?.[key as keyof EmptyProject]
    )
  })
})

defineExpose({
  isFormHasUnsavedChanges,
})

const usersStore = useUsersStore()

watch(
  () => props.project,
  () => {
    if (!props.project) {
      return
    }

    newProject.value = {
      ...props.project,
      owners: props.project.owners,
    }
  },
  { immediate: true },
)

const required = (v: string | SelectOption) => !!v || 'This field is required'

const ownerFiltersSearch = ref('')
const teamFiltersSearch = ref('')
</script>

<template>
  <VaForm v-slot="{ validate }" class="flex flex-col gap-2">
    <VaInput v-model="newProject.name" label="Project name" :rules="[required]" />
    <VaSelect v-model="newProject.owners" multiple v-model:search="ownerFiltersSearch" searchable label="Owner"
      text-by="fullname" track-by="id" value-by="id"
      :rules="[(v: any) => ('length' in v && v.length > 0) || 'This field is required']" :options="usersStore.items">
      <template #content="{ valueArray }">
        <template v-if="valueArray?.length">
          <div v-for="(user, index) in valueArray" :key="user.id" class="flex items-center gap-1 mr-2">
            <UserAvatar v-if="user" :user="user" size="18px" />
            {{ user.fullname }}{{ index < valueArray.length - 1 ? ',' : '' }} </div>
        </template>
      </template>
    </VaSelect>

    <VaSelect v-model="newProject.team" v-model:search="teamFiltersSearch" label="Team" text-by="name" track-by="id"
      value-by="id" :options="[]" :max-visible-options="$vaBreakpoint.mdUp ? 3 : 1">
      <template #content="{ value }">
        <div v-if="team" :key="team.id" class="flex items-center gap-1 mr-4">
          {{ team.name }}
        </div>
      </template>
    </VaSelect>
    <VaSelect v-model="newProject.status" label="Status" :rules="[required]" track-by="value" value-by="value" :options="[
      { text: 'Active', value: 'active' },
      { text: 'Inactive', value: 'inactive' },
    ]">
      <template #content="{ value }">
        <ProjectStatusBadge v-if="value" :status="value.value" />
      </template>
    </VaSelect>
    <div class="flex justify-end flex-col-reverse sm:flex-row mt-4 gap-2">
      <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
      <VaButton @click="validate() && $emit('save', newProject as Project)">{{ saveButtonLabel }}</VaButton>
    </div>
  </VaForm>
</template>

<style lang="scss" scoped>
.va-select-content__autocomplete {
  flex: 1;
}

.va-input-wrapper__text {
  gap: 0.2rem;
}
</style>
