import ChatInterface from "./components/ChatInterface";
import { Users, CreditCard, Banknote, ArrowUpRight } from "lucide-react";

async function getStats() {
    // In a real app, fetch these from Supabase server-side
    // For now, static placeholders or client-fetching logic is simplified
    return {
        totalDue: 45000,
        todayCollection: 12500,
        activeCustomers: 124
    };
}

export default async function Home() {
    const stats = await getStats();

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                        Sudarshan AI Labs
                    </h1>
                    <p className="text-white/60 mt-1">CRM & Accounting Assistant</p>
                </div>
                <div className="flex gap-4">
                    {/* User Profile / Settings placeholder */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 to-red-500 border-2 border-white/20" />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Banknote className="w-24 h-24 text-white" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-white/60 text-sm font-medium">Total Due (Market)</p>
                        <h3 className="text-3xl font-bold mt-2 text-white">₹{stats.totalDue.toLocaleString()}</h3>
                        <div className="mt-4 flex items-center text-red-400 text-sm">
                            <ArrowUpRight className="w-4 h-4 mr-1" />
                            <span>Pending Collection</span>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <CreditCard className="w-24 h-24 text-white" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-white/60 text-sm font-medium">Today's Collection</p>
                        <h3 className="text-3xl font-bold mt-2 text-white">₹{stats.todayCollection.toLocaleString()}</h3>
                        <div className="mt-4 flex items-center text-green-400 text-sm">
                            <ArrowUpRight className="w-4 h-4 mr-1" />
                            <span>+12% from yesterday</span>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Users className="w-24 h-24 text-white" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-white/60 text-sm font-medium">Active Customers</p>
                        <h3 className="text-3xl font-bold mt-2 text-white">{stats.activeCustomers}</h3>
                        <div className="mt-4 flex items-center text-blue-400 text-sm">
                            <span>Lucknow Region</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area: Chat & Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Chat Interface */}
                <div className="lg:col-span-2">
                    <ChatInterface />
                </div>

                {/* Right: Quick Actions / Recent Activity */}
                <div className="glass-card p-6 h-fit">
                    <h3 className="text-xl font-semibold mb-4 text-white">Quick Actions</h3>
                    <div className="space-y-3">
                        <button className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-xl text-left transition-colors flex items-center gap-3 border border-white/5">
                            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><Users className="w-4 h-4" /></div>
                            <span>Add New Customer</span>
                        </button>
                        <button className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-xl text-left transition-colors flex items-center gap-3 border border-white/5">
                            <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400"><Banknote className="w-4 h-4" /></div>
                            <span>Create Invoice</span>
                        </button>
                        <button className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-xl text-left transition-colors flex items-center gap-3 border border-white/5">
                            <div className="p-2 bg-green-500/20 rounded-lg text-green-400"><CreditCard className="w-4 h-4" /></div>
                            <span>Record Payment</span>
                        </button>
                    </div>

                    <div className="mt-8">
                        <h3 className="text-xl font-semibold mb-4 text-white">Recent Activity</h3>
                        <div className="space-y-4 text-sm text-white/70">
                            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                <span>Payment from <strong>Rahul</strong></span>
                                <span className="text-green-400">+₹500</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                <span>Invoice to <strong>Gupta Store</strong></span>
                                <span className="text-white/40">Pending</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
