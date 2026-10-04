import {
  Bell,
  Eye,
  Lock,
  Monitor,
  Save,
  SlidersHorizontal,
  UserRound,
} from "lucide-react"
import { useState } from "react"
import Button from "../components/common/Button"
import Card from "../components/common/Card"
import PageContainer from "../components/layout/PageContainer"
export default function Settings() {
  const [settings, setSettings] = useState({
    email: true,
    reminders: true,
    weekly: false,
    sound: true,
    camera: false,
    analytics: true,
    theme: "System",
    difficulty: "Adaptive",
  })
  const toggle = (key) => setSettings({ ...settings, [key]: !settings[key] })
  return (
    <PageContainer
      title="Settings"
      description="Customize your IntervAI experience."
    >
      <div className="space-y-5">
        {[
          {
            title: "Account",
            description: "Manage account details and password.",
            icon: UserRound,
            content: (
              <div className="grid gap-4 sm:grid-cols-2">
                <SimpleInput label="Email" value="alex.morgan@example.com" />
                <SimpleInput
                  label="Password"
                  value="••••••••••"
                  type="password"
                />
              </div>
            ),
          },
          {
            title: "Appearance",
            description: "Choose how IntervAI looks.",
            icon: Monitor,
            content: (
              <Select
                label="Theme"
                value={settings.theme}
                onChange={(theme) => setSettings({ ...settings, theme })}
                options={["System", "Light", "Dark"]}
              />
            ),
          },
          {
            title: "Notifications",
            description: "Decide when you want to hear from us.",
            icon: Bell,
            content: (
              <div className="space-y-1">
                <Toggle
                  label="Email notifications"
                  checked={settings.email}
                  onChange={() => toggle("email")}
                />
                <Toggle
                  label="Practice reminders"
                  checked={settings.reminders}
                  onChange={() => toggle("reminders")}
                />
                <Toggle
                  label="Weekly progress report"
                  checked={settings.weekly}
                  onChange={() => toggle("weekly")}
                />
              </div>
            ),
          },
          {
            title: "Interview preferences",
            description: "Set defaults for future sessions.",
            icon: SlidersHorizontal,
            content: (
              <div className="grid gap-4 sm:grid-cols-2">
                <Select
                  label="Default difficulty"
                  value={settings.difficulty}
                  onChange={(difficulty) =>
                    setSettings({ ...settings, difficulty })
                  }
                  options={["Adaptive", "Easy", "Medium", "Hard"]}
                />
                <div>
                  <Toggle
                    label="Interview sound"
                    checked={settings.sound}
                    onChange={() => toggle("sound")}
                  />
                  <Toggle
                    label="Camera preview"
                    checked={settings.camera}
                    onChange={() => toggle("camera")}
                  />
                </div>
              </div>
            ),
          },
          {
            title: "Privacy",
            description: "Control your data and personalization.",
            icon: Lock,
            content: (
              <>
                <Toggle
                  label="Share anonymous usage analytics"
                  checked={settings.analytics}
                  onChange={() => toggle("analytics")}
                />
                <Button variant="danger" className="mt-4">
                  Delete account
                </Button>
              </>
            ),
          },
        ].map(({ title, description, icon: Icon, content }) => (
          <Card key={title}>
            <div className="grid gap-5 md:grid-cols-[.5fr_1.5fr]">
              <div className="flex gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
                  <Icon className="size-5" />
                </span>
                <div>
                  <h2 className="font-display font-bold">{title}</h2>
                  <p className="mt-1 text-sm leading-5 text-muted">
                    {description}
                  </p>
                </div>
              </div>
              <div>{content}</div>
            </div>
          </Card>
        ))}
        <div className="flex justify-end">
          <Button icon={Save}>Save settings</Button>
        </div>
      </div>
    </PageContainer>
  )
}
function Toggle({ label, checked, onChange }) {
  return (
    <button
      onClick={onChange}
      role="switch"
      aria-checked={checked}
      className="flex w-full items-center justify-between rounded-xl p-3 text-left text-sm font-medium hover:bg-slate-50"
    >
      <span>{label}</span>
      <span
        className={`relative h-6 w-11 rounded-full transition ${
          checked ? "bg-primary" : "bg-slate-200"
        }`}
      >
        <span
          className={`absolute top-1 size-4 rounded-full bg-white transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </span>
    </button>
  )
}
function Select({ label, value, onChange, options }) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 min-h-11 w-full rounded-xl border border-line bg-white px-3 font-normal outline-none focus:border-primary"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  )
}
function SimpleInput({ label, ...props }) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <input
        className="mt-2 min-h-11 w-full rounded-xl border border-line px-3 font-normal outline-none focus:border-primary"
        {...props}
      />
    </label>
  )
}
