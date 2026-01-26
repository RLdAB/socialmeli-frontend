import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Navigation from "./components/Navigation.jsx";

import Home from "./pages/Home.jsx";
import Followers from "./pages/Followers.jsx";
import Followed from "./pages/Followed.jsx";
import Feed from "./pages/Feed.jsx";
import Publish from "./pages/Publish.jsx";
import Promos from "./pages/Promos.jsx";
import Users from "./pages/Users.jsx";
import FollowersRedirect from "./pages/FollowersRedirect.jsx";
import PostsRedirect from "./pages/PostsRedirect.jsx";


function getUserIdFromPath(pathname) {
  // tenta extrair /users/:id/...
  const m = pathname.match(/^\/users\/(\d+)(\/|$)/);
  return m ? Number(m[1]) : null;
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeUserId, setActiveUserId] = useState(1);

  // sincroniza state com URL se o userId estiver na rota
  useEffect(() => {
    const fromUrl = getUserIdFromPath(location.pathname);
    if (fromUrl && fromUrl !== activeUserId) setActiveUserId(fromUrl);
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleChangeUser(nextId) {
    setActiveUserId(nextId);

    // mantém a "seção" atual ao trocar usuário
    const path = location.pathname;
    if (path.includes("/followers")) navigate(`/users/${nextId}/followers`);
    else if (path.includes("/followed")) navigate(`/users/${nextId}/followed`);
    else if (path.includes("/feed")) navigate(`/users/${nextId}/feed`);
    else if (path.includes("/promos")) navigate(`/users/${nextId}/promos`);
    else navigate(`/users/${nextId}/feed`); // default útil
  }

  return (
    <div>
      <Navigation activeUserId={activeUserId} onChangeUser={handleChangeUser} />

      <div style={{ padding: 16 }}>
        <Routes>
          <Route path="/" element={<Home activeUserId={activeUserId} />} />


          <Route path="/users" element={<Users />} />
          <Route path="/posts" element={<PostsRedirect activeUserId={activeUserId} />} />
          <Route path="/followers" element={<FollowersRedirect activeUserId={activeUserId} />} />

          <Route path="/publish" element={<Publish activeUserId={activeUserId} />} />
          <Route path="/users/:userId/followers" element={<Followers />} />
          <Route path="/users/:userId/followed" element={<Followed />} />
          <Route path="/users/:userId/feed" element={<Feed />} />
          <Route path="/users/:userId/promos" element={<Promos />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}