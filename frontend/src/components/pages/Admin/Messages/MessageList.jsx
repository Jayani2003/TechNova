import { MessageCircle, Bell } from "lucide-react";

const MessageList = ({ messages, selectedId, adminNotificationCount, getStatusColor, onSelect }) => (
  <div className="lg:col-span-1 overflow-y-auto">
    {/* Sidebar Header */}
    <div className="p-4 border-b bg-gray-50">
      <h3 className="font-semibold flex items-center gap-2">
        <MessageCircle className="w-5 h-5" />
        Customer Messages ({messages.length})
      </h3>
      {adminNotificationCount > 0 && (
        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
          <Bell className="w-3 h-3" />
          {adminNotificationCount}{" "}
          {adminNotificationCount === 1 ? "message needs" : "messages need"} your attention
        </p>
      )}
    </div>

    {/* Customer List */}
    <div className="divide-y">
      {messages.map((message) => {
        const lastReply = message.replies?.[message.replies.length - 1];
        const needsAttention =
          (message.status === "new" && !message.readByAdmin) ||
          (lastReply?.from === "customer" && !lastReply?.readByAdmin);
        const isSelected = selectedId === message.id;

        return (
          <button
            key={message.id}
            onClick={() => onSelect(message.id)}
            className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
              isSelected ? "bg-blue-50 border-l-4 border-blue-600" : ""
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold truncate">{message.customerName}</h4>
                <p className="text-xs text-gray-600 truncate">{message.customerEmail}</p>
              </div>
              {needsAttention && (
                <span className="flex items-center gap-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full ml-2">
                  <Bell className="w-3 h-3" />
                  New
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mb-1">Subject: {message.subject}</p>
            <p className="text-xs text-gray-700 line-clamp-2">{message.message}</p>
            <div className="flex items-center justify-between mt-2">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(message.status)}`}>
                {message.status}
              </span>
              <span className="text-xs text-gray-500">{message.createdAt}</span>
            </div>
          </button>
        );
      })}
    </div>
  </div>
);

export default MessageList;
