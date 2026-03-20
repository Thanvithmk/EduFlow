import { useEffect, useMemo, useState } from 'react'
import {
  addFixedCommitment,
  deleteFixedCommitment,
  getFixedCommitments,
} from '../../services/api.js'

export default function FixedCommitments({ token, reloadTick }) {
  const [title, setTitle] = useState('')
  const [start_time, setStartTime] = useState('09:00')
  const [end_time, setEndTime] = useState('17:00')
  const [type, setType] = useState('academic')

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [localTick, setLocalTick] = useState(0)

  const tick = useMemo(() => `${reloadTick}-${localTick}`, [reloadTick, localTick])

  useEffect(() => {
    let alive = true
    const run = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getFixedCommitments(token)
        if (alive) setItems(Array.isArray(data) ? data : [])
      } catch (err) {
        if (alive)
          setError(err?.response?.data?.message || 'Failed to load commitments')
      }

      if (alive) setLoading(false)
    }

    run()
    return () => {
      alive = false
    }
  }, [token, tick])

  const onAdd = async (e) => {
    e.preventDefault()
    setError(null)
    setSaving(true)

    try {
      const payload = { title, start_time, end_time, type }
      await addFixedCommitment(payload, token)
      setTitle('')
      setLocalTick((n) => n + 1)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to add commitment')
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async (fixedCommitmentId) => {
    setError(null)
    try {
      await deleteFixedCommitment(fixedCommitmentId, token)
      setLocalTick((n) => n + 1)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to delete commitment')
    }
  }

  return (
    <section className="card" id="fixed-commitments">
      <div className="sectionHeaderRow">
        <h2 className="sectionTitle">Fixed Daily Commitments</h2>
      </div>

      <form className="subForm" onSubmit={onAdd}>
        <div className="twoCol">
          <label className="label">
            Title
            <input
              className="input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="College Classes"
              required
            />
          </label>
          <label className="label">
            Type
            <select
              className="select"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="academic">academic</option>
              <option value="study">study</option>
              <option value="break">break</option>
            </select>
          </label>
        </div>

        <div className="twoCol">
          <label className="label">
            Start Time (HH:MM)
            <input
              className="input"
              type="time"
              value={start_time}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </label>
          <label className="label">
            End Time (HH:MM)
            <input
              className="input"
              type="time"
              value={end_time}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </label>
        </div>

        <button className="button buttonWide" type="submit" disabled={saving}>
          {saving ? 'Adding...' : 'Add Commitment'}
        </button>
      </form>

      {error ? <div className="errorText">{error}</div> : null}

      <div className="listHeaderRow">
        <h3 className="listTitle">Existing Commitments</h3>
      </div>

      {loading ? <div className="mutedText">Loading...</div> : null}
      {!loading && !error ? (
        <div className="tableWrap">
          <table className="table">
            <thead>
              <tr>
                <th>Start</th>
                <th>End</th>
                <th>Title</th>
                <th>Type</th>
                <th className="colDelete">Delete</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="mutedText">
                    No fixed commitments yet.
                  </td>
                </tr>
              ) : (
                items.map((c) => (
                  <tr key={c.id}>
                    <td>{c.start_time}</td>
                    <td>{c.end_time}</td>
                    <td>{c.title}</td>
                    <td>{c.type}</td>
                    <td className="colDelete">
                      <button
                        className="deleteButton deleteButtonDanger"
                        type="button"
                        onClick={() => onDelete(c.id)}
                        aria-label={`Delete commitment ${c.title}`}
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

