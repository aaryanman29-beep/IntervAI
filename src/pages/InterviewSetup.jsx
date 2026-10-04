import {
  ArrowRight,
  BrainCircuit,
  Clock3,
  Gauge,
  Layers3,
  Target,
} from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router"
import Badge from "../components/common/Badge"
import Button from "../components/common/Button"
import Card from "../components/common/Card"
import SetupSelector from "../components/interview/InterviewSetup"
import PageContainer from "../components/layout/PageContainer"
import { difficulties, interviewTypes, roles } from "../utils/constants"
import { startInterview } from "../services/api"
export default function InterviewSetup() {
  const navigate = useNavigate()
  const [config, setConfig] = useState({
    role: "Software Engineer",
    type: "Technical",
    difficulty: "Medium",
    duration: "20 minutes",
  })
  const set = (key) => (value) => setConfig({ ...config, [key]: value })
  const start = async () => {
    await startInterview(config)
    navigate("/interview/mock")
  }
  return (
    <PageContainer
      title="Choose Your Interview"
      description="Personalize your practice session to match your next opportunity."
    >
      <div className="grid items-start gap-6 xl:grid-cols-[1.45fr_.55fr]">
        <Card className="space-y-8">
          <SetupSelector
            title="1. Select your target role"
            options={roles}
            value={config.role}
            onChange={set("role")}
            columns="sm:grid-cols-2 lg:grid-cols-4"
          />
          <SetupSelector
            title="2. Choose interview type"
            options={interviewTypes}
            value={config.type}
            onChange={set("type")}
          />
          <SetupSelector
            title="3. Set difficulty"
            options={difficulties}
            value={config.difficulty}
            onChange={set("difficulty")}
          />
          <SetupSelector
            title="4. Select duration"
            options={["10 minutes", "20 minutes", "30 minutes", "45 minutes"]}
            value={config.duration}
            onChange={set("duration")}
          />
        </Card>
        <Card className="sticky top-24">
          <span className="grid size-12 place-items-center rounded-2xl bg-primary text-white">
            <BrainCircuit />
          </span>
          <h2 className="mt-5 font-display text-xl font-bold">
            Interview summary
          </h2>
          <div className="mt-5 space-y-4">
            {[
              [Target, "Role", config.role],
              [Layers3, "Type", config.type],
              [Gauge, "Difficulty", config.difficulty],
              [Clock3, "Duration", config.duration],
            ].map(([Icon, label, value]) => (
              <div key={label} className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-lg bg-slate-50 text-muted">
                  <Icon className="size-4" />
                </span>
                <div>
                  <p className="text-xs text-muted">{label}</p>
                  <p className="text-sm font-semibold">{value}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-xl bg-primary-soft p-4 text-sm text-primary">
            <Badge>AI powered</Badge>
            <p className="mt-2 leading-6">
              Questions adapt to your selected role and difficulty.
            </p>
          </div>
          <Button onClick={start} icon={ArrowRight} className="mt-6 w-full">
            Start Interview
          </Button>
        </Card>
      </div>
    </PageContainer>
  )
}
