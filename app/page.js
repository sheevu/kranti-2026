'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

import { Settings, Plus, Users, ShoppingBag, Receipt, ArrowRight, Phone, Bot } from 'lucide-react'
import { BarChart, Bar, Tooltip, ResponsiveContainer } from 'recharts'
import VoiceNav from './components/VoiceNav'

export default function Home() {
  const [businessName, setBusinessName] = useState('My Dukaan')
  const [currentDate, setCurrentDate] = useState('')

  useEffect(() => {
    // Set Date
    const date = new Date()
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    // eslint-disable-next-line
    setCurrentDate(date.toLocaleDateString('hi-IN', options))

    // Fetch Business Name
    const fetchProfile = async () => {
      const { data } = await supabase.from('business_profile').select('business_category').eq('id', 1).single()
      if (data?.business_category) {
        setBusinessName(`${data.business_category} Store`)
      }
    }
    fetchProfile()
  }, [])

  // Mock Data for Phase 1 (Will be dynamic in Phase 2/3)
  const metrics = [
    { title: 'Aaj ki Bikri', value: '₹12,450', color: 'border-emerald-600', text: 'text-emerald-700' },
    { title: 'Aaj ka Kharcha', value: '₹3,200', color: 'border-red-600', text: 'text-red-700' },
    { title: 'Udhaar Baaki', value: '₹8,500', color: 'border-orange-500', text: 'text-orange-700' },
    { title: 'Net Munafa', value: '₹9,250', color: 'border-blue-600', text: 'text-blue-700' },
  ]

  return (
    <main className="min-h-screen bg-[#f3f4f6] pb-24 font-sans">
      {/* Header */}
      <header className="bg-white p-6 pb-4 rounded-b-2xl shadow-sm sticky top-0 z-50">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-slate-500 text-sm font-medium mb-1">{currentDate}</p>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Namaste, {businessName} 🙏</h1>
          </div>
          <Link href="/settings" className="bg-slate-100 p-2 rounded-full hover:bg-slate-200 transition">
            <Settings className="text-slate-600" size={24} />
          </Link>
        </div>
      </header>

      {/* Quick Actions (Floating Row) */}
      <div className="flex justify-evenly gap-4 px-4 -mt-0 py-6 overflow-x-auto no-scrollbar">
        <Link href="/invoices/new" className="flex flex-col items-center gap-2 min-w-[80px]">
          <div className="bg-blue-600 p-4 rounded-full shadow-lg shadow-blue-200 active:scale-95 transition">
            <Receipt className="text-white" size={24} />
          </div>
          <span className="text-xs font-bold text-slate-700">New Bill</span>
        </Link>
        <Link href="/scan" className="flex flex-col items-center gap-2 min-w-[80px]">
          <div className="bg-emerald-600 p-4 rounded-full shadow-lg shadow-emerald-200 active:scale-95 transition">
            <Plus className="text-white" size={24} />
          </div>
          <span className="text-xs font-bold text-slate-700">Scan Diary</span>
        </Link>
        <Link href="/customers" className="flex flex-col items-center gap-2 min-w-[80px]">
          <div className="bg-purple-600 p-4 rounded-full shadow-lg shadow-purple-200 active:scale-95 transition">
            <Users className="text-white" size={24} />
          </div>
          <span className="text-xs font-bold text-slate-700">Customers</span>
        </Link>
        <Link href="/products" className="flex flex-col items-center gap-2 min-w-[80px]">
          <div className="bg-orange-600 p-4 rounded-full shadow-lg shadow-orange-200 active:scale-95 transition">
            <ShoppingBag className="text-white" size={24} />
          </div>
          <span className="text-xs font-bold text-slate-700">Inventory</span>
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="px-4 grid grid-cols-2 gap-4 mb-8">
        {metrics.map((m, idx) => (
          <div key={idx} className={`bg-white p-5 rounded-xl shadow-sm border-t-4 ${m.color} flex flex-col justify-between h-32`}>
            <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">{m.title}</p>
            <p className={`text-3xl font-bold ${m.text}`}>{m.value}</p>
          </div>
        ))}
      </div>

      {/* Visual Analytics & Tips Section */}
      <div className="px-4 space-y-6 mb-8">

        {/* Weekly Chart */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800">Hafte ka Hisaab 📊</h2>
            <select className="bg-slate-50 border-none text-xs font-bold text-slate-500 rounded p-1">
              <option>Last 7 Days</option>
            </select>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Som', sale: 4000, expense: 2400 },
                { name: 'Mangal', sale: 3000, expense: 1398 },
                { name: 'Budh', sale: 2000, expense: 9800 },
                { name: 'Guru', sale: 2780, expense: 3908 },
                { name: 'Shukr', sale: 1890, expense: 4800 },
                { name: 'Shani', sale: 2390, expense: 3800 },
                { name: 'Ravi', sale: 3490, expense: 4300 },
              ]}>
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f1f5f9' }}
                />
                <Bar dataKey="sale" fill="#059669" radius={[4, 4, 0, 0]} barSize={10} />
                <Bar dataKey="expense" fill="#dc2626" radius={[4, 4, 0, 0]} barSize={10} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Action Points Widget */}
        <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-yellow-400">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            Aaj ke liye Salah 💡
          </h2>
          <ul className="space-y-3">
            {[
              "Call Gupta ji for payment (₹5000 due)",
              "Order more Aashirvaad Atta (Low Stock)",
              "Send WhatsApp Greeting to new customers"
            ].map((tip, i) => (
              <li key={i} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                <div className="mt-1 min-w-[16px]">
                  <div className="w-4 h-4 rounded border-2 border-yellow-600 flex items-center justify-center">
                    {/* Checkbox simulation */}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-slate-700 text-sm font-medium">{tip}</p>
                </div>
                {tip.includes("Call") && (
                  <button className="bg-green-100 text-green-700 p-2 rounded-full hover:bg-green-200">
                    <Phone size={16} />
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer Nav / Voice Hint */}
      <div className="text-center p-4 pb-24">
        <p className="text-slate-400 text-xs">Press Mic and say &quot;Naya Bill&quot; or &quot;Grahak&quot;</p>
      </div>

      {/* Floating Chat Button */}
      <Link href="/chat" className="fixed bottom-6 right-6 bg-slate-900 text-white p-4 rounded-full shadow-2xl border-4 border-slate-800 active:scale-95 transition z-40 flex items-center gap-2">
        <Bot size={28} />
        <span className="font-bold pr-1">Ask AI</span>
      </Link>
    </main>
  )
}
