import React, { useState } from 'react';
import { Search, Send, Phone, Video, MoreVertical, ArrowLeft } from 'lucide-react';

interface Chat {
  id: number;
  user: {
    name: string;
    image: string;
    status: 'online' | 'offline';
    lastSeen?: string;
  };
  lastMessage: {
    text: string;
    time: string;
    unread: number;
  };
}

interface Message {
  id: number;
  text: string;
  time: string;
  sent: boolean;
}

const chats: Chat[] = [
  {
    id: 1,
    user: {
      name: "Priya Sharma",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150",
      status: 'online'
    },
    lastMessage: {
      text: "Sure, I'd love to join your hackathon team!",
      time: "2:30 PM",
      unread: 2
    }
  },
  {
    id: 2,
    user: {
      name: "Rahul Verma",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
      status: 'offline',
      lastSeen: '1 hour ago'
    },
    lastMessage: {
      text: "Let's discuss the project tomorrow",
      time: "1:45 PM",
      unread: 0
    }
  },
  {
    id: 3,
    user: {
      name: "Sarah Chen",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
      status: 'online'
    },
    lastMessage: {
      text: "The robotics workshop was amazing!",
      time: "Yesterday",
      unread: 0
    }
  }
];

const messages: Message[] = [
  {
    id: 1,
    text: "Hi! I saw your post about the hackathon team",
    time: "2:15 PM",
    sent: false
  },
  {
    id: 2,
    text: "Yes! Are you interested in joining?",
    time: "2:16 PM",
    sent: true
  },
  {
    id: 3,
    text: "I have experience with ML and Python",
    time: "2:20 PM",
    sent: false
  },
  {
    id: 4,
    text: "That's perfect! We need someone with ML expertise",
    time: "2:25 PM",
    sent: true
  },
  {
    id: 5,
    text: "Sure, I'd love to join your hackathon team!",
    time: "2:30 PM",
    sent: false
  }
];

export default function Chats() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = chats.filter(chat => 
    chat.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Here you would typically send the message to your backend
      setNewMessage('');
    }
  };

  const handleBackToList = () => {
    setSelectedChat(null);
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] bg-white rounded-lg shadow-md overflow-hidden">
      <div className="flex h-full">
        {/* Chat List - Always visible on desktop, visible on mobile when no chat is selected */}
        <div className={`w-full md:w-1/3 border-r ${selectedChat ? 'hidden md:block' : 'block'}`}>
          {/* Search */}
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-text h-5 w-5" />
              <input
                type="text"
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="overflow-y-auto h-[calc(100%-4rem)]">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={`p-4 hover:bg-gray-light cursor-pointer ${
                  selectedChat?.id === chat.id ? 'bg-primary-light' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={chat.user.image}
                      alt={chat.user.name}
                      className="h-12 w-12 rounded-full object-cover border-2 border-primary"
                    />
                    <span
                      className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                        chat.user.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-gray-dark">{chat.user.name}</h3>
                      <span className="text-xs text-gray-text">{chat.lastMessage.time}</span>
                    </div>
                    <p className="text-sm text-gray-text truncate">{chat.lastMessage.text}</p>
                  </div>
                  {chat.lastMessage.unread > 0 && (
                    <span className="px-2 py-1 rounded-full text-xs text-white bg-primary">
                      {chat.lastMessage.unread}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area - Hidden on mobile when no chat is selected */}
        <div className={`flex-1 flex flex-col ${!selectedChat ? 'hidden md:flex' : 'flex'}`}>
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex justify-between items-center bg-white">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleBackToList}
                    className="md:hidden p-2 hover:bg-gray-light rounded-full"
                  >
                    <ArrowLeft className="h-5 w-5 text-gray-text" />
                  </button>
                  <img
                    src={selectedChat.user.image}
                    alt={selectedChat.user.name}
                    className="h-10 w-10 rounded-full object-cover border-2 border-primary"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-dark">{selectedChat.user.name}</h3>
                    <p className="text-xs text-gray-text">
                      {selectedChat.user.status === 'online' 
                        ? 'Online' 
                        : `Last seen ${selectedChat.user.lastSeen}`
                      }
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
                    className={`flex ${message.sent ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-2 ${
                        message.sent
                          ? 'bg-primary text-white'
                          : 'bg-white text-gray-dark'
                      }`}
                    >
                      <p>{message.text}</p>
                      <span className={`text-xs ${message.sent ? 'text-white/80' : 'text-gray-text'}`}>
                        {message.time}
                      </span>
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
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
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