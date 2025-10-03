import React, { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { CheckCircle, Package, Clock, ArrowRight } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { supabase } from '../lib/supabase'

interface OrderDetails {
  id: string
  cf_order_id: string
  name: string
  email: string
  total_amount: number
  currency: string
  status: string
  payment_status: string
  cart_items: any[]
  created_at: string
}

export const OrderSuccess: React.FC = () => {
  const [searchParams] = useSearchParams()
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const orderId = searchParams.get('order_id')

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (error || !orderDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'payment_pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'pending_review':
        return 'text-yellow-600 bg-yellow-100'
      case 'confirmed':
        return 'text-blue-600 bg-blue-100'
      case 'delivered':
        return 'text-green-600 bg-green-100'
      case 'payment_failed':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'payment_pending':
        return 'Payment Pending'
      case 'pending_review':
        return 'Pending Review'
      case 'confirmed':
        return 'Confirmed'
      case 'delivered':
        return 'Delivered'
      case 'payment_failed':
        return 'Payment Failed'
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
          <p className="text-lg text-gray-600">
            Thank you for your order. We'll process it and keep you updated.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="border-b pb-4 mb-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Order Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Order ID</p>
                <p className="font-medium text-gray-900">{orderDetails.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Order Date</p>
                <p className="font-medium text-gray-900">
                  {new Date(orderDetails.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="font-medium text-gray-900">
                  ₹{orderDetails.total_amount} {orderDetails.currency}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(orderDetails.status)}`}>
                  {getStatusText(orderDetails.status)}
                </span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Items</h3>
            <div className="space-y-3">
              {orderDetails.cart_items?.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {item.product.image_urls && item.product.image_urls.length > 0 && (
                      <img
                        src={item.product.image_urls[0]}
                        alt={item.product.title}
                        width="48"
                        height="48"
                        loading="lazy"
                        className="w-12 h-12 object-cover rounded-md"
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

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <div className="flex items-center space-x-2 text-blue-700 mb-3">
            <Clock className="w-5 h-5" />
            <h3 className="text-lg font-semibold">What's Next?</h3>
          </div>
          <div className="space-y-2 text-blue-600">
            <p>• Our team will review your order within 24 hours</p>
            <p>• You'll receive an email confirmation once your order is approved</p>
            <p>• We'll send you tracking details once your order is shipped</p>
            <p>• Expected delivery: 3-7 business days</p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-100 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Need Help?</h3>
          <p className="text-gray-600 mb-3">
            If you have any questions about your order, feel free to contact us:
          </p>
          <div className="space-y-2">
            <p className="text-gray-700">
              <strong>Email:</strong> xolvetech@gmail.com
            </p>
            <p className="text-gray-700">
              <strong>Phone:</strong> +91 9386387397
            </p>
            <p className="text-gray-700">
              <strong>WhatsApp:</strong> +91 9386387397
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/products">
            <Button variant="outline" className="flex items-center space-x-2">
              <Package className="w-4 h-4" />
              <span>Continue Shopping</span>
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