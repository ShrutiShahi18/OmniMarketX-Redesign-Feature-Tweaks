const BASE = "/api";

async function req(path, opts) {
  const res = await fetch(BASE + path, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  if (!res.ok) throw new Error((await res.json()).error || "Request failed");
  return res.json();
}

export const api = {
  getMe: () => req("/users/me"),
  resetWallet: (userId) => req(`/users/${userId}/reset`, { method: "POST" }),

  getMarkets: (category, sort) => {
    const p = new URLSearchParams();
    if (category) p.set("category", category);
    if (sort) p.set("sort", sort);
    return req(`/markets?${p.toString()}`);
  },
  getMarket: (id) => req(`/markets/${id}`),

  postTrade: (body) => req("/trades", { method: "POST", body: JSON.stringify(body) }),
  getHistory: (userId) => req(`/trades/history/${userId}`),
  getPositions: (userId) => req(`/trades/positions/${userId}`),

  getPosts: () => req("/posts"),
  createPost: (body) => req("/posts", { method: "POST", body: JSON.stringify(body) }),
  likePost: (id) => req(`/posts/${id}/like`, { method: "POST" }),
};
