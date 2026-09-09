import { useState } from "react";
import { api } from "../api.js";
import "../styles/social.css";

const TABS = [
  "For You",
  "Following",
  "Top",
  "Latest",
];

function getInitials(name = "User") {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U"
  );
}

function MessageIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 2L11 13" />
      <path d="M22 2l-7 20-4-9-9-4 20-7Z" />
    </svg>
  );
}

function CommentItem({
  comment,
  postId,
  currentUser,
  onUpdated,
  onReply,
}) {
  const [replyOpen, setReplyOpen] =
    useState(false);

  const [replyText, setReplyText] =
    useState("");

  const authorName =
    comment.user?.displayName ||
    "OmniMarketX User";

  const authorHandle =
    comment.user?.username
      ? `@${comment.user.username}`
      : "@user";

  async function toggleLike() {
    try {
      const updated =
        await api.likeComment(
          postId,
          comment._id
        );

      onUpdated(updated);
    } catch (error) {
      console.error(
        "Comment like error:",
        error
      );
    }
  }

  async function submitReply() {
    const cleanReply =
      replyText.trim();

    if (!cleanReply) return;

    try {
      const updated =
        await api.createComment(
          postId,
          {
            text: cleanReply,
            parentComment:
              comment._id,
          }
        );

      setReplyText("");
      setReplyOpen(false);

      onReply(updated);
    } catch (error) {
      console.error(
        "Reply error:",
        error
      );
    }
  }

  async function deleteComment() {
    const confirmed =
      window.confirm(
        "Delete this comment?"
      );

    if (!confirmed) return;

    try {
      const updated =
        await api.deleteComment(
          postId,
          comment._id
        );

      onUpdated(updated);
    } catch (error) {
      console.error(
        "Delete comment error:",
        error
      );
    }
  }

  return (
    <div className="social-comment">
      <div className="social-comment-main">
        <div className="social-comment-avatar">
          {getInitials(authorName)}
        </div>

        <div className="social-comment-content">
          <div className="social-comment-header">
            <strong>
              {authorName}
            </strong>

            <span>
              {authorHandle}
            </span>

            <span>
              ·
            </span>

            <span>
              {comment.createdAt
                ? new Date(
                    comment.createdAt
                  ).toLocaleDateString()
                : "Today"}
            </span>
          </div>

          <div className="social-comment-text">
            {comment.text}
          </div>

          <div className="social-comment-actions">
            <button
              type="button"
              className={
                comment.liked
                  ? "comment-liked"
                  : ""
              }
              onClick={toggleLike}
            >
              {comment.liked
                ? "❤️"
                : "🤍"}{" "}
              {comment.likeCount || 0}
            </button>

            <button
              type="button"
              onClick={() =>
                setReplyOpen(
                  (current) => !current
                )
              }
            >
              Reply
            </button>

            {currentUser?._id ===
              comment.user?._id && (
              <button
                type="button"
                className="comment-delete"
                onClick={
                  deleteComment
                }
              >
                Delete
              </button>
            )}
          </div>

          {replyOpen && (
            <div className="social-reply-box">
              <input
                value={replyText}
                onChange={(event) =>
                  setReplyText(
                    event.target.value
                  )
                }
                onKeyDown={(event) => {
                  if (
                    event.key ===
                    "Enter"
                  ) {
                    submitReply();
                  }
                }}
                placeholder="Write a reply..."
                autoFocus
              />

              <button
                type="button"
                onClick={
                  submitReply
                }
              >
                Reply
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Social({
  posts = [],
  refreshPosts,
  user,
  onCreatePost,
}) {
  const [tab, setTab] =
    useState("For You");

  const [text, setText] =
    useState("");

  const [openComments, setOpenComments] =
    useState({});

  const [toast, setToast] =
    useState("");

  function showToast(message) {
    setToast(message);

    window.clearTimeout(
      showToast.timeout
    );

    showToast.timeout =
      window.setTimeout(() => {
        setToast("");
      }, 1800);
  }

  async function submitPost() {
    const cleanText =
      text.trim();

    if (!cleanText) {
      showToast(
        "Write something first."
      );
      return;
    }

    try {
      if (onCreatePost) {
        await onCreatePost(
          cleanText
        );
      } else {
        await api.createPost({
          content: cleanText,
        });

        if (refreshPosts) {
          await refreshPosts();
        }
      }

      setText("");

      showToast(
        "Post published."
      );
    } catch (error) {
      console.error(
        "Create post error:",
        error
      );

      showToast(
        error?.message ||
          "Couldn't publish your post."
      );
    }
  }

  async function likePost(post) {
    try {
      await api.likePost(
        post._id
      );

      if (refreshPosts) {
        await refreshPosts();
      }
    } catch (error) {
      console.error(
        "Like error:",
        error
      );

      showToast(
        "Couldn't update the like."
      );
    }
  }

  function toggleComments(postId) {
    setOpenComments(
      (current) => ({
        ...current,
        [postId]:
          !current[postId],
      })
    );
  }

  async function addComment(
    postId,
    commentText
  ) {
    const cleanText =
      commentText.trim();

    if (!cleanText) {
      return;
    }

    try {
      await api.createComment(
        postId,
        {
          text: cleanText,
        }
      );

      if (refreshPosts) {
        await refreshPosts();
      }
    } catch (error) {
      console.error(
        "Comment error:",
        error
      );

      showToast(
        error?.message ||
          "Couldn't add comment."
      );
    }
  }

  async function sharePost(post) {
    const textToShare =
      `${post.authorName}: ${post.text}`;

    try {
      if (
        navigator.clipboard
      ) {
        await navigator.clipboard.writeText(
          textToShare
        );

        showToast(
          "Post copied to clipboard."
        );
      }
    } catch {
      showToast(
        "Couldn't copy the post."
      );
    }
  }

  let shownPosts = [...posts];

  if (tab === "Top") {
    shownPosts.sort(
      (a, b) =>
        Number(b.likes || 0) -
        Number(a.likes || 0)
    );
  }

  if (tab === "Latest") {
    shownPosts.sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    );
  }

  return (
    <div className="social-page">
      <h1 className="page-title">
        Social
      </h1>

      <p className="page-sub">
        What predictors are saying and
        betting on right now.
      </p>

      <div className="feed-tabs">
        {TABS.map((item) => (
          <button
            key={item}
            type="button"
            className={
              "chip" +
              (tab === item
                ? " active"
                : "")
            }
            onClick={() =>
              setTab(item)
            }
          >
            {item}
          </button>
        ))}
      </div>

      <div className="layout-grid">
        <div>
          <div className="post-card social-composer-card">
            <div className="composer">
              <div className="avatar">
                {getInitials(
                  user?.displayName
                )}
              </div>

              <textarea
                className="social-composer-input"
                value={text}
                onChange={(event) =>
                  setText(
                    event.target.value
                  )
                }
                placeholder="What's on your mind?"
                maxLength={2000}
              />
            </div>

            <div className="composer-actions">
              <button
                type="button"
                onClick={() =>
                  showToast(
                    "Market attachment coming soon."
                  )
                }
              >
                📊 Market
              </button>

              <button
                type="button"
                onClick={() =>
                  showToast(
                    "Image attachment coming soon."
                  )
                }
              >
                🖼 Image
              </button>

              <button
                type="button"
                onClick={() =>
                  showToast(
                    "Polls are coming soon."
                  )
                }
              >
                📈 Poll
              </button>

              <button
                type="button"
                className="post-btn"
                onClick={
                  submitPost
                }
              >
                Post
              </button>
            </div>
          </div>

          {shownPosts.map((post) => {
            const authorName =
              post.authorName ||
              post.user?.displayName ||
              "OmniMarketX User";

            const comments =
              post.comments || [];

            const isCommentsOpen =
              !!openComments[
                post._id
              ];

            return (
              <article
                className="post-card"
                key={post._id}
              >
                <div className="post-head">
                  <div className="avatar">
                    {getInitials(
                      authorName
                    )}
                  </div>

                  <div>
                    <div className="name">
                      {authorName}
                    </div>

                    <div className="handle">
                      {post.authorHandle ||
                        `@${
                          post.user
                            ?.username ||
                          "user"
                        }`}
                      {" · "}
                      {post.createdAt
                        ? new Date(
                            post.createdAt
                          ).toLocaleDateString()
                        : "Today"}
                    </div>
                  </div>
                </div>

                <div className="post-body">
                  {post.text ||
                    post.content}
                </div>

                <div className="post-actions">
                  <button
                    type="button"
                    className={
                      "social-action" +
                      (post.liked
                        ? " active-like"
                        : "")
                    }
                    onClick={() =>
                      likePost(post)
                    }
                  >
                    {post.liked
                      ? "❤️"
                      : "🤍"}{" "}
                    {post.likes || 0}
                  </button>

                  <button
                    type="button"
                    className={
                      "social-action" +
                      (isCommentsOpen
                        ? " active-action"
                        : "")
                    }
                    onClick={() =>
                      toggleComments(
                        post._id
                      )
                    }
                  >
                    <MessageIcon />

                    <span>
                      {comments.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    className="social-action"
                    onClick={() =>
                      showToast(
                        "Repost coming soon."
                      )
                    }
                  >
                    🔁
                  </button>

                  <button
                    type="button"
                    className="social-action"
                    onClick={() =>
                      showToast(
                        "Saved to bookmarks."
                      )
                    }
                  >
                    🔖
                  </button>

                  <button
                    type="button"
                    className="social-action"
                    onClick={() =>
                      sharePost(post)
                    }
                  >
                    <SendIcon />
                  </button>
                </div>

                {isCommentsOpen && (
                  <div className="social-comments">
                    <div className="social-comments-header">
                      <strong>
                        Comments
                      </strong>

                      <span>
                        {comments.length}
                      </span>
                    </div>

                    <CommentComposer
                      onSubmit={(
                        commentText
                      ) =>
                        addComment(
                          post._id,
                          commentText
                        )
                      }
                    />

                    {comments.length ===
                      0 ? (
                      <div className="social-comments-empty">
                        No comments yet.
                        Be the first to
                        say something.
                      </div>
                    ) : (
                      <div className="social-comments-list">
                        {comments
                          .filter(
                            (comment) =>
                              !comment.parentComment
                          )
                          .map(
                            (
                              comment
                            ) => (
                              <div
                                key={
                                  comment._id
                                }
                              >
                                <CommentItem
                                  comment={
                                    comment
                                  }
                                  postId={
                                    post._id
                                  }
                                  currentUser={
                                    user
                                  }
                                  onUpdated={() =>
                                    refreshPosts?.()
                                  }
                                  onReply={() =>
                                    refreshPosts?.()
                                  }
                                />

                                {comments
                                  .filter(
                                    (
                                      reply
                                    ) =>
                                      reply.parentComment ===
                                      comment._id
                                  )
                                  .map(
                                    (
                                      reply
                                    ) => (
                                      <div
                                        className="social-comment-reply"
                                        key={
                                          reply._id
                                        }
                                      >
                                        <CommentItem
                                          comment={
                                            reply
                                          }
                                          postId={
                                            post._id
                                          }
                                          currentUser={
                                            user
                                          }
                                          onUpdated={() =>
                                            refreshPosts?.()
                                          }
                                          onReply={() =>
                                            refreshPosts?.()
                                          }
                                        />
                                      </div>
                                    )
                                  )}
                              </div>
                            )
                          )}
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}

          {shownPosts.length ===
            0 && (
            <div className="side-card">
              No posts yet. Be the first
              to share a prediction.
            </div>
          )}
        </div>

        <div>
          <div className="side-card">
            <div className="side-title">
              🔥 Trending Now
            </div>

            {[
              "#omnimarketx",
              "#futurefoundry",
              "#predictionmarket",
              "#fintech",
            ].map(
              (hashtag, index) => (
                <div
                  key={hashtag}
                  className="hashtag-row"
                >
                  <span className="h">
                    {hashtag}
                  </span>

                  <span className="n">
                    {
                      [9, 8, 5, 3][
                        index
                      ]
                    }{" "}
                    posts
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {toast && (
        <div className="social-toast">
          {toast}
        </div>
      )}
    </div>
  );
}

function CommentComposer({
  onSubmit,
}) {
  const [text, setText] =
    useState("");

  function submit() {
    const cleanText =
      text.trim();

    if (!cleanText) return;

    onSubmit(cleanText);
    setText("");
  }

  return (
    <div className="social-comment-composer">
      <div className="avatar">
        You
      </div>

      <input
        value={text}
        onChange={(event) =>
          setText(event.target.value)
        }
        onKeyDown={(event) => {
          if (
            event.key ===
            "Enter"
          ) {
            submit();
          }
        }}
        placeholder="Write a comment..."
        maxLength={1000}
      />

      <button
        type="button"
        onClick={submit}
        disabled={!text.trim()}
      >
        Comment
      </button>
    </div>
  );
}