import { useState, useRef, useEffect } from "react"
import { Mic, Square, Play, Pause, Trash2, Send, Loader2, RefreshCw, AlertCircle } from "lucide-react"
import Button from "../common/Button"

export default function RecordingControls({
  onTranscriptionSuccess,
  sessionId,
  questionId,
  disabled = false,
  apiTranscribeFn,
}) {
  const [permissionState, setPermissionState] = useState("prompt") // 'prompt', 'granted', 'denied', 'unsupported'
  const [recordingState, setRecordingState] = useState("idle") // 'idle', 'recording', 'stopped'
  const [duration, setDuration] = useState(0)
  const [audioBlob, setAudioBlob] = useState(null)
  const [audioUrl, setAudioUrl] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const mediaRecorderRef = useRef(null)
  const streamRef = useRef(null)
  const timerRef = useRef(null)
  const audioChunksRef = useRef([])
  const audioElementRef = useRef(null)

  // Check MediaRecorder browser support
  useEffect(() => {
    if (typeof window === "undefined" || !navigator?.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setPermissionState("unsupported")
      setErrorMessage("Microphone recording is not supported in this browser.")
    }
  }, [])

  // Clean up audio blob URL and media stream on unmount
  useEffect(() => {
    return () => {
      cleanupStream()
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [audioUrl])

  const cleanupStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getSupportedMimeType = () => {
    if (typeof MediaRecorder === "undefined") return ""
    const types = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/ogg;codecs=opus",
      "audio/ogg",
      "audio/mp4",
      "audio/wav",
    ]
    for (const type of types) {
      if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(type)) {
        return type
      }
    }
    return ""
  }

  const startRecording = async () => {
    setErrorMessage("")
    discardRecording()

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })
      streamRef.current = stream
      setPermissionState("granted")

      const mimeType = getSupportedMimeType()
      const options = mimeType ? { mimeType } : {}
      const recorder = new MediaRecorder(stream, options)
      mediaRecorderRef.current = recorder
      audioChunksRef.current = []

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data)
        }
      }

      recorder.onstop = () => {
        cleanupStream()
        if (audioChunksRef.current.length === 0) {
          setErrorMessage("No audio recorded. Please try again.")
          setRecordingState("idle")
          return
        }

        const effectiveMime = recorder.mimeType || "audio/webm"
        const blob = new Blob(audioChunksRef.current, { type: effectiveMime })
        setAudioBlob(blob)
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        setRecordingState("stopped")
      }

      recorder.onerror = (e) => {
        console.error("MediaRecorder error:", e)
        setErrorMessage("An error occurred during audio recording.")
        stopRecording()
      }

      recorder.start(250) // collect chunks every 250ms
      setRecordingState("recording")
      setDuration(0)

      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1)
      }, 1000)
    } catch (err) {
      console.error("Microphone access error:", err)
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setPermissionState("denied")
        setErrorMessage("Microphone access was denied. Please allow microphone permissions in your browser settings.")
      } else {
        setErrorMessage("Unable to access microphone: " + (err.message || "Unknown error"))
      }
      setRecordingState("idle")
    }
  }

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try {
        mediaRecorderRef.current.stop()
      } catch (err) {
        console.error("Failed to stop recorder cleanly:", err)
      }
    }
  }

  const discardRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    stopRecording()
    cleanupStream()

    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
      setAudioUrl(null)
    }
    setAudioBlob(null)
    setDuration(0)
    setIsPlaying(false)
    setRecordingState("idle")
  }

  const togglePlayback = () => {
    if (!audioElementRef.current && audioUrl) {
      const audio = new Audio(audioUrl)
      audioElementRef.current = audio

      audio.onended = () => setIsPlaying(false)
      audio.onpause = () => setIsPlaying(false)
      audio.onerror = () => {
        setIsPlaying(false)
        setErrorMessage("Failed to play recorded preview.")
      }
    }

    if (!audioElementRef.current) return

    if (isPlaying) {
      audioElementRef.current.pause()
      setIsPlaying(false)
    } else {
      audioElementRef.current.play()
      setIsPlaying(true)
    }
  }

  const submitForTranscription = async () => {
    if (!audioBlob || isTranscribing) return
    if (audioBlob.size === 0) {
      setErrorMessage("Cannot submit an empty recording.")
      return
    }

    setIsTranscribing(true)
    setErrorMessage("")

    try {
      const formData = new FormData()
      const ext = audioBlob.type.includes("wav") ? "wav" : audioBlob.type.includes("mp4") ? "mp4" : "webm"
      formData.append("audio", audioBlob, `recording.${ext}`)
      formData.append("sessionId", sessionId)
      if (questionId) {
        formData.append("questionId", questionId)
      }

      const response = await apiTranscribeFn(formData)
      if (onTranscriptionSuccess) {
        onTranscriptionSuccess(response)
      }
      // Reset recording after successful transcription
      discardRecording()
    } catch (err) {
      console.error("Transcription submission failed:", err)
      const errorMsg = err.message || err.data?.message || "Failed to transcribe audio. Please retry."
      setErrorMessage(errorMsg)
    } finally {
      setIsTranscribing(false)
    }
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-line bg-white p-5 shadow-sm">
      {/* Unsupported or Denied Alert */}
      {permissionState === "unsupported" && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-800">
          <AlertCircle className="size-4 shrink-0" />
          <span>Speech recording is not supported in this browser. You can still type your answer.</span>
        </div>
      )}

      {permissionState === "denied" && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700">
          <AlertCircle className="size-4 shrink-0" />
          <span>Microphone access was denied. Please update your browser permissions.</span>
        </div>
      )}

      {/* Main Controls Section */}
      <div className="flex flex-col items-center gap-4">
        {recordingState === "idle" && (
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={startRecording}
              disabled={disabled || permissionState === "unsupported" || isTranscribing}
              aria-label="Start recording"
              className="group relative grid size-16 place-items-center rounded-full bg-primary text-white shadow-md transition hover:scale-105 hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <Mic className="size-7" />
            </button>
            <span className="text-xs font-medium text-muted">Click to record spoken answer</span>
          </div>
        )}

        {recordingState === "recording" && (
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-3">
              <span className="relative flex size-3">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex size-3 rounded-full bg-red-600" />
              </span>
              <span className="font-mono text-sm font-semibold text-red-600">
                Recording: {formatTime(duration)}
              </span>
            </div>

            <button
              type="button"
              onClick={stopRecording}
              aria-label="Stop recording"
              className="grid size-14 place-items-center rounded-full bg-red-600 text-white shadow-md ring-4 ring-red-100 transition hover:bg-red-700"
            >
              <Square className="size-5 fill-current" />
            </button>
            <span className="text-xs text-muted">Click square to stop</span>
          </div>
        )}

        {recordingState === "stopped" && audioUrl && (
          <div className="w-full flex flex-col gap-3">
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={togglePlayback}
                  disabled={isTranscribing}
                  aria-label={isPlaying ? "Pause audio preview" : "Play audio preview"}
                  className="grid size-9 place-items-center rounded-lg bg-primary text-white transition hover:bg-primary-dark disabled:opacity-50"
                >
                  {isPlaying ? <Pause className="size-4 fill-current" /> : <Play className="size-4 fill-current" />}
                </button>
                <div className="text-xs">
                  <p className="font-medium text-ink">Recorded Audio</p>
                  <p className="text-muted">{formatTime(duration)}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={discardRecording}
                disabled={isTranscribing}
                aria-label="Discard recording"
                className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                title="Discard recording"
              >
                <Trash2 className="size-4" />
              </button>
            </div>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={discardRecording}
                disabled={isTranscribing}
                className="flex-1 text-xs"
              >
                Discard
              </Button>
              <Button
                onClick={submitForTranscription}
                disabled={isTranscribing || disabled}
                loading={isTranscribing}
                icon={isTranscribing ? Loader2 : Send}
                className="flex-1 text-xs"
              >
                {isTranscribing ? "Transcribing (Scribe)..." : "Transcribe Answer"}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Error & Retry */}
      {errorMessage && (
        <div className="mt-3 flex items-start justify-between gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700">
          <div className="flex items-start gap-2">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
          {recordingState === "stopped" && (
            <button
              type="button"
              onClick={submitForTranscription}
              disabled={isTranscribing}
              aria-label="Retry transcription"
              className="inline-flex items-center gap-1 font-semibold text-red-800 hover:underline shrink-0"
            >
              <RefreshCw className="size-3" />
              Retry
            </button>
          )}
        </div>
      )}

      {/* Subtext info */}
      <p className="mt-4 text-center text-[11px] text-muted leading-tight">
        Powered by ElevenLabs Scribe STT. Audio is transcribed securely via backend and processed for evaluation.
      </p>
    </div>
  )
}
