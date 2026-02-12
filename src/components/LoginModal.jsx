import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Modal from "./Modal";

export default function LoginModal({ open, onClose }) {
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // sempre que abrir, limpa estado 
  useEffect(() => {
    if (open) {
      setName("");
      setPassword("");
      setError("");
      setLoading(false);
    }
  }, [open]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      await login({ name, password });
      onClose(); // fecha ao logar com sucesso
    } catch (err) {
      setError(err.message || "Erro ao logar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} title="Login" onClose={onClose}>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
        <label>
          Nome
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>

        <label>
          Senha
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>

        {error && <div style={{ color: "crimson" }}>{error}</div>}
      </form>
    </Modal>
  );
}