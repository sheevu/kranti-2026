'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Plus, Trash2, CheckCircle2, Clock, Circle } from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export default function KanbanPage() {
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)
    const [newTaskTitle, setNewTaskTitle] = useState('')

    useEffect(() => {
        fetchTasks()
    }, [])

    const fetchTasks = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('tasks')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) {
                // If table doesn't exist, we will handle it gracefully or init mock state
                console.warn("Tasks table might not exist", error)
            }

            setTasks(data || [])
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const addTask = async (e) => {
        e.preventDefault()
        if (!newTaskTitle.trim()) return

        const newTask = { title: newTaskTitle, status: 'todo' }

        // Optimistic update
        setTasks([newTask, ...tasks])
        setNewTaskTitle('')

        const { error } = await supabase.from('tasks').insert([newTask])
        if (error) {
            console.error(error)
            alert('Failed to add task. Make sure "tasks" table exists.')
            fetchTasks() // revert
        } else {
            fetchTasks() // refresh IDs
        }
    }

    const updateStatus = async (id, newStatus) => {
        // Optimistic
        setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t))

        const { error } = await supabase
            .from('tasks')
            .update({ status: newStatus })
            .eq('id', id)

        if (error) console.error(error)
    }

    const columns = [
        { id: 'todo', label: 'To Do', icon: Circle, color: 'text-slate-500', bg: 'bg-slate-50' },
        { id: 'in_progress', label: 'In Progress', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
        { id: 'done', label: 'Done', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50' },
    ]

    return (
        <main className="min-h-screen bg-white pb-24 overflow-x-hidden">
            <header className="bg-slate-900 text-white p-4 shadow-md sticky top-0 z-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/" className="hover:bg-slate-800 p-2 rounded-full transition">
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="text-xl font-bold">Tasks</h1>
                </div>
            </header>

            <div className="p-4 space-y-6">
                {/* Add Task Input */}
                <form onSubmit={addTask} className="flex gap-2">
                    <input
                        type="text"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="Add new task..."
                        className="flex-1 border-2 border-slate-300 rounded-lg p-3 text-lg focus:border-blue-600 outline-none"
                    />
                    <button type="submit" className="bg-blue-600 text-white p-3 rounded-lg font-bold">
                        <Plus size={28} />
                    </button>
                </form>

                {/* Kanban Columns */}
                <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
                    {columns.map((col) => (
                        <div key={col.id} className={twMerge("min-w-[85vw] sm:min-w-[300px] rounded-xl p-4 border snap-center", col.bg, "border-slate-200 shadow-sm")}>
                            <div className="flex items-center gap-2 mb-4 border-b pb-2 border-slate-200">
                                <col.icon className={col.color} size={20} />
                                <h2 className="font-bold text-slate-700">{col.label}</h2>
                                <span className="ml-auto bg-white px-2 py-0.5 rounded text-xs font-bold text-slate-500 border">
                                    {tasks.filter(t => t.status === col.id).length}
                                </span>
                            </div>

                            <div className="space-y-3">
                                {tasks.filter(t => t.status === col.id).map(task => (
                                    <div key={task.id || Math.random()} className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 flex flex-col gap-3">
                                        <p className="font-medium text-slate-800">{task.title}</p>

                                        <div className="flex justify-end gap-2 border-t pt-2 border-slate-100">
                                            {col.id !== 'todo' && (
                                                <button
                                                    onClick={() => updateStatus(task.id, col.id === 'done' ? 'in_progress' : 'todo')}
                                                    className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded flex items-center gap-1 hover:bg-slate-200"
                                                >
                                                    <ArrowLeft size={12} /> Move Back
                                                </button>
                                            )}
                                            {col.id !== 'done' && (
                                                <button
                                                    onClick={() => updateStatus(task.id, col.id === 'todo' ? 'in_progress' : 'done')}
                                                    className="text-xs font-bold text-white bg-blue-600 px-2 py-1 rounded flex items-center gap-1 hover:bg-blue-700"
                                                >
                                                    Next Stage <ArrowRight size={12} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {tasks.filter(t => t.status === col.id).length === 0 && (
                                    <div className="text-center py-8 text-slate-400 text-sm italic">No tasks</div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    )
}
