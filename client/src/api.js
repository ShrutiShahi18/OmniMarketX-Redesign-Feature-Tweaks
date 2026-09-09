import { auth } from "./firebase";

const BASE = `${import.meta.env.VITE_API_URL}/api`;

async function req(path, opts = {}) {
  const firebaseUser = auth.currentUser;

  let token = null;

  if (firebaseUser) {
    token =
      await firebaseUser.getIdToken();
  }

  const headers = {
    "Content-Type": "application/json",
    ...(opts.headers || {}),
  };

  if (token) {
    headers.Authorization =
      `Bearer ${token}`;
  }

  const res = await fetch(
    BASE + path,
    {
      ...opts,
      headers,
    }
  );

  if (!res.ok) {
    let errorMessage =
      "Request failed";

    try {
      const data =
        await res.json();

      errorMessage =
        data.error ||
        errorMessage;
    } catch {
      // Keep default error.
    }

    throw new Error(
      errorMessage
    );
  }

  return res.json();
}

export const api = {
  getMe: () =>
    req("/users/me"),

  updateMe: (body) =>
    req("/users/me", {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  resetWallet: () =>
    req("/users/reset", {
      method: "POST",
    }),

  getMarkets: (
    category,
    sort
  ) => {
    const p =
      new URLSearchParams();

    if (category) {
      p.set(
        "category",
        category
      );
    }

    if (sort) {
      p.set("sort", sort);
    }

    const query =
      p.toString();

    return req(
      `/markets${
        query
          ? `?${query}`
          : ""
      }`
    );
  },

  getMarket: (id) =>
    req(`/markets/${id}`),

  postTrade: (body) =>
    req("/trades", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  getHistory: () =>
    req("/trades/history"),

  getPositions: () =>
    req("/trades/positions"),

  getPosts: () =>
    req("/posts"),

  createPost: (body) =>
    req("/posts", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  likePost: (id) =>
    req(`/posts/${id}/like`, {
      method: "POST",
    }),

  createComment: (
    postId,
    body
  ) =>
    req(
      `/posts/${postId}/comments`,
      {
        method: "POST",
        body: JSON.stringify(body),
      }
    ),

  likeComment: (
    postId,
    commentId
  ) =>
    req(
      `/posts/${postId}/comments/${commentId}/like`,
      {
        method: "POST",
      }
    ),

  deleteComment: (
    postId,
    commentId
  ) =>
    req(
      `/posts/${postId}/comments/${commentId}`,
      {
        method: "DELETE",
      }
    ),
};