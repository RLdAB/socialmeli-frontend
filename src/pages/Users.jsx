import { useEffect, useState } from "react";
import { api } from "../services/api.js";
import CreateUserModal from "../components/CreateUserModal.jsx";

export default function Users() {
  const [modalOpen, setModalOpen] = useState(false);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadUsers() {
    debugger
    setLoading(true);
    setError("");

    try {
      const res = await api.getUsers();
      debugger
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

  return (
    <div>
      <h1>Usuários</h1>

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

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {loading && users.length === 0 && <p>Carregando...</p>}

      <div style={{ display: "grid", gap: 8 }}>
        {users.map((u) => (
          <div
            key={u.id}
            style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}
          >
            <strong>{u.name}</strong> — id: {u.id} — seller:{" "}
            {u.is_seller ? "sim" : "não"}
          </div>
        ))}

        {!loading && !error && users.length === 0 && (
          <p>Nenhum usuário cadastrado</p>
        )}
      </div>
    </div>
  );
}