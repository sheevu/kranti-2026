'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import { ArrowLeft, Save, Building2, MapPin, Users, Target, Loader2 } from 'lucide-react'

export default function SettingsPage() {
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [formData, setFormData] = useState({
        business_category: 'Grocery',
        location_type: 'Main Market',
        customer_type: '',
        revenue_goal: ''
    })

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        try {
            const { data, error } = await supabase
                .from('business_profile')
                .select('*')
                .eq('id', 1) // Using ID 1 for single-user demo
                .single()

            if (data) {
                setFormData({
                    business_category: data.business_category || 'Grocery',
                    location_type: data.location_type || 'Main Market',
                    customer_type: data.customer_type || '',
                    revenue_goal: data.revenue_goal || ''
                })
            }
        } catch (err) {
            console.error('Error fetching profile:', err)
        } finally {
            setFetching(false)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const saveSettings = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { error } = await supabase
                .from('business_profile')
                .upsert({
                    id: 1,
                    ...formData,
                    updated_at: new Date()
                })

            if (error) throw error
            alert('Settings Saved Successfully!')
        } catch (error) {
            console.error('Error saving settings:', error)
            alert('Failed to save settings.')
        } finally {
            setLoading(false)
        }
    }

    if (fetching) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-slate-100 pb-10">
            <header className="bg-slate-900 text-white p-4 shadow-md sticky top-0 z-10 flex items-center">
                <Link href="/" className="mr-4 p-2 hover:bg-slate-800 rounded-full transition">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-xl font-bold tracking-wide">Business Settings</h1>
            </header>

            <div className="p-4 pt-6 max-w-md mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
                    <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Building2 className="text-blue-600" /> My Dukaan Profile
                    </h2>

                    <form onSubmit={saveSettings} className="space-y-6">

                        {/* Category */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-700">Business Category</label>
                            <div className="relative">
                                <select
                                    name="business_category"
                                    value={formData.business_category}
                                    onChange={handleChange}
                                    className="w-full text-lg p-4 pl-12 rounded-lg border-2 border-slate-300 focus:border-blue-600 outline-none appearance-none bg-white"
                                >
                                    <option>Grocery</option>
                                    <option>Medical</option>
                                    <option>Apparel</option>
                                    <option>Hardware</option>
                                    <option>Restaurant</option>
                                    <option>Other</option>
                                </select>
                                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            </div>
                        </div>

                        {/* Location */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-700">Location Type</label>
                            <div className="relative">
                                <select
                                    name="location_type"
                                    value={formData.location_type}
                                    onChange={handleChange}
                                    className="w-full text-lg p-4 pl-12 rounded-lg border-2 border-slate-300 focus:border-blue-600 outline-none appearance-none bg-white"
                                >
                                    <option>Main Market</option>
                                    <option>Residential Colony</option>
                                    <option>Rural/Village</option>
                                    <option>Highway</option>
                                </select>
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            </div>
                        </div>

                        {/* Key Customer */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-700">Who is your Key Customer?</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="customer_type"
                                    value={formData.customer_type}
                                    onChange={handleChange}
                                    placeholder="e.g. Daily wage workers"
                                    className="w-full text-lg p-4 pl-12 rounded-lg border-2 border-slate-300 focus:border-blue-600 outline-none"
                                    required
                                />
                                <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            </div>
                        </div>

                        {/* Revenue Goal */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-700">Monthly Revenue Goal (₹)</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="revenue_goal"
                                    value={formData.revenue_goal}
                                    onChange={handleChange}
                                    placeholder="e.g. 50000"
                                    className="w-full text-lg p-4 pl-12 rounded-lg border-2 border-slate-300 focus:border-blue-600 outline-none"
                                    required
                                />
                                <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xl py-4 rounded-lg shadow-md transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <><Save size={24} /> Save Profile</>}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    )
}
