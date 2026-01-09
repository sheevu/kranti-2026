'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import { ArrowLeft, Search, Phone } from 'lucide-react'

export default function CustomerList() {
    const [customers, setCustomers] = useState([])
    const [search, setSearch] = useState('')

    useEffect(() => {
        fetchCustomers()
    }, [])

    const fetchCustomers = async () => {
        const { data } = await supabase.from('customers').select('*').order('created_at', { ascending: false })
        if (data) setCustomers(data)
    }

    const filtered = customers.filter(c => c.business_name.toLowerCase().includes(search.toLowerCase()))

    return (
        <main className="min-h-screen bg-[#f3f4f6]">
            {/* Header */}
            <header className="bg-slate-900 text-white p-6 pb-12 rounded-b-[2.5rem] shadow-md sticky top-0 z-10">
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/" className="p-2 bg-slate-800 rounded-full hover:bg-slate-700">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-2xl font-bold">Meri Party List</h1>
                </div>

                {/* Search Bar embedded in header */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search Name..."
                        className="w-full p-4 pl-12 rounded-xl text-slate-900 font-medium focus:outline-none shadow-lg placeholder:text-slate-400"
                    />
                </div>
            </header>

            <div className="p-4 -mt-4 pb-20 space-y-3">
                {filtered.map(c => (
                    <div key={c.id} className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4 active:scale-[0.98] transition-transform">
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 font-bold text-xl">
                            {c.business_name.charAt(0).toUpperCase()}
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <h3 className="font-bold text-slate-800 text-lg">{c.business_name}</h3>
                            <div className="flex items-center gap-2 text-slate-500 text-sm">
                                <Phone size={14} /> {c.mobile}
                            </div>
                        </div>

                        {/* Balance (Simulated Random for UI Demo) */}
                        <div className="text-right">
                            <p className="text-xs text-slate-400 font-medium">Balance</p>
                            <p className="text-red-600 font-bold text-lg">₹{Math.floor(Math.random() * 5000)}</p>
                        </div>
                    </div>
                ))}
                {filtered.length === 0 && (
                    <div className="text-center text-slate-400 mt-10">
                        <p>No parties found.</p>
                    </div>
                )}
            </div>
        </main>
    )
}
