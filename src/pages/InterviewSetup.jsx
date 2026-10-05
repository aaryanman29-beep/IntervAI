import { ArrowRight, BrainCircuit, CheckCircle, History } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router"
import Badge from "../components/common/Badge"
import Button from "../components/common/Button"
import Card from "../components/common/Card"
import SetupSelector from "../components/interview/InterviewSetup"
import PageContainer from "../components/layout/PageContainer"
import { difficulties, interviewTypes, roles } from "../utils/constants"
import { interviewApi } from "../services/api/interviewApi"
import { resumeApi } from "../services/api/resumeApi"
import { useAsync } from "../hooks/useAsync"
import { BrainCircuit as BrainIcon, Clock3, Gauge, Layers3, Target } from "lucide-react"

export default function InterviewSetup() {
  const navigate = useNavigate()
  const [config, setConfig] = useState({
    targetRole: "Software Engineer",
    interviewType: "TECHNICAL",
    experienceLevel: "MID_LEVEL",
    company: "",
    resumeId: null,
  })
  const [starting, setStarting] = useState(false)
  const [error, setError] = useState("")

  const { data: resumes, loading: resumesLoading } = useAsync(() => resumeApi.getAll())

  const set = (key) => (value) => setConfig({ ...config, [key]: value })

  const start = async () => {
    setStarting(true)
    setError("")
    try {
      const interview = await interviewApi.create(config)
      await interviewApi.start(interview.id)
      navigate(`/interview/mock?interviewId=${interview.id}`)
    } catch (err) {
      setError(err.message || "Failed to start interview")
      setStarting(false)
    }
  }

  const typeDisplayMap = {
    TECHNICAL: "Technical",
    HR: "HR",
    BEHAVIORAL: "Behavioral",
  }

  const levelDisplayMap = {
    ENTRY_LEVEL: "Entry Level",
    MID_LEVEL: "Mid Level",
    SENIOR: "Senior",
    LEAD: "Lead",
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
            value={config.targetRole}
            onChange={set("targetRole")}
            columns="sm:grid-cols-2 lg:grid-cols-4"
          />
          <SetupSelector
            title="2. Choose interview type"
            options={["TECHNICAL", "HR", "BEHAVIORAL"]}
            value={config.interviewType}
            onChange={set("interviewType")}
            displayFn={(v) => typeDisplayMap[v] || v}
          />
          <SetupSelector
            title="3. Set experience level"
            options={["ENTRY_LEVEL", "MID_LEVEL", "SENIOR", "LEAD"]}
            value={config.experienceLevel}
            onChange={set("experienceLevel")}
            displayFn={(v) => levelDisplayMap[v] || v}
          />
          <div>
            <p className="mb-3 text-sm font-semibold text-ink">
              4. Company name (optional)
            </p>
            <input
              type="text"
              placeholder="e.g. Google, Amazon..."
              value={config.company}
              onChange={(e) => setConfig({ ...config, company: e.target.value })}
              className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/10"
            />
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold text-ink">
              5. Use a resume (optional — enables AI skill matching)
            </p>
            {resumesLoading ? (
              <div className="animate-pulse h-10 w-full rounded-xl bg-slate-200" />
            ) : (
              <select
                className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none focus:border-primary"
                value={config.resumeId || ""}
                onChange={(e) => setConfig({ ...config, resumeId: e.target.value || null })}
              >
                <option value="">No resume selected</option>
                {(resumes || []).map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.originalFilename}
                  </option>
                ))}
              </select>
            )}
          </div>
        </Card>

        <Card className="sticky top-24">
          <span className="grid size-12 place-items-center rounded-2xl bg-primary text-white">
            <BrainIcon />
          </span>
          <h2 className="mt-5 font-display text-xl font-bold">Interview summary</h2>
          <div className="mt-5 space-y-4">
            {[
              [Target, "Role", config.targetRole],
              [Layers3, "Type", typeDisplayMap[config.interviewType] || config.interviewType],
              [Gauge, "Level", levelDisplayMap[config.experienceLevel] || config.experienceLevel],
              [Clock3, "Company", config.company || "Not specified"],
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
              Questions adapt to your selected role and experience level using Gemini AI.
            </p>
          </div>
          {error && (
            <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}
          <Button
            onClick={start}
            loading={starting}
            disabled={starting}
            icon={ArrowRight}
            className="mt-6 w-full"
          >
            {starting ? "Generating questions..." : "Start Interview"}
          </Button>
        </Card>
      </div>
    </PageContainer>
  )
}
