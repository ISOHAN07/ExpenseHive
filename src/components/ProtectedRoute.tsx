import { Navigate, Outlet } from "react-router-dom"
import AppLayout from "./layout/AppLayout"

export default function ProtectedRoute() {
  // Check if user is authenticated (you can replace this with actual auth logic)
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  )
}
