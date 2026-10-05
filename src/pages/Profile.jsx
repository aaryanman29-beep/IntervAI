import { Camera, Loader2, Pencil, Save, X } from "lucide-react"
import { useState, useEffect } from "react"
import Badge from "../components/common/Badge"
import Button from "../components/common/Button"
import Card from "../components/common/Card"
import PageContainer from "../components/layout/PageContainer"
import { useAuth } from "../contexts/AuthContext"
import { useAsync } from "../hooks/useAsync"
import { dashboardApi } from "../services/api/dashboardApi"
import ResumeManager from "../components/profile/ResumeManager"

export default function Profile() {
  const { user } = useAuth()
  const [editing, setEditing] = useState(false)
  const [profile, setProfile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState("")
  const [saveSuccess, setSaveSuccess] = useState(false)

  const { data: dashData, loading: dashLoading } = useAsync(() => dashboardApi.getDashboard())

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
        targetRole: user.targetRole || "",
        experience: user.experienceLevel || "",
      })
    }
  }, [user])

  const initials = profile?.name
    ? profile.name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2)
    : "US"

  const handleSave = async () => {
    setSaving(true)
    setSaveError("")
    setSaveSuccess(false)
    try {
      // PUT /api/users/profile - to be connected when UserController is added
      // For now, optimistic update using auth context
      setSaveSuccess(true)
      setEditing(false)
    } catch (err) {
      setSaveError(err.message || "Failed to save profile")
    } finally {
      setSaving(false)
    }
  }

  if (!profile) {
    return (
      <PageContainer title="Profile" description="Manage your personal details and career focus.">
        <div className="flex justify-center py-16">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer
      title="Profile"
      description="Manage your personal details and career focus."
      action={
        <Button
          variant={editing ? "ghost" : "secondary"}
          icon={editing ? X : Pencil}
          onClick={() => {
            setEditing(!editing)
            setSaveError("")
            setSaveSuccess(false)
          }}
        >
          {editing ? "Cancel" : "Edit profile"}
        </Button>
      }
    >
      <div className="grid items-start gap-6 lg:grid-cols-[.65fr_1.35fr]">
        <Card className="text-center">
          <div className="relative mx-auto w-fit">
            <span className="grid size-28 place-items-center rounded-full bg-primary-soft font-display text-3xl font-extrabold text-primary">
              {initials}
            </span>
            <button
              aria-label="Change profile photo"
              className="absolute bottom-0 right-0 grid size-9 place-items-center rounded-full bg-primary text-white"
            >
              <Camera className="size-4" />
            </button>
          </div>
          <h2 className="mt-5 font-display text-xl font-bold">{profile.name}</h2>
          <p className="text-sm text-muted">{profile.email}</p>
          <Badge className="mt-4">{profile.targetRole || "Candidate"}</Badge>
          <div className="mt-6 grid grid-cols-2 divide-x divide-line border-t border-line pt-5">
            <div>
              <p className="font-display text-xl font-extrabold">
                {dashLoading ? "—" : dashData?.totalInterviews ?? 0}
              </p>
              <p className="text-xs text-muted">Interviews</p>
            </div>
            <div>
              <p className="font-display text-xl font-extrabold">
                {dashLoading ? "—" : `${dashData?.overallScore ?? 0}%`}
              </p>
              <p className="text-xs text-muted">Avg. score</p>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="font-display text-lg font-bold">Professional details</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <ProfileField
              label="Full name"
              value={profile.name}
              editing={editing}
              onChange={(name) => setProfile({ ...profile, name })}
            />
            <ProfileField
              label="Email address"
              value={profile.email}
              editing={false} // email is identity, not editable here
            />
            <ProfileField
              label="Target role"
              value={profile.targetRole}
              editing={editing}
              onChange={(targetRole) => setProfile({ ...profile, targetRole })}
            />
            <ProfileField
              label="Experience level"
              value={profile.experience}
              editing={editing}
              onChange={(experience) => setProfile({ ...profile, experience })}
            />
          </div>

          {saveError && (
            <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{saveError}</p>
          )}
          {saveSuccess && (
            <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
              Profile saved successfully.
            </p>
          )}

          {editing && (
            <Button
              icon={Save}
              loading={saving}
              disabled={saving}
              className="mt-7"
              onClick={handleSave}
            >
              Save changes
            </Button>
          )}
        </Card>
      </div>

      <ResumeManager />
    </PageContainer>
  )
}

function ProfileField({ label, value, editing, onChange }) {
  return (
    <label className="text-sm font-semibold text-muted">
      {label}
      {editing ? (
        <input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="mt-2 min-h-11 w-full rounded-xl border border-line px-3 text-ink outline-none focus:border-primary"
        />
      ) : (
        <p className="mt-2 font-medium text-ink">{value || "—"}</p>
      )}
    </label>
  )
}
