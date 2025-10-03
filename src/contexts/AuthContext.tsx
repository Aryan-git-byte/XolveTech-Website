import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  loading: boolean
  isEmailConfirmed: boolean
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
  resendConfirmation: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  isAdmin: boolean
  isPartner: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Derive email confirmation status from user object
  const isEmailConfirmed = Boolean(user?.email_confirmed_at)
  
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: string, session: { user: User | null } | null) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }
  
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://xolvetech.in/'
      }
    })
    if (error) throw error
  }

  const signUp = async (email: string, password: string, _name: string) => {
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: 'https://xolvetech.in/'
      }
    })
    
    if (error) {
      // Check if user already exists
      if (error.message.includes('already registered') || 
          error.message.includes('already been registered') ||
          error.status === 422) {
        throw new Error('An account with this email already exists. Please sign in instead.')
      }
      throw error
    }
    
    // Check if user already exists (Supabase returns user but no session for existing users)
    if (data.user && !data.session && data.user.identities && data.user.identities.length === 0) {
      throw new Error('An account with this email already exists. Please sign in instead.')
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const resendConfirmation = async () => {
    if (!user?.email) {
      throw new Error('No user email found')
    }
    
    console.log('DEBUG: Value of supabase.auth.resend:', supabase.auth.resend)
    
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: user.email,
      options: {
        emailRedirectTo: 'https://xolvetech.in/'
      }
    })
    
    if (error) throw error
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://xolvetech.in/reset-password'
    })
    
    if (error) throw error
  }

  // Define authorized partner emails
  const authorizedPartnerEmails = [
    'aryan@xolvetech.in',
    'ayush@xolvetech.in',
    'rishav@xolvetech.in',
    'shubham@xolvetech.in'
  ]

  const isAdmin = user?.email === 'xolvetech@gmail.com'
  const isPartner = user?.email ? authorizedPartnerEmails.includes(user.email) : false

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isEmailConfirmed,
      signIn,
      signInWithGoogle, 
      signUp, 
      signOut, 
      resendConfirmation,
      resetPassword,
      isAdmin,
      isPartner
    }}>
      {children}
    </AuthContext.Provider>
  )
}
