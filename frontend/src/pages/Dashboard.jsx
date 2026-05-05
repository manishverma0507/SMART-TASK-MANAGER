import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import EmptyState from '../components/EmptyState'
import Loader from '../components/Loader'
import TaskCard from '../components/TaskCard'
import { useAuth } from '../hooks/useAuth'
import { projectApi, taskApi } from '../services/api'
import { getErrorMessage, getTaskStats } from '../utils/helpers'

const statCards = [
  { key: 'total', label: 'Total tasks' },
  { key: 'completed', label: 'Completed tasks' },
  { key: 'pending', label: 'Pending tasks' },
  { key: 'overdue', label: 'Overdue tasks' },
]

export default function Dashboard() {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [myTasks, setMyTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true)
        const [{ data: projectData }, { data: myTaskData }] = await Promise.all([
          projectApi.list(),
          taskApi.myTasks(),
        ])

        setProjects(projectData)
        setMyTasks(myTaskData)
      } catch (error) {
        toast.error(getErrorMessage(error, 'Failed to load dashboard'))
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [refreshKey])

  const stats = useMemo(() => getTaskStats(myTasks), [myTasks])

  const handleStatusChange = async (taskId, status) => {
    try {
      await taskApi.update(taskId, { status })
      setRefreshKey((current) => current + 1)
      toast.success('Task status updated')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Could not update task'))
    }
  }

  if (loading) {
    return <Loader label="Loading dashboard..." />
  }

  return (
    <div className="space-y-6 py-4">
      <section className="grid gap-4 xl:grid-cols-[1.4fr_0.9fr]">
        <div className="rounded-[28px] bg-slate-950 p-6 text-white shadow-xl shadow-slate-900/10">
          <p className="text-sm uppercase tracking-[0.22em] text-brand-200">Overview</p>
          <h2 className="mt-3 text-3xl font-semibold">Welcome back, {user?.name}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
            Monitor your team, keep projects moving, and stay on top of your assigned work from one place.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map((card) => (
              <div key={card.key} className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-sm text-slate-400">{card.label}</p>
                <p className="mt-3 text-3xl font-semibold">{stats[card.key]}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Workspace snapshot</p>
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
              <p className="text-sm text-slate-500 dark:text-slate-400">Projects you can access</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{projects.length}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
              <p className="text-sm text-slate-500 dark:text-slate-400">My open tasks</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
                {myTasks.filter((task) => task.status !== 'completed').length}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
              <p className="text-sm text-slate-500 dark:text-slate-400">Role</p>
              <p className="mt-2 text-xl font-semibold capitalize text-slate-900 dark:text-white">{user?.role}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-slate-400">My tasks</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Assigned to me</h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Update progress directly from your dashboard.
          </p>
        </div>

        <div className="mt-6">
          {myTasks.length === 0 ? (
            <EmptyState
              title="No tasks assigned yet"
              description="When a project owner assigns you work, your tasks will show up here."
            />
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              {myTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  isAdmin={false}
                  canEdit
                  onDelete={() => {}}
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
