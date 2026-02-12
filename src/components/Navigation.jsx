import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import LoginModal from "./LoginModal";

export default function Navigation() {
  const { authUser, logout } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <div style={{ display: "flex", gap: 16, alignItems: "center", padding: 16, borderBottom: "1px solid #ddd" }}>
      <strong>SocialMeli</strong>

      <nav style={{ display: "flex", gap: 12 }}>
        <Link to="/">Home</Link>
        <Link to="/users">Usuarios</Link>
        <Link to="/followers">Seguidos</Link>
        <Link to="/followed">Seguidores</Link>
        <Link to="/posts">Posts</Link>
        <Link to="/publish">Criar publicação</Link>
        <Link to="/promos">Promoções</Link>
      </nav>

      <div style={{ marginLeft: "auto" }}>
        {!authUser ? (
          <button onClick={() => setLoginOpen(true)}>Logar</button>
        ) : (
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span>{authUser.id} - {authUser.name}</span>
            <button onClick={logout}>Sair</button>
          </div>
        )}
      </div>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
}