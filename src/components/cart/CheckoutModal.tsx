import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, ShoppingCart, User, Mail, Phone, MapPin, CreditCard } from 'lucide-react'
import { useCart } from '../../contexts/CartContext'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { EmailConfirmationGuard } from '../auth/EmailConfirmationGuard'
import { 
  generateOrderId, 
  validateName, 
  validatePhone, 
  validateEmail, 
  validatePincode,
  sanitizeInput,
  initiatePayment,
  calculateDeliveryCharge
} from '../../lib/payment'

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { items, total, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentStep, setPaymentStep] = useState<'details' | 'payment'>('details')
  const [orderData, setOrderData] = useState({
    name: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    pincode: '',
    notes: ''
  })

  // Update form data when user changes
  useEffect(() => {
    setOrderData(prev => ({
      ...prev,
      name: user?.user_metadata?.full_name || prev.name,
      email: user?.email || prev.email
    }))
  }, [user])
  const [error, setError] = useState('')
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({})

  // Calculate delivery charge
  const deliveryCharge = calculateDeliveryCharge(items)
  const totalWithDelivery = total + deliveryCharge

  const validateForm = () => {
    const errors: {[key: string]: string} = {}
    
    if (!validateName(orderData.name)) {
      errors.name = 'Name should be 2-50 characters, letters only'
    }
    
    if (!validateEmail(orderData.email)) {
      errors.email = 'Please enter a valid email address'
    }
    
    if (!validatePhone(orderData.phone)) {
      errors.phone = 'Please enter a valid 10-digit Indian mobile number'
    }
    
    if (!validatePincode(orderData.pincode)) {
      errors.pincode = 'Please enter a valid 6-digit pincode'
    }
    
    if (!orderData.address.trim() || orderData.address.trim().length < 10) {
      errors.address = 'Please enter a complete address (minimum 10 characters)'
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check if cart total is less than ₹500 (product total, excluding delivery charge)
    if (total < 500) {
      setError('Minimum order value is ₹500. Please add more items to your cart.')
      return
    }
    
    if (validateForm()) {
      setPaymentStep('payment')
    }
  }

  const handlePaymentSubmit = async () => {
    setIsSubmitting(true)
    setError('')

    try {
      const orderId = generateOrderId()
      
      const paymentOrderDetails = {
        order_id: orderId,
        order_amount: totalWithDelivery * 100, // Convert rupees to paise for Razorpay
        order_currency: 'INR',
        customer_details: {
          customer_id: user?.id || `guest_${Date.now()}`,
          customer_name: sanitizeInput(orderData.name),
          customer_email: sanitizeInput(orderData.email),
          customer_phone: orderData.phone.replace(/\D/g, '')
        }
      }

      // Debug logging
      console.log('🔍 Frontend Debug - Cart total (₹):', total)
      console.log('🔍 Frontend Debug - Delivery charge (₹):', deliveryCharge)
      console.log('🔍 Frontend Debug - Total with delivery (₹):', totalWithDelivery)
      console.log('🔍 Frontend Debug - Sending amount (paise):', totalWithDelivery * 100)
      console.log('🔍 Frontend Debug - Payment order details:', paymentOrderDetails)

      const shippingDetails = {
        ...orderData,
        name: sanitizeInput(orderData.name),
        email: sanitizeInput(orderData.email),
        address: sanitizeInput(orderData.address),
        notes: sanitizeInput(orderData.notes || '')
      }

      // Initiate payment
      const result = await initiatePayment(paymentOrderDetails, items, shippingDetails)
      
      if (result.success) {
        // Payment successful - clear cart and redirect to payment success page
        clearCart()
        onClose()
        navigate(`/payment-success?order_id=${result.orderId}`)
      } else {
        setError(result.error || 'Payment gateway not configured')
      }
      
    } catch (error) {
      console.error('💥 Payment processing error:', error)
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      setError(`Payment failed: ${errorMessage}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setOrderData({
      ...orderData,
      [name]: value
    })
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: ''
      })
    }
  }

  const handleBackToDetails = () => {
    setPaymentStep('details')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-black flex items-center">
              <ShoppingCart className="w-5 h-5 mr-2" />
              {paymentStep === 'details' ? 'Shipping Details' : 'Payment'}
            </h3>
            <button
              type="button"
              aria-label="Close checkout modal"
              title="Close"
              onClick={onClose}
              className="text-black hover:text-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <EmailConfirmationGuard message="Please confirm your email address to place an order.">
          {paymentStep === 'details' ? (
            <>
              {/* Order Summary */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-black mb-3">Order Summary</h4>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        {item.product.image_urls && item.product.image_urls.length > 0 && (
                          <img
                            src={item.product.image_urls[0]}
                            alt={item.product.title}
                            width="64"
                            height="64"
                            loading="lazy"
                            className="w-16 h-16 object-cover rounded-md"
                          />
                        )}
                        <div>
                          <h5 className="font-medium text-black">{item.product.title}</h5>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-black">₹{item.product.price * item.quantity}</p>
                        <p className="text-sm text-gray-600">₹{item.product.price} each</p>
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-sm text-black">
                      <span>Subtotal:</span>
                      <span>₹{total}</span>
                    </div>
                    {deliveryCharge > 0 && (
                      <div className="flex justify-between text-sm text-black">
                        <span>Delivery Charge:</span>
                        <span>₹{deliveryCharge}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold text-black mt-1">
                      <span>Total:</span>
                      <span className="text-blue-800">₹{totalWithDelivery}</span>
                    </div>
                  </div>
                  <p className="text-sm text-black text-center mt-2">
                    {deliveryCharge > 0 
                      ? '(Includes product price, delivery & packaging)'
                      : '(Includes kit, packaging & free shipping)'
                    }
                  </p>
                </div>
              </div>

              {/* Customer Information Form */}
              <form onSubmit={handleDetailsSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black" />
                    <Input
                      name="name"
                      placeholder="Full Name"
                      value={orderData.name}
                      onChange={handleChange}
                      disabled={Boolean(user?.user_metadata?.full_name)}
                      className="pl-10"
                      error={validationErrors.name}
                      required
                    />
                  </div>
                  
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black" />
                    <Input
                      name="email"
                      type="email"
                      placeholder="Email Address"
                      value={orderData.email}
                      onChange={handleChange}
                      disabled={Boolean(user?.email)}
                      className="pl-10"
                      error={validationErrors.email}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black" />
                    <Input
                      name="phone"
                      type="tel"
                      placeholder="10-digit Mobile Number"
                      value={orderData.phone}
                      onChange={handleChange}
                      className="pl-10"
                      error={validationErrors.phone}
                      required
                    />
                  </div>
                  
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black" />
                    <Input
                      name="pincode"
                      type="text"
                      placeholder="6-digit Pincode"
                      value={orderData.pincode}
                      onChange={handleChange}
                      className="pl-10"
                      error={validationErrors.pincode}
                      required
                    />
                  </div>
                </div>

                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-black" />
                  <textarea
                    name="address"
                    placeholder="Complete Delivery Address (House/Flat, Street, City, State, Pincode)"
                    value={orderData.address}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-600"
                    style={{ borderColor: validationErrors.address ? '#dc2626' : '' }}
                    rows={4}
                    required
                  />
                  {validationErrors.address && (
                    <p className="text-sm text-red-900 mt-1 font-medium">{validationErrors.address}</p>
                  )}
                </div>

                <div>
                  <textarea
                    name="notes"
                    placeholder="Additional Notes (Optional)"
                    value={orderData.notes}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-600"
                    rows={2}
                  />
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-400 rounded-md">
                    <p className="text-red-900 text-sm font-medium">{error}</p>
                  </div>
                )}

                <div className="flex space-x-3">
                  <Button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Continue to Payment
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <>
              {/* Payment Step */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-400 rounded-md">
                  <p className="text-red-900 text-sm font-medium">{error}</p>
                </div>
              )}
              
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-black mb-3">Order Summary</h4>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-sm text-black">
                      <span>{item.product.title} x{item.quantity}</span>
                      <span>₹{item.product.price * item.quantity}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-sm text-black">
                      <span>Subtotal:</span>
                      <span>₹{total}</span>
                    </div>
                    {deliveryCharge > 0 && (
                      <div className="flex justify-between text-sm text-black">
                        <span>Delivery Charge:</span>
                        <span>₹{deliveryCharge}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold text-black mt-1">
                      <span>Total:</span>
                      <span className="text-blue-800">₹{totalWithDelivery}</span>
                    </div>
                  </div>
                  <p className="text-sm text-black text-center mt-2">
                    {deliveryCharge > 0 
                      ? 'Total includes product price, delivery & packaging. No extra charges.'
                      : 'MRP includes kit price, packaging, and shipping. No extra charges.'
                    }
                  </p>
                </div>
              </div>

              {/* Shipping Details Summary */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Shipping Details</h4>
                <div className="text-sm text-blue-900">
                  <p><strong>Name:</strong> {orderData.name}</p>
                  <p><strong>Email:</strong> {orderData.email}</p>
                  <p><strong>Phone:</strong> {orderData.phone}</p>
                  <p><strong>Address:</strong> {orderData.address}</p>
                </div>
              </div>

              {/* Payment Information */}
              <div className="mb-6 p-4 bg-blue-50 border border-blue-300 rounded-md">
                <div className="flex items-center space-x-2 text-blue-900 mb-2">
                  <CreditCard className="w-5 h-5" />
                  <span className="font-medium">Secure Payment with Razorpay</span>
                </div>
                <p className="text-sm text-blue-800">
                  Your payment is processed securely through Razorpay. We accept UPI, cards, net banking, and wallets.
                </p>
              </div>

              <div className="bg-green-50 border border-green-300 rounded-md p-4 mb-6">
                <h4 className="font-semibold text-green-900 mb-2">Order Review Process</h4>
                <p className="text-sm text-green-800">
                  After successful payment, your order will be "Pending Review". Our team reviews and confirms each order 
                  within 24 hours before shipping. Updates sent via email and WhatsApp.
                </p>
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={handlePaymentSubmit}
                  disabled={isSubmitting}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? 'Processing Payment...' : 'Pay Now'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBackToDetails}
                >
                  Back
                </Button>
              </div>
            </>
          )}
          </EmailConfirmationGuard>
        </div>
      </div>
    </div>
  )
}