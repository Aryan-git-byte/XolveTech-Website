import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { ShoppingCart, Package, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'

export const TestOrder: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    testType: 'payment',
    notes: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    // Simulate test order submission
    try {
      // In a real implementation, this would send data to your backend
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setSubmitStatus('success')
      setFormData({
        name: '',
        email: '',
        phone: '',
        testType: 'payment',
        notes: ''
      })
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <>
      <Helmet>
        <title>Test Order - XolveTech</title>
        <meta name="description" content="Submit a test order for XolveTech STEM learning kits" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Order Submission</h1>
            <p className="text-lg text-gray-600">
              Help us test our ordering system before the official launch on August 3rd
            </p>
          </div>

          {/* Test Order Form */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-center space-x-2 text-green-800">
                  <CheckCircle className="w-5 h-5" />
                  <p className="font-medium">Test order submitted successfully!</p>
                </div>
                <p className="text-green-700 mt-1">
                  Thank you for helping us test our system. We'll contact you soon with updates.
                </p>
              </div>
            )}
            
            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-center space-x-2 text-red-800">
                  <AlertCircle className="w-5 h-5" />
                  <p className="font-medium">There was an error submitting your test order.</p>
                </div>
                <p className="text-red-700 mt-1">Please try again or contact us directly.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                />
                
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                />
              </div>

              <Input
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+91 9876543210"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Test Type
                </label>
                <select
                  name="testType"
                  value={formData.testType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                >
                  <option value="payment">Payment Gateway Test</option>
                  <option value="shipping">Shipping Calculation Test</option>
                  <option value="inventory">Inventory Management Test</option>
                  <option value="general">General System Test</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Any specific aspects you'd like us to test or feedback you want to provide..."
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex items-center space-x-2 text-blue-700 mb-2">
                  <Package className="w-5 h-5" />
                  <span className="font-medium">Test Order Information</span>
                </div>
                <ul className="text-sm text-blue-600 space-y-1">
                  <li>• This is a test submission for system validation</li>
                  <li>• No actual payment will be processed</li>
                  <li>• No products will be shipped</li>
                  <li>• We'll contact you with test results and feedback</li>
                </ul>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3"
              >
                {isSubmitting ? 'Submitting Test Order...' : 'Submit Test Order'}
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              Questions about testing? Contact our team directly:
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:xolvetech@gmail.com"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Email: xolvetech@gmail.com
              </a>
              <a
                href="https://wa.me/919386387397"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp: +91 9386387397
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}