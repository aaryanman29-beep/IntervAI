import { Component } from "react"
import { AlertCircle } from "lucide-react"
import Button from "./Button"

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-64 flex-col items-center justify-center p-8 text-center">
          <div className="grid size-16 place-items-center rounded-full bg-red-50">
            <AlertCircle className="size-8 text-red-400" />
          </div>
          <h2 className="mt-4 font-display text-lg font-bold">Something went wrong</h2>
          <p className="mt-2 max-w-sm text-sm text-muted">
            This section encountered an error. Try refreshing or go back to the dashboard.
          </p>
          <div className="mt-6 flex gap-3">
            <Button
              variant="secondary"
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              Try again
            </Button>
            <Button to="/dashboard" variant="ghost">
              Dashboard
            </Button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
