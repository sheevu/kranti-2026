'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, UserPlus, Phone, Search, Truck } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

export default function Vendors() {
    const [vendors, setVendors] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    // Mock Data for now (Schema to be created later or assumed similar to customers)
    // Ideally we would fetch from a 'vendors' table
    useEffect(() => {
        const mockVendors = [
            { id: 1, name: 'Sharma Distributors', phone: '9876543210', balance: 15000 },
            { id: 2, name: 'Metro Cash & Carry', phone: '1800-100-200', balance: 0 },
            { id: 3, name: 'Patanjali Agency', phone: '9988776655', balance: 5000 },
        ]
        setTimeout(() => {
            setVendors(mockVendors)
            setLoading(false)
        }, 500)
    }, [])

    const filtered = vendors.filter(v =>
        v.name.toLowerCase().includes(search.toLowerCase()) ||
        v.phone.includes(search)
    )

    return (
        <main className="min-h-screen bg-[#f3f4f6]">
            {/* Header */}
            <header className="bg-white p-6 sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                    <Link href="/" className="p-2 hover:bg-slate-100 rounded-full text-slate-600">
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-800">My Vendors 🚛</h1>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search Vyapari..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-slate-100 p-3 pl-12 rounded-xl border border-transparent focus:border-blue-500 outline-none text-slate-700 font-medium transition-all"
                    />
                </div>
            </header>

            {/* List */}
            <div className="p-4 space-y-3 pb-24">
                {loading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="bg-white h-20 rounded-xl animate-pulse"></div>
                    ))
                ) : (
                    filtered.map(v => (
                        <div key={v.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between active:scale-[0.98] transition-transform">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xl">
                                    {v.name[0]}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">{v.name}</h3>
                                    <p className="text-sm text-slate-500 flex items-center gap-1">
                                        <Phone size={12} /> {v.phone}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-slate-400 font-medium uppercase">Payable</p>
                                <p className={`text-lg font-bold ${v.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                    ₹{v.balance}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* FAB */}
            <button className="fixed bottom-6 right-6 bg-orange-600 text-white p-4 rounded-full shadow-lg shadow-orange-300 active:scale-95 transition flex items-center gap-2 z-50">
                <UserPlus size={24} />
                <span className="font-bold pr-2">Add Vendor</span>
            </button>
        </main>
    )
}
