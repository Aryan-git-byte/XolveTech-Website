import React, { useState } from 'react'
import { Mail, AlertCircle, CheckCircle, RefreshCw, LogIn } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../ui/Button'

interface EmailConfirmationGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  message?: string
}

export const EmailConfirmationGuard: React.FC<EmailConfirmationGuardProps> = ({ 
  children, 
  requireAuth = true,
  message = "Please confirm your email address to access this feature."
}) => {
  const { user, isEmailConfirmed, resendConfirmation } = useAuth()
  const [isResending, setIsResending] = useState(false)
  const [resendStatus, setResendStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleResendConfirmation = async () => {
    setIsResending(true)
    setResendStatus('idle')

    try {
      await resendConfirmation()
      setResendStatus('success')
    } catch (error) {
      console.error('Error resending confirmation:', error)
      setResendStatus('error')
    } finally {
      setIsResending(false)
    }
  }

  // If authentication is not required, render children
  if (!requireAuth) {
    return <>{children}</>
  }

  // If user is not logged in, show sign-in prompt
  if (!user) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
        <div className="flex items-center justify-center mb-4">
          <LogIn className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Sign In Required</h3>
        <p className="text-blue-700 mb-4">
          Please sign in to your account to access this feature.
        </p>
        <Button
          onClick={() => {
            // Trigger auth modal - we'll dispatch a custom event
            const event = new CustomEvent('openAuthModal', { detail: { mode: 'signin' } })
            window.dispatchEvent(event)
          }}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Sign In
        </Button>
      </div>
    )
  }

  // If user is logged in but email is not confirmed, show confirmation prompt
  if (!isEmailConfirmed) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-6 h-6 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">Email Confirmation Required</h3>
            <p className="text-yellow-800 mb-4">
              {message} We've sent a confirmation email to <strong>{user.email}</strong>. 
              Please check your inbox and click the confirmation link.
            </p>

            {resendStatus === 'success' && (
              <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
                <div className="flex items-center space-x-2 text-green-800">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Confirmation email sent successfully!</span>
                </div>
              </div>
            )}

            {resendStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                <div className="flex items-center space-x-2 text-red-800">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Failed to send confirmation email. Please try again.</span>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleResendConfirmation}
                disabled={isResending}
                className="flex items-center space-x-2 bg-yellow-600 hover:bg-yellow-700"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    <span>Resend Confirmation Email</span>
                  </>
                )}
              </Button>
              <div className="text-sm text-yellow-700">
                <p>Check your spam folder if you don't see the email.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // If user is logged in and email is confirmed, render children
  return <>{children}</>
}