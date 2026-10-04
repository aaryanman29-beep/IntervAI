import { Mic, Square } from "lucide-react"
import Button from "../common/Button"
export default function RecordingControls({ state, onToggle }) {
  const recording = state === "recording"
  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={onToggle}
        aria-label={recording ? "Stop recording" : "Start recording"}
        className={`relative grid size-16 place-items-center rounded-full text-white transition ${
          recording
            ? "recording-ring bg-red-500"
            : "bg-primary hover:bg-primary-dark"
        }`}
      >
        {recording ? (
          <Square className="size-6 fill-current" />
        ) : (
          <Mic className="size-7" />
        )}
      </button>
      <Button variant="ghost" onClick={onToggle}>
        {recording ? "Stop Recording" : "Start Recording"}
      </Button>
    </div>
  )
}
