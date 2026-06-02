import { Navigate } from "react-router-dom"

export default function ProtectedRoute({ children, allowedRoles }) {

  const token = localStorage.getItem("token")

  let user = null

  try {
    const raw = localStorage.getItem("user")
    if (raw && raw !== "undefined") {
      user = JSON.parse(raw)
    }
  } catch {
    user = null
  }

  // BELUM LOGIN
  if (!token || !user) {
    return <Navigate to="/" />
  }

  // ROLE TIDAK SESUAI
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" />
  }

  return children
}