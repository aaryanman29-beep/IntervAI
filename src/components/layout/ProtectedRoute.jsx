import { Navigate, Outlet } from "react";
import { useAuth } from "../../contexts/AuthContext";

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-canvas">
        <span className="size-8 animate-spin rounded-full border-3 border-primary-soft border-t-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
