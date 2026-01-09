'use client'
import React, { useState, useRef, useCallback } from 'react'
import Webcam from 'react-webcam'
import Link from 'next/link'
import { ArrowLeft, Camera, Check, RefreshCw, Loader2 } from 'lucide-react'

export default function PhotoMunim() {
    const webcamRef = useRef(null)
    const [image, setImage] = useState(null)
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot()
        setImage(imageSrc)
        analyzeImage(imageSrc)
    }, [webcamRef])

    const retake = () => {
        setImage(null)
        setResult(null)
    }

    const analyzeImage = async (imgSrc) => {
        setLoading(true)
        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: imgSrc }),
            })
            const data = await response.json()
            if (data.error) throw new Error(data.error)
            setResult(data)
            // Save for dashboard/reports (Mock logic)
            const reports = JSON.parse(localStorage.getItem('daily_reports') || '[]')
            reports.push({ date: new Date().toISOString(), ...data })
            localStorage.setItem('daily_reports', JSON.stringify(reports))
            localStorage.setItem('latestScan', JSON.stringify(data))

        } catch (error) {
            console.error(error)
            alert("Munim ji abhi busy hain. Phir se try karein.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-slate-900 flex flex-col items-center justify-center relative">
            {/* Full Screen Camera */}
            {!image ? (
                <div className="absolute inset-0 z-0">
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        videoConstraints={{ facingMode: "environment" }}
                        className="w-full h-full object-cover"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/30"></div>
                </div>
            ) : (
                <div className="absolute inset-0 z-0 bg-black">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image} alt="Captured" className="w-full h-full object-contain opacity-50" />
                </div>
            )}

            {/* Back Button */}
            <Link href="/" className="absolute top-6 left-6 z-20 bg-white/20 backdrop-blur-md p-3 rounded-full text-white">
                <ArrowLeft size={24} />
            </Link>

            {/* Initial State: Capture UI */}
            {!image && (
                <div className="z-10 flex flex-col items-center gap-6 animate-in fade-in duration-500">
                    <h2 className="text-white text-2xl font-bold shadow-black drop-shadow-md">Diary ki Photo Le</h2>
                    <button
                        onClick={capture}
                        className="w-64 h-64 rounded-full bg-white/20 backdrop-blur-xl border-4 border-white/50 flex items-center justify-center shadow-2xl active:scale-95 transition-transform"
                    >
                        <div className="w-56 h-56 rounded-full bg-white flex items-center justify-center">
                            <Camera size={80} className="text-slate-900" />
                        </div>
                    </button>
                    <p className="text-white/80 text-sm font-medium bg-black/40 px-4 py-2 rounded-full">
                        Ensure good lighting
                    </p>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="z-20 bg-white/90 p-8 rounded-2xl shadow-xl flex flex-col items-center gap-4 text-center mx-4">
                    <Loader2 className="animate-spin text-blue-600" size={48} />
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Munim ji hisaab jod rahe hain...</h3>
                        <p className="text-slate-500 text-sm">Bass ek second...</p>
                    </div>
                </div>
            )}

            {/* Result State */}
            {result && !loading && (
                <div className="z-20 w-full max-w-sm mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                    <div className="bg-slate-50 p-6 border-b border-slate-100 text-center">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800">Analysis Complete!</h2>
                        <p className="text-slate-500">Here is your summary</p>
                    </div>

                    <div className="p-6 space-y-4">
                        <div className="flex justify-between items-center p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                            <span className="text-slate-600 font-medium">Kul Bikri</span>
                            <span className="text-2xl font-bold text-emerald-700">₹{result.sale}</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-red-50 border border-red-100 rounded-xl">
                            <span className="text-slate-600 font-medium">Kharcha</span>
                            <span className="text-2xl font-bold text-red-600">₹{result.expense}</span>
                        </div>
                        {/* Mock 'Purchase' since API might not return it yet, or use generic logic */}
                        <div className="flex justify-between items-center p-4 bg-orange-50 border border-orange-100 rounded-xl">
                            <span className="text-slate-600 font-medium">Maal Aaya</span>
                            <span className="text-2xl font-bold text-orange-600">₹{Math.floor(result.sale * 0.4)}</span>
                        </div>
                    </div>

                    <div className="p-4 bg-slate-50 flex gap-3">
                        <button onClick={retake} className="flex-1 py-4 text-slate-600 font-bold bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition">
                            Retake
                        </button>
                        <Link href="/" className="flex-1 py-4 text-white font-bold bg-blue-600 rounded-xl hover:bg-blue-700 transition flex justify-center items-center shadow-lg shadow-blue-200">
                            Confirm & Save
                        </Link>
                    </div>
                </div>
            )}
        </main>
    )
}
