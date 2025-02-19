import ProjectService from '../../services/projects'
import { Project } from '../../pages/projects/types'

export type Pagination = {
  page: number
  perPage: number
  total: number
}

export type Sorting = {
  sortBy: 'team' | 'created_at'
  sortingOrder: 'asc' | 'desc' | null
}

export const getProjects = async (options: Partial<Sorting> & Pagination) => {
  const projects: Project[] = await ProjectService.list()

  return {
    data: projects,
    pagination: {
      page: options.page,
      perPage: options.perPage,
      total: projects.length,
    },
  }
}

export const addProject = async (project: Omit<Project, 'id' | 'created_at'>) => {
  var response = await ProjectService.create(project)
  console.log(response)
  return
}

export const updateProject = async (project: Omit<Project, 'created_at'>) => {
  return await ProjectService.update(project.project_id, JSON.stringify(project))
}

export const removeProject = async (project: Project) => {
  await ProjectService.delete(project.project_id)
  return true
}