import "../styles/messages.css";

function MessageIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.5 8.5 0 0 1-3.6-.8L4 20l1.7-3.5A7.4 7.4 0 0 1 4.5 12 7.5 7.5 0 1 1 20 11.5Z" />
    </svg>
  );
}

export default function Messages() {
  return (
    <div className="messages-page">
      <div className="messages-layout">
        <aside className="messages-list">
          <div className="messages-list-header">
            <h1>Messages</h1>
          </div>

          <div className="messages-list-empty">
            <div className="messages-small-icon">
              <MessageIcon />
            </div>

            <h2>No messages yet</h2>

            <p>
              Start a conversation from someone's profile.
            </p>
          </div>
        </aside>

        <main className="messages-conversation">
          <div className="messages-conversation-empty">
            <div className="messages-large-icon">
              <MessageIcon />
            </div>

            <h2>Select a conversation</h2>

            <p>
              Choose a conversation from the list, or start a new one
              from someone's profile.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}