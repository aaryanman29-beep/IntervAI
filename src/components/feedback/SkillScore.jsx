import ProgressBar from "../common/ProgressBar"
export default function SkillScore({ name, value, score }) {
  const displayVal = value !== undefined ? value : (score !== undefined ? score : 0)
  return <ProgressBar label={name} value={displayVal} />
}
