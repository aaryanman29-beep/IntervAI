import { ArrowLeft } from "lucide-react"
import Button from "../components/common/Button"
export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-canvas p-5 text-center">
      <div>
        <img
          src={new URL("../assets/intervai-mark.png", import.meta.url).href}
          alt=""
          className="mx-auto size-16 rounded-2xl object-cover"
        />
        <p className="mt-7 font-display text-7xl font-extrabold text-primary">
          404
        </p>
        <h1 className="mt-3 font-display text-2xl font-bold">
          This page missed the interview
        </h1>
        <p className="mx-auto mt-3 max-w-md text-muted">
          The page you’re looking for doesn’t exist or has moved somewhere new.
        </p>
        <Button to="/dashboard" icon={ArrowLeft} className="mt-7">
          Back to dashboard
        </Button>
      </div>
    </main>
  )
}
