/*
  # Create Razorpay Order Function

  1. Purpose
    - Creates a Razorpay order for payment processing
    - Validates order data and amount
    - Returns order_id for frontend checkout

  2. Security
    - Uses Supabase secrets for API keys
    - Validates request data
    - Handles CORS properly

  3. Response
    - Returns Razorpay order_id on success
    - Provides error messages on failure
*/

import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface OrderRequest {
  amount: number
  currency: string
  receipt: string
  customer_details: {
    name: string
    email: string
    contact: string
  }
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get Razorpay credentials from Supabase secrets
    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID')
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET')

    if (!razorpayKeyId || !razorpayKeySecret) {
      throw new Error('Razorpay credentials not configured')
    }

    // Parse request body
    const orderData: OrderRequest = await req.json()

    // Validate required fields
    if (!orderData.amount || !orderData.currency || !orderData.receipt) {
      throw new Error('Missing required order fields')
    }

    // Validate amount (should be in paise for INR)
    if (orderData.amount < 100) {
      throw new Error('Amount should be at least ₹1 (100 paise)')
    }

    // Create Razorpay order
    const razorpayOrder = {
      amount: orderData.amount * 100, // Convert to paise
      currency: orderData.currency,
      receipt: orderData.receipt,
      notes: {
        customer_name: orderData.customer_details.name,
        customer_email: orderData.customer_details.email,
        customer_contact: orderData.customer_details.contact,
      }
    }

    // Make API call to Razorpay
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${razorpayKeyId}:${razorpayKeySecret}`)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(razorpayOrder),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Razorpay API error:', errorData)
      throw new Error(`Razorpay API error: ${response.status}`)
    }

    const order = await response.json()

    return new Response(
      JSON.stringify({
        success: true,
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        key_id: razorpayKeyId, // Safe to send key_id to frontend
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Error creating Razorpay order:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create order',
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})