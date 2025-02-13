import { useState, useEffect, useRef } from "react";
import {
  Search,
  Send,
  Phone,
  Video,
  MoreVertical,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLocation, useParams } from "react-router-dom";
import { studentService } from "../services/student.service";
import { useChat } from "../context/ChatContext";
import { toast } from "sonner";

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

interface Message {
  id: number;
  content: string;
  createdAt: string;
  senderId: number;
  receiverId: number;
  isRead: boolean;
  readAt?: string;
  sender?: {
    firstName: string;
    lastName: string;
    profilePic?: string;
  };
}

interface SearchResult {
  id: number;
  firstName: string;
  lastName: string;
  profilePic?: string;
}

export default function Chats() {
  const { user } = useAuth();
  const location = useLocation();
  const { chats, setChats, selectedChat, setSelectedChat } = useChat();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const wsRef = useRef<WebSocket | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [wsReady, setWsReady] = useState(false);
  const { userId } = useParams();

  // Initialize WebSocket connection
  useEffect(() => {
    if (!user?.id) return;

    const connectWebSocket = () => {
      const ws = new WebSocket("ws://localhost:3000");
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket Connected");
        setWsReady(true);
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
          console.log("Received message:", data);

          switch (data.type) {
            case "new-message":
              handleNewMessage(data.message);
              break;
            case "chat-history":
              setMessages(data.messages);
              break;
            case "user-status-changed":
              updateUserStatus(data);
              break;
            case "connection-success":
              console.log("Connection established successfully");
              break;
            default:
              console.log("Unknown message type:", data.type);
          }
        } catch (error) {
          console.error("Error processing message:", error);
        }
      };

      ws.onclose = () => {
        console.log("WebSocket Disconnected");
        setWsReady(false);
        // Attempt to reconnect after a delay
        setTimeout(connectWebSocket, 3000);
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        setWsReady(false);
      };
    };

    connectWebSocket();

    return () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
    };
  }, [user?.id]);

  // Handle incoming user from Directory
  useEffect(() => {
    if (userId && wsReady) {
      const selectedUser = location.state?.selectedUser;
      if (selectedUser) {
        handleStartNewChat(selectedUser);
      }
    }
  }, [userId, wsReady]);

  // Fetch chat list
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch(`/api/chats/user/${user?.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.chats) {
          setChats(data.chats); // The backend now sends formatted chats directly
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    if (user?.id && wsReady) {
      fetchChats();
    }
  }, [user?.id, wsReady]);

  // Handle new incoming message
  const handleNewMessage = (message: Message) => {
    console.log("Handling new message:", message);

    // Add message to messages list if it's from current chat
    if (
      selectedChat &&
      (selectedChat.user.id === message.senderId ||
        selectedChat.user.id === message.receiverId)
    ) {
      setMessages((prev) => [...prev, message]);
    }

    // Update chat list with new message
    updateChatWithNewMessage(message);
  };

  // Update user online status
  const updateUserStatus = (data: { userId: number; isOnline: boolean }) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.user.id === data.userId
          ? { ...chat, user: { ...chat.user, isOnline: data.isOnline } }
          : chat
      )
    );
  };

  // Update chat list with new message
  const updateChatWithNewMessage = (message: Message) => {
    setChats((prevChats) => {
      const chatIndex = prevChats.findIndex(
        (chat) =>
          chat.user.id ===
          (message.senderId === user?.id
            ? message.receiverId
            : message.senderId)
      );

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
        return [...prevChats, newChat];
      }

      // Update existing chat
      const updatedChats = [...prevChats];
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
      return updatedChats;
    });
  };

  // Add search handler
  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (query.trim().length > 0) {
      try {
        const response = await studentService.getAllStudents();
        const students = response.students;
        const filtered = students.filter((student: SearchResult) =>
          `${student.firstName} ${student.lastName}`
            .toLowerCase()
            .includes(query.toLowerCase())
        );
        setSearchResults(filtered);
      } catch (error) {
        console.error("Error searching students:", error);
      }
    } else {
      setSearchResults([]);
    }
  };

  // Add function to start new chat
  const handleStartNewChat = (selectedUser: SearchResult) => {
    // Prevent starting chat with yourself
    if (selectedUser.id === user?.id) {
      toast.error("You cannot message yourself");
      return;
    }

    const existingChat = chats.find((chat) => chat.user.id === selectedUser.id);
    if (existingChat) {
      handleSelectChat(existingChat);
    } else {
      const newChat: Chat = {
        id: Date.now(),
        user: {
          id: selectedUser.id,
          firstName: selectedUser.firstName,
          lastName: selectedUser.lastName,
          profilePic: selectedUser.profilePic,
          isOnline: false,
        },
      };
      setChats((prev) => [...prev, newChat]);
      handleSelectChat(newChat);
    }
    setSearchQuery("");
    setSearchResults([]);
  };

  // Update the send message handler
  const handleSendMessage = () => {
    if (
      !wsReady ||
      !wsRef.current ||
      !selectedChat ||
      !newMessage.trim() ||
      !user?.id
    ) {
      console.log("Cannot send message:", {
        wsReady,
        wsExists: !!wsRef.current,
        selectedChat: !!selectedChat,
        hasMessage: !!newMessage.trim(),
        userId: user?.id,
      });
      return;
    }

    try {
      const messageData = {
        type: "send-message",
        senderId: user.id,
        receiverId: selectedChat.user.id,
        content: newMessage.trim(),
      };

      wsRef.current.send(JSON.stringify(messageData));

      // Optimistically add message to UI
      const newMsg: Message = {
        id: Date.now(),
        content: newMessage.trim(),
        senderId: user.id,
        receiverId: selectedChat.user.id,
        createdAt: new Date().toISOString(),
        isRead: false,
      };

      setMessages((prev) => [...prev, newMsg]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Load chat history when selecting a chat
  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
    if (!wsReady || !wsRef.current || !user?.id) {
      console.log("Cannot select chat:", {
        wsReady,
        wsExists: !!wsRef.current,
        userId: user?.id,
      });
      return;
    }

    try {
      // Mark messages as read
      wsRef.current.send(
        JSON.stringify({
          type: "mark-messages-read",
          userId: user.id,
          senderId: chat.user.id,
        })
      );

      // Fetch chat history
      wsRef.current.send(
        JSON.stringify({
          type: "fetch-chat-history",
          userId: user.id,
          otherId: chat.user.id,
        })
      );
    } catch (error) {
      console.error("Error in handleSelectChat:", error);
    }
  };

  // Filter chats based on search query
  const filteredChats = chats.filter((chat) =>
    `${chat.user.firstName} ${chat.user.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] bg-white rounded-lg shadow-md overflow-hidden">
      <div className="flex h-full">
        {/* Chat List - Always visible on desktop, visible on mobile when no chat is selected */}
        <div
          className={`w-full md:w-1/3 border-r ${
            selectedChat ? "hidden md:block" : "block"
          }`}
        >
          {/* Search */}
          <div className="p-4 border-b relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-text h-5 w-5" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Search Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 mx-4 bg-white border rounded-lg shadow-lg z-10">
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    onClick={() => handleStartNewChat(result)}
                    className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
                  >
                    {result.profilePic ? (
                      <img
                        src={result.profilePic}
                        alt={`${result.firstName} ${result.lastName}`}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white">
                        {result.firstName[0]}
                        {result.lastName[0]}
                      </div>
                    )}
                    <div className="ml-3">
                      <p className="font-medium">
                        {result.firstName} {result.lastName}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Chat List */}
          <div className="overflow-y-auto h-[calc(100%-4rem)]">
            {/* Recent Chats */}
            {filteredChats.length > 0 && (
              <div className="p-4 border-b">
                <h3 className="text-sm font-medium text-gray-text mb-2">
                  Recent Chats
                </h3>
                {filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => handleSelectChat(chat)}
                    className={`p-3 hover:bg-gray-light cursor-pointer rounded-lg mb-2 ${
                      selectedChat?.id === chat.id ? "bg-primary-light" : ""
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {/* Profile Picture */}
                      <div className="relative">
                        {chat.user.profilePic ? (
                          <img
                            src={chat.user.profilePic}
                            alt={`${chat.user.firstName} ${chat.user.lastName}`}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white">
                            {chat.user.firstName[0]}
                            {chat.user.lastName[0]}
                          </div>
                        )}
                        <span
                          className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                            chat.user.isOnline ? "bg-green-500" : "bg-gray-400"
                          }`}
                        />
                      </div>

                      {/* User Info */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-gray-dark">
                            {chat.user.firstName} {chat.user.lastName}
                          </h3>
                          {chat.lastMessage && (
                            <span className="text-xs text-gray-text">
                              {new Date(
                                chat.lastMessage.createdAt
                              ).toLocaleTimeString()}
                            </span>
                          )}
                        </div>
                        {chat.lastMessage && (
                          <p className="text-sm text-gray-text truncate">
                            {chat.lastMessage.content}
                          </p>
                        )}
                      </div>

                      {/* Unread Count */}
                      {chat.lastMessage?.unreadCount &&
                        chat.lastMessage.unreadCount > 0 && (
                          <span className="px-2 py-1 rounded-full text-xs text-white bg-primary">
                            {chat.lastMessage.unreadCount}
                          </span>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-text mb-2">
                  Search Results
                </h3>
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    onClick={() => handleStartNewChat(result)}
                    className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
                  >
                    {result.profilePic ? (
                      <img
                        src={result.profilePic}
                        alt={`${result.firstName} ${result.lastName}`}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white">
                        {result.firstName[0]}
                        {result.lastName[0]}
                      </div>
                    )}
                    <div className="ml-3">
                      <p className="font-medium">
                        {result.firstName} {result.lastName}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat Area - Hidden on mobile when no chat is selected */}
        <div
          className={`flex-1 flex flex-col ${
            !selectedChat ? "hidden md:flex" : "flex"
          }`}
        >
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex justify-between items-center bg-white">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setSelectedChat(null)}
                    className="md:hidden p-2 hover:bg-gray-light rounded-full"
                  >
                    <ArrowLeft className="h-5 w-5 text-gray-text" />
                  </button>
                  <img
                    src={
                      selectedChat.user.profilePic ||
                      "https://via.placeholder.com/40"
                    }
                    alt={`${selectedChat.user.firstName} ${selectedChat.user.lastName}`}
                    className="h-10 w-10 rounded-full object-cover border-2 border-primary"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-dark">
                      {selectedChat.user.firstName} {selectedChat.user.lastName}
                    </h3>
                    <p className="text-xs text-gray-text">
                      {selectedChat.user.isOnline
                        ? "Online"
                        : `Last seen ${selectedChat.user.lastSeen}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button className="p-2 hover:bg-gray-light rounded-full">
                    <Phone className="h-5 w-5 text-gray-text" />
                  </button>
                  <button className="p-2 hover:bg-gray-light rounded-full">
                    <Video className="h-5 w-5 text-gray-text" />
                  </button>
                  <button className="p-2 hover:bg-gray-light rounded-full">
                    <MoreVertical className="h-5 w-5 text-gray-text" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-light">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.senderId === user?.id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    {/* Message Bubble */}
                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-2 ${
                        message.senderId === user?.id
                          ? "bg-primary text-white ml-auto" // Sender message (right)
                          : "bg-white text-gray-dark mr-auto" // Receiver message (left)
                      }`}
                    >
                      <p className="break-words">{message.content}</p>
                      <div
                        className={`flex items-center justify-end mt-1 space-x-1 ${
                          message.senderId === user?.id
                            ? "text-white/70"
                            : "text-gray-text"
                        }`}
                      >
                        <span className="text-xs">
                          {new Date(message.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {message.senderId === user?.id && (
                          <span className="text-xs">
                            {message.isRead ? "✓✓" : "✓"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t bg-white">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <button
                    onClick={handleSendMessage}
                    className="p-2 rounded-lg bg-primary text-white hover:bg-primary-dark"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="hidden md:flex flex-1 items-center justify-center text-gray-text">
              <p>Select a chat to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
