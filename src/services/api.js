const BASE_URL = "/api";

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;

  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(url, {
    cache: "no-store",
    ...options,
    headers,
  });

  if (res.status === 204) return null;

  const contentType = res.headers.get("content-type") || "";
  const text = await res.text();

  let data = null;
  if (text) {
    if (contentType.includes("application/json")) {
      try {
        data = JSON.parse(text);
      } catch {
        data = { raw: text };
      }
    } else {
      data = { raw: text };
    }
  }

  if (!res.ok) {
    const message = data?.error || data?.raw || `Erro HTTP ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

async function requestWithStatus(path, options = {}) {
  const url = `${BASE_URL}${path}`;

  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(url, {
    cache: "no-store",
    ...options,
    headers,
  });

  if (res.status === 204) return { data: null, status: 204 };

  const contentType = res.headers.get("content-type") || "";
  const text = await res.text();

  let data = null;
  if (text) {
    if (contentType.includes("application/json")) {
      try {
        data = JSON.parse(text);
      } catch {
        data = { raw: text };
      }
    } else {
      data = { raw: text };
    }
  }

  if (!res.ok) {
    const message = data?.error || data?.raw || `Erro HTTP ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return { data, status: res.status };
}

export const api = {
  // Users
  getUsers: () => request(`/users`),

  createUser: (payload) =>
    requestWithStatus(`/users`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

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

  // Promos
  getPromosByUser: (userId) =>
    request(`/products/promo-pub/list?user_id=${userId}`),
};