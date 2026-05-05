export const classNames = (...classes) => classes.filter(Boolean).join(' ')

export const formatDate = (date) => {
  if (!date) {
    return 'No deadline'
  }

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
  }).format(new Date(date))
}

export const isOverdue = (date, status) => {
  if (!date || status === 'completed') {
    return false
  }

  return new Date(date) < new Date()
}

export const getTaskStats = (tasks) => {
  const total = tasks.length
  const completed = tasks.filter((task) => task.status === 'completed').length
  const pending = tasks.filter((task) => task.status !== 'completed').length
  const overdue = tasks.filter((task) => isOverdue(task.deadline, task.status)).length

  return { total, completed, pending, overdue }
}

export const getErrorMessage = (error, fallback = 'Something went wrong') =>
  error?.response?.data?.message || fallback
