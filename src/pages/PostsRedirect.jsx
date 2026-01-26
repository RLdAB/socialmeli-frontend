import { Navigate } from "react-router-dom";

export default function PostsRedirect({ activeUserId }) {
    return <Navigate to={`/users/${activeUserId}/feed`} replace />;
}