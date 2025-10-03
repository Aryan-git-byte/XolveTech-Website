import React, { useState, useEffect } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Send, AlertCircle, CheckCircle, User, Mail, Package, MessageSquare } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { EmailConfirmationGuard } from '../auth/EmailConfirmationGuard'

interface ComponentRequestModalProps {
  isOpen: boolean
  onClose: () => void
}

interface FormData {
  name: string
  email: string
  component: string
  reason: string
}

interface FormErrors {
  name?: string
  email?: string
  component?: string
}

export const ComponentRequestModal: React.FC<ComponentRequestModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth()
  const [formData, setFormData] = useState<FormData>({
    name: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    component: '',
    reason: ''
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [submitMessage, setSubmitMessage] = useState('')

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setFormData({ 
        name: user?.user_metadata?.full_name || '', 
        email: user?.email || '', 
        component: '', 
        reason: '' 
      })
      setErrors({})
      setSubmitStatus('idle')
      setSubmitMessage('')
    }
  }, [isOpen, user])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.component.trim()) {
      newErrors.component = 'Component name is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
    
    // Clear submit status when user makes changes
    if (submitStatus !== 'idle') {
      setSubmitStatus('idle')
      setSubmitMessage('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const { error } = await supabase
        .from('component_requests')
        .insert([
          {
            name: formData.name.trim(),
            email: formData.email.trim(),
            component: formData.component.trim(),
            reason: formData.reason.trim() || null,
            created_at: new Date().toISOString()
          }
        ])

      if (error) {
        throw error
      }

      setSubmitStatus('success')
      setSubmitMessage('Your component request has been submitted successfully! We\'ll review it and get back to you soon.')
      
      // Auto-close modal after success
      setTimeout(() => {
        onClose()
      }, 2000)

    } catch (error) {
      console.error('Error submitting component request:', error)
      setSubmitStatus('error')
      setSubmitMessage('Failed to submit your request. Please try again or contact support.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Request a Component">
      <div className="space-y-6">
        <EmailConfirmationGuard message="Please confirm your email address to request components.">
          <div className="text-center text-gray-600">
            <p>Can't find the component you need? Let us know what you're looking for and we'll consider adding it to our catalog.</p>
          </div>

          {/* Success/Error Messages */}
          {submitStatus === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-green-800 font-medium">Request Submitted!</p>
                <p className="text-green-700 text-sm mt-1">{submitMessage}</p>
              </div>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-red-800 font-medium">Submission Failed</p>
                <p className="text-red-700 text-sm mt-1">{submitMessage}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <User className="w-4 h-4 mr-2 text-gray-500" />
                Your Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={isSubmitting || Boolean(user?.user_metadata?.full_name)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                  errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Mail className="w-4 h-4 mr-2 text-gray-500" />
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={isSubmitting || Boolean(user?.email)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                  errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter your email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Component Field */}
            <div>
              <label htmlFor="component" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Package className="w-4 h-4 mr-2 text-gray-500" />
                Component Requested *
              </label>
              <input
                type="text"
                id="component"
                value={formData.component}
                onChange={(e) => handleInputChange('component', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.component ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="e.g., Arduino Uno, Servo Motor, LED Matrix"
                disabled={isSubmitting}
              />
              {errors.component && (
                <p className="mt-1 text-sm text-red-600">{errors.component}</p>
              )}
            </div>

            {/* Reason Field (Optional) */}
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <MessageSquare className="w-4 h-4 mr-2 text-gray-500" />
                Reason for Request (Optional)
              </label>
              <textarea
                id="reason"
                value={formData.reason}
                onChange={(e) => handleInputChange('reason', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Tell us why you need this component or how you plan to use it..."
                disabled={isSubmitting}
              />
            </div>

            {/* Submit Button */}
            <div className="flex space-x-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || submitStatus === 'success'}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Request</span>
                  </>
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>

          {/* Help Text */}
          <div className="text-center text-sm text-gray-500 pt-4 border-t">
            <p>We review all component requests and will email you when new components are available.</p>
          </div>
        </EmailConfirmationGuard>
      </div>
    </Modal>
  )
}
