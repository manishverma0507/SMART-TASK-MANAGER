import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import EmptyState from '../components/EmptyState'
import Loader from '../components/Loader'
import ProjectCard from '../components/ProjectCard'
import { projectApi } from '../services/api'
import { getErrorMessage } from '../utils/helpers'

const initialForm = {
  name: '',
  description: '',
}

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [formData, setFormData] = useState(initialForm)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true)
        const { data } = await projectApi.list()
        setProjects(data)
      } catch (error) {
        toast.error(getErrorMessage(error, 'Failed to load projects'))
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [refreshKey])

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (formData.name.trim().length < 3) {
      toast.error('Project name must be at least 3 characters')
      return
    }

    try {
      setSubmitting(true)
      await projectApi.create(formData)
      setFormData(initialForm)
      setRefreshKey((current) => current + 1)
      toast.success('Project created successfully')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Could not create project'))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <Loader label="Loading projects..." />
  }

  return (
    <div className="space-y-6 py-4">
      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <form
          onSubmit={handleSubmit}
          className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950"
        >
          <p className="text-sm uppercase tracking-[0.22em] text-slate-400">New project</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Create a project workspace</h2>
          <div className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Project name</span>
              <input
                type="text"
                value={formData.name}
                onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900"
                placeholder="Marketing Launch"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Description</span>
              <textarea
                value={formData.description}
                onChange={(event) => setFormData((current) => ({ ...current, description: event.target.value }))}
                rows="5"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900"
                placeholder="Add project goals, milestones, or context..."
              />
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-2xl bg-slate-900 px-5 py-3 font-medium text-white transition hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-900"
            >
              {submitting ? 'Creating...' : 'Create project'}
            </button>
          </div>
        </form>

        <div className="rounded-[28px] bg-slate-950 p-6 text-white shadow-xl shadow-slate-900/10">
          <p className="text-sm uppercase tracking-[0.22em] text-brand-200">Collaboration</p>
          <h2 className="mt-2 text-3xl font-semibold">Every project has a clear owner and team</h2>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Add members by email, assign tasks by role, and keep work visible with filters for deadline and progress.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-white/5 p-4">
              <p className="text-sm text-slate-400">Total projects</p>
              <p className="mt-3 text-3xl font-semibold">{projects.length}</p>
            </div>
            <div className="rounded-3xl bg-white/5 p-4">
              <p className="text-sm text-slate-400">Members per project</p>
              <p className="mt-3 text-3xl font-semibold">
                {projects.reduce((sum, project) => sum + (project.members?.length || 0), 0)}
              </p>
            </div>
            <div className="rounded-3xl bg-white/5 p-4">
              <p className="text-sm text-slate-400">Ready to track</p>
              <p className="mt-3 text-3xl font-semibold">24/7</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Your projects</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Browse active workspaces</h2>
          </div>
        </div>

        <div className="mt-6">
          {projects.length === 0 ? (
            <EmptyState
              title="No projects yet"
              description="Create your first project to start assigning tasks and collaborating with your team."
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
