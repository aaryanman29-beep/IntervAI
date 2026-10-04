import ProgressBar from "../common/ProgressBar"
export default function InterviewProgress({ current = 4, total = 10 }) {
  return (
    <div className="flex items-center gap-4">
      <span className="shrink-0 text-sm font-semibold">
        Question {current} of {total}
      </span>
      <ProgressBar value={(current / total) * 100} showValue={false} />
    </div>
  )
}
