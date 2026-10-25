import { SkeletonCard, SkeletonLine } from "./Skeleton";

// Reusable domain-specific skeletons

export function QuestionCardSkeleton() {
  return (
    <SkeletonCard className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <SkeletonLine className="h-5 w-3/4" />
        <SkeletonLine className="h-6 w-16 rounded-full" />
      </div>
      <SkeletonLine className="h-3 w-1/2" />
      <div className="flex gap-2 pt-2">
        <SkeletonLine className="h-6 w-14 rounded-lg" />
        <SkeletonLine className="h-6 w-20 rounded-lg" />
      </div>
    </SkeletonCard>
  );
}

export function ResumeAnalysisSkeleton() {
  return (
    <div className="space-y-6">
      <SkeletonCard>
        <div className="flex items-center gap-4">
          <SkeletonLine className="size-16 rounded-2xl" />
          <div className="flex-1 space-y-2">
            <SkeletonLine className="h-5 w-48" />
            <SkeletonLine className="h-3 w-32" />
          </div>
        </div>
      </SkeletonCard>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SkeletonCard><SkeletonLine className="h-20 w-full" /></SkeletonCard>
        <SkeletonCard><SkeletonLine className="h-20 w-full" /></SkeletonCard>
        <SkeletonCard><SkeletonLine className="h-20 w-full" /></SkeletonCard>
      </div>
    </div>
  );
}

export function RoadmapSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <SkeletonCard key={i} className="flex gap-4 items-center">
          <SkeletonLine className="size-8 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <SkeletonLine className="h-4 w-1/3" />
            <SkeletonLine className="h-3 w-2/3" />
          </div>
        </SkeletonCard>
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <SkeletonCard className="h-64 flex flex-col justify-between p-6">
      <div className="flex justify-between">
        <SkeletonLine className="h-4 w-32" />
        <SkeletonLine className="h-4 w-16" />
      </div>
      <div className="flex items-end gap-3 h-40">
        {[40, 75, 55, 90, 60, 85, 70].map((h, i) => (
          <div key={i} className="flex-1 bg-slate-200 rounded-t-lg animate-pulse" style={{ height: `${h}%` }} />
        ))}
      </div>
    </SkeletonCard>
  );
}
