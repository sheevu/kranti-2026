'use client'
import React, { useState, useRef, useCallback } from 'react'
import Webcam from 'react-webcam'
import Link from 'next/link'
import { ArrowLeft, Camera, RefreshCw, Loader2 } from 'lucide-react'

export default function ScanPage() {
    const webcamRef = useRef(null)
    const [image, setImage] = useState(null)
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot()
        setImage(imageSrc)
    }, [webcamRef])

    const retake = () => {
        setImage(null)
        setResult(null)
    }

    const analyzeImage = async () => {
        if (!image) return
        setLoading(true)
        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image }),
            })
            const data = await response.json()
            if (data.error) throw new Error(data.error)

            setResult(data)

            // Save for dashboard
            localStorage.setItem('latestScan', JSON.stringify(data))
        } catch (error) {
            console.error(error)
            alert("Analysis failed. Try again!")
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-slate-900 text-white pb-10">
            <header className="bg-slate-950 p-4 sticky top-0 z-10 flex items-center shadow-md">
                <Link href="/" className="mr-4 p-2 hover:bg-slate-800 rounded-full transition">
                    <ArrowLeft size={24} className="text-white" />
                </Link>
                <h1 className="text-xl font-bold tracking-wide">AI Munim Scanner</h1>
            </header>

            <div className="p-4 flex flex-col items-center max-w-md mx-auto space-y-6">

                {/* Camera/Image Area */}
                <div className="relative w-full aspect-[3/4] bg-black rounded-2xl overflow-hidden shadow-xl border-2 border-slate-700">
                    {!image ? (
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            videoConstraints={{ facingMode: "environment" }}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={image} alt="Captured" className="w-full h-full object-cover" />
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 w-full">
                    {!image ? (
                        <button
                            onClick={capture}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg flex justify-center items-center gap-2 text-lg active:scale-95 transition"
                        >
                            <Camera size={24} /> Capture
                        </button>
                    ) : (
                        <>
                            {!result && !loading && (
                                <button
                                    onClick={retake}
                                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 rounded-xl shadow-lg flex justify-center items-center gap-2 active:scale-95 transition"
                                >
                                    <RefreshCw size={20} /> Retake
                                </button>
                            )}
                            {!loading && !result && (
                                <button
                                    onClick={analyzeImage}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg flex justify-center items-center gap-2 text-lg active:scale-95 transition"
                                >
                                    Analyze
                                </button>
                            )}
                        </>
                    )}
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center gap-4 py-8">
                        <Loader2 className="animate-spin text-blue-400" size={48} />
                        <p className="text-lg font-medium text-blue-200 animate-pulse">Analyzing Invoice...</p>
                    </div>
                )}

                {/* Results Card */}
                {result && (
                    <div className="w-full bg-slate-800 rounded-2xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-500 border border-slate-700">
                        <h2 className="text-2xl font-bold text-center mb-6 text-green-400">Analysis Complete</h2>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-slate-700 p-4 rounded-xl text-center">
                                <p className="text-slate-400 text-sm mb-1">Total Sale</p>
                                <p className="text-2xl font-bold text-white">₹{result.sale}</p>
                            </div>
                            <div className="bg-slate-700 p-4 rounded-xl text-center">
                                <p className="text-slate-400 text-sm mb-1">Expenses</p>
                                <p className="text-2xl font-bold text-red-400">₹{result.expense}</p>
                            </div>
                        </div>

                        <div className="bg-slate-900/50 p-4 rounded-xl">
                            <h3 className="text-lg font-bold text-yellow-500 mb-3 block border-b border-slate-700 pb-2">
                                Growth Tips (Munaafa Mantra)
                            </h3>
                            <ul className="space-y-3">
                                {result.action_points?.map((point, i) => (
                                    <li key={i} className="flex gap-3 text-slate-300">
                                        <span className="text-yellow-500 font-bold">•</span>
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button
                            onClick={retake}
                            className="w-full mt-6 bg-slate-700 hover:bg-slate-600 p-3 rounded-lg font-semibold"
                        >
                            Scan Next Page
                        </button>
                    </div>
                )}
            </div>
        </main>
    )
}
