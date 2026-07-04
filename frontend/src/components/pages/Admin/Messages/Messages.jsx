import { useState } from "react";
import { MessageCircle, RefreshCw } from "lucide-react";
import { useMessages } from "../../../../context/useMessages.js";
import MessageList from "./MessageList";
import MessageThread from "./MessageThread";

const getStatusColor = (status) => {
  switch (status) {
    case "replied": return "bg-blue-100 text-blue-800";
    case "read":    return "bg-green-100 text-green-800";
    case "new":     return "bg-yellow-100 text-yellow-800";
    default:        return "bg-gray-100 text-gray-800";
  }
};

const Messages = () => {
  const { messages, loading, addReply, markMessageAsReadByAdmin, getAdminNotificationCount, refetch } = useMessages();
  const [selectedId, setSelectedId] = useState(null);

  const adminNotificationCount = getAdminNotificationCount();
  const selectedMessage = messages.find((m) => m.id === selectedId) || null;

  const handleSelect = (id) => {
    setSelectedId(id);
    markMessageAsReadByAdmin(id);
  };

  if (loading) return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center py-20">
      <RefreshCw className="w-6 h-6 text-slate-400 animate-spin" />
    </div>
  );

  if (messages.length === 0) return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm text-center py-16">
      <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-xl font-semibold mb-2">No Messages Yet</h3>
      <p className="text-gray-600 text-sm">Customer messages from the Contact Us form will appear here.</p>
    </div>
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-3 divide-x h-[600px]">
        <MessageList
          messages={messages}
          selectedId={selectedId}
          adminNotificationCount={adminNotificationCount}
          getStatusColor={getStatusColor}
          onSelect={handleSelect}
          onRefresh={refetch}
        />
        <MessageThread
          message={selectedMessage}
          getStatusColor={getStatusColor}
          onReply={addReply}
        />
      </div>
    </div>
  );
};

export default Messages;
