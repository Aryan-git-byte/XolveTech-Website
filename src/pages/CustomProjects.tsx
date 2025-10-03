import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { CheckCircle, Lightbulb, Users} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { EmailConfirmationGuard } from '../components/auth/EmailConfirmationGuard'

export const CustomProjects: React.FC = () => {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.full_name || '',
    contact_info: user?.email || '',
    project_desc: '',
    budget_range: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  // Update form data when user changes
  React.useEffect(() => {
    setFormData(prev => ({
      ...prev,
      name: user?.user_metadata?.full_name || prev.name,
      contact_info: user?.email || prev.contact_info
    }))
  }, [user])
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const { error } = await supabase
        .from('custom_projects')
        .insert([formData])

      if (error) throw error

      setSubmitStatus('success')
      setFormData({
        name: user?.user_metadata?.full_name || '',
        contact_info: user?.email || '',
        project_desc: '',
        budget_range: ''
      })
    } catch (error) {
      console.error('Error submitting custom project:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <>
      <Helmet>
        <title>Custom Arduino Robotics Projects - XolveTech | Personalized STEM Solutions India</title>
        <meta name="description" content="Request custom Arduino robotics projects from XolveTech. Personalized STEM solutions, automation systems, and educational projects designed by young innovators from Bihar, India." />
      </Helmet>
      
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Bring Your Idea to Life</h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              Have a custom project in mind? Whether it's a model, device, or automation system — 
              we can help you build it.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">✅ Affordable</h3>
              <p className="text-gray-600">
                Competitive pricing designed to fit student and hobbyist budgets
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">✅ Tailored for Your Needs</h3>
              <p className="text-gray-600">
                Custom solutions designed specifically for your requirements and goals
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">✅ Built by Young Innovators</h3>
              <p className="text-gray-600">
                Created by passionate students who understand your vision and challenges
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Submit Your Custom Project Request</h2>
            
            <EmailConfirmationGuard message="Please confirm your email address to submit a custom project request.">
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-center space-x-2 text-green-800">
                    <CheckCircle className="w-5 h-5" />
                    <p className="font-medium">Project request submitted successfully!</p>
                  </div>
                  <p className="text-green-700 mt-1">
                    Our team will review your request and get back to you within 24-48 hours.
                  </p>
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-800">There was an error submitting your request. Please try again.</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={Boolean(user?.user_metadata?.full_name)}
                    required
                    placeholder="Enter your full name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Information *
                  </label>
                  <input
                    type="text"
                    name="contact_info"
                    value={formData.contact_info}
                    onChange={handleChange}
                    disabled={Boolean(user?.email)}
                    required
                    placeholder="Email or phone number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Describe Your Idea *
                  </label>
                  <textarea
                    name="project_desc"
                    value={formData.project_desc}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Tell us about your project idea, what you want to build, its purpose, and any specific requirements..."
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Budget Range *
                  </label>
                  <select
                    aria-label="Budget Range"
                    name="budget_range"
                    value={formData.budget_range}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="">Select your budget range</option>
                    <option value="Under ₹500">Under ₹500</option>
                    <option value="₹500 - ₹1,000">₹500 - ₹1,000</option>
                    <option value="₹1,000 - ₹2,500">₹1,000 - ₹2,500</option>
                    <option value="₹2,500 - ₹5,000">₹2,500 - ₹5,000</option>
                    <option value="₹5,000 - ₹10,000">₹5,000 - ₹10,000</option>
                    <option value="Above ₹10,000">Above ₹10,000</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                >
                  {isSubmitting ? 'Submitting Request...' : 'Submit Request'}
                </button>
              </form>
            </EmailConfirmationGuard>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600">
              From idea to reality in simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Submit Request</h3>
              <p className="text-gray-600">Fill out the form with your project details and requirements</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Review & Quote</h3>
              <p className="text-gray-600">Our team reviews your idea and provides a detailed quote</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Build & Test</h3>
              <p className="text-gray-600">We build your project with regular updates on progress</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                4
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delivery</h3>
              <p className="text-gray-600">Receive your custom project with documentation</p>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  )
}