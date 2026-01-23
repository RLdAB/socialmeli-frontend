const BASE_URL = "http://localhost:8080";

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const res = await fetch(url, { ...options, headers });

  // 204 no content
  if (res.status === 204) return null;

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const message = data?.error || `Erro HTTP ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

export const api = {
  // Followers / Followed
  getFollowersList: (userId, order = "name_asc") =>
    request(`/users/${userId}/followers/list?order=${order}`),

  getFollowedList: (userId, order = "name_asc") =>
    request(`/users/${userId}/followed/list?order=${order}`),

  // Feed
  getFeed: (userId, { order = "date_desc", weeks = 2 } = {}) =>
    request(`/products/followed/${userId}/list?order=${order}&weeks=${weeks}`),

  // Publish
  publishProduct: (payload) =>
    request(`/products/publish`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // Promos (conforme spec do desafio)
  getPromosByUser: (userId) =>
    request(`/products/promo-pub/list?user_id=${userId}`),
};