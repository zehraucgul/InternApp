import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowRoles }) {
  const { isAuth, roleValue } = useContext(AuthContext);

  if (!isAuth) return <Navigate to="/login" />;

  if (allowRoles && !allowRoles.includes(roleValue)) {
    return <Navigate to="/" />;
  }

  return children;
}
