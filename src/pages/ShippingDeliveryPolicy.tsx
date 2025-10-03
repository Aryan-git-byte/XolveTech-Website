import React from 'react'
import { Mail, Phone, MapPin, ArrowLeft, Truck } from 'lucide-react'

export const ShippingDeliveryPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center space-x-2 text-blue-100 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Truck className="w-12 h-12 text-blue-200 mr-3" />
              <h1 className="text-4xl font-bold">Shipping & Delivery Policy</h1>
            </div>
            <p className="text-xl text-blue-100">
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
                At XolveTech, we aim to ensure that your order reaches you safely and on time, no matter where in India you are located.
              </p>

              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">🚚 Shipping Timeline</h2>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Orders are manually reviewed after successful payment.</li>
                    <li>Once approved, we ship your order within <strong>48 hours (2 business days)</strong>.</li>
                    <li>Delivery typically takes <strong>8–10 days</strong>, depending on your location and local courier performance.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">🛠️ Order Processing</h2>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>After you place an order and complete payment via <strong>Razorpay</strong>, it enters a 'Pending Review' stage.</li>
                    <li>Our team verifies product availability and order details before manually approving it.</li>
                    <li>Once approved, your shipment is automatically managed via our <strong>Shiprocket system</strong>.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">📦 Delivery Address</h2>
                  <p className="text-gray-700">
                    Orders are shipped to the address provided at checkout. Please ensure all contact details are accurate to avoid delivery issues.
                  </p>
                  <p className="text-gray-700 mt-2">
                    Shipping confirmation and tracking details will be sent via WhatsApp or email after dispatch.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">🌍 Shipping Coverage</h2>
                  <p className="text-gray-700">
                    Currently, we ship across <strong>India only</strong>. International shipping is not available at this time.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">⚠️ Delays & Exceptions</h2>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>While most orders arrive within 8–10 days, delays may occur due to courier delays, weather, or service-area restrictions.</li>
                    <li>XolveTech is not liable for such delays but will support you in resolving issues.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">📞 Need Help?</h2>
                  <p className="text-gray-700 mb-4">
                    For any order or delivery-related concerns:
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700">
                        <strong>WhatsApp/Call:</strong> <a href="https://wa.me/919386387397" className="text-green-600 hover:text-green-800">9386387397</a>
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-700">
                        <strong>Email:</strong> <a href="mailto:xolvetech@gmail.com" className="text-blue-600 hover:text-blue-800">xolvetech@gmail.com</a>
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-red-600" />
                      <span className="text-gray-700"><strong>Location:</strong> Patna, Bihar</span>
                    </div>
                  </div>
                </section>
              </div>

              <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg text-center">
                <p className="text-lg font-semibold text-blue-900">
                  XolveTech – Innovation Straight to Your Doorstep.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ShippingDeliveryPolicy