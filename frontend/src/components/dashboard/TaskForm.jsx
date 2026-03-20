import { useMemo, useState } from 'react'

const TASK_TYPE_OPTIONS = [
  'programming',
  'research',
  'presentation',
  'lab_work',
  'exam_preparation',
  'project',
]

const SUBJECT_OPTIONS = [
  'machine_learning',
  'computer_science',
  'data_science',
  'software_engineering',
  'web_development',
  'database_systems',
  'mathematics',
]

export default function TaskForm({ onGetEstimate, busy }) {
  const [title, setTitle] = useState('')
  const [task_type, setTaskType] = useState('programming')
  const [subject, setSubject] = useState('machine_learning')
  const [complexity, setComplexity] = useState(3)
  const [size_metric, setSizeMetric] = useState(2)
  const [team_size, setTeamSize] = useState(1)
  const [days_until_due, setDaysUntilDue] = useState(5)

  const [error, setError] = useState(null)

  const canSubmit = useMemo(() => {
    if (!title.trim()) return false
    if (!task_type) return false
    if (!subject) return false
    return true
  }, [title, task_type, subject])

  const onSubmit = (e) => {
    e.preventDefault()
    setError(null)

    if (!canSubmit) {
      setError('Please complete the required fields.')
      return
    }

    if (onGetEstimate) {
      onGetEstimate({
        title,
        task_type,
        subject,
        complexity,
        size_metric,
        team_size,
        days_until_due,
      })
    }
  }

  return (
    <div>
      <h2 className="sectionTitle">Add New Task</h2>
      <form className="form" onSubmit={onSubmit}>
        <label className="label">
          Title
          <input
            className="input"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="NLP Assignment"
            required
          />
        </label>

        <label className="label">
          Task Type
          <select
            className="select"
            value={task_type}
            onChange={(e) => setTaskType(e.target.value)}
          >
            {TASK_TYPE_OPTIONS.map((v) => (
              <option value={v} key={v}>
                {v.replaceAll('_', ' ')}
              </option>
            ))}
          </select>
        </label>

        <label className="label">
          Subject
          <select
            className="select"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            {SUBJECT_OPTIONS.map((v) => (
              <option value={v} key={v}>
                {v.replaceAll('_', ' ')}
              </option>
            ))}
          </select>
        </label>

        <div className="twoCol">
          <label className="label">
            Complexity (1-4)
            <select
              className="select"
              value={complexity}
              onChange={(e) => setComplexity(Number(e.target.value))}
            >
              {[1, 2, 3, 4].map((v) => (
                <option value={v} key={v}>
                  {v}
                </option>
              ))}
            </select>
          </label>

          <label className="label">
            Size Metric (1-5)
            <select
              className="select"
              value={size_metric}
              onChange={(e) => setSizeMetric(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5].map((v) => (
                <option value={v} key={v}>
                  {v}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="twoCol">
          <label className="label">
            Team Size (1-10)
            <select
              className="select"
              value={team_size}
              onChange={(e) => setTeamSize(Number(e.target.value))}
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map((v) => (
                <option value={v} key={v}>
                  {v}
                </option>
              ))}
            </select>
          </label>

          <label className="label">
            Days Until Due
            <input
              className="input"
              type="number"
              min={1}
              value={days_until_due}
              onChange={(e) => setDaysUntilDue(Number(e.target.value))}
              required
            />
          </label>
        </div>

        {error ? <div className="errorText">{error}</div> : null}

        <button className="button" type="submit" disabled={busy || !canSubmit}>
          {busy ? 'Getting estimate...' : 'Get Estimate'}
        </button>
      </form>
    </div>
  )
}

