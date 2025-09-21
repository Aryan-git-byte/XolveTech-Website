import React from 'react'
import { Product } from '../../types'
import { Button } from '../ui/Button'
import { Eye, Plus, ShoppingCart, Images } from 'lucide-react'
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
const calculateFinalPrice = (product: Product): number => {
  if (!product.on_offer || !product.discount_value) return product.price
  
  if (product.discount_type === 'flat') {
    return Math.max(0, product.price - product.discount_value)
  } else {
    return Math.round(product.price * (1 - product.discount_value / 100))
  }
}

// Helper function to normalize image URLs
const getImageUrls = (imageUrls: any): string[] => {
  if (!imageUrls) return []
  
  if (Array.isArray(imageUrls)) {
    return imageUrls.filter(url => url && url.trim())
  }
  
  if (typeof imageUrls === 'string') {
    try {
      const parsed = JSON.parse(imageUrls)
      if (Array.isArray(parsed)) {
        return parsed.filter(url => url && url.trim())
      }
      return imageUrls.trim() ? [imageUrls.trim()] : []
    } catch {
      return imageUrls.trim() ? [imageUrls.trim()] : []
    }
  }
  
  return []
}

interface ProductCardProps {
  product: Product
  onViewDetails: (product: Product) => void
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails }) => {
  const { addToCart } = useCart()
  const imageUrls = getImageUrls(product.image_urls)
  const hasMultipleImages = imageUrls.length > 1

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
      <div className="relative aspect-w-16 aspect-h-9 bg-gray-200 rounded-t-lg overflow-hidden">
        {imageUrls.length > 0 ? (
          <>
            <img
              src={imageUrls[0]}
              alt={product.title}
              width="320"
              height="192"
              loading="lazy"
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
            />
            {/* Multiple Images Indicator */}
            {hasMultipleImages && (
              <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                <Images className="w-3 h-3" />
                <span>{imageUrls.length}</span>
              </div>
            )}
          </>
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
        <div className="mb-3">
          {product.on_offer ? (
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-sm text-gray-500 line-through">₹{product.price}</span>
                <span className="text-2xl font-bold text-blue-600">₹{calculateFinalPrice(product)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                  {product.discount_type === 'flat' 
                    ? `Save ₹${product.discount_value}`
                    : `-${product.discount_value}% Off`
                  }
                </span>
                <span className="text-xs text-gray-500">All inclusive</span>
              </div>
              {product.discount_expiry_date && getDaysRemaining(product.discount_expiry_date) > 0 && (
                <div className="mt-1">
                  <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                    ⏳ Offer ends in {getDaysRemaining(product.discount_expiry_date)} days!
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-blue-600">₹{product.price}</span>
              <span className="text-xs text-gray-500">All inclusive</span>
            </div>
          )}
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