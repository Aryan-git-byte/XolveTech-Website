import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { PartnerDashboard } from '../components/partners/PartnerDashboard'

export const Partners: React.FC = () => {
  const { user, loading } = useAuth()

  // Check if user is a partner
  const isPartner = user?.email && [
    'aryan@xolvetech.in',
    'ayush@xolvetech.in', 
    'rishav@xolvetech.in',
    'shubham@xolvetech.in'
  ].includes(user.email)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user || !isPartner) {
    return <Navigate to="/partners/login" replace />
  }

  return (
    <>
      <Helmet>
        <title>Partner Dashboard - XolveTech Internal</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <PartnerDashboard />
    </>
  )
}