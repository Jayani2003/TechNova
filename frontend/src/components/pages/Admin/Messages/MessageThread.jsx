import { useState } from "react";
import { MessageCircle, Send } from "lucide-react";

// ─── Empty State ──────────────────────────────────────────────────────────────
const EmptyThread = () => (
  <div className="lg:col-span-2 flex-1 flex items-center justify-center text-center p-8">
    <div>
      <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-xl font-semibold mb-2 text-gray-700">
        Select a Customer
      </h3>
      <p className="text-gray-600">
        Choose a customer from the list to view and reply to their messages
      </p>
    </div>
  </div>
);

// ─── Message Thread ───────────────────────────────────────────────────────────
const MessageThread = ({ message, getStatusColor, onReply }) => {
  const [replyText, setReplyText] = useState("");

  if (!message) return <EmptyThread />;

  const handleSend = () => {
    if (!replyText.trim()) return;
    onReply(message.id, {
      from: "admin",
      fromName: "Lanka Wheels Support",
      message: replyText,
    });
    setReplyText("");
  };

  const statusLabel = message.status.charAt(0).toUpperCase() + message.status.slice(1);

  return (
    <div className="lg:col-span-2 flex flex-col">
      {/* Conversation Header */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">{message.customerName}</h3>
            <p className="text-sm text-gray-600">{message.customerEmail}</p>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(message.status)}`}>
            {statusLabel}
          </span>
        </div>
        <div className="mt-2">
          <p className="text-sm text-gray-700">
            <strong>Subject:</strong> {message.subject}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Message ID: {message.id} • Sent: {message.createdAt}
          </p>
        </div>
      </div>

      {/* Conversation Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {message.replies && message.replies.map((reply) => (
          <div
            key={reply.id}
            className={`flex ${reply.from === "admin" ? "justify-end" : "justify-start"}`}
          >
            <div className="max-w-[80%]">
              <div className={`rounded-lg shadow p-4 ${
                reply.from === "admin" ? "bg-blue-600 text-white" : "bg-white border"
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    reply.from === "admin" ? "bg-blue-800 text-white" : "bg-blue-600 text-white"
                  }`}>
                    {reply.fromName.charAt(0)}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${reply.from === "admin" ? "text-white" : ""}`}>
                      {reply.fromName}
                    </p>
                    <p className={`text-xs ${reply.from === "admin" ? "text-blue-100" : "text-gray-500"}`}>
                      {reply.timestamp}
                    </p>
                  </div>
                </div>
                <p className={`text-sm ${reply.from === "admin" ? "text-white" : "text-gray-700"}`}>
                  {reply.message}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reply Input */}
      <div className="p-4 border-t bg-white">
        <label className="text-sm font-semibold mb-2 block">Send Reply:</label>
        <div className="flex gap-2">
          <textarea
            placeholder="Type your reply here..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            rows={3}
            className="flex-1 p-3 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none"
          />
          <button
            onClick={handleSend}
            disabled={!replyText.trim()}
            className="self-end flex items-center gap-2 bg-gray-900 text-white px-4 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageThread;
