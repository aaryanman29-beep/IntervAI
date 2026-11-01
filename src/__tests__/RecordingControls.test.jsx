import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react"
import "../setupTests"
import RecordingControls from "../components/interview/RecordingControls"

describe("RecordingControls Component", () => {
  let mockMediaRecorder
  let mockStream

  beforeEach(() => {
    cleanup()
    vi.clearAllMocks()

    mockStream = {
      getTracks: vi.fn().mockReturnValue([
        { stop: vi.fn() },
      ]),
    }

    mockMediaRecorder = {
      start: vi.fn(),
      stop: vi.fn(function () {
        this.state = "inactive"
        if (this.onstop) this.onstop()
      }),
      ondataavailable: null,
      onstop: null,
      state: "inactive",
      mimeType: "audio/webm",
    }

    global.navigator.mediaDevices = {
      getUserMedia: vi.fn().mockImplementation(() => Promise.resolve(mockStream)),
    }

    class MockMediaRecorderClass {
      constructor() {
        this.state = "recording"
        this.mimeType = "audio/webm"
        mockMediaRecorder.state = "recording"
        return mockMediaRecorder
      }
    }
    MockMediaRecorderClass.isTypeSupported = vi.fn().mockReturnValue(true)
    global.MediaRecorder = MockMediaRecorderClass

    global.URL.createObjectURL = vi.fn().mockReturnValue("blob:mock-audio-url")
    global.URL.revokeObjectURL = vi.fn()
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it("renders Start Recording button by default", () => {
    render(
      <RecordingControls
        sessionId="session-123"
        questionId="q-456"
        apiTranscribeFn={vi.fn()}
      />
    )

    expect(screen.getByLabelText(/start recording/i)).toBeInTheDocument()
    expect(screen.getByText(/click to record spoken answer/i)).toBeInTheDocument()
  })

  it("handles microphone permission denied", async () => {
    global.navigator.mediaDevices.getUserMedia = vi.fn().mockRejectedValue({
      name: "NotAllowedError",
      message: "Permission denied",
    })

    render(
      <RecordingControls
        sessionId="session-123"
        questionId="q-456"
        apiTranscribeFn={vi.fn()}
      />
    )

    const startBtn = screen.getByLabelText(/start recording/i)
    fireEvent.click(startBtn)

    await waitFor(() => {
      expect(screen.getAllByText(/microphone access was denied/i).length).toBeGreaterThan(0)
    })
  })

  it("starts and stops recording, displaying duration and preview controls", async () => {
    render(
      <RecordingControls
        sessionId="session-123"
        questionId="q-456"
        apiTranscribeFn={vi.fn()}
      />
    )

    const startBtn = screen.getByLabelText(/start recording/i)
    fireEvent.click(startBtn)

    await waitFor(() => {
      expect(screen.getByLabelText(/stop recording/i)).toBeInTheDocument()
      expect(screen.getByText(/recording:/i)).toBeInTheDocument()
    })

    // Simulate chunk emission and stopping
    mockMediaRecorder.ondataavailable({ data: new Blob(["audio-data"], { type: "audio/webm" }) })
    const stopBtn = screen.getByLabelText(/stop recording/i)
    fireEvent.click(stopBtn)

    await waitFor(() => {
      expect(screen.getByText(/recorded audio/i)).toBeInTheDocument()
      expect(screen.getByRole("button", { name: /transcribe answer/i })).toBeInTheDocument()
      expect(screen.getByTitle(/discard recording/i)).toBeInTheDocument()
    })
  })

  it("discards recording and returns to idle state", async () => {
    render(
      <RecordingControls
        sessionId="session-123"
        questionId="q-456"
        apiTranscribeFn={vi.fn()}
      />
    )

    fireEvent.click(screen.getByLabelText(/start recording/i))

    await waitFor(() => {
      expect(screen.getByLabelText(/stop recording/i)).toBeInTheDocument()
    })

    mockMediaRecorder.ondataavailable({ data: new Blob(["audio-data"], { type: "audio/webm" }) })
    fireEvent.click(screen.getByLabelText(/stop recording/i))

    await waitFor(() => {
      expect(screen.getByTitle(/discard recording/i)).toBeInTheDocument()
    })

    fireEvent.click(screen.getByTitle(/discard recording/i))

    await waitFor(() => {
      expect(screen.getByLabelText(/start recording/i)).toBeInTheDocument()
    })
    expect(global.URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock-audio-url")
  })

  it("submits recording to transcription endpoint and triggers callback", async () => {
    const mockTranscribeFn = vi.fn().mockResolvedValue({
      transcript: "I have 5 years of React experience.",
      answerId: "ans-1",
      evaluated: true,
    })
    const onSuccess = vi.fn()

    render(
      <RecordingControls
        sessionId="session-123"
        questionId="q-456"
        apiTranscribeFn={mockTranscribeFn}
        onTranscriptionSuccess={onSuccess}
      />
    )

    fireEvent.click(screen.getByLabelText(/start recording/i))
    await waitFor(() => screen.getByLabelText(/stop recording/i))

    mockMediaRecorder.ondataavailable({ data: new Blob(["test-audio"], { type: "audio/webm" }) })
    fireEvent.click(screen.getByLabelText(/stop recording/i))

    await waitFor(() => screen.getByRole("button", { name: /transcribe answer/i }))

    fireEvent.click(screen.getByRole("button", { name: /transcribe answer/i }))

    await waitFor(() => {
      expect(mockTranscribeFn).toHaveBeenCalledTimes(1)
      expect(onSuccess).toHaveBeenCalledWith(expect.objectContaining({
        transcript: "I have 5 years of React experience.",
      }))
    })
  })

  it("displays error and allows retry when transcription fails", async () => {
    const mockTranscribeFn = vi.fn()
      .mockRejectedValueOnce(new Error("Transcription service unavailable"))
      .mockResolvedValueOnce({ transcript: "Recovered transcript" })

    render(
      <RecordingControls
        sessionId="session-123"
        questionId="q-456"
        apiTranscribeFn={mockTranscribeFn}
        onTranscriptionSuccess={vi.fn()}
      />
    )

    fireEvent.click(screen.getByLabelText(/start recording/i))
    await waitFor(() => screen.getByLabelText(/stop recording/i))

    mockMediaRecorder.ondataavailable({ data: new Blob(["test-audio"], { type: "audio/webm" }) })
    fireEvent.click(screen.getByLabelText(/stop recording/i))

    await waitFor(() => screen.getByRole("button", { name: /transcribe answer/i }))
    fireEvent.click(screen.getByRole("button", { name: /transcribe answer/i }))

    await waitFor(() => {
      expect(screen.getByText(/transcription service unavailable/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/retry transcription/i)).toBeInTheDocument()
    })

    // Retry
    fireEvent.click(screen.getByLabelText(/retry transcription/i))
    await waitFor(() => {
      expect(mockTranscribeFn).toHaveBeenCalledTimes(2)
    })
  })

  it("cleans up media stream tracks on unmount", async () => {
    const { unmount } = render(
      <RecordingControls
        sessionId="session-123"
        questionId="q-456"
        apiTranscribeFn={vi.fn()}
      />
    )

    fireEvent.click(screen.getByLabelText(/start recording/i))
    await waitFor(() => screen.getByLabelText(/stop recording/i))

    unmount()
    expect(mockStream.getTracks()[0].stop).toHaveBeenCalled()
  })
})
