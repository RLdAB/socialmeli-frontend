export default function Modal({ open, title, onClose, children }) {
    if (!open) return null;
  
    return (
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
          zIndex: 9999,
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "min(520px, 100%)",
            background: "#fff",
            borderRadius: 10,
            border: "1px solid #ddd",
            padding: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <h2 style={{ margin: 0, fontSize: 18 }}>{title}</h2>
            <button onClick={onClose} aria-label="Fechar">X</button>
          </div>
  
          <div style={{ marginTop: 12 }}>{children}</div>
        </div>
      </div>
    );
  }