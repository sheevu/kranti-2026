/* eslint-disable */
'use client'
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowLeft, Send, Mic, MicOff, Sparkles, User, Bot } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

export default function ChatPage() {
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isListening, setIsListening] = useState(false)
    const messagesEndRef = useRef(null)

    // Predefined Options
    const insightOptions = [
        "Aaj ka Summary batao 📊",
        "Bikri kaise badhaye? 🚀",
        "Udhaar recover tips 💰"
    ]

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    // Voice Recognition Setup
    useEffect(() => {
        if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
            // eslint-disable-next-line new-cap
            const speech = new window.webkitSpeechRecognition()
            speech.continuous = false
            speech.lang = 'hi-IN'
            speech.interimResults = false

            speech.onstart = () => setIsListening(true)
            speech.onend = () => setIsListening(false)
            speech.onresult = (event) => {
                const transcript = event.results[0][0].transcript
                setInput(transcript)
                // Optional: Auto-send confirmed voice input
                // sendMessage(transcript) 
            }
            window.speechRec = speech
        }
    }, [])

    const toggleMic = () => {
        if (window.speechRec) {
            if (isListening) window.speechRec.stop()
            else window.speechRec.start()
        } else {
            alert("Voice not supported in this browser")
        }
    }

    const sendMessage = async (text = input) => {
        if (!text.trim()) return

        const userMsg = { role: 'user', content: text }
        setMessages(prev => [...prev, userMsg])
        setInput('')
        setIsLoading(true)

        try {
            // Fetch basic context (simulated or real)
            // In a real app, we'd pass recent sales data here
            const context = "Grocery Store"

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    history: messages.slice(-5), // Keep last 5 context
                    businessContext: context
                }),
            })
            const data = await response.json()

            const aiMsg = { role: 'ai', content: data.text }
            setMessages(prev => [...prev, aiMsg])

            // Text to Speech
            speak(data.text)

        } catch (error) {
            console.error(error)
            setMessages(prev => [...prev, { role: 'ai', content: "Maaf karein, network issue hai." }])
        } finally {
            setIsLoading(false)
        }
    }

    const speak = (text) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text)
            utterance.lang = 'hi-IN'
            window.speechSynthesis.speak(utterance)
        }
    }

    return (
        <main className="min-h-screen bg-[#f3f4f6] flex flex-col">
            {/* Header */}
            <header className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10">
                <Link href="/" className="p-2 hover:bg-slate-100 rounded-full text-slate-600">
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        Sudarshan AI <Sparkles size={16} className="text-yellow-500 fill-yellow-500" />
                    </h1>
                    <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Online
                    </p>
                </div>
            </header>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-forwards">
                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                            <Bot size={40} className="text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-700">Namaste! Kaise madad karu?</h2>

                        <div className="grid grid-cols-1 gap-3 w-full max-w-xs">
                            {insightOptions.map((opt, i) => (
                                <button
                                    key={i}
                                    onClick={() => sendMessage(opt)}
                                    className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition text-left flex justify-between items-center group"
                                >
                                    {opt}
                                    <ArrowLeft size={16} className="rotate-180 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`
                            max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm
                            ${msg.role === 'user'
                                ? 'bg-slate-900 text-white rounded-br-none'
                                : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'}
                        `}>
                            {msg.content}
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white p-4 rounded-2xl rounded-bl-none shadow-sm border border-slate-100">
                            <div className="flex gap-1">
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100 sticky bottom-0">
                <div className="flex gap-2 items-end bg-slate-100 p-2 rounded-2xl border border-slate-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">

                    <button
                        onClick={toggleMic}
                        className={`p-3 rounded-xl transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white text-slate-500 hover:bg-slate-200'}`}
                    >
                        {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                    </button>

                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Kuch puchein..."
                        className="flex-1 bg-transparent border-none outline-none resize-none py-3 text-slate-800 placeholder:text-slate-400 max-h-32"
                        rows={1}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                sendMessage();
                            }
                        }}
                    />

                    <button
                        onClick={() => sendMessage()}
                        disabled={!input.trim() || isLoading}
                        className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send size={20} />
                    </button>
                </div>
                <p className="text-center text-[10px] text-slate-400 mt-2">AI can make mistakes. Check important info.</p>
            </div>
        </main>
    )
}
