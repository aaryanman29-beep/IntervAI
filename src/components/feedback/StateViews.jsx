import { AlertCircle, RefreshCw, WifiOff } from "lucide-react";
import Button from "../common/Button";

export function ErrorState({ message, onRetry, type = "error" }) {
  const isNetworkError = type === "network" || message?.toLowerCase().includes("network") || message?.toLowerCase().includes("failed to fetch");
  
  return (
    <div
      className="flex flex-col items-center justify-center py-16 text-center"
      role="alert"
    >
      <div className="grid size-16 place-items-center rounded-full bg-red-50">
        {isNetworkError
          ? <WifiOff className="size-8 text-red-400" />
          : <AlertCircle className="size-8 text-red-400" />}
      </div>
      <h3 className="mt-4 font-display text-lg font-bold">
        {isNetworkError ? "Connection unavailable" : "Something went wrong"}
      </h3>
      <p className="mt-2 max-w-xs text-sm text-muted">
        {isNetworkError
          ? "Unable to reach the server. Check your connection and try again."
          : message || "An unexpected error occurred."}
      </p>
      {onRetry && (
        <Button variant="secondary" icon={RefreshCw} onClick={onRetry} className="mt-6">
          Try again
        </Button>
      )}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && (
        <div className="grid size-16 place-items-center rounded-full bg-primary-soft">
          <Icon className="size-8 text-primary" />
        </div>
      )}
      <h3 className="mt-4 font-display text-lg font-bold">{title}</h3>
      {description && (
        <p className="mt-2 max-w-xs text-sm text-muted">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
