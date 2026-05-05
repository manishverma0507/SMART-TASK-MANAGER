import { MoonStar, Sun, UserCircle2 } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { classNames } from '../utils/helpers'

const titles = {
  '/dashboard': 'Dashboard',
  '/projects': 'Projects',
}

export default function Navbar() {
  const { user, darkMode, toggleDarkMode, logout } = useAuth()
  const location = useLocation()
  const title = location.pathname.startsWith('/projects/')
    ? 'Project Details'
    : (titles[location.pathname] ?? 'Team Task Manager')

  return (
    <header className="flex flex-col gap-4 border-b border-slate-200/80 px-4 py-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">Collaborate smarter</p>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">{title}</h1>
        <div className="mt-3 flex gap-2 lg:hidden">
          {[
            { to: '/dashboard', label: 'Dashboard' },
            { to: '/projects', label: 'Projects' },
          ].map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                classNames(
                  'rounded-full px-3 py-1.5 text-sm font-medium transition',
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={toggleDarkMode}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-brand-300 hover:text-brand-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
        >
          {darkMode ? <Sun size={16} /> : <MoonStar size={16} />}
          {darkMode ? 'Light mode' : 'Dark mode'}
        </button>

        <div className="inline-flex items-center gap-3 rounded-2xl bg-slate-100 px-3 py-2 text-sm dark:bg-slate-800">
          <UserCircle2 size={18} className="text-brand-500" />
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">{user?.name}</p>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              {user?.role}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={logout}
          className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
        >
          Logout
        </button>
      </div>
    </header>
  )
}
