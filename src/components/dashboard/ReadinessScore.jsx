import Card from "../common/Card"

export default function ReadinessScore({ score, loading }) {
  const value = score ?? 0
  return (
    <Card className="flex h-full flex-col justify-between">
      <div>
        <p className="font-display text-lg font-bold">Interview readiness</p>
        <p className="mt-1 text-sm text-muted">
          Your overall preparation score
        </p>
      </div>
      <div className="my-6 flex justify-center">
        {loading ? (
          <div className="size-40 animate-pulse rounded-full bg-slate-200" />
        ) : (
          <div
            className="relative grid size-40 place-items-center rounded-full"
            style={{
              background: `conic-gradient(var(--color-primary) ${value * 3.6}deg, var(--color-primary-soft) 0deg)`,
            }}
          >
            <div className="grid size-32 place-items-center rounded-full bg-white text-center">
              <div>
                <span className="font-display text-4xl font-extrabold">
                  {value}%
                </span>
                <p className="mt-1 text-xs font-semibold text-success">
                  {value >= 70 ? "Interview ready" : value >= 40 ? "In progress" : "Getting started"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      <p className="text-center text-xs text-muted">
        Based on your completed interviews
      </p>
    </Card>
  )
}
