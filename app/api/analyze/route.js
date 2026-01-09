
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js'

// Separate server-side client to avoid issues with client-side only singleton if any
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function POST(req) {
    try {
        const { image } = await req.json();
        const apiKey = process.env.GEMINI_API_KEY;

        // 1. Fetch Business Context
        let contextPrompt = "";
        const { data: profile } = await supabase
            .from('business_profile')
            .select('*')
            .eq('id', 1)
            .single();

        if (profile) {
            contextPrompt = `
        CONTEXT:
        - You are a strategic Business Coach for a ${profile.business_category} shop.
        - Location: ${profile.location_type}.
        - Core Customers: ${profile.customer_type}.
        - Monthly Revenue Goal: ₹${profile.revenue_goal}.
        
        Tailor your advice specifically for this context. For example, if it's a "Main Market" shop, focus on competitive pricing and display. If "Rural", focus on relationships.
        `;
        } else {
            contextPrompt = "You are an expert Munim (Indian Accountant).";
        }

        if (!apiKey) {
            return NextResponse.json({ error: "Gemini API Key missing" }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
    ${contextPrompt}
    
    Analyze this handwritten image. Extract: Total Sale, Total Purchase, Total Expense. 
    
    Return ONLY valid JSON: 
    {
        "sale": number, 
        "expense": number, 
        "net_profit": number,
        "action_points": [
            "5 specific, actionable tips in Hindi/Hinglish to help them reach their goal. Focus on specific inventory and marketing tricks relevant to their category."
        ]
    }. 
    Do not use markdown formatting.
    `;

        // Remove header from base64 string if present (data:image/jpeg;base64,...)
        const base64Data = image.split(',')[1] || image;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Data,
                    mimeType: "image/jpeg",
                },
            },
        ]);

        const response = await result.response;
        const text = response.text();

        // Clean up markdown code blocks if Gemini returns them despite instructions
        const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(jsonString);

        return NextResponse.json(data);
    } catch (error) {
        console.error("Gemini Analysis Error:", error);
        return NextResponse.json({ error: "Failed to analyze image" }, { status: 500 });
    }
}
