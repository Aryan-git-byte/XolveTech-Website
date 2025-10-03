import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Package, Eye } from 'lucide-react'
import { Component, ComponentRequest } from '../../types'
import { supabase } from '../../lib/supabase'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { sanitizeText } from '../../utils/sanitize'

interface ComponentsManagerProps {
  onUpdate: () => void
}

export const ComponentsManager: React.FC<ComponentsManagerProps> = ({ onUpdate }) => {
  const [components, setComponents] = useState<Component[]>([])
  const [requests, setRequests] = useState<ComponentRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'components' | 'requests'>('components')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingComponent, setEditingComponent] = useState<Component | null>(null)
  const [selectedRequest, setSelectedRequest] = useState<ComponentRequest | null>(null)
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    stock_status: true,
    image_url: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [componentsData, requestsData] = await Promise.all([
        supabase.from('components').select('*').order('created_at', { ascending: false }),
        supabase.from('component_requests').select('*').order('created_at', { ascending: false })
      ])

      if (componentsData.error) throw componentsData.error
      if (requestsData.error) throw requestsData.error

      setComponents(componentsData.data || [])
      setRequests(requestsData.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const componentData = {
      name: formData.name,
      price: parseInt(formData.price),
      description: formData.description,
      category: formData.category,
      stock_status: formData.stock_status,
      image_url: formData.image_url || null
    }

    try {
      if (editingComponent) {
        const { error } = await supabase
          .from('components')
          .update(componentData)
          .eq('id', editingComponent.id)
        
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('components')
          .insert([componentData])
        
        if (error) throw error
      }

      fetchData()
      onUpdate()
      setIsModalOpen(false)
      resetForm()
    } catch (error) {
      console.error('Error saving component:', error)
    }
  }

  const handleEdit = (component: Component) => {
    setEditingComponent(component)
    setFormData({
      name: component.name,
      price: component.price.toString(),
      description: component.description,
      category: component.category,
      stock_status: component.stock_status,
      image_url: component.image_url || ''
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this component?')) {
      try {
        const { error } = await supabase
          .from('components')
          .delete()
          .eq('id', id)
        
        if (error) throw error
        fetchData()
        onUpdate()
      } catch (error) {
        console.error('Error deleting component:', error)
      }
    }
  }

  const resetForm = () => {
    setEditingComponent(null)
    setFormData({
      name: '',
      price: '',
      description: '',
      category: '',
      stock_status: true,
      image_url: ''
    })
  }

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading components...</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Components Management</h2>
        {activeTab === 'components' && (
          <Button
            onClick={() => {
              resetForm()
              setIsModalOpen(true)
            }}
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Component</span>
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('components')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'components'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Components ({components.length})
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'requests'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Requests ({requests.length})
        </button>
      </div>

      {/* Components Tab */}
      {activeTab === 'components' && (
        <>
          {components.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No components found</h3>
              <p className="text-gray-600">Add your first component to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {components.map((component) => (
                <div key={component.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  {component.image_url && (
                    <img
                      src={component.image_url}
                      alt={component.name}
                      width="320"
                      height="192"
                      loading="lazy"
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 
                        className="text-lg font-semibold text-gray-900"
                        dangerouslySetInnerHTML={{ __html: sanitizeText(component.name) }}
                      />
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        component.stock_status 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {component.stock_status ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                    <p 
                      className="text-gray-600 text-sm mb-2 line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: sanitizeText(component.description) }}
                    />
                    <p className="text-xl font-bold text-blue-600 mb-3">₹{component.price}</p>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(component)}
                        className="flex items-center space-x-1"
                      >
                        <Edit className="w-3 h-3" />
                        <span>Edit</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(component.id)}
                        className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Requests Tab */}
      {activeTab === 'requests' && (
        <>
          {requests.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
              <p className="text-gray-600">Component requests will appear here</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {requests.map((request) => (
                <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{request.name}</h3>
                    <span className="text-xs text-gray-400">
                      {new Date(request.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{request.email}</p>
                  <p className="text-sm font-medium text-gray-900 mb-2">
                    Requested: {request.component}
                  </p>
                  
                  {request.reason && (
                    <p 
                      className="text-gray-700 mb-4 line-clamp-3 text-sm"
                      dangerouslySetInnerHTML={{ __html: sanitizeText(request.reason) }}
                    />
                  )}
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedRequest(request)
                      setIsRequestModalOpen(true)
                    }}
                    className="flex items-center space-x-1"
                  >
                    <Eye className="w-3 h-3" />
                    <span>View Details</span>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Component Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          resetForm()
        }}
        title={editingComponent ? 'Edit Component' : 'Add New Component'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Component Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price (₹)"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
            <Input
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              title="Component description"
              placeholder="Describe the component..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              required
            />
          </div>
          
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.stock_status}
                onChange={(e) => setFormData({ ...formData, stock_status: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">In Stock</span>
            </label>
          </div>
          
          <Input
            label="Image URL (optional)"
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            placeholder="https://example.com/image.jpg"
          />
          
          <div className="flex space-x-3">
            <Button type="submit">
              {editingComponent ? 'Update Component' : 'Add Component'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen(false)
                resetForm()
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Request Details Modal */}
      {selectedRequest && (
        <Modal
          isOpen={isRequestModalOpen}
          onClose={() => {
            setIsRequestModalOpen(false)
            setSelectedRequest(null)
          }}
          title="Component Request Details"
        >
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Requester Information</h3>
              <p><strong>Name:</strong> {selectedRequest.name}</p>
              <p><strong>Contact:</strong> {selectedRequest.email}</p>
              <p><strong>Date:</strong> {new Date(selectedRequest.created_at).toLocaleDateString()}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Request Details</h3>
              <p><strong>Component:</strong> {selectedRequest.component}</p>
              {selectedRequest.reason && (
                <div>
                  <strong>Reason:</strong>
                  <div className="bg-gray-50 p-3 rounded-lg mt-1">
                    <p 
                      className="text-gray-700"
                      dangerouslySetInnerHTML={{ __html: sanitizeText(selectedRequest.reason) }}
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex space-x-3">
              <Button
                onClick={() => {
                  setIsRequestModalOpen(false)
                  setSelectedRequest(null)
                }}
              >
                Close
              </Button>
              <a
                href={`mailto:${selectedRequest.email}?subject=Re: Component Request - ${selectedRequest.component}`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Reply via Email
              </a>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}