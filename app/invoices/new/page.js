'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Save, Share2 } from 'lucide-react'

export default function NewInvoice() {
    const [items, setItems] = useState([{ id: 1, name: '', qty: 1, price: 0 }])
    const [customer, setCustomer] = useState({ name: '', mobile: '' })

    const addItem = () => {
        setItems([...items, { id: Date.now(), name: '', qty: 1, price: 0 }])
    }

    const updateItem = (id, field, value) => {
        setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i))
    }

    const total = items.reduce((sum, i) => sum + (i.qty * i.price), 0)

    const handleShare = () => {
        const text = `Namaste ${customer.name || 'Grahak'},%0A%0AAapka Bill:%0A${items.map(i => `${i.name} x${i.qty} = ₹${i.qty * i.price}`).join('%0A')}%0A%0AKul Rashi: ₹${total}%0A%0AThank you!`
        window.open(`https://wa.me/?text=${text}`, '_blank')
    }

    return (
        <main className="min-h-screen bg-[#f3f4f6]">
            {/* Header */}
            <header className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-50">
                <Link href="/" className="p-2 hover:bg-slate-100 rounded-full">
                    <ArrowLeft className="text-slate-700" size={24} />
                </Link>
                <h1 className="text-xl font-bold text-slate-800">Naya Bill Banayein</h1>
            </header>

            <div className="p-4 pb-32 max-w-lg mx-auto space-y-4">

                {/* Customer Details Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-blue-500">
                    <h2 className="text-sm font-bold text-slate-500 uppercase mb-4">Grahak Details</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Grahak ka Naam</label>
                            <input
                                type="text"
                                value={customer.name}
                                onChange={e => setCustomer({ ...customer, name: e.target.value })}
                                className="w-full text-lg p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-blue-500"
                                placeholder="Naam likhein"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Mobile No</label>
                            <input
                                type="tel"
                                value={customer.mobile}
                                onChange={e => setCustomer({ ...customer, mobile: e.target.value })}
                                className="w-full text-lg p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-blue-500"
                                placeholder="10 digit number"
                            />
                        </div>
                    </div>
                </div>

                {/* Items Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-emerald-500">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-sm font-bold text-slate-500 uppercase">Items List</h2>
                        <button onClick={addItem} className="text-blue-600 text-sm font-bold">+ Add Item</button>
                    </div>

                    <div className="space-y-4">
                        {items.map((item, idx) => (
                            <div key={item.id} className="flex gap-2 items-start">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        value={item.name}
                                        onChange={e => updateItem(item.id, 'name', e.target.value)}
                                        placeholder="Item"
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                                    />
                                </div>
                                <div className="w-16">
                                    <input
                                        type="number"
                                        value={item.qty}
                                        onChange={e => updateItem(item.id, 'qty', parseInt(e.target.value) || 0)}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-center"
                                    />
                                </div>
                                <div className="w-24">
                                    <input
                                        type="number"
                                        value={item.price}
                                        onChange={e => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                                        placeholder="₹"
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Sticky Footer */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 shadow-lg flex flex-col gap-3">
                <div className="flex justify-between items-center px-2">
                    <span className="text-slate-600 font-medium">Kul Rashi:</span>
                    <span className="text-3xl font-bold text-slate-900">₹{total}</span>
                </div>
                <button
                    onClick={handleShare}
                    className="w-full bg-[#2563eb] text-white font-bold text-lg py-4 rounded-xl flex justify-center items-center gap-2 hover:bg-blue-700 active:scale-95 transition"
                >
                    <Share2 size={24} /> WhatsApp pe Bhejein
                </button>
            </div>

        </main>
    )
}
