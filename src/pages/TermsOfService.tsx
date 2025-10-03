import React from 'react'
import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, ArrowLeft } from 'lucide-react'

export const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            to="/" 
            className="inline-flex items-center space-x-2 text-blue-100 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
            <p className="text-xl text-blue-100">
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
                Welcome to XolveTech! By using our website, purchasing our products, or accessing our learning resources, you agree to the following Terms of Service. Please read them carefully.
              </p>

              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                  <p className="text-gray-700">
                    By using any service or placing an order through XolveTech, you agree to abide by these Terms. If you do not agree, please refrain from using our platform.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">2. User Responsibilities</h2>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>You must provide accurate and complete information when placing an order.</li>
                    <li>You agree not to misuse, alter, or tamper with our STEM kits, content, or services.</li>
                    <li>Any attempt to reverse engineer, replicate, or resell our proprietary products or materials without permission is strictly prohibited.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Orders and Payments</h2>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>All prices are listed in INR and are inclusive of shipping—no hidden charges.</li>
                    <li>We accept payments via <strong>Razorpay</strong> (UPI, debit card, credit card, net banking).</li>
                    <li>Orders are processed only after successful payment and manual review by our team.</li>
                    <li>We reserve the right to cancel or reject any order in rare cases (e.g., delivery location issues, product unavailability, or suspected misuse).</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Shipping & Delivery</h2>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Orders are typically shipped within <strong>48 hours</strong> after approval.</li>
                    <li>Standard delivery timeframe is <strong>8–10 days</strong>, depending on location.</li>
                    <li>XolveTech is not liable for delays caused by courier services or external logistics.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Returns & Replacements</h2>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Due to the DIY nature of our products, we do not offer refunds.</li>
                    <li>We only provide replacements for damaged or missing components, if reported within <strong>3 days of delivery</strong>.</li>
                    <li>No replacements will be offered for damages caused by the user, including short circuits, physical damage, or misuse.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Intellectual Property</h2>
                  <p className="text-gray-700">
                    All kits, manuals, tutorials, videos, and content are the intellectual property of XolveTech. Unauthorized copying, sharing, or commercial use of our materials is prohibited and may result in legal action.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Learning Resources</h2>
                  <p className="text-gray-700">
                    Our learning resources (QR-linked videos, booklets, etc.) are meant for personal and educational use only. Use in schools, training centers, or other institutions requires prior written consent from XolveTech.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitation of Liability</h2>
                  <p className="text-gray-700">
                    XolveTech is not responsible for injuries, damages, or losses arising from improper use of kits or tools. Users are expected to follow all safety instructions and use the kits responsibly.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Modifications to Terms</h2>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>These Terms may be updated as our platform, products, or policies evolve.</li>
                    <li>Continued use of our services implies that you accept the latest version of these Terms.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact Us</h2>
                  <p className="text-gray-700 mb-4">
                    For questions, support, or clarifications regarding these Terms:
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-700">
                        📧 Email: <a href="mailto:xolvetech@gmail.com" className="text-blue-600 hover:text-blue-800">xolvetech@gmail.com</a>
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700">
                        📞 WhatsApp/Phone: <a href="tel:+919386387397" className="text-green-600 hover:text-green-800">+91 9386387397</a>
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-red-600" />
                      <span className="text-gray-700">📍 Location: Patna, Bihar</span>
                    </div>
                  </div>
                </section>
              </div>

              <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg text-center">
                <p className="text-lg font-semibold text-blue-900">
                  XolveTech – Learn Boldly. Build Freely.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}