import { Mic, Square } from "lucide-react"
import Button from "../common/Button"
export default function RecordingControls({ state, onToggle, isSupported = true }) {
  const recording = state === "recording"
  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={onToggle}
        disabled={!isSupported}
        aria-label={recording ? "Stop voice recording" : "Start voice recording"}
        className={`relative grid size-16 place-items-center rounded-full text-white shadow-md transition-all ${
          recording
            ? "recording-ring bg-red-500 animate-pulse ring-4 ring-red-200"
            : isSupported
            ? "bg-primary hover:bg-primary-dark hover:scale-105"
            : "bg-slate-300 cursor-not-allowed"
        }`}
      >
        {recording ? (
          <Square className="size-6 fill-current" />
        ) : (
          <Mic className="size-7" />
        )}
      </button>
      <Button variant="ghost" onClick={onToggle} disabled={!isSupported}>
        {recording ? "Stop Recording (Listening...)" : isSupported ? "Click to Speak" : "Speech not supported in browser"}
      </Button>
    </div>
  )
}
