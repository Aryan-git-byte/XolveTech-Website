import React, { useState } from 'react'
import { X, Plus, Minus, ShoppingCart, Trash2 } from 'lucide-react'
import { useCart } from '../../contexts/CartContext'
import { Button } from '../ui/Button'
import { CheckoutModal } from './CheckoutModal'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { items, total, itemCount, updateQuantity, removeFromCart, clearCart } = useCart()
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  const handleCheckout = () => {
    if (items.length === 0) return
    setIsCheckoutOpen(true)
  }

  const handleCheckoutClose = () => {
    setIsCheckoutOpen(false)
    // If checkout was successful, the cart would already be cleared
    // and the user redirected, so we can safely close the cart drawer
    if (items.length === 0) {
      onClose()
    }
  }
  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
        
        <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
          <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h2 className="text-lg font-semibold text-black">
                Shopping Cart ({itemCount})
              </h2>
              <button
                aria-label="Close cart"
                title="Close cart"
                onClick={onClose}
                className="text-black hover:text-gray-700 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-12 h-12 text-black mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-black mb-2">Your cart is empty</h3>
                  <p className="text-black">Add some STEM kits to get started!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.product.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        {item.product.image_urls && item.product.image_urls.length > 0 && (
                          <img
                            src={item.product.image_urls[0]}
                            alt={item.product.title}
                            width="64"
                            height="64"
                            loading="lazy"
                            className="w-16 h-16 object-cover rounded-md"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-black truncate">
                            {item.product.title}
                          </h4>
                          <p className="text-sm text-black">₹{item.product.price}</p>
                          
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                aria-label={`Decrease quantity of ${item.product.title}`}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-black"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-8 text-center text-sm font-medium text-black">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                aria-label={`Increase quantity of ${item.product.title}`}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-black"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              aria-label={`Remove ${item.product.title} from cart`}
                              className="text-red-900 hover:text-red-800 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <div className="mt-2 text-right">
                            <span className="text-sm font-semibold text-black">
                              ₹{item.product.price * item.quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t px-4 py-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-black">Total:</span>
                  <span className="text-xl font-bold text-blue-800">₹{total}</span>
                </div>
                
                <div className="space-y-2">
                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Proceed to Checkout
                  </Button>
                  
                  <Button
                    onClick={clearCart}
                    variant="outline"
                    className="w-full text-red-900 border-red-400 hover:bg-red-50"
                  >
                    Clear Cart
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={handleCheckoutClose}
      />
    </>
  )
}