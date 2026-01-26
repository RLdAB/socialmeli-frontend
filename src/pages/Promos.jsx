import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api.js";
import PostCard from "../components/PostCard.jsx";

export default function Promos() {
  console.log(">>> Promos RENDER");
  const { userId } = useParams();
  console.log(">>> Promos userId:", userId);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log(">>> Promos useEffect DISPAROU", userId);

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

    return () => {
      alive = false;
    };
  }, [userId]);

  const posts = data?.posts || [];

  return (
    <div>
      <h1>Promoções</h1>
      <p>
        Seller: {data?.user_name ?? "-"} (id: {userId})
      </p>

      {loading && <p>Carregando...</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {!loading && !error && (
        <div style={{ display: "grid", gap: 12 }}>
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
          {posts.length === 0 && <p>Nenhuma promoção encontrada.</p>}
        </div>
      )}
    </div>
  );
}