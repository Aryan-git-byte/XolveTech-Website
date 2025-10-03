import React from 'react'
import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, ArrowLeft, RefreshCw } from 'lucide-react'

export const CancellationRefundPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            to="/" 
            className="inline-flex items-center space-x-2 text-red-100 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <RefreshCw className="w-12 h-12 text-red-200 mr-3" />
              <h1 className="text-4xl font-bold">Cancellation & Refund Policy</h1>
            </div>
            <p className="text-xl text-red-100">
              Last Updated: July 23, 2025
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8 lg:p-12">
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-600 mb-8">
                At XolveTech, we process every order with speed, care, and full transparency. While cancellations are limited due to our fast shipping, we understand valid reasons may arise. Please read our updated policy:
              </p>

              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">🔁 Order Cancellation</h2>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>You may request a cancellation only if the order has <strong>not been shipped yet</strong>.</li>
                    <li>Since we typically ship all orders within <strong>48 hours (2 days)</strong> of payment, most cancellations must be made within <strong>24 hours of placing the order</strong>.</li>
                    <li>Once an order is shipped, cancellation is no longer possible, even if it's still within 3 days.</li>
                    <li>To request cancellation, message us on WhatsApp (<strong>9386387397</strong>) or email <strong>xolvetech@gmail.com</strong> with your order ID and reason.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">🚫 No Cancellation on Custom/Component Orders</h2>
                  <p className="text-gray-700">
                    Orders for custom kits, individual components, or special requests are <strong>non-cancellable once placed</strong>.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">📦 Damaged or Defective Products</h2>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>If your item is damaged or non-functional, report it within <strong>3 days of delivery</strong>.</li>
                    <li>Send us clear photos/videos of the product and packaging for verification.</li>
                    <li>After verification, we'll issue a free replacement or store credit, based on the issue.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">🔄 Wrong or Mismatched Product</h2>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>If the product received is incorrect or not as described, notify us within <strong>3 days of delivery</strong>.</li>
                    <li>We'll investigate and provide a replacement, correction, or partial refund as needed.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">🛡️ Manufacturer Warranty Products</h2>
                  <p className="text-gray-700">
                    For items with manufacturer warranties (e.g., branded sensors/modules), contact the respective brand directly for support.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">💸 Refunds</h2>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Once a cancellation or return is approved, refunds (if applicable) are processed within <strong>3–5 business days</strong> via <strong>Razorpay</strong> to the original payment method.</li>
                    <li>For Cash on Delivery orders, we will require your UPI ID or bank account details for processing.</li>
                  </ul>
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-800 font-medium">
                      🔍 All refunds and return requests are manually reviewed by the XolveTech team to ensure fairness and accuracy.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">📞 Need Help?</h2>
                  <p className="text-gray-700 mb-4">
                    WhatsApp/Call: <a href="https://wa.me/919386387397" className="text-green-600 hover:text-green-800 font-semibold">9386387397</a>
                  </p>
                  <p className="text-gray-700 mb-2">
                    Email: <a href="mailto:xolvetech@gmail.com" className="text-blue-600 hover:text-blue-800 font-semibold">xolvetech@gmail.com</a>
                  </p>
                  <p className="text-gray-700">
                    Location: <span className="font-semibold">Patna, Bihar</span>
                  </p>
                </section>
              </div>

              <div className="mt-12 p-6 bg-gradient-to-r from-red-50 to-red-100 rounded-lg text-center">
                <p className="text-lg font-semibold text-red-900">
                  XolveTech – Building Innovations, Empowering Innovators.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}