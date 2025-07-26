import React from 'react'
import { Product } from '../../types'
import { Button } from '../ui/Button'
import { Eye, Plus, ShoppingCart } from 'lucide-react'
import { useCart } from '../../contexts/CartContext'
import { sanitizeText } from '../../utils/sanitize'

interface ProductCardProps {
  product: Product
  onViewDetails: (product: Product) => void
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails }) => {
  const { addToCart } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    addToCart(product)
    
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
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
            <ShoppingCart className="w-12 h-12 text-blue-400" />
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 
          className="text-lg font-semibold text-gray-900 mb-2"
          dangerouslySetInnerHTML={{ __html: sanitizeText(product.title) }}
        />
        <p 
          className="text-gray-600 text-sm mb-3 line-clamp-2"
          dangerouslySetInnerHTML={{ __html: sanitizeText(product.description) }}
        />
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-blue-600">₹{product.price}</span>
          <span className="text-xs text-gray-500">All inclusive</span>
        </div>
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onViewDetails(product)}
            className="flex items-center space-x-1 flex-1"
          >
            <Eye className="w-4 h-4" />
            <span>View Details</span>
          </Button>
          <Button
            size="sm"
            onClick={handleAddToCart}
            className="flex items-center space-x-1 bg-orange-600 hover:bg-orange-700"
          >
            <Plus className="w-4 h-4" />
            <span>Add to Cart</span>
          </Button>
        </div>
      </div>
    </div>
  )
}