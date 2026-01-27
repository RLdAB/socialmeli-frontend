import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api.js";
import PostCard from "../components/PostCard.jsx";

export default function Feed() {
  const { userId } = useParams();

  const [order, setOrder] = useState("date_desc");
  const [weeks, setWeeks] = useState(2);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // controla “request mais recente”
  const reqIdRef = useRef(0);

  useEffect(() => {
    const reqId = ++reqIdRef.current;

    setLoading(true);
    setError("");

    api.getFeed(userId, { order, weeks })
      .then((res) => {
        // ignora se já existe uma request mais nova
        if (reqId !== reqIdRef.current) return;
        setData(res);
      })
      .catch((e) => {
        if (reqId !== reqIdRef.current) return;
        setError(e.message || "Erro ao carregar feed");
      })
      .finally(() => {
        if (reqId !== reqIdRef.current) return;
        setLoading(false);
      });
  }, [userId, order, weeks]);

  const posts = data?.posts || [];

  return (
    <div>
      <h1>Feed de publicações</h1>
      <p>User: {userId}</p>

      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          margin: "12px 0",
          flexWrap: "wrap",
        }}
      >
        <div>
          <label>Ordenar: </label>
          <select value={order} onChange={(e) => setOrder(e.target.value)}>
            <option value="date_desc">Data (mais recente)</option>
            <option value="date_asc">Data (mais antiga)</option>
          </select>
        </div>

        <div>
          <label>Weeks: </label>
          <input
            type="number"
            min="1"
            value={weeks}
            onChange={(e) => setWeeks(Number(e.target.value) || 1)}
            style={{ width: 80 }}
          />
        </div>
      </div>

      {loading && <p>Carregando...</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {!loading && !error && (
        <>
          <p>
            {data?.count ?? posts.length} post(s) nas últimas {data?.weeks ?? weeks} semana(s)
          </p>

          <div style={{ display: "grid", gap: 12 }}>
            {posts.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
            {posts.length === 0 && <p>Nenhuma publicação encontrada.</p>}
          </div>
        </>
      )}
    </div>
  );
}