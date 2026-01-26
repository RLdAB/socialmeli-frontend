import { Navigate } from "react-router-dom";

export default function FollowersRedirect({ activeUserId }) {
    return <Navigate to={`/users/${activeUserId}/followers`} replace />;
}