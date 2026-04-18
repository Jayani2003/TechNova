import { ChevronRight } from "lucide-react";

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const styles = {
    new: "bg-yellow-100 text-yellow-800",
    read: "bg-slate-100 text-slate-600",
    replied: "bg-emerald-100 text-emerald-700",
  };
  const labels = {
    new: "Pending",
    read: "Read",
    replied: "Replied",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${styles[status] || styles.read}`}>
      {labels[status] || "Read"}
    </span>
  );
};

// ─── Single Message Item ──────────────────────────────────────────────────────
const MessageItem = ({ message, isSelected, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full text-left p-4 hover:bg-slate-50 transition-colors rounded-xl border mb-2 ${
      isSelected ? "border-slate-900 bg-slate-50" : "border-slate-100 bg-white"
    }`}
  >
    <div className="flex items-start justify-between mb-1">
      <p className="font-semibold text-slate-800 text-sm truncate flex-1">
        {message.subject}
      </p>
      <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0 ml-2" />
    </div>
    <p className="text-xs text-slate-500 line-clamp-2 mb-2">{message.message}</p>
    <div className="flex items-center justify-between">
      <StatusBadge status={message.status} />
      <span className="text-xs text-slate-400">{message.createdAt}</span>
    </div>
  </button>
);

// ─── Message List ─────────────────────────────────────────────────────────────
const MyMessageList = ({ messages, selectedId, onSelect }) => (
  <div className="lg:col-span-1">
    <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
      Your Conversations ({messages.length})
    </h2>
    {messages.map((message) => (
      <MessageItem
        key={message.id}
        message={message}
        isSelected={selectedId === message.id}
        onClick={() => onSelect(message.id)}
      />
    ))}
  </div>
);

export default MyMessageList;
