import React from 'react'
import { Component } from '../../types'
import { Button } from '../ui/Button'
import { Plus, ShoppingCart } from 'lucide-react'
import { useCart } from '../../contexts/CartContext'
import { sanitizeText } from '../../utils/sanitize'

interface ComponentCardProps {
  component: Component
}

export const ComponentCard: React.FC<ComponentCardProps> = ({ component }) => {
  const { addToCart } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Convert component to product format for cart compatibility
    const productFormat = {
      id: component.id,
      title: component.name,
      description: component.description,
      price: component.price,
      category: component.category,
      kit_contents: [],
      learning_outcomes: [],
      tools_required: [],
      assembly_steps: '',
      image_url: component.image_url,
      created_at: component.created_at
    }
    
    addToCart(productFormat)
    
    // Show brief success feedback
    const button = e.currentTarget as HTMLButtonElement
    const originalText = button.textContent
    button.textContent = 'Added!'
    button.disabled = true
    setTimeout(() => {
      button.textContent = originalText
      button.disabled = false
    }, 1000)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow group">
      <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-t-lg overflow-hidden">
        {component.image_url ? (
          <img
            src={component.image_url}
            alt={component.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
            <ShoppingCart className="w-12 h-12 text-blue-400" />
          </div>
        )}
      </div>
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
          className="text-gray-600 text-sm mb-3 line-clamp-2"
          dangerouslySetInnerHTML={{ __html: sanitizeText(component.description) }}
        />
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-blue-600">₹{component.price}</span>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {component.category}
          </span>
        </div>
        
        <Button
          onClick={handleAddToCart}
          disabled={!component.stock_status}
          className={`w-full flex items-center justify-center space-x-2 ${
            component.stock_status 
              ? 'bg-orange-600 hover:bg-orange-700' 
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>{component.stock_status ? 'Add to Cart' : 'Out of Stock'}</span>
        </Button>
      </div>
    </div>
  )
}