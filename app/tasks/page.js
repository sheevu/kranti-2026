'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, CheckCircle } from 'lucide-react'

export default function KaamKaaj() {
    const [tasks, setTasks] = useState([])
    const [newTask, setNewTask] = useState('')

    useEffect(() => {
        const fetchTasks = async () => {
            const { data } = await supabase.from('tasks').select('*').order('created_at', { ascending: false })
            if (data) setTasks(data)
        }
        fetchTasks()
    }, [])

    const addTask = async (e) => {
        e.preventDefault()
        if (!newTask.trim()) return

        const { data, error } = await supabase.from('tasks').insert([{ title: newTask, status: 'todo' }]).select()
        if (data) {
            setTasks([data[0], ...tasks])
            setNewTask('')
        }
    }

    const updateStatus = async (id, status) => {
        // Optimistic Update
        setTasks(tasks.map(t => t.id === id ? { ...t, status } : t))
        await supabase.from('tasks').update({ status }).eq('id', id)
    }

    const columns = [
        { id: 'todo', title: 'Karna Hai 📝', bg: 'bg-yellow-50', border: 'border-yellow-200' },
        { id: 'in_progress', title: 'Chal Raha Hai ⏳', bg: 'bg-blue-50', border: 'border-blue-200' },
        { id: 'done', title: 'Ho Gaya ✅', bg: 'bg-green-50', border: 'border-green-200' },
    ]

    return (
        <main className="min-h-screen bg-[#f3f4f6] pb-20">
            <header className="bg-slate-900 text-white p-6 pb-6 rounded-b-3xl shadow-md sticky top-0 z-10 flex text-center justify-between items-center">
                <div className="flex items-center gap-4">
                    <Link href="/" className="p-2 bg-slate-800 rounded-full hover:bg-slate-700">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-xl font-bold">Kaam Kaaj</h1>
                </div>
            </header>

            {/* Add Task Input */}
            <div className="p-4 bg-white m-4 rounded-xl shadow-sm border border-slate-100 flex gap-2">
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Naya kaam likhein..."
                    className="flex-1 p-2 bg-transparent text-lg font-medium outline-none placeholder:text-slate-400"
                />
                <button
                    onClick={addTask}
                    className="bg-slate-900 text-white p-3 rounded-lg hover:bg-slate-800 active:scale-95 transition"
                >
                    <Plus size={24} />
                </button>
            </div>

            {/* Kanban Scrollable Area */}
            <div className="flex gap-4 overflow-x-auto px-4 pb-8 no-scrollbar snap-x">
                {columns.map(col => (
                    <div key={col.id} className={`min-w-[85vw] sm:min-w-[300px] ${col.bg} p-4 rounded-2xl border-2 ${col.border} snap-center`}>
                        <h2 className="text-lg font-bold text-slate-700 mb-4 sticky top-0">{col.title}</h2>

                        <div className="space-y-3">
                            {tasks.filter(t => t.status === col.id).map(task => (
                                <div key={task.id} className="bg-white p-4 rounded-xl shadow-sm border-b-2 border-slate-100 relative group animate-in slide-in-from-bottom-2">
                                    <p className="text-slate-800 font-medium leading-snug">{task.title}</p>

                                    <div className="mt-3 flex gap-2 justify-end">
                                        {col.id !== 'todo' && (
                                            <button onClick={() => updateStatus(task.id, 'todo')} className="text-xs bg-slate-100 px-2 py-1 rounded hover:bg-slate-200">
                                                ⬅ Wap
                                            </button>
                                        )}
                                        {col.id !== 'done' && (
                                            <button onClick={() => updateStatus(task.id, col.id === 'todo' ? 'in_progress' : 'done')} className="text-xs bg-slate-900 text-white px-2 py-1 rounded hover:bg-slate-700">
                                                Aage ➡
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {tasks.filter(t => t.status === col.id).length === 0 && (
                                <div className="h-20 flex items-center justify-center text-slate-400 italic text-sm border-2 border-dashed border-slate-200 rounded-xl">
                                    Khali Hai
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </main>
    )
}
