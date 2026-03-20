import { useEffect, useMemo, useState } from 'react'
import { deleteTask, getTasks } from '../../services/api.js'

export default function TaskList({ token, reloadTick }) {
  const [loading, setLoading] = useState(true)
  const [tasks, setTasks] = useState([])
  const [error, setError] = useState(null)
  const [localTick, setLocalTick] = useState(0)

  const tick = useMemo(() => `${reloadTick}-${localTick}`, [reloadTick, localTick])

  useEffect(() => {
    let alive = true
    const run = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getTasks(token)
        if (alive) setTasks(Array.isArray(data) ? data : [])
      } catch (err) {
        if (alive)
          setError(err?.response?.data?.message || 'Failed to load tasks')
      }

      if (alive) setLoading(false)
    }

    run()
    return () => {
      alive = false
    }
  }, [token, tick])

  const onDelete = async (taskId) => {
    setError(null)
    try {
      await deleteTask(taskId, token)
      setLocalTick((n) => n + 1)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to delete task')
    }
  }

  return (
    <section className="card">
      <div className="sectionHeaderRow">
        <h2 className="sectionTitle">Saved Tasks</h2>
      </div>

      {loading ? <div className="mutedText">Loading...</div> : null}
      {error ? <div className="errorText">{error}</div> : null}

      {!loading && !error ? (
        <div className="tableWrap">
          <table className="table">
            <thead>
              <tr>
                <th className="colId">ID</th>
                <th>Task Name</th>
                <th className="colNum">Hours</th>
                <th className="colNum">Due</th>
                <th className="colStatus">Status</th>
                <th className="colDelete">Delete</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="mutedText">
                    No tasks saved yet.
                  </td>
                </tr>
              ) : (
                tasks.map((t) => (
                  <tr key={t.id}>
                    <td className="colId">{t.id}</td>
                    <td>{t.title}</td>
                    <td className="colNum">{t.predicted_hours}</td>
                    <td className="colNum">{t.days_until_due}d</td>
                    <td className="colStatus">
                      <span className="statusPill">Pending</span>
                    </td>
                    <td className="colDelete">
                      <button
                        className="deleteButton"
                        type="button"
                        onClick={() => onDelete(t.id)}
                        aria-label={`Delete task ${t.title}`}
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  )
}

