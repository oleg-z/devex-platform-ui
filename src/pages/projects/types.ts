import { User } from '../users/types'

export type UUID = `${string}-${string}-${string}-${string}-${string}`

export type Project = {
  project_id: UUID
  name: string
  owners: User['id'][]
  team: User['id']
  status: 'active' | 'inactive'
  created_at: string
}

export type EmptyProject = Omit<Project, 'project_id' | 'owners' | 'created_at' | 'status'> & {
  project_owner: Project['owners'] | undefined
  status: Project['status'] | undefined
}
