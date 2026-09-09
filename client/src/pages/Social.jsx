import { useState } from "react";
import { api } from "../api.js";

const TABS = ["For You", "Following", "Top", "Latest"];

export default function Social({ posts, setPosts, user }) {
  const [tab, setTab] = useState("For You");
  const [text, setText] = useState("");

  async function submitPost() {
    if (!text.trim()) return;
    const post = await api.createPost({ userId: user._id, authorName: user.displayName, authorHandle: "@" + user.username, text });
    setPosts([post, ...posts]);
    setText("");
  }

  async function like(post) {
    const updated = await api.likePost(post._id);
    setPosts(posts.map((p) => (p._id === updated._id ? updated : p)));
  }

  return (
    <div>
      <h1 className="page-title">Social</h1>
      <p className="page-sub">What predictors are saying and betting on right now.</p>
      <div className="feed-tabs">
        {TABS.map((t) => <div key={t} className={"chip" + (tab === t ? " active" : "")} onClick={() => setTab(t)}>{t}</div>)}
      </div>
      <div className="layout-grid">
        <div>
          <div className="post-card">
            <div className="composer">
              <div className="avatar">SS</div>
              <div className="composer-box" contentEditable suppressContentEditableWarning onBlur={(e) => setText(e.target.textContent)} onInput={(e) => setText(e.target.textContent)}>
                What's on your mind?
              </div>
            </div>
            <div className="composer-actions"><span>📊 Market</span><span>🖼 Image</span><span>📈 Poll</span><span className="post-btn" onClick={submitPost}>Post</span></div>
          </div>
          {posts.map((p) => (
            <div className="post-card" key={p._id}>
              <div className="post-head"><div className="avatar">{p.authorName.split(" ").map((w) => w[0]).join("").slice(0, 2)}</div><div><div className="name">{p.authorName}</div><div className="handle">{p.authorHandle} · {new Date(p.createdAt).toLocaleDateString()}</div></div></div>
              <div className="post-body">{p.text}</div>
              <div className="post-actions">
                <span className="like-btn" onClick={() => like(p)}>{p.liked ? "❤️" : "🤍"} {p.likes}</span>
                <span>💬 0</span><span>🔁</span><span>🔖</span><span>↗</span>
              </div>
            </div>
          ))}
        </div>
        <div>
          <div className="side-card">
            <div className="side-title">🔥 Trending Now</div>
            {["#omnimarketx", "#futurefoundry", "#predictionmarket", "#fintech"].map((h, i) => (
              <div key={h} className="hashtag-row"><span className="h">{h}</span><span className="n">{[9, 8, 5, 3][i]} posts</span></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
