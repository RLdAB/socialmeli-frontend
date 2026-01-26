import { useState } from "react";
import { api } from "../services/api.js";

export default function Publish({ activeUserId }) {
  const [form, setForm] = useState({
    user_id: activeUserId ?? 1,
    date: "",
    product_id: "",
    product_name: "",
    type: "",
    brand: "",
    color: "",
    notes: "",
    category: "",
    price: "",
  });

  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState("");
  const [error, setError] = useState("");

  function setField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    setOk("");
    setError("");
    setLoading(true);

    try {
      const payload = {
        user_id: Number(form.user_id),
        date: form.date,
        product: {
          product_id: Number(form.product_id),
          product_name: form.product_name,
          type: form.type,
          brand: form.brand,
          color: form.color,
          notes: form.notes,
        },
        category: Number(form.category),
        price: Number(form.price),
      };

      await api.publishProduct(payload);
      setOk("Publicação criada com sucesso!");
    } catch (e2) {
      setError(e2.message || "Erro ao publicar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Criar publicação</h1>

      <form onSubmit={submit} style={{ display: "grid", gap: 10, maxWidth: 520 }}>
        <label>
          user_id (seller):
          <input
            value={form.user_id}
            onChange={(e) => setField("user_id", e.target.value)}
            inputMode="numeric"
          />
        </label>

        <label>
          date (dd-MM-yyyy):
          <input
            placeholder="22-01-2026"
            value={form.date}
            onChange={(e) => setField("date", e.target.value)}
          />
        </label>

        <label>
          product_id:
          <input value={form.product_id} onChange={(e) => setField("product_id", e.target.value)} />
        </label>

        <label>
          product_name:
          <input value={form.product_name} onChange={(e) => setField("product_name", e.target.value)} />
        </label>

        <label>
          type:
          <input value={form.type} onChange={(e) => setField("type", e.target.value)} />
        </label>

        <label>
          brand:
          <input value={form.brand} onChange={(e) => setField("brand", e.target.value)} />
        </label>

        <label>
          color:
          <input value={form.color} onChange={(e) => setField("color", e.target.value)} />
        </label>

        <label>
          notes:
          <input value={form.notes} onChange={(e) => setField("notes", e.target.value)} />
        </label>

        <label>
          category (number):
          <input value={form.category} onChange={(e) => setField("category", e.target.value)} />
        </label>

        <label>
          price:
          <input value={form.price} onChange={(e) => setField("price", e.target.value)} />
        </label>

        <button disabled={loading} type="submit">
          {loading ? "Enviando..." : "Publicar"}
        </button>

        {ok && <p style={{ color: "green" }}>{ok}</p>}
        {error && <p style={{ color: "crimson" }}>{error}</p>}
      </form>
    </div>
  );
}