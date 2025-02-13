import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Bell, MessageSquare } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface Notification {
  senderId: number;
  count: number;
  sender: {
    firstName: string;
    lastName: string;
    profilePic?: string;
  };
}

export default function Navbar() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  const totalNotifications = notifications.reduce((sum, n) => sum + n.count, 0);

  useEffect(() => {
    if (!user?.id) return;

    const ws = new WebSocket("ws://localhost:3000");
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("Navbar WebSocket Connected");
      ws.send(
        JSON.stringify({
          type: "get-notifications",
          userId: user.id,
        })
      );
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "notifications-update") {
        setNotifications(data.notifications);
      }
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [user?.id]);

  return (
    <nav className="bg-primary shadow-md pl-64">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end h-16">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative"
              >
                <Bell className="h-6 w-6 text-white cursor-pointer hover:text-primary-light" />
                {totalNotifications > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalNotifications}
                  </span>
                )}
              </button>

              {showNotifications && notifications.length > 0 && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50">
                  <div className="p-2">
                    {notifications.map((notification) => (
                      <Link
                        key={notification.senderId}
                        to="/chats"
                        state={{
                          selectedUser: {
                            id: notification.senderId,
                            firstName: notification.sender.firstName,
                            lastName: notification.sender.lastName,
                            profilePic: notification.sender.profilePic,
                          },
                        }}
                        className="flex items-center p-3 hover:bg-gray-50 rounded-lg"
                      >
                        {notification.sender.profilePic ? (
                          <img
                            src={notification.sender.profilePic}
                            alt={`${notification.sender.firstName} ${notification.sender.lastName}`}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white">
                            {notification.sender.firstName[0]}
                            {notification.sender.lastName[0]}
                          </div>
                        )}
                        <div className="ml-3">
                          <p className="font-medium">
                            {notification.sender.firstName}{" "}
                            {notification.sender.lastName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {notification.count} unread message
                            {notification.count !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link to="/chats">
              <MessageSquare className="h-6 w-6 text-white cursor-pointer hover:text-primary-light" />
            </Link>

            <Link to="/profile">
              <img
                className="h-8 w-8 rounded-full border-2 border-white"
                src={user?.profilePic || "/default-avatar.png"}
                alt="Profile"
              />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
