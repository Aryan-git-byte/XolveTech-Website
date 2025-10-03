import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Search, ShoppingCart, Filter, Plus, MessageSquare } from 'lucide-react'
import { Component } from '../types'
import { supabase } from '../lib/supabase'
import { SearchBar } from '../components/ui/SearchBar'
import { ComponentCard } from '../components/components/ComponentCard'
import { ComponentRequestModal } from '../components/components/ComponentRequestModal'
import { Button } from '../components/ui/Button'

export const Components: React.FC = () => {
  const [components, setComponents] = useState<Component[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [stockFilter, setStockFilter] = useState('all')
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false)

  useEffect(() => {
    fetchComponents()
  }, [])

  const fetchComponents = async () => {
    try {
      setError(null)
      
      // Clear any invalid session first
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        // If no session, try to refresh or clear auth state
        await supabase.auth.signOut()
      }

      // Fetch components - using the same query structure as ComponentsManager
      const { data, error } = await supabase
        .from('components')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        
        // Handle specific auth errors
        if (error.message.includes('Invalid Refresh Token') || 
            error.message.includes('refresh_token_not_found')) {
          // Clear the session and try again without auth
          await supabase.auth.signOut()
          
          // Retry the query
          const { data: retryData, error: retryError } = await supabase
            .from('components')
            .select('*')
            .order('created_at', { ascending: false })
          
          if (retryError) {
            throw retryError
          }
          setComponents(retryData || [])
        } else {
          throw error
        }
      } else {
        setComponents(data || [])
      }

      // Debug: Log the data structure to see what we're getting
      console.log('Fetched components:', data)
      
    } catch (error: any) {
      console.error('Error fetching components:', error)
      setError(`Failed to load components: ${error.message}`)
      
      // Set empty array on error
      setComponents([])
    } finally {
      setLoading(false)
    }
  }

  const filteredComponents = components.filter(component => {
    const matchesSearch = component.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         component.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || component.category === selectedCategory
    const matchesStock = stockFilter === 'all' || 
                        (stockFilter === 'in-stock' && component.stock_status) ||
                        (stockFilter === 'out-of-stock' && !component.stock_status)

    return matchesSearch && matchesCategory && matchesStock
  })

  const categories = ['all', ...Array.from(new Set(components.map(c => c.category).filter(Boolean)))]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading components...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-4">
            <ShoppingCart className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">Unable to Load Components</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button
            onClick={() => {
              setLoading(true)
              fetchComponents()
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Buy Arduino Electronics Components Online India | Sensors Motors LEDs Breadboards - XolveTech</title>
        <meta name="description" content="Buy Arduino electronics components online in India. Sensors, motors, LEDs, breadboards, resistors, microcontrollers. DIY electronics parts for students. Free shipping across India." />
        <meta name="keywords" content="buy Arduino components India, electronics components online, Arduino sensors India, servo motors online, LED components India, breadboard online, resistors capacitors India, microcontroller components, Arduino boards India, electronics parts online, DIY electronics components, maker components India, Arduino shields India, jumper wires online, electronic modules India, sensor kits India, motor drivers online, Arduino accessories India, electronics hobby components, prototyping components India, circuit components online, Arduino starter components, electronics project parts, embedded components India, IoT components online, robotics components India, automation parts online, electronic switches India, connectors cables online, Arduino compatible parts" />
        
        <meta property="og:title" content="Arduino Electronics Components Online India - XolveTech" />
        <meta property="og:description" content="Buy Arduino sensors, motors, LEDs, breadboards, and electronics components online in India. DIY parts for students." />
        <meta property="og:image" content="https://xolvetech.in/components-og.png" />
        <meta property="og:url" content="https://xolvetech.in/components" />
        
        <link rel="canonical" href="https://xolvetech.com/components" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Arduino Electronics Components",
            "description": "Complete collection of Arduino electronics components, sensors, motors, LEDs, and DIY parts for students and makers in India",
            "url": "https://xolvetech.in/components"
          })}
        </script>
      </Helmet>
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <section className="bg-white shadow-sm" role="banner">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Arduino Electronics Components India</h1>
              <p className="text-lg text-gray-600 mb-6">
                Explore a range of essential Arduino electronic parts – sensors, servo motors, LED modules, breadboards, and more. 
                Perfect for your DIY electronics builds, Arduino projects, and school STEM assignments across India.
              </p>
              
              {/* Call-to-action buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => setIsRequestModalOpen(true)}
                  className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700"
                  aria-label="Request specific Arduino electronics component"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>🔧 Want a specific Arduino component? Request it here!</span>
                </Button>
                <a
                  href="/custom-projects"
                  className="inline-flex items-center space-x-2 px-6 py-3 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                  aria-label="Submit custom Arduino robotics project request"
                >
                  <Plus className="w-4 h-4" />
                  <span>📦 Custom Arduino Robotics Projects</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-6 bg-white border-b" role="search">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="w-full md:w-96">
                <SearchBar
                  value={searchTerm}
                  onChange={setSearchTerm}
                  placeholder="Search Arduino sensors, motors, LEDs..."
                />
              </div>
              <div className="flex items-center space-x-4">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Filter components by category"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Filter components by stock availability"
                >
                  <option value="all">All Stock</option>
                  <option value="in-stock">In Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Components Grid */}
        <section className="py-8" role="main">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredComponents.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <ShoppingCart className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No Arduino components found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search for sensors, motors, LEDs, or breadboards</p>
                <Button
                  onClick={() => setIsRequestModalOpen(true)}
                  className="bg-orange-600 hover:bg-orange-700"
                  aria-label="Request Arduino component not found"
                >
                  Request Arduino Component
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredComponents.map((component) => (
                  <ComponentCard
                    key={component.id}
                    component={component}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Component Request Modal */}
        <ComponentRequestModal
          isOpen={isRequestModalOpen}
          onClose={() => setIsRequestModalOpen(false)}
        />
      </div>
    </>
  )
}
