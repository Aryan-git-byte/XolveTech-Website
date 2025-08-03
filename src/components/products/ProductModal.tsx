import React, { useState } from 'react'
import { Product } from '../../types'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Package, Target, PenTool as Tool, Plus } from 'lucide-react'
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

interface ProductModalProps {
  product: Product
  isOpen: boolean
  onClose: () => void
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart(product)
    // Show a brief success message or animation
    const button = document.activeElement as HTMLButtonElement
    if (button) {
      const originalText = button.textContent
      button.textContent = 'Added!'
      button.disabled = true
      setTimeout(() => {
        button.textContent = originalText
        button.disabled = false
      }, 1000)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={product.title}>
      <div className="space-y-6">
        {/* Product Image */}
        {product.image_urls && product.image_urls.length > 0 && (
          <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden">
            <img
              src={product.image_urls[0]}
              alt={product.title}
              width="512"
              height="256"
              loading="lazy"
              className="w-full h-64 object-cover"
            />
          </div>
        )}

        {/* Price */}
        <div className="text-center bg-gray-50 p-4 rounded-lg">
          {product.on_offer ? (
            <div>
              <div className="flex items-center justify-center space-x-3 mb-2">
                <span className="text-lg text-gray-500 line-through">₹{product.price}</span>
                <span className="text-3xl font-bold text-blue-600">₹{calculateFinalPrice(product)}</span>
              </div>
              <div className="flex items-center justify-center space-x-2 mb-2">
                <span className="inline-block bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full font-medium">
                  {product.discount_type === 'flat' 
                    ? `Save ₹${product.discount_value}`
                    : `-${product.discount_value}% Off`
                  }
                </span>
              </div>
              {product.discount_expiry_date && getDaysRemaining(product.discount_expiry_date) > 0 && (
                <div className="mb-2">
                  <span className="text-sm text-orange-600 bg-orange-100 px-3 py-1 rounded-full font-medium">
                    ⏳ Offer ends in {getDaysRemaining(product.discount_expiry_date)} days!
                  </span>
                </div>
              )}
              <p className="text-sm text-gray-600">
                MRP includes kit price, packaging, and shipping. No extra charges.
              </p>
            </div>
          ) : (
            <div>
              <span className="text-3xl font-bold text-blue-600">₹{product.price}</span>
              <p className="text-sm text-gray-600 mt-1">
                MRP includes kit price, packaging, and shipping. No extra charges.
              </p>
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <h4 className="text-lg font-semibold mb-2">Description</h4>
          <p 
            className="text-gray-600"
            dangerouslySetInnerHTML={{ __html: sanitizeText(product.description) }}
          />
        </div>

        {/* Kit Contents */}
        {product.kit_contents && product.kit_contents.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold mb-2 flex items-center">
              <Package className="w-5 h-5 mr-2 text-blue-600" />
              What's Included
            </h4>
            <ul className="space-y-1">
              {product.kit_contents.map((item, index) => (
                <li key={index} className="text-gray-600 flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                  <span dangerouslySetInnerHTML={{ __html: sanitizeText(item) }} />
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Learning Outcomes */}
        {product.learning_outcomes && product.learning_outcomes.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold mb-2 flex items-center">
              <Target className="w-5 h-5 mr-2 text-green-600" />
              Learning Outcomes
            </h4>
            <ul className="space-y-1">
              {product.learning_outcomes.map((outcome, index) => (
                <li key={index} className="text-gray-600 flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                  <span dangerouslySetInnerHTML={{ __html: sanitizeText(outcome) }} />
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tools Required */}
        {product.tools_required && product.tools_required.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold mb-2 flex items-center">
              <Tool className="w-5 h-5 mr-2 text-orange-600" />
              Tools Needed
            </h4>
            <p className="text-sm text-gray-500 mb-2">You'll need these common household items:</p>
            <ul className="space-y-1">
              {product.tools_required.map((tool, index) => (
                <li key={index} className="text-gray-600 flex items-center">
                  <span className="w-2 h-2 bg-orange-600 rounded-full mr-2"></span>
                  <span dangerouslySetInnerHTML={{ __html: sanitizeText(tool) }} />
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Assembly Steps */}
        {product.assembly_steps && (
          <div>
            <h4 className="text-lg font-semibold mb-2">Basic Assembly Steps</h4>
            <p 
              className="text-gray-600"
              dangerouslySetInnerHTML={{ __html: sanitizeText(product.assembly_steps) }}
            />
            <p className="text-sm text-blue-600 mt-2">
              📖 Detailed step-by-step instructions included in your 12-page guidebook
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button
            onClick={handleAddToCart}
            className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700"
          >
            <Plus className="w-4 h-4" />
            <span>Add to Cart</span>
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  )
}
