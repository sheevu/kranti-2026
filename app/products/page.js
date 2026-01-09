'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Share2, Plus, ShoppingBag } from 'lucide-react'

export default function Inventory() {
    const [products, setProducts] = useState([
        { id: 1, name: 'Aashirvaad Atta 10kg', stock: 12, online: true, img: '' },
        { id: 2, name: 'Tata Salt 1kg', stock: 45, online: true, img: '' },
        { id: 3, name: 'Fortune Oil 1L', stock: 8, online: false, img: '' },
        { id: 4, name: 'Maggi Masala Pack', stock: 24, online: true, img: '' },
    ])

    const toggleOnline = (id) => {
        setProducts(products.map(p => p.id === id ? { ...p, online: !p.online } : p))
    }

    const shareCatalog = () => {
        const text = `Check out our online catalog: \n\n${products.filter(p => p.online).map(p => `${p.name} (Stock: ${p.stock})`).join('\n')}`
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
    }

    return (
        <main className="min-h-screen bg-[#f3f4f6] pb-24">

            {/* Header */}
            <header className="bg-slate-900 text-white p-6 pb-6 rounded-b-3xl shadow-md sticky top-0 z-10 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Link href="/" className="p-2 bg-slate-800 rounded-full hover:bg-slate-700">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-xl font-bold">Meri Inventory</h1>
                </div>
                <button className="bg-white text-slate-900 p-2 rounded-full active:scale-95 transition">
                    <Plus size={24} />
                </button>
            </header>

            {/* Grid */}
            <div className="p-4 grid grid-cols-2 gap-4">
                {products.map(p => (
                    <div key={p.id} className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col">
                        {/* Image Placeholder */}
                        <div className="h-32 bg-slate-100 flex items-center justify-center relative">
                            {p.img ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                            ) : (
                                <ShoppingBag className="text-slate-300" size={48} />
                            )}
                            {/* Badge */}
                            <div className={`absolute top-2 right-2 px-2 py-1 rounded text-[10px] font-bold uppercase ${p.stock < 10 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                {p.stock < 10 ? 'Low Stock' : 'In Stock'}
                            </div>
                        </div>

                        <div className="p-3 flex-1 flex flex-col justify-between">
                            <div>
                                <h3 className="font-bold text-slate-800 text-sm line-clamp-2 leading-tight mb-1">{p.name}</h3>
                                <p className="text-slate-500 text-xs font-medium">Stock: {p.stock} units</p>
                            </div>

                            <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between items-center">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Online?</span>
                                <button
                                    onClick={() => toggleOnline(p.id)}
                                    className={`w-10 h-6 rounded-full p-1 transition-colors ${p.online ? 'bg-green-500' : 'bg-slate-300'}`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${p.online ? 'translate-x-4' : 'translate-x-0'}`} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Floating Share Button */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-xs px-4">
                <button
                    onClick={shareCatalog}
                    className="w-full bg-[#25d366] hover:bg-[#20ba5c] text-white font-bold py-4 rounded-xl shadow-lg shadow-green-200 flex justify-center items-center gap-2 active:scale-95 transition"
                >
                    <Share2 size={24} /> WhatsApp Catalog Share
                </button>
            </div>

        </main>
    )
}
