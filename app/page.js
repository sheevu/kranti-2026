'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

export default function Home() {
  const [businessName, setBusinessName] = useState('')
  const [mobile, setMobile] = useState('')
  const [loading, setLoading] = useState(false)

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
    <main className="min-h-screen bg-slate-100 pb-10">
      {/* Header */}
      <header className="bg-slate-900 text-white p-6 text-center shadow-md">
        <h1 className="text-2xl font-bold tracking-wide">Sudarshan CRM</h1>
      </header>

      <div className="p-4 pt-8 max-w-md mx-auto">
        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">Add New Customer</h2>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Business Name Input */}
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

            {/* Mobile Number Input */}
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

            {/* Submit Button */}
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
        <div className="mt-8 text-center">
          <Link href="/parties" className="text-blue-700 font-semibold text-lg underline p-4 inline-block">
            View All Parties &rarr;
          </Link>
        </div>
      </div>
    </main>
  )
}
