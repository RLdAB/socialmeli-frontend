export default function PostCard({ post }) {
    return (
      <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
        <div><strong>{post.product_name}</strong> (product_id: {post.product_id})</div>
        <div>Preço: R$ {Number(post.price).toFixed(2)}</div>
        <div>Categoria: {post.category}</div>
        <div>Promo: {post.has_promo ? "Sim" : "Não"}</div>
        {post.has_promo && post.discount != null && (
          <div>Desconto: {(Number(post.discount) * 100).toFixed(0)}%</div>
        )}
        <div style={{ marginTop: 8, color: "#666" }}>
          {post.content}
        </div>
        <div style={{ marginTop: 8, fontSize: 12, color: "#888" }}>
          {post.created_at ? new Date(post.created_at).toLocaleString() : null}
        </div>
      </div>
    );
  }