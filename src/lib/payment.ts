// Simple payment utilities - ready for new payment gateway integration
import { supabase } from './supabase'

// Razorpay types
interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  handler: (response: RazorpayResponse) => void
  prefill: {
    name: string
    email: string
    contact: string
  }
  theme: {
    color: string
  }
  modal: {
    ondismiss: () => void
  }
}

interface RazorpayResponse {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open(): void
    }
  }
}

// Load Razorpay script
const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export interface PaymentResult {
  success: boolean
  error?: string
  orderId?: string
  paymentData?: RazorpayResponse
}

export interface OrderData {
  order_id: string
  order_amount: number
  order_currency: string
  customer_details: {
    customer_id: string
    customer_name: string
    customer_email: string
    customer_phone: string
  }
}

// Generate order ID
export const generateOrderId = (): string => {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000)
  return `XLV_${timestamp}_${random}`
}

// Validate order ID format
export const validateOrderId = (orderId: string): boolean => {
  const orderIdPattern = /^XLV_\d+_\d+$/
  return orderIdPattern.test(orderId)
}

// Input validation functions
export const validateName = (name: string): boolean => {
  const namePattern = /^[a-zA-Z\s]{2,50}$/
  return namePattern.test(name.trim())
}

export const validatePhone = (phone: string): boolean => {
  const phonePattern = /^[6-9]\d{9}$/
  return phonePattern.test(phone.replace(/\D/g, ''))
}

export const validatePincode = (pincode: string): boolean => {
  const pincodePattern = /^[1-9][0-9]{5}$/
  return pincodePattern.test(pincode)
}

export const validateEmail = (email: string): boolean => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailPattern.test(email)
}

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>\"'&]/g, '')
}

// Calculate delivery charge based on simplified logic
export const calculateDeliveryCharge = (cartItems: any[]): number => {
  // If cart is empty, no delivery charge
  if (cartItems.length === 0) {
    return 0
  }

  // Check if any item in the cart is a kit
  for (const item of cartItems) {
    const product = item.product
    
    // Check if item is a kit (has kit_contents with elements or assembly_steps with content)
    if (
      (product.kit_contents && product.kit_contents.length > 0) ||
      (product.assembly_steps && product.assembly_steps.trim().length > 0)
    ) {
      return 0 // Free delivery for kits
    }
  }

  // If we reach here, cart contains only components
  return 80
}

// Create Razorpay order via Supabase Edge Function
const createRazorpayOrder = async (
  amount: number,
  currency: string,
  receipt: string,
  customerDetails: any
) => {
  // Debug logging to track the amount
  console.log('🔍 createRazorpayOrder - Amount being sent:', amount, 'paise (₹' + (amount/100) + ')')
  
  const requestBody = {
    order_amount: amount,  // FIXED: Use order_amount to match what edge function expects
    order_currency: currency,  // FIXED: Use order_currency to match what edge function expects
    receipt,
    customer_details: customerDetails
  };

  console.log('🔍 Request body being sent to edge function:', JSON.stringify(requestBody, null, 2));
  
  const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
    body: requestBody
  })

  if (error) {
    console.error('Error creating Razorpay order:', error)
    throw new Error('Failed to create payment order')
  }

  if (!data.success) {
    throw new Error(data.error || 'Failed to create payment order')
  }

  return data
}

// Save order to database
const saveOrderToDatabase = async (
  orderId: string,
  orderData: any,
  cartItems: any[],
  shippingDetails: any,
  razorpayOrderId: string
) => {
  const { error } = await supabase
    .from('orders')
    .insert([{
      id: orderId,
      name: shippingDetails.name,
      email: shippingDetails.email,
      contact: shippingDetails.phone,
      address: shippingDetails.address,
      total_amount: orderData.order_amount / 100, // FIXED: Store amount in rupees in database
      currency: orderData.order_currency,
      status: 'payment_pending',
      payment_status: 'pending',
      cf_order_id: razorpayOrderId, // Store Razorpay order_id here
      cart_items: cartItems,
      shipping_details: shippingDetails,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }])

  if (error) {
    console.error('Error saving order:', error)
    throw new Error('Failed to save order')
  }
}

// Update order status after successful payment
const updateOrderPaymentStatus = async (
  orderId: string,
  paymentData: RazorpayResponse
) => {
  const { error } = await supabase
    .from('orders')
    .update({
      status: 'payment_completed',
      payment_status: 'completed',
      payment_id: paymentData.razorpay_payment_id,
      payment_signature: paymentData.razorpay_signature,
      updated_at: new Date().toISOString()
    })
    .eq('id', orderId)

  if (error) {
    console.error('Error updating order payment status:', error)
    throw new Error('Failed to update order status')
  }
}

// Razorpay payment initiation
export const initiatePayment = async (
  orderData: OrderData,
  cartItems: any[],
  shippingDetails: any
): Promise<PaymentResult> => {
  try {
    // Debug logging
    console.log('🔍 initiatePayment - Order data:', {
      order_id: orderData.order_id,
      order_amount: orderData.order_amount,
      order_currency: orderData.order_currency,
      amount_in_rupees: orderData.order_amount / 100
    })

    // Load Razorpay script
    const scriptLoaded = await loadRazorpayScript()
    if (!scriptLoaded) {
      throw new Error('Failed to load Razorpay payment gateway')
    }

    // Create Razorpay order
    const razorpayOrder = await createRazorpayOrder(
      orderData.order_amount,  // This is already in paise from CheckoutModal
      orderData.order_currency,
      orderData.order_id,
      orderData.customer_details
    )

    console.log('🔍 Razorpay order response:', razorpayOrder)

    // Save order to database
    await saveOrderToDatabase(
      orderData.order_id,
      orderData,
      cartItems,
      shippingDetails,
      razorpayOrder.order_id
    )

    // Return promise that resolves when payment is complete
    return new Promise((resolve) => {
      const options: RazorpayOptions = {
        key: razorpayOrder.key_id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'XolveTech',
        description: 'STEM Learning Kits',
        order_id: razorpayOrder.order_id,
        handler: async (response: RazorpayResponse) => {
          try {
            console.log('Payment successful:', response)
            
            // Update order status in database
            await updateOrderPaymentStatus(orderData.order_id, response)
            
            // Payment completed successfully
            resolve({
              success: true,
              orderId: orderData.order_id,
              paymentData: response
            })
          } catch (error) {
            console.error('Error updating order after payment:', error)
            // Still resolve as success since payment was completed
            resolve({
              success: true,
              orderId: orderData.order_id,
              paymentData: response
            })
          }
        },
        prefill: {
          name: orderData.customer_details.customer_name,
          email: orderData.customer_details.customer_email,
          contact: orderData.customer_details.customer_phone
        },
        theme: {
          color: '#2563eb' // Blue theme matching your site
        },
        modal: {
          ondismiss: () => {
            resolve({
              success: false,
              error: 'Payment cancelled by user'
            })
          }
        }
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    })
    
  } catch (error) {
    console.error('Payment error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Payment failed'
    }
  }
}
