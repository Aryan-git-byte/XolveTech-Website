import React from 'react'
import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, ArrowLeft, Shield } from 'lucide-react'

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            to="/" 
            className="inline-flex items-center space-x-2 text-green-100 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Shield className="w-12 h-12 text-green-200 mr-3" />
              <h1 className="text-4xl font-bold">Privacy Policy</h1>
            </div>
            <p className="text-xl text-green-100">
              Last Updated: July 5, 2025
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
                Thank you for visiting XolveTech. We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website or interact with our products and services.
              </p>

              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
                  <p className="text-gray-700 mb-4">
                    We collect minimal personal information necessary to process orders and improve our services:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li><strong>Personal Details:</strong> Name, phone number, email address, and delivery address (when placing an order).</li>
                    <li><strong>Order Information:</strong> Products purchased, and delivery details.</li>
                    <li><strong>Communication Data:</strong> WhatsApp messages, form responses, and customer support interactions.</li>
                  </ul>
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-800 font-medium">
                      We do not store any payment card or bank details.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
                  <p className="text-gray-700 mb-4">
                    We use the data we collect for the following purposes:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>To process and deliver your orders.</li>
                    <li>To communicate order updates and respond to inquiries.</li>
                    <li>To improve our website, kits, and services.</li>
                    <li>To provide learning resources and updates if opted in.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Data Storage and Security</h2>
                  <p className="text-gray-700">
                    Your personal data is stored securely using encrypted databases and protected platforms like Supabase. Only authorized team members have access, and we do not share or sell your data with third parties.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Cookies and Analytics</h2>
                  <p className="text-gray-700">
                    We may use cookies or basic analytics tools to understand website traffic and improve user experience. These do not collect personal data.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Third-Party Links</h2>
                  <p className="text-gray-700">
                    Our website may contain links to YouTube videos, WhatsApp, or external resources. We are not responsible for the privacy practices of these third-party sites.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights</h2>
                  <p className="text-gray-700 mb-4">
                    You may request to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>View the data we have collected about you.</li>
                    <li>Correct or update your details.</li>
                    <li>Request deletion of your data from our systems.</li>
                  </ul>
                  <p className="text-gray-700 mt-4">
                    For any privacy-related request, email us at <a href="mailto:xolvetech@gmail.com" className="text-blue-600 hover:text-blue-800">xolvetech@gmail.com</a>.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Updates to This Policy</h2>
                  <p className="text-gray-700">
                    We may update this policy from time to time. The latest version will always be available on our website.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Contact Us</h2>
                  <p className="text-gray-700 mb-4">
                    If you have any questions or concerns about this policy or your data, please contact us:
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-blue-600" />
                      <a href="mailto:xolvetech@gmail.com" className="text-blue-600 hover:text-blue-800">
                        xolvetech@gmail.com
                      </a>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-green-600" />
                      <a href="tel:+919386387397" className="text-green-600 hover:text-green-800">
                        +91 9386387397
                      </a>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-red-600" />
                      <span className="text-gray-700">Patna, Bihar</span>
                    </div>
                  </div>
                </section>
              </div>

              <div className="mt-12 p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-lg text-center">
                <p className="text-lg font-semibold text-green-900">
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