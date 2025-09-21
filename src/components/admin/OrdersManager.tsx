import React, { useState, useEffect } from 'react'
import { ShoppingCart, Eye, CheckCircle, Clock, Truck } from 'lucide-react'
import { Order, Product } from '../../types'
import { supabase } from '../../lib/supabase'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { sanitizeText } from '../../utils/sanitize'

interface OrderWithProduct extends Order {
  product: Product
}

export const OrdersManager: React.FC = () => {
  const [orders, setOrders] = useState<OrderWithProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<OrderWithProduct | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      
      setOrders(data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)

      if (error) throw error
      fetchOrders()
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'payment_pending':
        return 'bg-gray-100 text-gray-800'
      case 'payment_failed':
        return 'bg-red-100 text-red-800'
      case 'pending_review':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'payment_pending':
        return <Clock className="w-4 h-4" />
      case 'payment_failed':
        return <Clock className="w-4 h-4" />
      case 'pending_review':
        return <Clock className="w-4 h-4" />
      case 'cancelled':
        return <Clock className="w-4 h-4" />
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />
      case 'delivered':
        return <Truck className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading orders...</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Orders Management</h2>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-600">Orders will appear here when customers place them</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Products
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      {order.cart_items && order.cart_items.length > 0 ? (
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.cart_items[0].product.title}
                            {order.cart_items.length > 1 && (
                              <span className="text-gray-500"> +{order.cart_items.length - 1} more</span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="text-sm font-medium text-gray-900">Unknown Product</div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.name}</div>
                      <div className="text-sm text-gray-500">{order.contact}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1">{order.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">₹{order.total_amount || 0}</div>
                    <div className="text-xs text-gray-500">All inclusive</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        aria-label={`View details for order ${order.id}`}
                        onClick={() => {
                          setSelectedOrder(order)
                          setIsModalOpen(true)
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        aria-label={`Update status for order ${order.id}`}
                        className="text-sm border border-gray-300 rounded-md px-2 py-1"
                        disabled={order.status === 'delivered'}
                      >
                        <option value="payment_pending">Payment Pending</option>
                        <option value="payment_failed">Payment Failed</option>
                        <option value="pending_review">Pending Review</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedOrder && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedOrder(null)
          }}
          title="Order Details"
        >
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Product Information</h3>
              {selectedOrder.cart_items ? (
                <div className="space-y-3">
                  {selectedOrder.cart_items.map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{item.product.title}</p>
                        <p className="text-sm text-gray-700">Quantity: {item.quantity}</p>
                        <p className="text-sm text-gray-700">Price: ₹{item.product.price}</p>
                      </div>
                      <p className="font-bold text-blue-600">₹{item.product.price * item.quantity}</p>
                    </div>
                  ))}
                  <div className="border-t pt-2 flex justify-between font-bold text-lg">
                    <span className="text-gray-900">Total:</span>
                    <span className="text-blue-600">₹{selectedOrder.total_amount}</span>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-gray-900 font-medium">{selectedOrder.product?.title}</p>
                  <p className="text-gray-700">{selectedOrder.product?.description}</p>
                  <p className="text-2xl font-bold text-blue-600 mt-2">₹{selectedOrder.product?.price}</p>
                </>
              )}
            </div>
            
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Customer Information</h3>
              <div className="space-y-2">
                <p className="text-gray-900">
                  <span className="font-semibold text-gray-800">Name:</span>{' '}
                  <span className="text-gray-800" dangerouslySetInnerHTML={{ __html: sanitizeText(selectedOrder.name) }} />
                </p>
                {selectedOrder.email && (
                  <p className="text-gray-900">
                    <span className="font-semibold text-gray-800">Email:</span>{' '}
                    <span className="text-gray-800" dangerouslySetInnerHTML={{ __html: sanitizeText(selectedOrder.email) }} />
                  </p>
                )}
                <p className="text-gray-900">
                  <span className="font-semibold text-gray-800">Contact:</span>{' '}
                  <span className="text-gray-800" dangerouslySetInnerHTML={{ __html: sanitizeText(selectedOrder.contact) }} />
                </p>
                <p className="text-gray-900">
                  <span className="font-semibold text-gray-800">Address:</span>{' '}
                  <span className="text-gray-800" dangerouslySetInnerHTML={{ __html: sanitizeText(selectedOrder.address) }} />
                </p>
                {selectedOrder.pincode && (
                  <p className="text-gray-900">
                    <span className="font-semibold text-gray-800">Pincode:</span>{' '}
                    <span className="text-gray-800">{selectedOrder.pincode}</span>
                  </p>
                )}
                {selectedOrder.shipping_details?.notes && (
                  <p className="text-gray-900">
                    <span className="font-semibold text-gray-800">Notes:</span>{' '}
                    <span className="text-gray-800" dangerouslySetInnerHTML={{ __html: sanitizeText(selectedOrder.shipping_details.notes) }} />
                  </p>
                )}
              </div>
            </div>
            
            {selectedOrder.payment_status && (
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Payment Information</h3>
                <div className="space-y-2">
                  <p className="text-gray-900">
                    <span className="font-semibold text-gray-800">Payment Status:</span>
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                      selectedOrder.payment_status === 'completed' ? 'bg-green-100 text-green-800' :
                      selectedOrder.payment_status === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedOrder.payment_status}
                    </span>
                  </p>
                  {selectedOrder.payment_amount && (
                    <p className="text-gray-900">
                      <span className="font-semibold text-gray-800">Payment Amount:</span>{' '}
                      <span className="text-gray-800">₹{selectedOrder.payment_amount}</span>
                    </p>
                  )}
                  {selectedOrder.payment_method && (
                    <p className="text-gray-900">
                      <span className="font-semibold text-gray-800">Payment Method:</span>{' '}
                      <span className="text-gray-800">{selectedOrder.payment_method}</span>
                    </p>
                  )}
                  {selectedOrder.cf_order_id && (
                    <p className="text-gray-900">
                      <span className="font-semibold text-gray-800">Cashfree Order ID:</span>{' '}
                      <span className="text-gray-800">{selectedOrder.cf_order_id}</span>
                    </p>
                  )}
                  <p className="text-sm text-gray-700 mt-2 bg-blue-50 p-2 rounded">
                    <span className="font-semibold text-gray-800">Note:</span> Amount includes kit price, packaging, and shipping. No additional charges.
                  </p>
                </div>
              </div>
            )}
            
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Order Status</h3>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                  {getStatusIcon(selectedOrder.status)}
                  <span className="ml-1">{selectedOrder.status}</span>
                </span>
                <span className="text-sm text-gray-700">
                  Placed on {new Date(selectedOrder.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
            
            <div className="flex space-x-3 pt-4">
              <Button
                onClick={() => {
                  setIsModalOpen(false)
                  setSelectedOrder(null)
                }}
              >
                Close
              </Button>
              <a
                href={`https://wa.me/+91${selectedOrder.contact.replace(/\D/g, '')}?text=Hello ${selectedOrder.name}! Your order for ${selectedOrder.product?.title} has been updated.`}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Contact Customer
              </a>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
