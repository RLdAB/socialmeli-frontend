import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api.js";

function extractUsers(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.users)) return payload.users;
  if (Array.isArray(payload.followers)) return payload.followers;
  return [];
}

export default function Followers() {
  const { userId } = useParams();
  const [order, setOrder] = useState("name_asc");

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");

    api.getFollowersList(userId, order)
      .then((res) => alive && setData(res))
      .catch((e) => alive && setError(e.message || "Erro ao carregar followers"))
      .finally(() => alive && setLoading(false));

    return () => { alive = false; };
  }, [userId, order]);

  const users = useMemo(() => extractUsers(data), [data]);

  return (
    <div>
      <h1>Quem me segue</h1>
      <p>User: {userId}</p>

      <div style={{ display: "flex", gap: 8, alignItems: "center", margin: "12px 0" }}>
        <label>Ordenar:</label>
        <select value={order} onChange={(e) => setOrder(e.target.value)}>
          <option value="name_asc">Nome (A-Z)</option>
          <option value="name_desc">Nome (Z-A)</option>
        </select>
      </div>

      {loading && <p>Carregando...</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {!loading && !error && (
        <div style={{ display: "grid", gap: 8 }}>
          {users.map((u) => (
            <div key={u.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
              <strong>{u.name}</strong> — id: {u.id} — seller: {u.is_seller ? "sim" : "não"}
            </div>
          ))}
          {users.length === 0 && <p>Nenhum follower encontrado.</p>}
        </div>
      )}
    </div>
  );
}