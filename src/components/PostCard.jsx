export default function PostCard({ post }) {
  const productName = post.product_name ?? post.product?.product_name ?? "-";
  const productId = post.product_id ?? post.product?.product_id ?? "-";

  const createdAt = post.created_at
    ? new Date(post.created_at).toLocaleString()
    : "";

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
      <div>
        <strong>{productName}</strong> (product_id: {productId})
      </div>

      <div>Preço: R$ {Number(post.price ?? 0).toFixed(2)}</div>
      <div>Categoria: {post.category}</div>

      <div>Promo: {post.has_promo ? "Sim" : "Não"}</div>

      {post.has_promo && post.discount != null && (
        <div>Desconto: {(Number(post.discount) * 100).toFixed(0)}%</div>
      )}

      {createdAt && (
        <div style={{ marginTop: 8, fontSize: 12, color: "#888" }}>
          {createdAt}
        </div>
      )}
    </div>
  );
}