import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  loading: boolean
  isEmailConfirmed: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
  resendConfirmation: () => Promise<void>
  isAdmin: boolean
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
      async (_, session) => {
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

  const signUp = async (email: string, password: string, _name: string) => {
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: 'https://xolvetech.in/'
      }
    })
    if (error) throw error
  }

  const signOut = async () => {
    try {
      // Set user to null immediately to improve UI responsiveness
      setUser(null)
      
      // Then attempt to sign out from Supabase
      const { error } = await supabase.auth.signOut()
      
      // If there's an error, log it but don't throw
      if (error) {
        console.error('Error during sign out:', error)
        // The user is already signed out in the UI, so we don't need to throw
      }
    } catch (e) {
      // Catch any unexpected errors but don't throw them
      console.error('Unexpected error during sign out:', e)
      // Still consider the user signed out locally
    }
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

  const isAdmin = user?.email === 'xolvetech@gmail.com'

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isEmailConfirmed,
      signIn, 
      signUp, 
      signOut, 
      resendConfirmation,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  )
}
