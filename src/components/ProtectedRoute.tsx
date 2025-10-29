import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../src/context/useAuth";
import { useState, useEffect } from "react";
import AppLayout from "./layout/AppLayout";

export default function ProtectedRoute() {
  const { token } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (token || storedToken) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setIsChecking(false);
  }, [token]);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center h-screen text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
