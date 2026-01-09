'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Scan, TrendingUp, Lightbulb, Settings } from 'lucide-react'

export default function Home() {
  const [businessName, setBusinessName] = useState('')
  const [mobile, setMobile] = useState('')
  const [loading, setLoading] = useState(false)
  const [dailyAdvice, setDailyAdvice] = useState(null)

  // Mock data for the chart - in a real app this would come from the DB
  const data = [
    { name: 'Mon', sale: 4000, expense: 2400 },
    { name: 'Tue', sale: 3000, expense: 1398 },
    { name: 'Wed', sale: 2000, expense: 9800 },
    { name: 'Thu', sale: 2780, expense: 3908 },
    { name: 'Fri', sale: 1890, expense: 4800 },
    { name: 'Sat', sale: 2390, expense: 3800 },
    { name: 'Sun', sale: 3490, expense: 4300 },
  ];

  useEffect(() => {
    // Load daily advice from latest scan
    const saved = localStorage.getItem('latestScan')
    if (saved) {
      setDailyAdvice(JSON.parse(saved))
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('customers')
        .insert([{ business_name: businessName, mobile: mobile }])

      if (error) throw error

      alert('Party Added Successfully!')
      setBusinessName('')
      setMobile('')
    } catch (error) {
      console.error('Error adding customer:', error)
      alert('Error adding customer. Check console.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 pb-24">
      {/* Header */}
      <header className="bg-slate-900 text-white p-6 shadow-md flex justify-between items-center sticky top-0 z-50">
        <div>
          <Link href="/settings">
            <h1 className="text-2xl font-bold tracking-wide flex items-center gap-2">
              Sudarshan CRM <span className="text-slate-500 text-xs border border-slate-700 rounded px-1">AI</span>
            </h1>
          </Link>
          <p className="text-xs text-slate-400">PRO Version</p>
        </div>
        <div className="flex gap-2">
          <Link href="/settings" className="bg-slate-800 p-2 rounded-full shadow-lg border border-slate-700 active:scale-95 transition">
            <Settings size={24} className="text-slate-300" />
          </Link>
          <Link href="/scan" className="bg-blue-600 p-2 rounded-full shadow-lg border-2 border-slate-800 active:scale-95 transition">
            <Scan size={24} />
          </Link>
        </div>
      </header>

      <div className="p-4 pt-6 max-w-md mx-auto space-y-6">

        {/* Visual Dashboard - Sales Chart */}
        <div className="bg-white rounded-xl shadow p-4 border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="text-green-600" size={24} />
            <h2 className="text-lg font-bold text-slate-800">Weekly Sales vs Expense</h2>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="sale" fill="#16a34a" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Advice Card */}
        {dailyAdvice && (
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl shadow p-5 border border-yellow-200">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="text-yellow-600" size={24} />
              <h2 className="text-lg font-bold text-slate-800">Daily Wisdom</h2>
            </div>

            <div className="flex justify-between mb-4 text-sm font-semibold bg-white/50 p-3 rounded-lg">
              <div className="text-center">
                <p className="text-slate-500 text-xs">Analyzed Sale</p>
                <p className="text-green-700 text-lg">₹{dailyAdvice.sale}</p>
              </div>
              <div className="text-center">
                <p className="text-slate-500 text-xs">Analyzed Expense</p>
                <p className="text-red-600 text-lg">₹{dailyAdvice.expense}</p>
              </div>
            </div>

            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">Growth Tips</h3>
            <ul className="space-y-2">
              {dailyAdvice.action_points?.slice(0, 3).map((tip, idx) => (
                <li key={idx} className="text-slate-700 text-sm flex gap-2">
                  <span className="text-yellow-600">•</span> {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Add Customer Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">Add New Customer</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="businessName" className="block text-sm font-semibold text-slate-700">
                Business Name / Dukaan ka Naam
              </label>
              <input
                id="businessName"
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Enter shop name"
                className="w-full text-lg p-4 rounded-lg border-2 border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="mobile" className="block text-sm font-semibold text-slate-700">
                Mobile Number
              </label>
              <input
                id="mobile"
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter 10-digit number"
                className="w-full text-lg p-4 rounded-lg border-2 border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold text-xl py-4 rounded-lg shadow-md transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Customer'}
            </button>
          </form>
        </div>

        {/* Navigation Link to View Parties */}
        <div className="text-center">
          <Link href="/parties" className="text-blue-700 font-semibold text-lg underline p-4 inline-block">
            View All Parties &rarr;
          </Link>
        </div>
      </div>
    </main>
  )
}
