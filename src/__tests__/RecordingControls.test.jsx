import { describe, it, expect, vi, afterEach } from "vitest"
import { render, screen, fireEvent, cleanup } from "@testing-library/react"
import "../setupTests"
import RecordingControls from "../components/interview/RecordingControls"

describe("RecordingControls Component", () => {
  afterEach(() => {
    cleanup()
  })

  it("renders idle state with Click to Speak button by default", () => {
    const handleToggle = vi.fn()
    render(<RecordingControls state="idle" onToggle={handleToggle} isSupported={true} />)

    expect(screen.getByLabelText(/start voice recording/i)).toBeInTheDocument()
    expect(screen.getByText(/click to speak/i)).toBeInTheDocument()
  })

  it("renders recording state with Stop Recording button", () => {
    const handleToggle = vi.fn()
    render(<RecordingControls state="recording" onToggle={handleToggle} isSupported={true} />)

    expect(screen.getByLabelText(/stop voice recording/i)).toBeInTheDocument()
    expect(screen.getByText(/stop recording \(listening\.\.\.\)/i)).toBeInTheDocument()
  })

  it("fires onToggle when user clicks the microphone button", () => {
    const handleToggle = vi.fn()
    render(<RecordingControls state="idle" onToggle={handleToggle} isSupported={true} />)

    fireEvent.click(screen.getByLabelText(/start voice recording/i))
    expect(handleToggle).toHaveBeenCalledTimes(1)
  })

  it("fires onToggle when user clicks the text button", () => {
    const handleToggle = vi.fn()
    render(<RecordingControls state="idle" onToggle={handleToggle} isSupported={true} />)

    fireEvent.click(screen.getByText(/click to speak/i))
    expect(handleToggle).toHaveBeenCalledTimes(1)
  })

  it("handles unsupported browser speech gracefully", () => {
    const handleToggle = vi.fn()
    render(<RecordingControls state="idle" onToggle={handleToggle} isSupported={false} />)

    const micBtn = screen.getByLabelText(/start voice recording/i)
    const textBtn = screen.getByText(/speech not supported in browser/i)

    expect(micBtn).toBeDisabled()
    expect(textBtn).toBeDisabled()

    fireEvent.click(micBtn)
    expect(handleToggle).not.toHaveBeenCalled()
  })
})
