"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Settings } from "lucide-react";

// Mocking WebSocket URL - Change this to your deployed backend URL later
const WS_URL = "ws://chat-backend-production-b8c6.up.railway.app/ws/chat/room_1";

export default function ChatRoom() {
  const [messages, setMessages] = useState<{text: string, isMe: boolean}[]>([]);
  const [input, setInput] = useState("");
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket(WS_URL);
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.text) {
        setMessages((prev) => [...prev, { text: data.text, isMe: false }]);
      }
    };
    setWs(socket);
    return () => socket.close();
  }, []);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !ws) return;
    
    ws.send(input);
    setMessages((prev) => [...prev, { text: input, isMe: true }]);
    setInput("");
  };

  return (
    <div className="h-screen flex bg-[url('https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center">
      {/* Readability Filter Layer */}
      <div className="absolute inset-0 bg-[#4A3B32] opacity-40 backdrop-blur-[4px]"></div>

      <div className="relative z-10 w-full max-w-4xl mx-auto h-full flex flex-col p-4 md:p-8">
        {/* Header */}
        <header className="bg-parchment/80 backdrop-blur-md rounded-2xl p-4 flex justify-between items-center shadow-lg mb-4 border border-white/20">
          <h2 className="text-2xl font-serif font-bold text-walnut">The Enchanted Forest</h2>
          <button className="p-2 bg-white/40 rounded-full hover:bg-white/60 transition">
            <Settings className="w-6 h-6 text-walnut" />
          </button>
        </header>

        {/* Chat Area */}
        <main className="flex-1 overflow-y-auto space-y-4 p-4 no-scrollbar">
          {messages.map((msg, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[70%] p-4 rounded-3xl ${msg.isMe ? "bg-moss text-parchment rounded-br-sm shadow-[0_4px_14px_rgba(74,93,35,0.3)]" : "bg-parchment/90 text-walnut backdrop-blur-md rounded-bl-sm shadow-md"}`}>
                <p className="text-[16px] leading-relaxed">{msg.text}</p>
              </div>
            </motion.div>
          ))}
        </main>

        {/* Input Area */}
        <footer className="mt-4">
          <form onSubmit={sendMessage} className="flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Whisper into the hearth..." 
              className="flex-1 bg-parchment/90 backdrop-blur-md border-none rounded-full px-6 py-4 text-walnut focus:outline-none focus:ring-2 focus:ring-moss shadow-lg placeholder:text-walnut/50" 
            />
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-terracotta text-parchment p-4 rounded-full shadow-lg"
            >
              <Send className="w-6 h-6 ml-1" />
            </motion.button>
          </form>
        </footer>
      </div>
    </div>
  );
}