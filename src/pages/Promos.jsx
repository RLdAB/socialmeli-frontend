import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api.js";
import PostCard from "../components/PostCard.jsx";

export default function Promos() {
  const { userId } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");

    api.getPromosByUser(userId)
      .then((res) => {
        if (!alive) return;
        setData(res);
      })
      .catch((e) => {
        if (!alive) return;
        setError(e.message || "Erro ao carregar promoções");
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => { alive = false; };
  }, [userId]);

  const posts = Array.isArray(data) ? data : (data?.posts || []);

  return (
    <div>
      <h1>Produtos em promoção</h1>
      <p>User: {userId}</p>

      {loading && <p>Carregando...</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {!loading && !error && (
        <div style={{ display: "grid", gap: 12 }}>
          {posts.map((p) => (
            <PostCard key={p.id ?? `${p.user_id}-${p.product_id}-${p.created_at}`} post={p} />
          ))}
          {posts.length === 0 && <p>Nenhuma promoção encontrada.</p>}
        </div>
      )}
    </div>
  );
}