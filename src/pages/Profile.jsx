import { Camera, Pencil, Save, X } from "lucide-react"
import { useState } from "react"
import Badge from "../components/common/Badge"
import Button from "../components/common/Button"
import Card from "../components/common/Card"
import PageContainer from "../components/layout/PageContainer"
import { mockUser } from "../data/mockUser"
export default function Profile() {
  const [editing, setEditing] = useState(false)
  const [profile, setProfile] = useState(mockUser)
  return (
    <PageContainer
      title="Profile"
      description="Manage your personal details and career focus."
      action={
        <Button
          variant={editing ? "ghost" : "secondary"}
          icon={editing ? X : Pencil}
          onClick={() => setEditing(!editing)}
        >
          {editing ? "Cancel" : "Edit profile"}
        </Button>
      }
    >
      <div className="grid items-start gap-6 lg:grid-cols-[.65fr_1.35fr]">
        <Card className="text-center">
          <div className="relative mx-auto w-fit">
            <span className="grid size-28 place-items-center rounded-full bg-primary-soft font-display text-3xl font-extrabold text-primary">
              {profile.initials}
            </span>
            <button
              aria-label="Change profile photo"
              className="absolute bottom-0 right-0 grid size-9 place-items-center rounded-full bg-primary text-white"
            >
              <Camera className="size-4" />
            </button>
          </div>
          <h2 className="mt-5 font-display text-xl font-bold">
            {profile.name}
          </h2>
          <p className="text-sm text-muted">{profile.email}</p>
          <Badge className="mt-4">{profile.role}</Badge>
          <div className="mt-6 grid grid-cols-2 divide-x divide-line border-t border-line pt-5">
            <div>
              <p className="font-display text-xl font-extrabold">12</p>
              <p className="text-xs text-muted">Interviews</p>
            </div>
            <div>
              <p className="font-display text-xl font-extrabold">82%</p>
              <p className="text-xs text-muted">Avg. score</p>
            </div>
          </div>
        </Card>
        <Card>
          <h2 className="font-display text-lg font-bold">
            Professional details
          </h2>
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
              editing={editing}
              onChange={(email) => setProfile({ ...profile, email })}
            />
            <ProfileField
              label="Target role"
              value={profile.role}
              editing={editing}
              onChange={(role) => setProfile({ ...profile, role })}
            />
            <ProfileField
              label="Experience level"
              value={profile.experience}
              editing={editing}
              onChange={(experience) => setProfile({ ...profile, experience })}
            />
          </div>
          <div className="mt-6">
            <p className="text-sm font-semibold">Skills</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <Badge key={skill}>{skill}</Badge>
              ))}
            </div>
          </div>
          {editing && (
            <Button
              icon={Save}
              className="mt-7"
              onClick={() => setEditing(false)}
            >
              Save changes
            </Button>
          )}
        </Card>
      </div>
    </PageContainer>
  )
}
function ProfileField({ label, value, editing, onChange }) {
  return (
    <label className="text-sm font-semibold text-muted">
      {label}
      {editing ? (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="mt-2 min-h-11 w-full rounded-xl border border-line px-3 text-ink outline-none focus:border-primary"
        />
      ) : (
        <p className="mt-2 font-medium text-ink">{value}</p>
      )}
    </label>
  )
}
