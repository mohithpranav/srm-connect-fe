import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { useAuth } from "./AuthContext";

interface Chat {
  id: number;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    profilePic?: string;
    isOnline: boolean;
    lastSeen?: string;
  };
  lastMessage?: {
    content: string;
    createdAt: string;
    unreadCount: number;
  };
}

interface ChatContextType {
  chats: Chat[];
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
  selectedChat: Chat | null;
  setSelectedChat: React.Dispatch<React.SetStateAction<Chat | null>>;
  wsConnected: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const { user } = useAuth();
  const wsRef = useRef<WebSocket | null>(null);
  const [wsConnected, setWsConnected] = useState(false);

  // WebSocket connection
  useEffect(() => {
    if (!user?.id) return;

    console.log("🔌 Initializing WebSocket connection...");
    const ws = new WebSocket("ws://localhost:3000");
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("🟢 WebSocket Connected");
      setWsConnected(true);
      ws.send(
        JSON.stringify({
          type: "user-online",
          userId: user.id,
        })
      );
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📩 Received WebSocket message:", data);

        switch (data.type) {
          case "new-message":
            handleNewMessage(data.message);
            break;
          case "user-status-changed":
            handleUserStatusChange(data);
            break;
          case "connection-success":
            console.log("✅ Connection confirmed for user:", data.userId);
            break;
          default:
            console.log("❓ Unknown message type:", data.type);
        }
      } catch (error) {
        console.error("❌ Error processing WebSocket message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("❌ WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("🔴 WebSocket Disconnected");
      setWsConnected(false);
      // Attempt to reconnect after 3 seconds
      setTimeout(() => {
        console.log("🔄 Attempting to reconnect...");
      }, 3000);
    };

    return () => {
      console.log("🔌 Cleaning up WebSocket connection");
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [user?.id]);

  // Fetch initial chats
  useEffect(() => {
    const fetchChats = async () => {
      if (!user?.id) return;

      try {
        console.log("📥 Fetching chats for user:", user.id);
        const response = await fetch(`/api/chats/user/${user.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch chats");

        const data = await response.json();
        console.log("📦 Received chats:", data);
        setChats(data.chats);
      } catch (error) {
        console.error("❌ Error fetching chats:", error);
      }
    };

    if (wsConnected) {
      fetchChats();
    }
  }, [user?.id, wsConnected]);

  const handleNewMessage = (message: any) => {
    console.log("📨 Handling new message:", message);

    setChats((prevChats) => {
      const chatIndex = prevChats.findIndex(
        (chat) =>
          chat.user.id ===
          (message.senderId === user?.id
            ? message.receiverId
            : message.senderId)
      );

      const updatedChats = [...prevChats];
      if (chatIndex === -1) {
        // Create new chat if it doesn't exist
        const newChat: Chat = {
          id: Date.now(),
          user: {
            id:
              message.senderId === user?.id
                ? message.receiverId
                : message.senderId,
            firstName: message.sender?.firstName || "",
            lastName: message.sender?.lastName || "",
            profilePic: message.sender?.profilePic,
            isOnline: false,
          },
          lastMessage: {
            content: message.content,
            createdAt: message.createdAt,
            unreadCount: message.senderId === user?.id ? 0 : 1,
          },
        };
        updatedChats.unshift(newChat);
      } else {
        // Update existing chat
        updatedChats[chatIndex] = {
          ...updatedChats[chatIndex],
          lastMessage: {
            content: message.content,
            createdAt: message.createdAt,
            unreadCount:
              message.senderId === user?.id
                ? 0
                : (updatedChats[chatIndex].lastMessage?.unreadCount || 0) + 1,
          },
        };
      }

      // Sort chats by last message time
      return updatedChats.sort((a, b) => {
        if (!a.lastMessage) return 1;
        if (!b.lastMessage) return -1;
        return (
          new Date(b.lastMessage.createdAt).getTime() -
          new Date(a.lastMessage.createdAt).getTime()
        );
      });
    });
  };

  const handleUserStatusChange = (data: any) => {
    console.log("👤 User status changed:", data);
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.user.id === data.userId
          ? { ...chat, user: { ...chat.user, isOnline: data.isOnline } }
          : chat
      )
    );
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        wsConnected,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
