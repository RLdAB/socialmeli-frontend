import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

import Navigation from "./components/Navigation.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Home from "./pages/Home.jsx";
import Users from "./pages/Users.jsx";
import Login from "./pages/Login.jsx";

import Followers from "./pages/Followers.jsx";
import Followed from "./pages/Followed.jsx";
import Feed from "./pages/Feed.jsx";
import Publish from "./pages/Publish.jsx";
import Promos from "./pages/Promos.jsx";

import FollowersRedirect from "./pages/FollowersRedirect.jsx";
import FollowedRedirect from "./pages/FollowedRedirect.jsx";
import PostsRedirect from "./pages/PostsRedirect.jsx";
import PromosRedirect from "./pages/PromosRedirect.jsx";

export default function App() {
  const { authUser } = useAuth();
  const activeUserId = authUser?.id ?? null;

  return (
    <div>
      <Navigation />

      <div style={{ padding: 16 }}>
        <Routes>
          {/* Exceção: login sempre acessível */}
          <Route path="/login" element={<Login />} />

          {/* Públicas (se tornar privadas, envolva com ProtectedRoute) */}
          <Route path="/" element={<Home activeUserId={activeUserId} />} />
          <Route path="/users" element={<Users activeUserId={activeUserId} />} />

          {/* Atalhos privados (usados pela navbar) */}
          <Route
            path="/followers"
            element={
              <ProtectedRoute>
                <FollowersRedirect />
              </ProtectedRoute>
            }
          />
          <Route
            path="/followed"
            element={
              <ProtectedRoute>
                <FollowedRedirect />
              </ProtectedRoute>
            }
          />
          <Route
            path="/posts"
            element={
              <ProtectedRoute>
                <PostsRedirect />
              </ProtectedRoute>
            }
          />
          <Route
            path="/promos"
            element={
              <ProtectedRoute>
                <PromosRedirect />
              </ProtectedRoute>
            }
          />

          {/* Rotas privadas finais */}
          <Route
            path="/publish"
            element={
              <ProtectedRoute>
                <Publish />
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

          {/* fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}