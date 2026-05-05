import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'
import { getErrorMessage } from '../utils/helpers'

const initialState = {
  email: '',
  password: '',
}

export default function Login() {
  const [formData, setFormData] = useState(initialState)
  const [submitting, setSubmitting] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      setSubmitting(true)
      await login(formData)
      navigate('/dashboard')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Login failed'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/60 bg-white/80 shadow-2xl shadow-slate-200/50 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-black/20 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-brand-200">Team Task Manager</p>
            <h1 className="mt-6 text-4xl font-semibold leading-tight">
              Ship projects with more clarity, ownership, and momentum.
            </h1>
          </div>
          <p className="max-w-md text-sm leading-7 text-slate-400">
            Organize projects, assign tasks, and give every team member a clean collaborative workspace.
          </p>
        </div>

        <div className="p-6 sm:p-10">
          <p className="text-sm font-medium text-brand-600">Welcome back</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">Login to your workspace</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Use your account to continue managing projects and tasks.
          </p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Email</span>
              <input
                type="email"
                value={formData.email}
                onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-brand-500 dark:border-slate-700 dark:bg-slate-950"
                placeholder="you@example.com"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Password</span>
              <input
                type="password"
                value={formData.password}
                onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-brand-500 dark:border-slate-700 dark:bg-slate-950"
                placeholder="Enter your password"
              />
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-2xl bg-slate-900 px-4 py-3 font-medium text-white transition hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-900"
            >
              {submitting ? 'Signing in...' : 'Login'}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
            New here?{' '}
            <Link to="/signup" className="font-semibold text-brand-600">
              Create an account
            </Link>
          </p>

          <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950/30">
            <p className="mb-3 text-sm font-semibold text-green-900 dark:text-green-200">Demo Credentials</p>
            <div className="space-y-2 text-sm text-green-800 dark:text-green-300">
              <p><span className="font-medium">Email:</span> demo@example.com</p>
              <p><span className="font-medium">Password:</span> demo123 (or anything)</p>
              <p className="mt-3 text-xs text-green-700 dark:text-green-400">Use these credentials to test the app</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
