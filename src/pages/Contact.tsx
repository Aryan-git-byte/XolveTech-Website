import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Mail, Phone, Instagram, MapPin, Send } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { EmailConfirmationGuard } from '../components/auth/EmailConfirmationGuard'

export const Contact: React.FC = () => {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  // Update form data when user changes
  React.useEffect(() => {
    setFormData(prev => ({
      ...prev,
      name: user?.user_metadata?.full_name || prev.name,
      email: user?.email || prev.email
    }))
  }, [user])
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const { error } = await supabase
        .from('contacts')
        .insert([formData])

      if (error) throw error

      setSubmitStatus('success')
      setFormData({ name: '', email: '', message: '' })
    } catch (error) {
      console.error('Error submitting contact form:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <>
      <Helmet>
        <title>Contact XolveTech - STEM Education Support | Arduino Kit Help India</title>
        <meta name="description" content="Contact XolveTech team for Arduino STEM kit support, custom project inquiries, and educational assistance. Email, WhatsApp, and Instagram support available." />
      </Helmet>
      
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Contact XolveTech</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Questions about our STEM kits? Want to collaborate? We'd love to connect with you!
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              
              <EmailConfirmationGuard message="Please confirm your email address to send us a message.">
                {submitStatus === 'success' && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-green-800">Thank you for your message! We'll get back to you soon.</p>
                  </div>
                )}
                
                {submitStatus === 'error' && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-800">There was an error sending your message. Please try again.</p>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={Boolean(user?.user_metadata?.full_name)}
                    required
                  />
                  
                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={Boolean(user?.email)}
                    required
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      aria-label="Message"
                      title="Your message to XolveTech"
                      placeholder="Type your message here..."
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                  </Button>
                </form>
              </EmailConfirmationGuard>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <a href="mailto:xolvetech@gmail.com" className="text-blue-600 hover:text-blue-800">
                        xolvetech@gmail.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Phone className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Phone / WhatsApp</p>
                      <a href="https://wa.me/919386387397" className="text-green-600 hover:text-green-800">
                        +91 9386387397
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                      <Instagram className="w-5 h-5 text-pink-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Instagram</p>
                      <a href="https://instagram.com/xolvetech" className="text-pink-600 hover:text-pink-800">
                        @xolvetech
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Location</p>
                      <p className="text-gray-600">Patna, Bihar, India</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-2">Quick Response via WhatsApp</h3>
                <p className="text-orange-100 mb-4">
                  For urgent inquiries or immediate support, click below to open WhatsApp chat for the fastest response.
                </p>
                <a
                  href="https://wa.me/919386387397"
                  className="inline-flex items-center space-x-2 bg-white text-orange-600 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>WhatsApp Us</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">
              Find answers to common questions about our STEM kits and services
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How long does delivery take?</h3>
              <p className="text-gray-600">
                Fast and safe delivery across India within 3-7 business days. Remote locations may take slightly longer.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">
                We accept all major payment methods through Cashfree: UPI, credit cards, debit cards, and net banking.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Do you provide assembly support?</h3>
              <p className="text-gray-600">
                Yes! Each kit includes a detailed 12-page guidebook with step-by-step instructions, and our team is available via WhatsApp for support.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What if I receive damaged components?</h3>
              <p className="text-gray-600">
                If you receive damaged or missing components, we offer free replacements if reported within 3 days of delivery. Contact us via WhatsApp with photos for quick resolution.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  )
}