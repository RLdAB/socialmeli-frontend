import { Link } from "react-router-dom";
import UserSelector from "./UserSelector.jsx";

export default function Navigation({ activeUserId, onChangeUser }) {
  return (
    <div style={{ display: "flex", gap: 16, alignItems: "center", padding: 16, borderBottom: "1px solid #ddd" }}>
      <strong>SocialMeli</strong>

      <nav style={{ display: "flex", gap: 12 }}>
        <Link to="/">Home</Link>
        <Link to={`/users/${activeUserId}/followers`}>Quem me segue</Link>
        <Link to={`/users/${activeUserId}/followed`}>Quem eu sigo</Link>
        <Link to={`/users/${activeUserId}/feed`}>Feed</Link>
        <Link to="/publish">Criar publicação</Link>
        <Link to={`/users/${activeUserId}/promos`}>Promoções</Link>
      </nav>

      <div style={{ marginLeft: "auto" }}>
        <UserSelector value={activeUserId} onChange={onChangeUser} />
      </div>
    </div>
  );
}