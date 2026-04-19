import { createContext, useContext, useState, useEffect } from "react";
 
const MessagesContext = createContext();
 
const STORAGE_KEY = "lankawheels_messages";
 
// Initial seed data so the admin panel isn't empty on first load
const initialMessages = [
  {
    id: "msg001",
    customerId: "john@example.com",
    customerName: "John Smith",
    customerEmail: "john@example.com",
    customerPhone: "",
    subject: "Question about rental rates",
    message: "Hi, I would like to know the rental rates for a week-long trip around Sri Lanka.",
    status: "replied",
    readByAdmin: true,
    createdAt: "2026-03-05",
    replies: [
      {
        id: "r001",
        from: "customer",
        fromName: "John Smith",
        message: "Hi, I would like to know the rental rates for a week-long trip around Sri Lanka.",
        timestamp: "2026-03-05 09:00",
      },
      {
        id: "r002",
        from: "admin",
        fromName: "Lanka Wheels Support",
        message: "Thank you for contacting us! Our weekly rates start from $280 for economy vehicles. Would you like a detailed quote?",
        timestamp: "2026-03-05 14:30",
      },
      {
        id: "r003",
        from: "customer",
        fromName: "John Smith",
        message: "Yes, please! I need a vehicle for 7 days starting from March 15th.",
        timestamp: "2026-03-06 09:15",
      },
    ],
  },
];
 
// ── Load from localStorage or fall back to seed data ──────────────────────────
const loadMessages = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error("Failed to load messages from localStorage:", e);
  }
  return initialMessages;
};
 
// ── Save to localStorage ───────────────────────────────────────────────────────
const saveMessages = (messages) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch (e) {
    console.error("Failed to save messages to localStorage:", e);
  }
};
 
export const MessagesProvider = ({ children }) => {
  const [messages, setMessages] = useState(loadMessages);
 
  // ── Sync to localStorage whenever messages change ──
  useEffect(() => {
    saveMessages(messages);
  }, [messages]);
 
  // ── Called from ContactForm when a customer submits a message ──
  const addMessage = ({ customerId, customerName, customerEmail, customerPhone, subject, message }) => {
    const newMessage = {
      id: `msg${Date.now()}`,
      customerId,
      customerName,
      customerEmail,
      customerPhone,
      subject,
      message,
      status: "new",
      readByAdmin: false,
      createdAt: new Date().toISOString().split("T")[0],
      replies: [
        {
          id: `r${Date.now()}`,
          from: "customer",
          fromName: customerName,
          message,
          timestamp: new Date().toLocaleString(),
        },
      ],
    };
    setMessages((prev) => [newMessage, ...prev]);
  };
 
  // ── Called when admin or customer sends a reply ──
  const addReply = (messageId, { from, fromName, message }) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              status: from === "admin" ? "replied" : "new",
              replies: [
                ...msg.replies,
                {
                  id: `r${Date.now()}`,
                  from,
                  fromName,
                  message,
                  timestamp: new Date().toLocaleString(),
                },
              ],
            }
          : msg
      )
    );
  };
 
  // ── Called from AdminDashboard to update message status ──
  const updateMessageStatus = (messageId, status) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, status } : msg
      )
    );
  };
 
  // ── Called from AdminDashboard to mark a message as read ──
  const markMessageAsReadByAdmin = (messageId) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? { ...msg, readByAdmin: true, status: msg.status === "new" ? "read" : msg.status }
          : msg
      )
    );
  };
 
  // ── Returns count of unread messages for admin badge ──
  const getAdminNotificationCount = () =>
    messages.filter((msg) => !msg.readByAdmin).length;
 
  return (
    <MessagesContext.Provider
      value={{
        messages,
        addMessage,
        addReply,
        updateMessageStatus,
        markMessageAsReadByAdmin,
        getAdminNotificationCount,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
};
 
export const useMessages = () => {
  const context = useContext(MessagesContext);
  if (!context) {
    throw new Error("useMessages must be used within a MessagesProvider");
  }
  return context;
};
 