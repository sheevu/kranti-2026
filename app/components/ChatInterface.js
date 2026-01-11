"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Mic, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ChatInterface() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { role: "user", content: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        try {
            // 1. Get Intent & Response from AI
            const aiRes = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: [...messages, userMsg] }),
            });
            const aiData = await aiRes.json();

            // 2. Add Assistant Message (Text)
            const assistantMsg = {
                role: "assistant",
                content: aiData.assistant_text || "Something went wrong."
            };
            setMessages((prev) => [...prev, assistantMsg]);

            // 3. Execute Action (if valid and not error)
            if (aiData.action && aiData.action !== "ERROR") {
                const actionRes = await fetch("/api/action", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ action: aiData.action, parameters: aiData.parameters })
                });
                const actionResult = await actionRes.json();

                if (actionResult.result && aiData.action === 'GET_BALANCE') {
                    setMessages(prev => [...prev, {
                        role: "system",
                        content: `System: Updated Balance is ₹${actionResult.result.balance}`
                    }]);
                }
            }

        } catch (error) {
            console.error(error);
            setMessages((prev) => [...prev, { role: "system", content: "Error connecting to AI." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto glass-card overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-white/5 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <h2 className="font-semibold text-lg text-white">Sudarshan AI Assistant</h2>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={cn(
                            "flex w-full",
                            msg.role === "user" ? "justify-end" : "justify-start"
                        )}
                    >
                        <div
                            className={cn(
                                "max-w-[80%] rounded-2xl px-4 py-2",
                                msg.role === "user"
                                    ? "bg-blue-600 text-white rounded-br-none"
                                    : msg.role === "system"
                                        ? "bg-yellow-500/20 text-yellow-200 text-sm border border-yellow-500/30"
                                        : "bg-white/10 text-white rounded-bl-none border border-white/5"
                            )}
                        >
                            {msg.content}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white/10 rounded-2xl px-4 py-2 rounded-bl-none flex gap-1 items-center">
                            <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" />
                            <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce delay-100" />
                            <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce delay-200" />
                        </div>
                    </div>
                )}
                <div ref={scrollRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white/5 border-t border-white/10 flex gap-2">
                <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white">
                    <Mic className="w-5 h-5" />
                </button>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Ask in Hindi or English (e.g., 'Add customer Rahul')..."
                    className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-white/30"
                />
                <button
                    onClick={handleSend}
                    disabled={isLoading}
                    className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100"
                >
                    <Send className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
