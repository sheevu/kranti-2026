import { GoogleGenerativeAI } from "@google/generative-ai"
import { supabase } from '@/lib/supabaseClient'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function POST(req) {
    try {
        const { message, history, businessContext } = await req.json()

        // 1. Fetch Business Profile (if not provided in context, though UI should send it)
        // For robustness, we can fetch it here if missing, but let's assume passed or fetch default
        let profileData = "General Store"
        if (!businessContext) {
            const { data } = await supabase.from('business_profile').select('*').eq('id', 1).single()
            if (data) profileData = `${data.business_category} (${data.location_type})`
        } else {
            profileData = businessContext
        }

        // 2. Construct Prompt
        const model = genAI.getGenerativeModel({ model: "gemini-pro" })

        const systemPrompt = `You are 'Sudarshan', a smart and friendly AI Business Assistant for a local Indian shopkeeper running a ${profileData}.
    
    Your Goal: Help the shopkeeper increase sales, manage udhaar (credit), and reduce expenses.
    Language: Mix of Hindi and English (Hinglish) - simple, encouraging, and respectful. Use emojis occasionally.
    
    Context:
    - User is asking: "${message}"
    - Previous conversation: ${JSON.stringify(history || [])}
    
    If the user asks for "Insights" or "Summary", provide a brief bulleted list of 3 actionable tips based on general retail best practices for their shop type.
    
    Keep responses short (under 50 words) unless asked for detaied advice.
    `

        const result = await model.generateContent(systemPrompt)
        const response = await result.response
        const text = response.text()

        return Response.json({ text })
    } catch (error) {
        console.error(error)
        return Response.json({ error: 'Failed to chat' }, { status: 500 })
    }
}
