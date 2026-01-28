import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api.js";

function extractUsers(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.users)) return payload.users;
  if (Array.isArray(payload.followed)) return payload.followed;
  if (Array.isArray(payload.following)) return payload.following;
  return [];
}

export default function Followed() {
  const { userId } = useParams();

  const [order, setOrder] = useState("name_asc");
  const [sellerId, setSellerId] = useState("");

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await api.getFollowedList(userId, order);
      setData(res);
    } catch (e) {
      setError(e.message || "Erro ao carregar followed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, order]);

  const users = extractUsers(data);

  async function handleFollow() {
    setMessage("");
    setError("");

    const sid = Number(sellerId);
    if (!Number.isInteger(sid) || sid <= 0) {
      setError("Informe um sellerId válido.");
      return;
    }

    setActionLoading(true);
    try {
      await api.followSeller(userId, sid);
      setMessage(`Agora você segue o seller ${sid}.`);
      setSellerId("");
      await load();
    } catch (e) {
      setError(e.message || "Erro ao seguir seller");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleUnfollow(sid) {
    setMessage("");
    setError("");

    setActionLoading(true);
    try {
      await api.unfollowSeller(userId, sid);
      setMessage(`Você deixou de seguir o seller ${sid}.`);
      await load();
    } catch (e) {
      setError(e.message || "Erro ao deixar de seguir");
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div>
      <h1>Quem eu sigo</h1>
      <p>User: {userId}</p>

      <div style={{ display: "flex", gap: 12, alignItems: "center", margin: "12px 0", flexWrap: "wrap" }}>
        <div>
          <label>Ordenar: </label>
          <select value={order} onChange={(e) => setOrder(e.target.value)}>
            <option value="name_asc">Nome (A-Z)</option>
            <option value="name_desc">Nome (Z-A)</option>
          </select>
        </div>
      </div>

      <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12, marginBottom: 12 }}>
        <strong>Seguir seller</strong>
        <div style={{ display: "flex", gap: 8, marginTop: 8, alignItems: "center" }}>
          <input
            placeholder="sellerId"
            value={sellerId}
            onChange={(e) => setSellerId(e.target.value)}
            style={{ width: 120 }}
          />
          <button onClick={handleFollow} disabled={actionLoading}>
            {actionLoading ? "Aguarde..." : "Seguir"}
          </button>
        </div>
      </div>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {loading && <p>Carregando...</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {!loading && !error && (
        <div style={{ display: "grid", gap: 8 }}>
          {users.map((u) => (
            <div key={u.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12, display: "flex", justifyContent: "space-between", gap: 12 }}>
              <div>
                <strong>{u.name}</strong> — id: {u.id}
              </div>
              <button onClick={() => handleUnfollow(u.id)} disabled={actionLoading}>
                Deixar de seguir
              </button>
            </div>
          ))}
          {users.length === 0 && <p>Você não segue ninguém.</p>}
        </div>
      )}
    </div>
  );
}