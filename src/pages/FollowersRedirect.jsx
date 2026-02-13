import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function FollowersRedirect() {
    const { authUser } = useAuth();
  
    return <Navigate to={`/users/${authUser.id}/followers`} replace />;
}