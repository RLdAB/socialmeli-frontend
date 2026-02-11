import { Routes, Route, Navigate } from "react-router-dom";
import Navigation from "./components/Navigation.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useAuth } from "./contexts/AuthContext";

import Home from "./pages/Home.jsx";
import Followers from "./pages/Followers.jsx";
import Followed from "./pages/Followed.jsx";
import Feed from "./pages/Feed.jsx";
import Publish from "./pages/Publish.jsx";
import Promos from "./pages/Promos.jsx";
import Users from "./pages/Users.jsx";
import FollowersRedirect from "./pages/FollowersRedirect.jsx";
import PostsRedirect from "./pages/PostsRedirect.jsx";
import Login from "./pages/Login.jsx";

export default function App() {

  const { authUser } = useAuth();
  const activeUserId = authUser?.id ?? null;

  return (
    <div>
      <Navigation />

      <div style={{ padding: 16 }}>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<Home activeUserId={activeUserId} />} />
          <Route path="/users" element={<Users activeUserId={activeUserId} />} />

          {/* Riderects (vamos ajustar abaixo para respeitar login) */}
          <Route path="/posts" element={<PostsRedirect activeUserId={activeUserId} />} />
          <Route path="/followers" element={<FollowersRedirect activeUserId={activeUserId} />} />

          {/* Rotas protegidas */}
          <Route
            path="/publish"
            element={
              <ProtectedRoute>
                <Publish activeUserId={activeUserId} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/users/:userId/followers"
            element={
              <ProtectedRoute>
                <Followers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/users/:userId/followed"
            element={
              <ProtectedRoute>
                <Followed />
              </ProtectedRoute>
            }
          />

          <Route
            path="/users/:userId/feed"
            element={
              <ProtectedRoute>
                <Feed />
              </ProtectedRoute>
            }
          />

          <Route
            path="/users/:userId/promos"
            element={
              <ProtectedRoute>
                <Promos />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}