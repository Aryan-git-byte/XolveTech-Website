/*
  # Razorpay Webhook Handler

  1. Purpose
    - Handles payment status updates from Razorpay
    - Verifies webhook signature for security
    - Updates order status in database

  2. Security
    - Validates webhook signature
    - Uses Supabase service role for database updates
    - Logs all webhook events

  3. Database Updates
    - Updates payment_status, payment_amount, payment_method
    - Records payment_time and webhook_data
    - Updates order status based on payment result
*/

import { createClient } from 'npm:@supabase/supabase-js@2'
import { crypto } from 'https://deno.land/std@0.177.0/crypto/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-razorpay-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

async function verifyWebhookSignature(
  body: string,
  signature: string,
  secret: string
): Promise<boolean> {
  try {
    const expectedSignature = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )

    const computedSignature = await crypto.subtle.sign(
      'HMAC',
      expectedSignature,
      new TextEncoder().encode(body)
    )

    const computedHex = Array.from(new Uint8Array(computedSignature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

    return signature === computedHex
  } catch (error) {
    console.error('Signature verification error:', error)
    return false
  }
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get webhook secret from environment
    const webhookSecret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET')
    if (!webhookSecret) {
      throw new Error('Webhook secret not configured')
    }

    // Get Supabase credentials
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get request body and signature
    const body = await req.text()
    const signature = req.headers.get('x-razorpay-signature')

    if (!signature) {
      throw new Error('Missing webhook signature')
    }

    // Verify webhook signature
    const isValid = await verifyWebhookSignature(body, signature, webhookSecret)
    if (!isValid) {
      throw new Error('Invalid webhook signature')
    }

    // Parse webhook payload
    const payload = JSON.parse(body)
    const event = payload.event
    const paymentData = payload.payload.payment.entity

    console.log('Webhook received:', event, paymentData.id)

    // Handle payment events
    if (event === 'payment.captured' || event === 'payment.failed') {
      const orderId = paymentData.order_id
      const paymentStatus = event === 'payment.captured' ? 'completed' : 'failed'
      const orderStatus = event === 'payment.captured' ? 'pending_review' : 'payment_failed'

      // Update order in database
      const { error } = await supabase
        .from('orders')
        .update({
          payment_status: paymentStatus,
          payment_amount: paymentData.amount / 100, // Convert from paise to rupees
          payment_currency: paymentData.currency,
          payment_method: paymentData.method,
          payment_time: new Date(paymentData.created_at * 1000).toISOString(),
          status: orderStatus,
          webhook_data: paymentData,
          updated_at: new Date().toISOString(),
        })
        .eq('cf_order_id', orderId) // Using cf_order_id field to store Razorpay order_id

      if (error) {
        console.error('Database update error:', error)
        throw new Error('Failed to update order')
      }

      console.log(`Order ${orderId} updated with status: ${paymentStatus}`)
    }

    return new Response(
      JSON.stringify({ success: true, event }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Webhook processing error:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Webhook processing failed',
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})