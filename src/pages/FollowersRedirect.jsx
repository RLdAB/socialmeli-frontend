import { Navigate } from "react-router-dom";

export default function FollowersRedirect({ activeUserId }) {
    if (!activeUserId) return <Navigate to="/login" replace />;
    return <Navigate to={`/users/${activeUserId}/followers`} replace />;
}