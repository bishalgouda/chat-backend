"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Sparkles } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, call the /auth/magic-link FastAPI endpoint here
    router.push("/chat");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center">
      {/* Dynamic Frosted Glass Overlay */}
      <div className="absolute inset-0 bg-walnut/40 backdrop-blur-sm"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="relative z-10 bg-parchment/90 backdrop-blur-md p-10 rounded-3xl shadow-2xl max-w-md w-full border border-softglow"
      >
        <div className="text-center mb-8">
          <motion.div 
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="inline-block p-4 bg-terracotta/20 rounded-full mb-4"
          >
            <Sparkles className="w-8 h-8 text-terracotta" />
          </motion.div>
          <h1 className="text-4xl font-serif text-walnut mb-2">HearthChat</h1>
          <p className="text-moss font-medium">Warm, secure, and personal.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-walnut mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-walnut/50" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/50 border border-walnut/20 focus:outline-none focus:ring-2 focus:ring-terracotta transition-all placeholder:text-walnut/40"
                placeholder="totoro@ghibli.studio"
              />
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02, boxShadow: "0px 0px 15px rgba(203, 109, 81, 0.4)" }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-terracotta text-parchment py-3 rounded-xl font-bold text-lg flex items-center justify-center gap-2"
          >
            Send Magic Link
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}