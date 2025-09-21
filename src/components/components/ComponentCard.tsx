import React from 'react'
import { Component } from '../../types'
import { Button } from '../ui/Button'
import { Plus, ShoppingCart } from 'lucide-react'
import { useCart } from '../../contexts/CartContext'
import { sanitizeText } from '../../utils/sanitize'

// Helper function to calculate days remaining
const getDaysRemaining = (expiryDate: string): number => {
  const today = new Date()
  const expiry = new Date(expiryDate)
  const diffTime = expiry.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// Helper function to calculate final price
const calculateFinalPrice = (component: Component): number => {
  if (!component.on_offer || !component.discount_value) return component.price
  
  if (component.discount_type === 'flat') {
    return Math.max(0, component.price - component.discount_value)
  } else {
    return Math.round(component.price * (1 - component.discount_value / 100))
  }
}

interface ComponentCardProps {
  component: Component
}

export const ComponentCard: React.FC<ComponentCardProps> = ({ component }) => {
  const { addToCart } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    addToCart(component)
    
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
      <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-t-lg overflow-hidden relative">
        {component.image_url ? (
          <img
            src={component.image_url}
            alt={component.name || 'Component image'}
            width="320"
            height="192"
            loading="lazy"
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
            onError={(e) => {
              // Hide image on error and show fallback
              const target = e.currentTarget as HTMLImageElement
              target.style.display = 'none'
              const fallback = target.nextElementSibling as HTMLElement
              if (fallback) fallback.style.display = 'flex'
            }}
          />
        ) : null}
        {/* Fallback div - always present but hidden if image loads */}
        <div 
          className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center"
          style={{ display: component.image_url ? 'none' : 'flex' }}
        >
          <div className="text-center">
            <ShoppingCart className="w-12 h-12 text-blue-400 mx-auto mb-2" />
            <p className="text-xs text-blue-600 font-medium">{component.name || 'Component'}</p>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 
          className="text-lg font-semibold text-gray-900 mb-2"
          dangerouslySetInnerHTML={{ __html: sanitizeText(component.name) }}
        />
        <p 
          className="text-gray-600 text-sm mb-3 line-clamp-2"
          dangerouslySetInnerHTML={{ __html: sanitizeText(component.description) }}
        />
        <div className="mb-3">
          {component.on_offer ? (
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-sm text-gray-500 line-through">₹{component.price}</span>
                <span className="text-2xl font-bold text-blue-600">₹{calculateFinalPrice(component)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                  {component.discount_type === 'flat' 
                    ? `Save ₹${component.discount_value}`
                    : `-${component.discount_value}% Off`
                  }
                </span>
                <span className="text-xs text-gray-500">All inclusive</span>
              </div>
              {component.discount_expiry_date && getDaysRemaining(component.discount_expiry_date) > 0 && (
                <div className="mt-1">
                  <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                    ⏳ Offer ends in {getDaysRemaining(component.discount_expiry_date)} days!
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-blue-600">₹{component.price}</span>
              <span className="text-xs text-gray-500">All inclusive</span>
            </div>
          )}
        </div>
        <div className="flex">
          <Button
            size="sm"
            onClick={handleAddToCart}
            className="flex items-center space-x-1 bg-orange-600 hover:bg-orange-700 w-full justify-center"
          >
            <Plus className="w-4 h-4" />
            <span>Add to Cart</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
