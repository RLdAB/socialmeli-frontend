import { Navigate } from "react-router-dom";

export default function PostsRedirect({ activeUserId }) {
    if (!activeUserId) return <Navigate to="/login" replace />;
    return <Navigate to={`/users/${activeUserId}/feed`} replace />;
}