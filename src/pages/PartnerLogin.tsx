import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Navigate } from 'react-router-dom'
import { Mail, Lock, Users } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useAuth } from '../contexts/AuthContext'

export const PartnerLogin: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn, user } = useAuth()

  // Check if user is already logged in as a partner
  const isPartner = user?.email && [
    'aryan@xolvetech.in',
    'ayush@xolvetech.in', 
    'rishav@xolvetech.in',
    'shubham@xolvetech.in'
  ].includes(user.email)

  if (user && isPartner) {
    return <Navigate to="/partners" replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Validate partner email
    const validEmails = [
      'aryan@xolvetech.in',
      'ayush@xolvetech.in', 
      'rishav@xolvetech.in',
      'shubham@xolvetech.in'
    ]

    if (!validEmails.includes(email)) {
      setError('Access restricted to XolveTech partners only')
      setIsLoading(false)
      return
    }

    try {
      await signIn(email, password)
    } catch (error: any) {
      setError(error.message || 'Authentication failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Partner Login - XolveTech Internal</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-blue-600 font-bold text-xl">X</span>
              </div>
              <div className="text-white">
                <h1 className="text-2xl font-bold">XolveTech</h1>
                <p className="text-blue-200 text-sm">Partner Portal</p>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-2 text-blue-200 mb-2">
              <Users className="w-5 h-5" />
              <span className="text-sm">Internal Access Only</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-blue-200">Sign in to access your partner dashboard</p>
          </div>

          {/* Login Form */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-400/30 rounded-lg">
                <p className="text-red-100 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
                <Input
                  type="email"
                  placeholder="Partner Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder-blue-200 focus:border-blue-400"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder-blue-200 focus:border-blue-400"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 text-lg font-medium"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Partner Info */}
            <div className="mt-8 pt-6 border-t border-white/20">
              <div className="text-center text-blue-200 text-sm">
                <p className="mb-2">Authorized Partners:</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white/5 rounded-lg p-2">
                    <p className="font-medium">Aryan Kumar</p>
                    <p className="text-blue-300">Founder & CTO</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-2">
                    <p className="font-medium">Rishav</p>
                    <p className="text-blue-300">Operations</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-2">
                    <p className="font-medium">Shubham</p>
                    <p className="text-blue-300">Media & Content</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-2">
                    <p className="font-medium">Ayush</p>
                    <p className="text-blue-300">Logistics</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-blue-200 text-sm">
            <p>© 2025 XolveTech Internal Systems</p>
          </div>
        </div>
      </div>
    </>
  )
}