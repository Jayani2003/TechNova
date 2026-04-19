import { useState } from "react";
import { useNavigate } from "react-router";
import { MessageCircle } from "lucide-react";
import { useAuth } from "../../../../context/AuthContext.jsx";
import { useMessages } from "../../../../context/MessagesContext.jsx";
import MyMessageList from "./MyMessageList";
import MyMessageThread from "./MyMessageThread";
import MyMessageEmpty from "./MyMessageEmpty";

function MyMessages() {
  const { user } = useAuth();
  const { messages, addReply } = useMessages();
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(null);

  // ── Guest Protection ──
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800 mb-2">Please log in</h3>
          <p className="text-slate-500 text-sm mb-6">
            You need to be logged in to view your messages.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Filter only this user's messages
  const userMessages = messages.filter((m) => m.customerId === user.email);
  const selectedMessage = userMessages.find((m) => m.id === selectedId) || null;

  const handleSendFollowUp = (messageId, text) => {
    addReply(messageId, {
      from: "customer",
      fromName: user.name || user.email,
      message: text,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Page Header */}
      <div className="text-center py-10 px-4">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">My Messages</h1>
        <p className="text-slate-500 text-sm">
          View your conversations with Ceylon Best Tours support
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        {userMessages.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
            <MyMessageEmpty navigate={navigate} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <MyMessageList
              messages={userMessages}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
            <MyMessageThread
              message={selectedMessage}
              onSendFollowUp={handleSendFollowUp}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default MyMessages;
