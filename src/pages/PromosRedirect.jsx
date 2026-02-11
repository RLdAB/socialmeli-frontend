import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function PromosRedirect() {
  const { authUser } = useAuth();
  return <Navigate to={`/users/${authUser.id}/promos`} replace />;
}