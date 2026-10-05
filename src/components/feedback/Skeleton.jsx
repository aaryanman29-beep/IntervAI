// Skeleton UI components for loading states
export function SkeletonLine({ className = "" }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-slate-200 ${className}`}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard({ children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-line bg-white p-6 card-shadow ${className}`}>
      {children}
    </div>
  );
}

export function StatsCardSkeleton() {
  return (
    <SkeletonCard>
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <SkeletonLine className="h-3 w-32" />
          <SkeletonLine className="h-7 w-16" />
          <SkeletonLine className="h-3 w-24" />
        </div>
        <SkeletonLine className="size-10 rounded-xl" />
      </div>
    </SkeletonCard>
  );
}

export function TableRowSkeleton({ cols = 6 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-5 py-4">
          <SkeletonLine className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

export function InterviewCardSkeleton() {
  return (
    <SkeletonCard>
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <SkeletonLine className="h-4 w-40" />
          <SkeletonLine className="h-3 w-28" />
        </div>
        <SkeletonLine className="h-8 w-14 rounded-xl" />
      </div>
      <div className="mt-4 flex gap-2">
        <SkeletonLine className="h-6 w-16 rounded-full" />
        <SkeletonLine className="h-6 w-20 rounded-full" />
      </div>
    </SkeletonCard>
  );
}
