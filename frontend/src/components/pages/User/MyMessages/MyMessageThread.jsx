import { useState } from "react";
import { MessageCircle, Send } from "lucide-react";

// ─── Status Badge (reused here for thread header) ─────────────────────────────
const StatusBadge = ({ status }) => {
  const styles = {
    new: "bg-yellow-100 text-yellow-800",
    read: "bg-slate-100 text-slate-600",
    replied: "bg-emerald-100 text-emerald-700",
  };
  const labels = { new: "Pending", read: "Read", replied: "Replied" };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${styles[status] || styles.read}`}>
      {labels[status] || "Read"}
    </span>
  );
};

// ─── No Selection Placeholder ─────────────────────────────────────────────────
const NoSelection = () => (
  <div className="h-[550px] flex items-center justify-center text-center p-8 bg-white rounded-2xl border border-slate-100 shadow-sm">
    <div>
      <MessageCircle className="w-12 h-12 text-slate-200 mx-auto mb-3" />
      <p className="text-slate-400 text-sm">
        Select a conversation to view messages
      </p>
    </div>
  </div>
);

// ─── Conversation Thread ──────────────────────────────────────────────────────
const MyMessageThread = ({ message, onSendFollowUp }) => {
  const [followUp, setFollowUp] = useState("");

  if (!message) return <NoSelection />;

  const handleSend = () => {
    if (!followUp.trim()) return;
    onSendFollowUp(message.id, followUp);
    setFollowUp("");
  };

  return (
    <div className="lg:col-span-2">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm h-[550px] flex flex-col">
        {/* Thread Header */}
        <div className="p-4 border-b border-slate-100 rounded-t-2xl">
          <p className="font-bold text-slate-800">{message.subject}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-slate-400">Sent: {message.createdAt}</span>
            <StatusBadge status={message.status} />
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {message.replies && message.replies.map((reply) => {
            const isAdmin = reply.from === "admin";
            return (
              <div
                key={reply.id}
                className={`flex ${isAdmin ? "justify-start" : "justify-end"}`}
              >
                <div className="max-w-[80%]">
                  <div className={`rounded-2xl px-4 py-3 ${
                    isAdmin
                      ? "bg-white border border-slate-100 shadow-sm"
                      : "bg-slate-900 text-white"
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        isAdmin ? "bg-blue-100 text-blue-700" : "bg-slate-700 text-white"
                      }`}>
                        {reply.fromName.charAt(0)}
                      </div>
                      <p className={`text-xs font-semibold ${isAdmin ? "text-slate-700" : "text-slate-300"}`}>
                        {reply.fromName}
                      </p>
                      <p className="text-xs text-slate-400">{reply.timestamp}</p>
                    </div>
                    <p className={`text-sm ${isAdmin ? "text-slate-700" : "text-white"}`}>
                      {reply.message}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Follow-up Input */}
        <div className="p-4 border-t border-slate-100 rounded-b-2xl bg-white">
          <p className="text-xs font-semibold text-slate-600 mb-2">Send a follow-up:</p>
          <div className="flex gap-2">
            <textarea
              value={followUp}
              onChange={(e) => setFollowUp(e.target.value)}
              placeholder="Type your follow-up message..."
              rows={2}
              className="flex-1 p-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none text-sm resize-none"
            />
            <button
              onClick={handleSend}
              disabled={!followUp.trim()}
              className="self-end flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyMessageThread;
