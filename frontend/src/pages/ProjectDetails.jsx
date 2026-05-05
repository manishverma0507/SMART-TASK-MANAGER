import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ArrowLeft, Filter, FolderPen, UserPlus2 } from 'lucide-react'
import EmptyState from '../components/EmptyState'
import Loader from '../components/Loader'
import TaskCard from '../components/TaskCard'
import { useAuth } from '../hooks/useAuth'
import { projectApi, taskApi } from '../services/api'
import { formatDate, getErrorMessage, getTaskStats } from '../utils/helpers'

const initialProjectForm = {
  name: '',
  description: '',
}

const initialTaskForm = {
  title: '',
  description: '',
  status: 'todo',
  deadline: '',
  assignedTo: '',
}

const initialFilters = {
  search: '',
  status: '',
  deadline: '',
}

export default function ProjectDetails() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [projectForm, setProjectForm] = useState(initialProjectForm)
  const [taskForm, setTaskForm] = useState(initialTaskForm)
  const [memberEmail, setMemberEmail] = useState('')
  const [filters, setFilters] = useState(initialFilters)
  const [loading, setLoading] = useState(true)
  const [savingProject, setSavingProject] = useState(false)
  const [addingMember, setAddingMember] = useState(false)
  const [creatingTask, setCreatingTask] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const isManager = useMemo(() => {
    if (!project || !user) {
      return false
    }

    return user.role === 'admin' || project.createdBy?._id === user._id
  }, [project, user])

  useEffect(() => {
    const loadProjectPage = async () => {
      try {
        setLoading(true)
        const params = Object.fromEntries(
          Object.entries(filters).filter(([, value]) => value),
        )

        const [{ data: projectData }, { data: taskData }] = await Promise.all([
          projectApi.getById(projectId),
          taskApi.listByProject(projectId, params),
        ])

        setProject(projectData)
        setTasks(taskData)
        setProjectForm({
          name: projectData.name,
          description: projectData.description || '',
        })
        setTaskForm((current) => ({
          ...current,
          assignedTo: current.assignedTo || projectData.members?.[0]?._id || '',
        }))
      } catch (error) {
        toast.error(getErrorMessage(error, 'Failed to load project'))
      } finally {
        setLoading(false)
      }
    }

    loadProjectPage()
  }, [filters, projectId, refreshKey])

  const stats = useMemo(() => getTaskStats(tasks), [tasks])

  const refresh = () => setRefreshKey((current) => current + 1)

  const handleProjectUpdate = async (event) => {
    event.preventDefault()

    if (projectForm.name.trim().length < 3) {
      toast.error('Project name must be at least 3 characters')
      return
    }

    try {
      setSavingProject(true)
      await projectApi.update(projectId, projectForm)
      refresh()
      toast.success('Project updated')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to update project'))
    } finally {
      setSavingProject(false)
    }
  }

  const handleProjectDelete = async () => {
    if (!window.confirm('Delete this project and all related tasks?')) {
      return
    }

    try {
      await projectApi.remove(projectId)
      toast.success('Project deleted')
      navigate('/projects')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Could not delete project'))
    }
  }

  const handleAddMember = async (event) => {
    event.preventDefault()

    if (!memberEmail) {
      toast.error('Enter a registered user email')
      return
    }

    try {
      setAddingMember(true)
      await projectApi.addMember(projectId, { email: memberEmail })
      setMemberEmail('')
      refresh()
      toast.success('Member added to project')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Could not add member'))
    } finally {
      setAddingMember(false)
    }
  }

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm('Remove this member from the project?')) {
      return
    }

    try {
      await projectApi.removeMember(projectId, memberId)
      refresh()
      toast.success('Member removed')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Could not remove member'))
    }
  }

  const handleCreateTask = async (event) => {
    event.preventDefault()

    if (!taskForm.title || !taskForm.assignedTo) {
      toast.error('Task title and assignee are required')
      return
    }

    try {
      setCreatingTask(true)
      await taskApi.create({
        ...taskForm,
        project: projectId,
      })
      setTaskForm({
        ...initialTaskForm,
        assignedTo: project?.members?.[0]?._id || '',
      })
      refresh()
      toast.success('Task created successfully')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Could not create task'))
    } finally {
      setCreatingTask(false)
    }
  }

  const handleStatusChange = async (taskId, status) => {
    try {
      await taskApi.update(taskId, { status })
      refresh()
      toast.success('Task updated')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Could not update task'))
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) {
      return
    }

    try {
      await taskApi.remove(taskId)
      refresh()
      toast.success('Task deleted')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Could not delete task'))
    }
  }

  if (loading) {
    return <Loader label="Loading project..." />
  }

  if (!project) {
    return (
      <EmptyState
        title="Project not found"
        description="The project might have been removed or you may not have access to it."
        action={
          <Link to="/projects" className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white">
            Back to projects
          </Link>
        }
      />
    )
  }

  return (
    <div className="space-y-6 py-4">
      <section className="rounded-[28px] bg-slate-950 p-6 text-white shadow-xl shadow-slate-900/10">
        <Link to="/projects" className="inline-flex items-center gap-2 text-sm text-slate-300 transition hover:text-white">
          <ArrowLeft size={16} />
          Back to projects
        </Link>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-brand-200">Project workspace</p>
            <h2 className="mt-2 text-3xl font-semibold">{project.name}</h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
              {project.description || 'No project description has been added yet.'}
            </p>
            <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-300">
              <span className="rounded-full bg-white/10 px-3 py-2">Owner: {project.createdBy?.name}</span>
              <span className="rounded-full bg-white/10 px-3 py-2">Members: {project.members?.length || 0}</span>
              <span className="rounded-full bg-white/10 px-3 py-2">Updated: {formatDate(project.updatedAt)}</span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-2">
            {[
              { label: 'Total', value: stats.total },
              { label: 'Completed', value: stats.completed },
              { label: 'Pending', value: stats.pending },
              { label: 'Overdue', value: stats.overdue },
            ].map((item) => (
              <div key={item.label} className="rounded-3xl bg-white/5 p-4">
                <p className="text-sm text-slate-400">{item.label}</p>
                <p className="mt-2 text-3xl font-semibold">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center gap-2">
              <FolderPen size={18} className="text-brand-500" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Project settings</h3>
            </div>

            {isManager ? (
              <form className="mt-5 space-y-4" onSubmit={handleProjectUpdate}>
                <input
                  type="text"
                  value={projectForm.name}
                  onChange={(event) => setProjectForm((current) => ({ ...current, name: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900"
                  placeholder="Project name"
                />
                <textarea
                  rows="4"
                  value={projectForm.description}
                  onChange={(event) => setProjectForm((current) => ({ ...current, description: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900"
                  placeholder="Update project details"
                />
                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={savingProject}
                    className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-brand-500 dark:bg-white dark:text-slate-900"
                  >
                    {savingProject ? 'Saving...' : 'Save project'}
                  </button>
                  <button
                    type="button"
                    onClick={handleProjectDelete}
                    className="rounded-2xl border border-rose-200 px-4 py-3 text-sm font-medium text-rose-600 transition hover:bg-rose-50 dark:border-rose-500/30 dark:hover:bg-rose-500/10"
                  >
                    Delete project
                  </button>
                </div>
              </form>
            ) : (
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                Members can view project details and update task progress. Project creators and admins can edit project settings.
              </p>
            )}
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center gap-2">
              <UserPlus2 size={18} className="text-brand-500" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Team members</h3>
            </div>

            {isManager ? (
              <form className="mt-5 flex flex-col gap-3 sm:flex-row" onSubmit={handleAddMember}>
                <input
                  type="email"
                  value={memberEmail}
                  onChange={(event) => setMemberEmail(event.target.value)}
                  className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900"
                  placeholder="Add registered user by email"
                />
                <button
                  type="submit"
                  disabled={addingMember}
                  className="rounded-2xl bg-brand-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {addingMember ? 'Adding...' : 'Add member'}
                </button>
              </form>
            ) : null}

            <div className="mt-5 grid gap-3">
              {project.members?.map((member) => (
                <div
                  key={member._id}
                  className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-900"
                >
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{member.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{member.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {member.role}
                    </span>
                    {isManager && member._id !== project.createdBy?._id ? (
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(member._id)}
                        className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-rose-200 hover:text-rose-600 dark:border-slate-700 dark:text-slate-300"
                      >
                        Remove
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {isManager ? (
            <form
              onSubmit={handleCreateTask}
              className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950"
            >
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Create task</h3>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <input
                  type="text"
                  value={taskForm.title}
                  onChange={(event) => setTaskForm((current) => ({ ...current, title: event.target.value }))}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900"
                  placeholder="Task title"
                />
                <select
                  value={taskForm.assignedTo}
                  onChange={(event) => setTaskForm((current) => ({ ...current, assignedTo: event.target.value }))}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900"
                >
                  {project.members?.map((member) => (
                    <option key={member._id} value={member._id}>
                      {member.name}
                    </option>
                  ))}
                </select>
                <select
                  value={taskForm.status}
                  onChange={(event) => setTaskForm((current) => ({ ...current, status: event.target.value }))}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900"
                >
                  <option value="todo">To do</option>
                  <option value="in-progress">In progress</option>
                  <option value="completed">Completed</option>
                </select>
                <input
                  type="date"
                  value={taskForm.deadline}
                  onChange={(event) => setTaskForm((current) => ({ ...current, deadline: event.target.value }))}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900"
                />
              </div>
              <textarea
                rows="4"
                value={taskForm.description}
                onChange={(event) => setTaskForm((current) => ({ ...current, description: event.target.value }))}
                className="mt-4 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900"
                placeholder="Describe the task deliverable"
              />
              <button
                type="submit"
                disabled={creatingTask}
                className="mt-4 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-900"
              >
                {creatingTask ? 'Creating task...' : 'Create task'}
              </button>
            </form>
          ) : null}

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-brand-500" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Filter tasks</h3>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <input
                type="text"
                value={filters.search}
                onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900"
                placeholder="Search tasks"
              />
              <select
                value={filters.status}
                onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900"
              >
                <option value="">All statuses</option>
                <option value="todo">To do</option>
                <option value="in-progress">In progress</option>
                <option value="completed">Completed</option>
              </select>
              <select
                value={filters.deadline}
                onChange={(event) => setFilters((current) => ({ ...current, deadline: event.target.value }))}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900"
              >
                <option value="">All deadlines</option>
                <option value="today">Due today</option>
                <option value="upcoming">Upcoming</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Task board</p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Tasks in this project</h3>
          </div>
          <button
            type="button"
            onClick={() => setFilters(initialFilters)}
            className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-brand-300 hover:text-brand-600 dark:border-slate-700 dark:text-slate-200"
          >
            Reset filters
          </button>
        </div>

        <div className="mt-6">
          {tasks.length === 0 ? (
            <EmptyState
              title="No tasks match this view"
              description="Create a task or adjust your filters to see more work items."
            />
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  isAdmin={isManager}
                  canEdit={isManager || task.assignedTo?._id === user?._id}
                  onDelete={handleDeleteTask}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
