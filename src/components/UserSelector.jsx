import { useState } from "react";

export default function UserSelector({ value, onChange }) {
  const [local, setLocal] = useState(String(value));

  function submit(e) {
    e.preventDefault();
    const n = Number(local);
    if (!Number.isInteger(n) || n <= 0) return;
    onChange(n);
  }

  return (
    <form onSubmit={submit} style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <label>userId:</label>
      <input
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        style={{ width: 80 }}
        inputMode="numeric"
      />
      <button type="submit">Aplicar</button>
    </form>
  );
}