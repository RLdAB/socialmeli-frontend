import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Navigation() {
  const { authUser, logout } = useAuth();
  const navigate = useNavigate();

  const activeUserId = authUser?.id;

  return (
    <div style={{ display: "flex", gap: 16, alignItems: "center", padding: 16, borderBottom: "1px solid #ddd" }}>
      <strong>SocialMeli</strong>

      <nav style={{ display: "flex", gap: 12 }}>
        <Link to="/">Home</Link>
        <Link to="/users">Usuarios</Link>


        {/* Sempre vai para a rota/atalho; o ProtectedRoute cuida da mensagem */}
        <Link to="/followers">Seguidos</Link>
        <Link to="/followed">Seguidores</Link>
        <Link to="/posts">Posts</Link>
        <Link to="/publish">Criar publicação</Link>
        <Link to="/promos">Promoções</Link>
      </nav>

      <div style={{ marginLeft: "auto" }}>
        {!authUser ? (
          <button onClick={() => navigate("/login")}>Logar</button>
        ) : (
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span>{authUser.id} - {authUser.name}</span>
            <button onClick={logout}>Sair</button>
          </div>
        )}
      </div>
    </div>
  );
}