
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize server-side Supabase client (using service role if needed, or public anon for now since RLS is open)
// Ideally, use a server-side client with appropriate permissions.
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(req) {
    try {
        const { action, parameters } = await req.json();
        let result = null;
        let message = "";

        switch (action) {
            case 'ADD_CUSTOMER':
                const { data: newCustomer, error: addError } = await supabase
                    .from('customers')
                    .insert([{
                        name: parameters.customer_name,
                        phone: parameters.details?.phone,
                        city: parameters.details?.city
                    }])
                    .select()
                    .single();

                if (addError) throw addError;
                result = newCustomer;
                message = `Added ${newCustomer.name} successfully.`;
                break;

            case 'GET_BALANCE':
                const { data: customers, error: fetchError } = await supabase
                    .from('customers')
                    .select('balance')
                    .ilike('name', `%${parameters.customer_name}%`);

                if (fetchError) throw fetchError;
                if (!customers || customers.length === 0) {
                    message = "Customer nahi mila.";
                } else {
                    // Assuming first match for simplicity
                    result = customers[0];
                    message = `Balance is ₹${customers[0].balance}`;
                }
                break;

            // Add other cases (ADD_PAYMENT, LIST_CUSTOMERS, etc.) as needed

            case 'LIST_CUSTOMERS':
                const { data: list, error: listError } = await supabase
                    .from('customers')
                    .select('*');

                if (listError) throw listError;
                result = list;
                break;

            default:
                // For actions not yet implemented or requiring no DB ops
                result = { status: 'Action not processed in backend yet' };
        }

        return NextResponse.json({ success: true, result, message });

    } catch (error) {
        console.error('Action Execution Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
