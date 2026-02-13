export async function authLogin(name, password) {
    const url = `${import.meta.env.VITE_API_URL}/auth/login`;
  
    const res = await fetch(url, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, password }),
    });
  
    // mantém mesmo se vier vazio/não-json
    const text = await res.text();
    let data = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { raw: text };
    }
  
    if (!res.ok) {
      throw new Error(data?.error || `Falha ao autenticar (status ${res.status})`);
    }
  
    // esperado: { message: "authenticated", user: { id, name, is_seller } }
    return data;
  }