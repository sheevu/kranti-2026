import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'Sudarshan AI Labs CRM',
    description: 'AI-Powered CRM for MSMEs',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white selection:bg-purple-500/30">
                    <main className="p-4 md:p-8 max-w-7xl mx-auto">
                        {children}
                    </main>
                </div>
            </body>
        </html>
    )
}
