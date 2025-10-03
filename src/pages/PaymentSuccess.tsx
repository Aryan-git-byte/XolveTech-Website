import React, { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { CheckCircle, Package, Clock, ArrowRight, Download, Star } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { supabase } from '../lib/supabase'

interface OrderDetails {
  id: string
  cf_order_id: string
  payment_id?: string
  name: string
  email: string
  total_amount: number
  currency: string
  status: string
  payment_status: string
  cart_items: any[]
  created_at: string
}

export const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams()
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const orderId = searchParams.get('order_id')
  const paymentIdFromUrl = searchParams.get('payment_id')

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails()
    } else {
      setError('Order ID not found')
      setLoading(false)
    }
  }, [orderId])

  const fetchOrderDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single()

      if (error) throw error
      setOrderDetails(data)
    } catch (error) {
      console.error('Error fetching order details:', error)
      setError('Failed to load order details')
    } finally {
      setLoading(false)
    }
  }

  // Get the payment ID - prefer database value, fallback to URL param
  const getPaymentId = () => {
    if (orderDetails?.payment_id) {
      return orderDetails.payment_id
    }
    if (paymentIdFromUrl && paymentIdFromUrl !== 'processing') {
      return paymentIdFromUrl
    }
    return 'Processing...'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (error || !orderDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-600 mb-4">
            <Package className="w-12 h-12 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Success Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful! 🎉</h1>
            <p className="text-lg text-gray-600">
              Thank you for your order! Your STEM learning journey begins now.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-medium text-gray-900">{orderDetails.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment ID</p>
                  <p className="font-medium text-gray-900">{getPaymentId()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="font-medium text-gray-900">
                    {new Date(orderDetails.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="font-medium text-green-600 text-lg">
                    ₹{orderDetails.total_amount}
                  </p>
                </div>
              </div>

              {/* Payment Status Badge */}
              <div className="mb-6">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Payment Completed
                </div>
              </div>

              {/* Order Items */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Items Ordered</h3>
                <div className="space-y-4">
                  {orderDetails.cart_items?.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
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
                          <p className="font-medium text-gray-900">{item.product.title}</p>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-medium text-gray-900">
                        ₹{item.product.price * item.quantity}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* What's Next */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center space-x-2 text-blue-700 mb-4">
                <Clock className="w-5 h-5" />
                <h3 className="text-lg font-semibold">What Happens Next?</h3>
              </div>
              <div className="space-y-3 text-blue-600">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">1</div>
                  <p><strong>Order Review:</strong> Our team will review and confirm your order within 24 hours</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">2</div>
                  <p><strong>Kit Preparation:</strong> We'll carefully pack your STEM kit with all components</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">3</div>
                  <p><strong>Shipping:</strong> Your kit will be shipped within 48 hours of confirmation</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">4</div>
                  <p><strong>Delivery:</strong> Expect delivery within 8-10 days across India</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
              <div className="space-y-3">
                <p className="text-gray-600 text-sm">
                  Questions about your order? Our team is here to help!
                </p>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <strong>Email:</strong> xolvetech@gmail.com
                  </p>
                  <p className="text-gray-700">
                    <strong>WhatsApp:</strong> +91 9386387397
                  </p>
                </div>
                <a
                  href="https://wa.me/919386387397"
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors w-full justify-center"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Learning Resources */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Start Learning Now</h3>
              <p className="text-gray-600 text-sm mb-4">
                While you wait for your kit, explore our learning resources!
              </p>
              <div className="space-y-3">
                <Link
                  to="/learning"
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Guides</span>
                </Link>
                <Link
                  to="/how-it-works"
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Package className="w-4 h-4" />
                  <span>How It Works</span>
                </Link>
              </div>
            </div>

            {/* Review Prompt */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-3">
                <Star className="w-5 h-5 text-yellow-300" />
                <h3 className="text-lg font-semibold">Love XolveTech?</h3>
              </div>
              <p className="text-orange-100 text-sm mb-4">
                Share your experience and help other young innovators discover STEM learning!
              </p>
              <a
                href="https://instagram.com/xolvetech"
                className="inline-flex items-center px-4 py-2 bg-white text-orange-600 rounded-md hover:bg-gray-100 transition-colors text-sm font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                Follow @xolvetech
              </a>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/products">
            <Button variant="outline" className="flex items-center space-x-2">
              <Package className="w-4 h-4" />
              <span>Shop More Kits</span>
            </Button>
          </Link>
          <Link to="/">
            <Button className="flex items-center space-x-2">
              <span>Back to Home</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}