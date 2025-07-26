import React, { useState, useEffect } from 'react'
import { Package, ShoppingCart, FileText, MessageSquare, BarChart3, Plus, Settings } from 'lucide-react'
import { Wrench } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { Button } from '../../components/ui/Button'
import { AdminStats } from '../../components/admin/AdminStats'
import { ProductsManager } from '../../components/admin/ProductsManager'
import { ComponentsManager } from '../../components/admin/ComponentsManager'
import { CustomProjectsManager } from '../../components/admin/CustomProjectsManager'
import { OrdersManager } from '../../components/admin/OrdersManager'
import { ResourcesManager } from '../../components/admin/ResourcesManager'
import { ContactsManager } from '../../components/admin/ContactsManager'

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('stats')
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomProjects: 0,
    totalResources: 0,
    totalContacts: 0,
    totalComponents: 0
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [products, orders, customProjects, resources, contacts, components] = await Promise.all([
        supabase.from('products').select('id'),
        supabase.from('orders').select('id'),
        supabase.from('custom_projects').select('id'),
        supabase.from('resources').select('id'),
        supabase.from('contacts').select('id'),
        supabase.from('components').select('id')
      ])

      setStats({
        totalProducts: products.data?.length || 0,
        totalOrders: orders.data?.length || 0,
        totalCustomProjects: customProjects.data?.length || 0,
        totalResources: resources.data?.length || 0,
        totalContacts: contacts.data?.length || 0,
        totalComponents: components.data?.length || 0
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const tabs = [
    { id: 'stats', label: 'Statistics', icon: BarChart3 },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'components', label: 'Components', icon: Settings },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'custom-projects', label: 'Custom Projects', icon: Wrench },
    { id: 'resources', label: 'Resources', icon: FileText },
    { id: 'contacts', label: 'Messages', icon: MessageSquare }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your XolveTech website and orders</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm">
          {activeTab === 'stats' && <AdminStats stats={stats} />}
          {activeTab === 'products' && <ProductsManager onUpdate={fetchStats} />}
          {activeTab === 'components' && <ComponentsManager onUpdate={fetchStats} />}
          {activeTab === 'orders' && <OrdersManager />}
          {activeTab === 'custom-projects' && <CustomProjectsManager onUpdate={fetchStats} />}
          {activeTab === 'resources' && <ResourcesManager onUpdate={fetchStats} />}
          {activeTab === 'contacts' && <ContactsManager />}
        </div>
      </div>
    </div>
  )
}