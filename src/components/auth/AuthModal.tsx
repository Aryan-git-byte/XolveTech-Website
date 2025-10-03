import React, { useState, useEffect } from 'react'
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { FcGoogle } from 'react-icons/fc'
interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: 'signin' | 'signup'
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  initialMode = 'signin' 
}) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot-password'>(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showConfirmationMessage, setShowConfirmationMessage] = useState(false)
  const [showPasswordResetMessage, setShowPasswordResetMessage] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  const { signIn, signUp, resetPassword, signInWithGoogle } = useAuth()

  // Update mode and reset form when initialMode prop changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode)
      resetForm()
    }
  }, [initialMode, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setShowConfirmationMessage(false)
    setShowPasswordResetMessage(false)

    try {
      if (mode === 'signin') {
        await signIn(email, password)
        onClose()
        resetForm()
      } else if (mode === 'signup') {
        await signUp(email, password, name)
        setShowConfirmationMessage(true)
      } else if (mode === 'forgot-password') {
        await resetPassword(email)
        setShowPasswordResetMessage(true)
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setName('')
    setError('')
    setShowConfirmationMessage(false)
    setShowPasswordResetMessage(false)
    setShowPassword(false)
  }

  const handleClose = () => {
    onClose()
    resetForm()
  }

  if (!isOpen) return null

  // Show password reset confirmation message
  if (showPasswordResetMessage) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div
            className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
            onClick={handleClose}
          />

          <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

          <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full sm:p-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Check Your Email</h3>
              <p className="text-gray-600 mb-4">
                We've sent a password reset link to <strong>{email}</strong>. 
                Please click the link in the email to reset your password.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
                <p className="text-blue-800 text-sm">
                  The link will expire in 1 hour. If you don't see the email, check your spam folder.
                </p>
              </div>
              <Button onClick={handleClose} className="w-full">
                Got it
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show confirmation message after successful signup
  if (showConfirmationMessage) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div
            className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
            onClick={handleClose}
          />

          <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

          <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full sm:p-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Check Your Email</h3>
              <p className="text-gray-600 mb-4">
                We've sent a confirmation email to <strong>{email}</strong>. 
                Please click the link in the email to confirm your account.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
                <p className="text-blue-800 text-sm">
                  After confirming your email, you'll be redirected to the login page where you can sign in.
                </p>
              </div>
              <Button onClick={handleClose} className="w-full">
                Got it
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={handleClose}
        />

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Reset Password'}
            </h3>
            <button
              type="button"
              title="Close modal"
              aria-label="Close modal"
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 text-sm">{error}</p>
              {error.includes('already exists') && (
                <button
                  onClick={() => {
                    setMode('signin')
                    setError('')
                  }}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm mt-2 underline"
                >
                  Go to Sign In
                </button>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>

            {mode !== 'forgot-password' && (
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            )}

            {mode === 'signin' && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setMode('forgot-password')
                    setError('')
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading 
                ? (mode === 'signin' ? 'Signing in...' : mode === 'signup' ? 'Creating account...' : 'Sending reset link...') 
                : (mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link')
              }
            </Button>
            
            {mode !== 'forgot-password' && (
              <>
                <div className="relative flex items-center justify-center mt-4">
                  <div className="absolute border-t border-gray-300 w-full"></div>
                  <div className="relative bg-white px-4 text-sm text-gray-500">or</div>
                </div>
                
                <Button 
                  type="button"
                  onClick={() => signInWithGoogle()}
                  disabled={isLoading}
                  className="w-full mt-4 bg-white border border-gray-300 border border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-2"
                >
                  <FcGoogle className="w-5 h-5" />
                  <span style={{ color: '#000000' }}>Continue with Google</span>
                </Button>
              </>
            )}
          </form>

          <div className="mt-4 text-center">
            {mode === 'signin' && (
              <p className="text-sm text-gray-600">
                Don't have an account? 
                <button
                  onClick={() => {
                    setMode('signup')
                    setError('')
                  }}
                  className="text-blue-600 hover:text-blue-800 font-medium ml-1"
                >
                  Sign up
                </button>
              </p>
            )}
            
            {mode === 'signup' && (
              <p className="text-sm text-gray-600">
                Already have an account? 
                <button
                  onClick={() => {
                    setMode('signin')
                    setError('')
                  }}
                  className="text-blue-600 hover:text-blue-800 font-medium ml-1"
                >
                  Sign in
                </button>
              </p>
            )}

            {mode === 'forgot-password' && (
              <p className="text-sm text-gray-600">
                Remember your password? 
                <button
                  onClick={() => {
                    setMode('signin')
                    setError('')
                  }}
                  className="text-blue-600 hover:text-blue-800 font-medium ml-1"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
