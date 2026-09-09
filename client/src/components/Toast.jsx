export default function Toast({ message }) {
  return (
    <div className={"toast-wrap" + (message ? " show" : "")}>
      <div className="toast">
        <div className="toast-icon">✓</div>
        <div>
          <div className="toast-title">Posted to feed</div>
          <div className="toast-preview">{message && message.length > 60 ? message.slice(0, 60) + "…" : message}</div>
        </div>
      </div>
    </div>
  );
}
