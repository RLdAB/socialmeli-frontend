import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("")

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setLoading(true);
            setError("");
            await login({ name, password });
            navigate("/");
        } catch (err) {
            setError(err.message || "Erro ao logar");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <h1>Login</h1>

            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 8, maxWidth: 320 }}>
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

                {error && <div style={{ color: "red" }}>{error}</div>}
            </form>
        </div>
    );
}