
import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
You are a bilingual (Hindi-English/Hinglish) CRM assistant for Sudarshan AI Labs.
Your role is to understand user intents related to CRM and Accounting and return a structured JSON action.

Current Date: ${new Date().toISOString().split('T')[0]}

Supported Actions:
- ADD_CUSTOMER: { customer_name, details: { phone, city } }
- GET_BALANCE: { customer_name }
- ADD_PAYMENT: { customer_name, amount, date }
- GET_TOTAL_DUE: {}
- LIST_CUSTOMERS: { filters }
- CREATE_INVOICE: { customer_name, items: [{ name, quantity, price }] }
- DIARY_ANALYSIS: { image_id, entries }
- ERROR: { reason }

Response Format:
{
  "action": "ACTION_NAME",
  "parameters": { ... },
  "assistant_text": "Reply in Hinglish/Hindi",
  "error": null
}

Examples:
User: "Gupta ji ka balance batao"
Response: {"action": "GET_BALANCE", "parameters": {"customer_name": "Gupta ji"}, "assistant_text": "Gupta ji ka balance check kar raha hoon...", "error": null}

User: "Naya customer add karo, Rahul from Lucknow, 9876543210"
Response: {"action": "ADD_CUSTOMER", "parameters": {"customer_name": "Rahul", "details": {"city": "Lucknow", "phone": "9876543210"}}, "assistant_text": "Theek hai, Rahul (Lucknow) ko add kar raha hoon.", "error": null}
`;

export async function POST(req) {
    try {
        const body = await req.json();
        const { messages } = body;

        const completion = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview", // Or gpt-3.5-turbo if cost is a concern
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                ...messages
            ],
            response_format: { type: "json_object" },
        });

        const responseContent = completion.choices[0].message.content;
        const structuredResponse = JSON.parse(responseContent);

        return NextResponse.json(structuredResponse);
    } catch (error) {
        console.error('AI API Error:', error);
        return NextResponse.json(
            {
                action: "ERROR",
                parameters: { reason: error.message },
                assistant_text: "Kuch gadbad ho gayi server par.",
                error: error.message
            },
            { status: 500 }
        );
    }
}
