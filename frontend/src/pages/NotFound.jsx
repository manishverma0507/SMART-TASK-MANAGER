import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="max-w-lg rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <p className="text-sm uppercase tracking-[0.24em] text-slate-400">404</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">Page not found</h1>
        <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
          The page you are looking for does not exist or may have been moved.
        </p>
        <Link
          to="/dashboard"
          className="mt-6 inline-flex rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-brand-500 dark:bg-white dark:text-slate-900"
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  )
}
