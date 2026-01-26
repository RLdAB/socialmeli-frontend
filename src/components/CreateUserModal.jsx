import { useState } from "react";
import { api } from "../services/api.js";

export default function CreateUserModal({ open, onClose, onCreated }) {
  const [name, setName] = useState("");
  const [isSeller, setIsSeller] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // createUser retorna { data, status }
      const { status } = await api.createUser({ name, is_seller: isSeller });

      if (status === 201) {
        await onCreated?.(); // garante recarregar lista antes de fechar
        onClose?.();
        setName("");
        setIsSeller(false);
      } else {
        setError(`Esperado status 201, recebido ${status}`);
      }
    } catch (err) {
      setError(err.message || "Erro ao criar usuário");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "white",
          padding: 16,
          borderRadius: 8,
          width: "100%",
          maxWidth: 420,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <h2 style={{ margin: 0 }}>Criar usuário</h2>
          <button type="button" onClick={onClose} disabled={loading}>
            Fechar
          </button>
        </div>

        <form onSubmit={submit} style={{ display: "grid", gap: 12, marginTop: 12 }}>
          <div style={{ display: "grid", gap: 6 }}>
            <label htmlFor="user-name">Nome:</label>
            <input
              id="user-name"
              name="name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <label
            htmlFor="is-seller"
            style={{ display: "flex", gap: 8, alignItems: "center" }}
          >
            <input
              id="is-seller"
              name="is_seller"
              type="checkbox"
              checked={isSeller}
              onChange={(e) => setIsSeller(e.target.checked)}
            />
            É seller?
          </label>

          {error && <p style={{ color: "crimson", margin: 0 }}>{error}</p>}

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button type="button" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" disabled={loading || !name.trim()}>
              {loading ? "Criando..." : "Criar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}