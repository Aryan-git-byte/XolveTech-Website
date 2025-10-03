import React from 'react'
import { Package, ShoppingCart, FileText, MessageSquare } from 'lucide-react'

interface AdminStatsProps {
  stats: {
    totalProducts: number
    totalComponents: number
    totalCustomProjects: number
    totalOrders: number
    totalResources: number
    totalContacts: number
  }
}

export const AdminStats: React.FC<AdminStatsProps> = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      title: 'Components',
      value: stats.totalComponents,
      icon: Package,
      color: 'text-purple-600',
      bg: 'bg-purple-100'
    },
    {
      title: 'Custom Projects',
      value: stats.totalCustomProjects,
      icon: MessageSquare,
      color: 'text-purple-600',
      bg: 'bg-purple-100'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'text-green-600',
      bg: 'bg-green-100'
    },
    {
      title: 'Learning Resources',
      value: stats.totalResources,
      icon: FileText,
      color: 'text-purple-600',
      bg: 'bg-purple-100'
    },
    {
      title: 'Contact Messages',
      value: stats.totalContacts,
      icon: MessageSquare,
      color: 'text-orange-600',
      bg: 'bg-orange-100'
    }
  ]

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => {
          const Icon = card.icon
          return (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                </div>
                <div className={`w-12 h-12 ${card.bg} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${card.color}`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-2">Welcome to XolveTech Admin</h3>
        <p className="text-blue-100">
          Manage your STEM learning kits, track orders, and connect with your community of young innovators.
        </p>
      </div>
    </div>
  )
}