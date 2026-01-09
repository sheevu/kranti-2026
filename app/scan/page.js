'use client'
import React, { useState, useRef, useCallback } from 'react'
import Webcam from 'react-webcam'
import Link from 'next/link'
import { ArrowLeft, Camera, Check, RefreshCw, Loader2, Upload, ShoppingBag, TrendingUp, TrendingDown } from 'lucide-react'

export default function PhotoMunim() {
    const webcamRef = useRef(null)
    const fileInputRef = useRef(null)
    const [scanType, setScanType] = useState(null) // 'SALE', 'PURCHASE', 'EXPENSE'
    const [image, setImage] = useState(null)
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot()
        setImage(imageSrc)
        analyzeImage(imageSrc)
    }, [webcamRef])

    const handleFileUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImage(reader.result)
                analyzeImage(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

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
                body: JSON.stringify({ image: imgSrc, type: scanType }),
            })
            const data = await response.json()
            if (data.error) throw new Error(data.error)
            setResult(data)

            // Mock Saving logic
            const reports = JSON.parse(localStorage.getItem('daily_reports') || '[]')
            reports.push({ date: new Date().toISOString(), type: scanType, ...data })
            localStorage.setItem('daily_reports', JSON.stringify(reports))

        } catch (error) {
            console.error(error)
            alert("Munim ji abhi busy hain. Phir se try karein.")
        } finally {
            setLoading(false)
        }
    }

    const clearSelection = () => {
        setScanType(null)
        setImage(null)
        setResult(null)
    }

    return (
        <main className="min-h-screen bg-slate-900 flex flex-col items-center justify-center relative p-4">

            {/* 1. Category Selection Screen */}
            {!scanType && (
                <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Link href="/" className="absolute top-6 left-6 z-20 bg-white/10 backdrop-blur-md p-3 rounded-full text-white hover:bg-white/20 transition">
                        <ArrowLeft size={24} />
                    </Link>

                    <h1 className="text-3xl font-bold text-white mb-8 text-center leading-tight">
                        Kya scan karna hai? <br />
                        <span className="text-slate-400 text-lg font-medium">Select an option</span>
                    </h1>

                    <div className="space-y-4">
                        <button
                            onClick={() => setScanType('SALE')}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 p-6 rounded-2xl flex items-center gap-4 group transition-all active:scale-95 shadow-lg shadow-emerald-900/50"
                        >
                            <div className="bg-white/20 p-4 rounded-full">
                                <TrendingUp className="text-white" size={32} />
                            </div>
                            <div className="text-left">
                                <p className="text-white text-lg font-bold">Scan or upload your <span className="text-yellow-300 underline underline-offset-4 decoration-2">Sale</span></p>
                                <p className="text-emerald-100 text-xs">Aaj ki bikri record karein</p>
                            </div>
                        </button>

                        <button
                            onClick={() => setScanType('PURCHASE')}
                            className="w-full bg-blue-600 hover:bg-blue-500 p-6 rounded-2xl flex items-center gap-4 group transition-all active:scale-95 shadow-lg shadow-blue-900/50"
                        >
                            <div className="bg-white/20 p-4 rounded-full">
                                <ShoppingBag className="text-white" size={32} />
                            </div>
                            <div className="text-left">
                                <p className="text-white text-lg font-bold">Scan or upload your <span className="text-yellow-300 underline underline-offset-4 decoration-2">Purchase</span></p>
                                <p className="text-blue-100 text-xs">Naya maal aaya?</p>
                            </div>
                        </button>

                        <button
                            onClick={() => setScanType('EXPENSE')}
                            className="w-full bg-red-600 hover:bg-red-500 p-6 rounded-2xl flex items-center gap-4 group transition-all active:scale-95 shadow-lg shadow-red-900/50"
                        >
                            <div className="bg-white/20 p-4 rounded-full">
                                <TrendingDown className="text-white" size={32} />
                            </div>
                            <div className="text-left">
                                <p className="text-white text-lg font-bold">Scan or upload your <span className="text-yellow-300 underline underline-offset-4 decoration-2">Expenses</span></p>
                                <p className="text-red-100 text-xs">Chai-Paani ya Kiraya</p>
                            </div>
                        </button>
                    </div>
                </div>
            )}

            {/* 2. Camera / Upload UI */}
            {scanType && !image && (
                <>
                    <div className="absolute inset-0 z-0">
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            videoConstraints={{ facingMode: "environment" }}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40"></div>
                    </div>

                    <button onClick={clearSelection} className="absolute top-6 left-6 z-20 bg-white/20 backdrop-blur-md p-3 rounded-full text-white">
                        <ArrowLeft size={24} />
                    </button>

                    <div className="z-10 flex flex-col items-center gap-6 animate-in fade-in duration-500">
                        <h2 className="text-white text-2xl font-bold text-center shadow-black drop-shadow-md">
                            {scanType === 'SALE' && 'Bikri (Sale)'}
                            {scanType === 'PURCHASE' && 'Kharid (Purchase)'}
                            {scanType === 'EXPENSE' && 'Kharcha (Expense)'}
                            <span className="block text-sm font-normal text-white/80 mt-1">ki photo lein</span>
                        </h2>

                        <div className="flex flex-col gap-4 items-center">
                            <button
                                onClick={capture}
                                className={`w-48 h-48 rounded-full bg-white/20 backdrop-blur-xl border-4 flex items-center justify-center shadow-2xl active:scale-95 transition-transform
                                    ${scanType === 'SALE' ? 'border-emerald-500' : ''}
                                    ${scanType === 'PURCHASE' ? 'border-blue-500' : ''}
                                    ${scanType === 'EXPENSE' ? 'border-red-500' : ''}
                                `}
                            >
                                <div className="w-40 h-40 rounded-full bg-white flex items-center justify-center">
                                    <Camera size={60} className={`
                                        ${scanType === 'SALE' ? 'text-emerald-600' : ''}
                                        ${scanType === 'PURCHASE' ? 'text-blue-600' : ''}
                                        ${scanType === 'EXPENSE' ? 'text-red-600' : ''}
                                    `} />
                                </div>
                            </button>

                            <div className="relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    ref={fileInputRef}
                                    className="hidden"
                                />
                                <button
                                    onClick={() => fileInputRef.current.click()}
                                    className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full text-white font-bold border border-white/30 hover:bg-white/30 transition shadow-lg"
                                >
                                    <Upload size={20} /> Upload Photo
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* 3. Loading State */}
            {loading && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                    <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center gap-4 text-center max-w-xs w-full">
                        <Loader2 className="animate-spin text-blue-600" size={48} />
                        <div>
                            <h3 className="text-xl font-bold text-slate-800">Analyzing...</h3>
                            <p className="text-slate-500 text-sm">Munim ji hisaab jod rahe hain...</p>
                        </div>
                    </div>
                </div>
            )}

            {/* 4. Result State */}
            {result && !loading && (
                <div className="z-20 w-full max-w-sm mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                    <div className="bg-slate-50 p-6 border-b border-slate-100 text-center">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800">Done!</h2>
                        <p className="text-slate-500">Analysis for {scanType}</p>
                    </div>

                    <div className="p-6 space-y-4">
                        {/* Display logic based on scanType ideally, but simplified here */}
                        <div className="flex justify-between items-center p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                            <span className="text-slate-600 font-medium">Kul Bikri</span>
                            <span className="text-2xl font-bold text-emerald-700">₹{result.sale}</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-red-50 border border-red-100 rounded-xl">
                            <span className="text-slate-600 font-medium">Kharcha</span>
                            <span className="text-2xl font-bold text-red-600">₹{result.expense}</span>
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
