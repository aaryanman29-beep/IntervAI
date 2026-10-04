import ProgressBar from "../common/ProgressBar"
export default function SkillScore({ name, value }) {
  return <ProgressBar label={name} value={value} />
}
