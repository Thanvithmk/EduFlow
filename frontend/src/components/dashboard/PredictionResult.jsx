export default function PredictionResult({ prediction, busy, onAddTask }) {
  const estimatedHours = prediction?.estimated_hours
  const confidence = prediction?.confidence

  return (
    <div>
      <h2 className="sectionTitle">Time Estimate Result</h2>

      <div className="resultBox">
        {estimatedHours == null ? (
          <div className="resultPlaceholder">
            Submit a task to get an estimate.
          </div>
        ) : (
          <div className="resultContent">
            <div className="resultRow">
              <span className="resultLabel">Estimated Hours</span>
              <span className="resultValue">{estimatedHours} hours</span>
            </div>
            <div className="resultRow">
              <span className="resultLabel">Confidence</span>
              <span className="resultValue">{confidence}</span>
            </div>
          </div>
        )}
      </div>

      <button
        className="button buttonWide"
        type="button"
        disabled={busy || estimatedHours == null || !onAddTask}
        onClick={onAddTask}
      >
        {busy ? 'Saving...' : 'Confirm & Save Task'}
      </button>

      {estimatedHours != null ? (
        <div className="hintText">
          Based on your inputs, this should take about {estimatedHours} hours.
        </div>
      ) : null}
    </div>
  )
}

