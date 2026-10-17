import { LoaderCircle } from "lucide-react";
import { ErrorState, EmptyState } from "../feedback/StateViews";

export default function StateViews({
  status,
  loading,
  error,
  isEmpty,
  emptyTitle = "No items found",
  emptyMessage = "There is nothing here yet.",
  emptyAction,
  children,
}) {
  const isLoading = loading ?? status === "pending";

  if (isLoading) {
    return (
      <div className="flex min-h-48 flex-col items-center justify-center gap-3 text-muted">
        <LoaderCircle className="size-7 animate-spin text-primary" />
        <p className="text-sm">Loading...</p>
      </div>
    );
  }

  if (error) {
    return <ErrorState message={typeof error === "string" ? error : error.message} />;
  }

  if (isEmpty) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyMessage}
        action={emptyAction}
      />
    );
  }

  return children;
}
