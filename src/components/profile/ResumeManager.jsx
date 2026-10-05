import { FileText, Loader2, Upload, AlertCircle, Sparkles, Check, CheckCircle2 } from "lucide-react"
import { useState } from "react"
import Button from "../common/Button"
import Card from "../common/Card"
import Badge from "../common/Badge"
import { resumeApi } from "../../services/api/resumeApi"
import { useAsync } from "../../hooks/useAsync"

export default function ResumeManager() {
  const { data: resumes, loading, error, refetch } = useAsync(() => resumeApi.getAll())
  const [uploading, setUploading] = useState(false)
  const [analyzingId, setAnalyzingId] = useState(null)
  const [activeAnalysis, setActiveAnalysis] = useState(null)
  const [uploadError, setUploadError] = useState("")

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setUploadError("")
    try {
      await resumeApi.upload(file)
      await refetch()
    } catch (err) {
      setUploadError(err.message || "Failed to upload resume")
    } finally {
      setUploading(false)
    }
  }

  const analyzeResume = async (id) => {
    setAnalyzingId(id)
    try {
      const result = await resumeApi.analyze(id)
      setActiveAnalysis(result)
    } catch (err) {
      alert(err.message || "Failed to analyze resume")
    } finally {
      setAnalyzingId(null)
    }
  }

  return (
    <Card className="mt-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-bold">Resume Management</h2>
          <p className="mt-1 text-sm text-muted">
            Upload your resumes to enable AI-powered skill extraction and tailored interviews.
          </p>
        </div>
        <label className="cursor-pointer">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
          <div className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary-hover ${uploading ? "opacity-70" : ""}`}>
            {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
            {uploading ? "Uploading..." : "Upload Resume"}
          </div>
        </label>
      </div>

      {uploadError && (
        <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
          {uploadError}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : resumes?.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-line bg-slate-50 py-10 text-center">
          <FileText className="mb-2 size-8 text-slate-300" />
          <p className="text-sm font-semibold">No resumes uploaded</p>
          <p className="mt-1 max-w-sm text-xs text-muted">
            Upload a PDF or Word document to get AI feedback on your skills.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {resumes?.map((resume) => (
            <div
              key={resume.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line p-4 transition hover:bg-slate-50"
            >
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-lg bg-primary-soft text-primary">
                  <FileText className="size-5" />
                </div>
                <div>
                  <p className="font-semibold">{resume.originalFilename}</p>
                  <p className="text-xs text-muted">
                    Uploaded {new Date(resume.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button
                variant="secondary"
                icon={Sparkles}
                onClick={() => analyzeResume(resume.id)}
                loading={analyzingId === resume.id}
                disabled={analyzingId === resume.id}
              >
                Analyze ATS Fit
              </Button>
            </div>
          ))}
        </div>
      )}

      {activeAnalysis && (
        <div className="mt-6 rounded-2xl bg-slate-50 p-5 border border-line">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold flex items-center gap-2 text-primary">
              <Sparkles className="size-5" /> ATS Analysis Results
            </h3>
            <button
              onClick={() => setActiveAnalysis(null)}
              className="text-sm font-semibold text-muted hover:text-ink"
            >
              Close
            </button>
          </div>
          
          <div className="mt-5 grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase text-muted mb-3">Extracted Skills</p>
              <div className="flex flex-wrap gap-2">
                {activeAnalysis.skillsExtracted?.split(",").map(s => s.trim()).filter(Boolean).map(skill => (
                  <Badge key={skill}>{skill}</Badge>
                ))}
              </div>
            </div>
            
            <div>
              <p className="text-xs font-bold uppercase text-muted mb-3">Missing Keywords</p>
              <div className="flex flex-wrap gap-2">
                {activeAnalysis.missingKeywords?.split(",").map(s => s.trim()).filter(Boolean).map(skill => (
                  <span key={skill} className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <p className="text-xs font-bold uppercase text-muted mb-3">Overall Feedback</p>
            <p className="text-sm leading-6 text-ink whitespace-pre-wrap">
              {activeAnalysis.overallFeedback}
            </p>
          </div>
        </div>
      )}
    </Card>
  )
}
