'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'

export default function Parties() {
    const [customers, setCustomers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchCustomers()
    }, [])

    const fetchCustomers = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('customers')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setCustomers(data || [])
        } catch (err) {
            console.error('Error fetching customers:', err)
            setError('Failed to load parties.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-slate-100 pb-10">
            {/* Header */}
            <header className="bg-slate-900 text-white p-4 shadow-md sticky top-0 z-10 flex items-center">
                <Link href="/" className="mr-4 p-2 hover:bg-slate-800 rounded-full transition">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-xl font-bold tracking-wide">View Parties</h1>
            </header>

            <div className="p-4 pt-6 max-w-md mx-auto space-y-4">

                {loading && (
                    <div className="flex justify-center p-8 text-slate-500">
                        <Loader2 className="animate-spin" size={32} />
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Error!</strong>
                        <span className="block sm:inline"> {error}</span>
                    </div>
                )}

                {!loading && !error && customers.length === 0 && (
                    <div className="text-center p-8 text-slate-500 bg-white rounded-xl shadow-sm">
                        <p>No parties found.</p>
                        <Link href="/" className="text-blue-600 mt-2 inline-block font-semibold">
                            Add your first customer
                        </Link>
                    </div>
                )}

                {/* Customer List */}
                {!loading && customers.map((customer) => (
                    <div key={customer.id} className="bg-white rounded-xl shadow p-6 border-l-4 border-blue-500 flex flex-col hover:shadow-md transition-shadow">
                        <h3 className="text-xl font-bold text-slate-800 mb-1">
                            {customer.business_name || 'Unknown Business'}
                        </h3>
                        <p className="text-slate-500 font-medium text-lg flex items-center">
                            Phone: <span className="text-slate-700 ml-2">{customer.mobile || 'N/A'}</span>
                        </p>
                    </div>
                ))}
            </div>
        </main>
    )
}
