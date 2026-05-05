import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Loader from './components/Loader'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import ProjectDetails from './pages/ProjectDetails'
import NotFound from './pages/NotFound'

function ProtectedLayout() {
  const { user, loading } = useAuth()

  if (loading) {
    return <Loader label="Checking your session..." fullScreen />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen text-slate-900 transition-colors dark:text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Sidebar />
        <div className="flex min-h-full min-w-0 flex-1 flex-col rounded-[28px] border border-white/70 bg-white/80 shadow-xl shadow-slate-200/60 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-black/20">
          <Navbar />
          <main className="flex-1 px-4 pb-6 pt-2 sm:px-6 lg:px-8">
            <Routes>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:projectId" element={<ProjectDetails />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  )
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <Loader label="Loading..." fullScreen />
  }

  return user ? <Navigate to="/dashboard" replace /> : children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
        <Route path="/*" element={<ProtectedLayout />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
