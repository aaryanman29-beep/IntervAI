import Card from "../common/Card"
export default function ScoreCard({ value }) {
  return (
    <Card className="text-center">
      <p className="text-sm font-medium text-muted">Overall score</p>
      <div className="mx-auto my-5 grid size-36 place-items-center rounded-full border-12 border-primary-soft">
        <span className="font-display text-4xl font-extrabold text-primary">
          {value}%
        </span>
      </div>
      <p className="font-semibold text-success">Excellent performance</p>
    </Card>
  )
}
