'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Mic, MicOff } from 'lucide-react'

export default function VoiceNav() {
    const [isListening, setIsListening] = useState(false)
    const router = useRouter()
    const [recognition, setRecognition] = useState(null)

    useEffect(() => {
        if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
            // eslint-disable-next-line new-cap
            const speech = new window.webkitSpeechRecognition()
            speech.continuous = false
            speech.lang = 'hi-IN' // Listen for Hindi
            speech.interimResults = false

            speech.onstart = () => setIsListening(true)
            speech.onend = () => setIsListening(false)

            const handleCommand = (command) => {
                const cmd = command.toLowerCase()

                // Simple Keyword matching for Hindi/Hinglish
                if (cmd.includes('grahak') || cmd.includes('customer') || cmd.includes('party')) {
                    router.push('/parties')
                } else if (cmd.includes('scan') || cmd.includes('bill') || cmd.includes('hisab') || cmd.includes('diary')) {
                    router.push('/scan')
                } else if (cmd.includes('task') || cmd.includes('kaam') || cmd.includes('list')) {
                    router.push('/tasks')
                } else if (cmd.includes('home') || cmd.includes('wapas') || cmd.includes('main')) {
                    router.push('/')
                } else {
                    alert(`Didn't catch that. Heard: "${cmd}"`)
                }
            }

            speech.onresult = (event) => {
                const transcript = event.results[0][0].transcript.toLowerCase()
                console.log('Heard:', transcript)
                handleCommand(transcript)
            }

            setRecognition(speech)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router])

    const toggleMic = () => {
        if (!recognition) {
            alert('Voice recognition not supported in this browser.')
            return
        }

        if (isListening) {
            recognition.stop()
        } else {
            recognition.start()
        }
    }

    if (!recognition) return null // Hide if not supported

    return (
        <button
            onClick={toggleMic}
            className={`fixed bottom-6 right-6 p-4 rounded-full shadow-2xl transition-all border-4 text-white z-50 ${isListening
                ? 'bg-red-600 border-red-400 animate-pulse scale-110'
                : 'bg-blue-600 border-blue-800 hover:bg-blue-700 active:scale-95'
                }`}
        >
            {isListening ? <Mic size={32} /> : <MicOff size={32} />}
        </button>
    )
}
