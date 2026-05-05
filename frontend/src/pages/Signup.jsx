import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'
import { getErrorMessage } from '../utils/helpers'

const initialState = {
  name: '',
  email: '',
  password: '',
  role: 'member',
}

export default function Signup() {
  const [formData, setFormData] = useState(initialState)
  const [submitting, setSubmitting] = useState(false)
  const { signup } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill in all fields')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    try {
      setSubmitting(true)
      await signup(formData)
      navigate('/dashboard')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Signup failed'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/60 bg-white/80 shadow-2xl shadow-slate-200/50 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-black/20 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="hidden bg-brand-500 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-brand-100">Create workspace access</p>
            <h1 className="mt-6 text-4xl font-semibold leading-tight">
              Start collaborating with a modern task workflow.
            </h1>
          </div>
          <p className="max-w-md text-sm leading-7 text-brand-100/80">
            Choose a role, create projects, and assign tasks with the structure teams need to move fast.
          </p>
        </div>

        <div className="p-6 sm:p-10">
          <p className="text-sm font-medium text-brand-600">Get started</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">Create your account</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Set up your profile and start managing projects from one dashboard.
          </p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Name</span>
              <input
                type="text"
                value={formData.name}
                onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-brand-500 dark:border-slate-700 dark:bg-slate-950"
                placeholder="Manish Verma"
              />
            </label>

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
                placeholder="Minimum 6 characters"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Role</span>
              <select
                value={formData.role}
                onChange={(event) => setFormData((current) => ({ ...current, role: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-brand-500 dark:border-slate-700 dark:bg-slate-950"
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-2xl bg-slate-900 px-4 py-3 font-medium text-white transition hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-900"
            >
              {submitting ? 'Creating account...' : 'Signup'}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-brand-600">
              Login
            </Link>
          </p>

          <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/30">
            <p className="mb-3 text-sm font-semibold text-blue-900 dark:text-blue-200">Demo Credentials</p>
            <div className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
              <p><span className="font-medium">Email:</span> demo@example.com</p>
              <p><span className="font-medium">Password:</span> demo123 (or anything)</p>
              <p className="mt-3 text-xs text-blue-700 dark:text-blue-400">Or create a new account with any credentials</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
