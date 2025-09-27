import React, { useState, useEffect } from 'react'
import {Package, Settings, FileText, ShoppingCart, MessageSquare } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { ProductsManager } from '../../components/admin/ProductsManager'
import { ComponentsManager } from '../../components/admin/ComponentsManager'
import { OrdersManager } from '../../components/admin/OrdersManager'
import { ResourcesManager } from '../../components/admin/ResourcesManager'
import { ContactsManager } from '../../components/admin/ContactsManager'
import { CustomProjectsManager } from '../../components/admin/CustomProjectsManager'

interface SupabaseCountResponse {
  data: null
  count: number | null
  error: {
    message: string
    details?: string
    hint?: string
    code?: string
  } | null
}

interface Stats {
  products: number
  components: number
  custom_projects: number
  orders: number
  resources: number
  contacts: number
}

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('products')
  const [stats, setStats] = useState<Stats>({
    products: 0,
    components: 0,
    custom_projects: 0,
    orders: 0,
    resources: 0,
    contacts: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  const tabs = [
    { id: 'products', label: 'Products', icon: Package },
    { id: 'components', label: 'Components', icon: Settings },
    { id: 'custom_projects', label: 'Custom Projects', icon: FileText },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'resources', label: 'Resources', icon: FileText },
    { id: 'contacts', label: 'Contacts', icon: MessageSquare }
  ]

  const fetchStats = async () => {
    try {
      setIsLoading(true)
      
      // Helper function to safely execute Supabase queries
      const safeSupabaseQuery = async (tableName: string): Promise<SupabaseCountResponse> => {
        try {
          const response = await supabase
            .from(tableName)
            .select('*', { count: 'exact', head: true })
          
          // If response is undefined or null, return default
          if (!response) {
            console.warn(`No response received for table: ${tableName}`)
            return {
              data: null,
              count: 0,
              error: { message: `No response for ${tableName}` }
            }
          }
          
          return response as SupabaseCountResponse
        } catch (error: any) {
          console.error(`Failed to fetch ${tableName} count:`, error)
          return {
            data: null,
            count: 0,
            error: {
              message: `Failed to fetch ${tableName} count`,
              details: error?.message || 'Unknown error'
            }
          }
        }
      }

      // Fetch counts for all data types using the safe query function
      const rawResponses = await Promise.all([
        safeSupabaseQuery('products'),
        safeSupabaseQuery('components'),
        safeSupabaseQuery('custom_projects'),
        safeSupabaseQuery('orders'),
        safeSupabaseQuery('resources'),
        safeSupabaseQuery('contacts')
      ])

      // Map over rawResponses to ensure each response is a valid object
      const validatedResponses = rawResponses.map((response, index) => {
        const tableNames = ['products', 'components', 'custom_projects', 'orders', 'resources', 'contacts']
        
        if (response === null || response === undefined) {
          console.warn(`Response is null/undefined for table: ${tableNames[index]}`)
          return {
            data: null,
            count: 0,
            error: { message: `Null response for ${tableNames[index]}` }
          } as SupabaseCountResponse
        }
        return response
      })

      // Destructure the validated responses
      const [
        productsResponse,
        componentsResponse,
        customProjectsResponse,
        ordersResponse,
        resourcesResponse,
        contactsResponse
      ] = validatedResponses

      // Set stats without optional chaining since responses are guaranteed to be valid objects
      setStats({
        products: productsResponse.count || 0,
        components: componentsResponse.count || 0,
        custom_projects: customProjectsResponse.count || 0,
        orders: ordersResponse.count || 0,
        resources: resourcesResponse.count || 0,
        contacts: contactsResponse.count || 0
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
      // Reset all stats to 0 if there's a general error
      setStats({
        products: 0,
        components: 0,
        custom_projects: 0,
        orders: 0,
        resources: 0,
        contacts: 0
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'products':
        return <ProductsManager onUpdate={fetchStats} />
      case 'components':
        return <ComponentsManager onUpdate={fetchStats} />
      case 'custom_projects':
        return <CustomProjectsManager onUpdate={fetchStats} />
      case 'orders':
        return <OrdersManager />
      case 'resources':
        return <ResourcesManager onUpdate={fetchStats} />
      case 'contacts':
        return <ContactsManager />
      default:
        return <ProductsManager onUpdate={fetchStats} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage your products, orders, and content</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const count = stats[tab.id as keyof Stats]
            
            return (
              <div
                key={tab.id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setActiveTab(tab.id)}
                role="button"
                aria-pressed={activeTab === tab.id}
                tabIndex={0}
              >
                <div className="flex items-center">
                  <div className={`flex-shrink-0 p-3 rounded-md ${
                    activeTab === tab.id 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    <Icon className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{tab.label}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {isLoading ? '...' : count}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  aria-current={activeTab === tab.id ? 'page' : undefined}
                >
                  <Icon className="w-5 h-5 mr-2" aria-hidden="true" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow">
          {renderActiveTab()}
        </div>
      </div>
    </div>
  )
}