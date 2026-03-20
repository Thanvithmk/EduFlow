import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../auth/useAuth.js'
import { predictTask, saveTask } from '../../services/api.js'
import FixedCommitments from './FixedCommitments.jsx'
import PredictionResult from './PredictionResult.jsx'
import TaskForm from './TaskForm.jsx'
import TaskList from './TaskList.jsx'

export default function Dashboard() {
  const { token } = useAuth()

  const [prediction, setPrediction] = useState(null)
  const [taskDraft, setTaskDraft] = useState(null)

  const [busyPredict, setBusyPredict] = useState(false)
  const [busySave, setBusySave] = useState(false)
  const [tasksReloadTick, setTasksReloadTick] = useState(0)
  const [fixedReloadTick, _setFixedReloadTick] = useState(0)

  // Ensure a consistent confidence display even though backend currently only returns hours.
  const confidence = useMemo(() => 'Medium', [])

  useEffect(() => {
    // When user refreshes mid-flow, keep the UI clean.
    setPrediction(null)
    setTaskDraft(null)
  }, [token])

  const onGetEstimate = async (values) => {
    setBusyPredict(true)
    setPrediction(null)
    setTaskDraft(null)

    try {
      const payload = {
        task_type: values.task_type,
        subject: values.subject,
        complexity: Number(values.complexity),
        size_metric: Number(values.size_metric),
        team_size: Number(values.team_size),
        days_until_due: Number(values.days_until_due),
      }

      const data = await predictTask(payload, token)
      const estimatedHours =
        data?.data?.estimated_hours ?? data?.estimated_hours ?? null

      if (estimatedHours == null) {
        throw new Error(data?.error || 'Prediction failed')
      }

      setPrediction({
        estimated_hours: estimatedHours,
        confidence,
      })

      setTaskDraft({
        title: values.title,
        task_type: values.task_type,
        subject: values.subject,
        complexity: Number(values.complexity),
        size_metric: Number(values.size_metric),
        team_size: Number(values.team_size),
        days_until_due: Number(values.days_until_due),
        predicted_hours: estimatedHours,
      })
    } finally {
      setBusyPredict(false)
    }
  }

  const onAddToTaskList = async () => {
    if (!taskDraft || !prediction) return
    setBusySave(true)

    try {
      const payload = { ...taskDraft, predicted_hours: prediction.estimated_hours }
      await saveTask(payload, token)
      setTasksReloadTick((n) => n + 1)
      setPrediction(null)
      setTaskDraft(null)
    } finally {
      setBusySave(false)
    }
  }

  return (
    <div className="dashboard">
      <section className="gridTop">
        <div className="card cardPad">
          <TaskForm onGetEstimate={onGetEstimate} busy={busyPredict} />
        </div>
        <div className="card cardPad">
          <PredictionResult
            prediction={prediction}
            busy={busySave}
            onAddTask={onAddToTaskList}
          />
        </div>
      </section>

      <section className="stackSection">
        <TaskList token={token} reloadTick={tasksReloadTick} />
        <FixedCommitments token={token} reloadTick={fixedReloadTick} />
      </section>
    </div>
  )
}

