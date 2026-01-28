import { useEffect, useState } from "react";
import { api } from "../services/api.js";
import CreateUserModal from "../components/CreateUserModal.jsx";

export default function Users({ activeUserId }) {
  const [modalOpen, setModalOpen] = useState(false);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadUsers() {
    setLoading(true);
    setError("");
    try {
      const res = await api.getUsers();
      setUsers(res?.users || []);
    } catch (e) {
      setError(e.message || "Erro ao listar usuários");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleFollow(sellerId) {
    setMessage("");
    setError("");
    setActionLoadingId(sellerId);

    try {
      await api.followSeller(activeUserId, sellerId);
      setMessage(`User ${activeUserId} agora segue o seller ${sellerId}.`);
    } catch (e) {
      setError(e.message || "Erro ao seguir");
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleUnfollow(sellerId) {
    setMessage("");
    setError("");
    setActionLoadingId(sellerId);

    try {
      await api.unfollowSeller(activeUserId, sellerId);
      setMessage(`User ${activeUserId} deixou de seguir o seller ${sellerId}.`);
    } catch (e) {
      setError(e.message || "Erro ao deixar de seguir");
    } finally {
      setActionLoadingId(null);
    }
  }

  return (
    <div>
      <h1>Usuários</h1>
      <p>
        Usuário ativo (buyer): <strong>{activeUserId}</strong>
      </p>

      <div style={{ display: "flex", gap: 8, margin: "12px 0" }}>
        <button onClick={() => setModalOpen(true)}>Criar usuário</button>
        <button onClick={loadUsers} disabled={loading}>
          {loading ? "Carregando..." : "Recarregar"}
        </button>
      </div>

      <CreateUserModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={loadUsers}
      />

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {loading && users.length === 0 && <p>Carregando...</p>}

      <div style={{ display: "grid", gap: 8 }}>
        {users.map((u) => {
          const isSelf = Number(u.id) === Number(activeUserId);

          return (
            <div
              key={u.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: 12,
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                alignItems: "center",
              }}
            >
              <div>
                <strong>{u.name}</strong> — id: {u.id} — seller:{" "}
                {u.is_seller ? "sim" : "não"}
                {isSelf && <span style={{ marginLeft: 8, color: "#666" }}>(você)</span>}
              </div>

              {!isSelf && (
                <div style={{ display: "flex", gap: 8 }}>
                  {u.is_seller && (
                    <button
                      onClick={() => handleFollow(u.id)}
                      disabled={actionLoadingId === u.id}
                    >
                      {actionLoadingId === u.id ? "..." : "Seguir"}
                    </button>
                  )}

                  <button
                    onClick={() => handleUnfollow(u.id)}
                    disabled={actionLoadingId === u.id}
                  >
                    {actionLoadingId === u.id ? "..." : "Deixar de seguir"}
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {!loading && !error && users.length === 0 && <p>Nenhum usuário cadastrado</p>}
      </div>
    </div>
  );
}