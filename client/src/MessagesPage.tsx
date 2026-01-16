import { useState } from "react";
import { Search, Phone, Video, MoreVertical, Image, Smile, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  text: string;
  timestamp: string;
  isSent: boolean;
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  preview: string;
  timestamp: string;
  online: boolean;
  unread?: number;
}

const conversations: Conversation[] = [
  {
    id: "1",
    name: "Alex Grey",
    avatar: "https://i.pravatar.cc/150?img=33",
    preview: "Thank you for your interest in my work!",
    timestamp: "2m ago",
    online: true,
  },
  {
    id: "2",
    name: "Gallery Support",
    avatar: "https://i.pravatar.cc/150?img=47",
    preview: "Your order has been shipped.",
    timestamp: "1h ago",
    online: true,
  },
  {
    id: "3",
    name: "Luke Brown",
    avatar: "https://i.pravatar.cc/150?img=12",
    preview: "The print will be ready next week.",
    timestamp: "3h ago",
    online: false,
  },
  {
    id: "4",
    name: "Art Collector",
    avatar: "https://i.pravatar.cc/150?img=68",
    preview: "Would you be interested in trading?",
    timestamp: "1d ago",
    online: false,
  },
];

const mockMessages: { [key: string]: Message[] } = {
  "1": [
    { id: "1", text: "Hello! I saw you favorited my artwork.", timestamp: "10:30 AM", isSent: false },
    { id: "2", text: "Yes! I absolutely love your style. The sacred geometry in your work is incredible.", timestamp: "10:32 AM", isSent: true },
    { id: "3", text: "Thank you so much! That piece took me about 3 months to complete.", timestamp: "10:35 AM", isSent: false },
    { id: "4", text: "I can tell. The detail is amazing. Do you have any prints available?", timestamp: "10:36 AM", isSent: true },
    { id: "5", text: "Yes! We have limited edition prints available through the gallery.", timestamp: "10:38 AM", isSent: false },
    { id: "6", text: "Thank you for your interest in my work!", timestamp: "10:40 AM", isSent: false },
  ],
  "2": [
    { id: "1", text: "Your order #12345 has been shipped!", timestamp: "9:00 AM", isSent: false },
    { id: "2", text: "Great! When should I expect it?", timestamp: "9:05 AM", isSent: true },
    { id: "3", text: "It should arrive within 3-5 business days.", timestamp: "9:10 AM", isSent: false },
  ],
  "3": [
    { id: "1", text: "Hi! I'm interested in your Cosmic Vision print.", timestamp: "Yesterday", isSent: true },
    { id: "2", text: "The print will be ready next week.", timestamp: "Yesterday", isSent: false },
  ],
  "4": [
    { id: "1", text: "Would you be interested in trading?", timestamp: "2 days ago", isSent: false },
  ],
};

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<string>("1");
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const currentConversation = conversations.find((c) => c.id === selectedConversation);
  const currentMessages = mockMessages[selectedConversation] || [];

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // In a real app, this would send the message to the server
      console.log("Sending message:", messageInput);
      setMessageInput("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 pt-32">
      <div className="container max-w-7xl">
        <h1 className="text-4xl font-bold text-white mb-8">Messages</h1>

        <div className="bg-gray-900 rounded-2xl overflow-hidden border border-white/10 flex h-[calc(100vh-250px)]">
          {/* Left Sidebar - Conversations List */}
          <div className="w-96 border-r border-white/10 flex flex-col">
            {/* Search */}
            <div className="p-4 border-b border-white/10">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation.id)}
                  className={`w-full p-4 flex items-start gap-3 hover:bg-white/5 transition-colors border-b border-white/5 ${
                    selectedConversation === conversation.id ? "bg-white/10" : ""
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={conversation.avatar}
                      alt={conversation.name}
                      className="w-12 h-12 rounded-full"
                    />
                    {conversation.online && (
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-gray-900" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-white truncate">{conversation.name}</h3>
                      <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                        {conversation.timestamp}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 truncate">{conversation.preview}</p>
                  </div>

                  {conversation.unread && (
                    <div className="flex-shrink-0 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-medium">{conversation.unread}</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Right Side - Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            {currentConversation && (
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={currentConversation.avatar}
                      alt={currentConversation.name}
                      className="w-10 h-10 rounded-full"
                    />
                    {currentConversation.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900" />
                    )}
                  </div>
                  <div>
                    <h2 className="font-semibold text-white">{currentConversation.name}</h2>
                    <p className="text-sm text-gray-400">
                      {currentConversation.online ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="text-white/80 hover:text-white">
                    <Phone className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-white/80 hover:text-white">
                    <Video className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-white/80 hover:text-white">
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {currentMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-md ${message.isSent ? "order-2" : "order-1"}`}>
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        message.isSent
                          ? "bg-purple-600 text-white"
                          : "bg-white/10 text-white"
                      }`}
                    >
                      <p>{message.text}</p>
                    </div>
                    <p className={`text-xs text-gray-500 mt-1 ${message.isSent ? "text-right" : "text-left"}`}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="text-white/80 hover:text-white flex-shrink-0">
                  <Image className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-white/80 hover:text-white flex-shrink-0">
                  <Smile className="w-5 h-5" />
                </Button>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <Button
                  onClick={handleSendMessage}
                  className="bg-purple-600 hover:bg-purple-700 text-white flex-shrink-0"
                  size="icon"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
