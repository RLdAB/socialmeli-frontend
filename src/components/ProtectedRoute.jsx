import { useAuth } from "../contexts/AuthContext";
import LoginRequiredMessage from "./LoginRequiredMessage";

export default function ProtectedRoute({ children }) {
  const { authUser } = useAuth();
  if (!authUser) return <LoginRequiredMessage />;
  return children;
}