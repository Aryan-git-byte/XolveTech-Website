import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Package } from 'lucide-react'
import { Product } from '../../types'
import { supabase } from '../../lib/supabase'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { sanitizeText } from '../../utils/sanitize'

interface ProductsManagerProps {
  onUpdate: () => void
}

export const ProductsManager: React.FC<ProductsManagerProps> = ({ onUpdate }) => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    kit_contents: '',
    learning_outcomes: '',
    tools_required: '',
    assembly_steps: '',
    image_urls: '', // Changed from image_url to image_urls
    on_offer: false,
    discount_type: 'flat' as 'flat' | 'percentage',
    discount_value: '',
    discount_expiry_date: ''
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate final price for preview
  const calculateFinalPrice = () => {
    const originalPrice = parseFloat(formData.price) || 0
    const discountValue = parseFloat(formData.discount_value) || 0
    
    if (!formData.on_offer || !discountValue) return originalPrice
    
    if (formData.discount_type === 'flat') {
      return Math.max(0, originalPrice - discountValue)
    } else {
      return originalPrice * (1 - discountValue / 100)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Convert newline-separated URLs to array
    const imageUrls = formData.image_urls
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0)
    
    const productData = {
      title: formData.title,
      description: formData.description,
      price: parseInt(formData.price),
      category: formData.category,
      kit_contents: formData.kit_contents.split('\n').filter(Boolean),
      learning_outcomes: formData.learning_outcomes.split('\n').filter(Boolean),
      tools_required: formData.tools_required.split('\n').filter(Boolean),
      assembly_steps: formData.assembly_steps,
      image_urls: imageUrls.length > 0 ? imageUrls : null, // Store as array
      on_offer: formData.on_offer,
      discount_type: formData.on_offer ? formData.discount_type : null,
      discount_value: formData.on_offer && formData.discount_value ? parseFloat(formData.discount_value) : null,
      discount_expiry_date: formData.on_offer && formData.discount_expiry_date ? formData.discount_expiry_date : null
    }

    try {
      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id)
        
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData])
        
        if (error) throw error
      }

      fetchProducts()
      onUpdate()
      setIsModalOpen(false)
      resetForm()
    } catch (error) {
      console.error('Error saving product:', error)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      kit_contents: product.kit_contents?.join('\n') || '',
      learning_outcomes: product.learning_outcomes?.join('\n') || '',
      tools_required: product.tools_required?.join('\n') || '',
      assembly_steps: product.assembly_steps || '',
      image_urls: product.image_urls?.join('\n') || '', // Join array to newline-separated string
      on_offer: product.on_offer || false,
      discount_type: product.discount_type || 'flat',
      discount_value: product.discount_value?.toString() || '',
      discount_expiry_date: product.discount_expiry_date ? product.discount_expiry_date.split('T')[0] : ''
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id)
        
        if (error) throw error
        fetchProducts()
        onUpdate()
      } catch (error) {
        console.error('Error deleting product:', error)
      }
    }
  }

  const resetForm = () => {
    setEditingProduct(null)
    setFormData({
      title: '',
      description: '',
      price: '',
      category: '',
      kit_contents: '',
      learning_outcomes: '',
      tools_required: '',
      assembly_steps: '',
      image_urls: '', // Reset to empty string
      on_offer: false,
      discount_type: 'flat',
      discount_value: '',
      discount_expiry_date: ''
    })
  }

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading products...</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Products Management</h2>
        <Button
          onClick={() => {
            resetForm()
            setIsModalOpen(true)
          }}
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">Add your first STEM kit to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden">
              {product.image_urls && product.image_urls.length > 0 && (
                <div className="relative">
                  <img
                    src={product.image_urls[0]} // Display first image
                    alt={product.title}
                    className="w-full h-48 object-cover"
                  />
                  {product.image_urls.length > 1 && (
                    <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                      +{product.image_urls.length - 1} more
                    </div>
                  )}
                </div>
              )}
              <div className="p-4">
                <h3 
                  className="text-lg font-semibold text-gray-900 mb-2"
                  dangerouslySetInnerHTML={{ __html: sanitizeText(product.title) }}
                />
                <p 
                  className="text-gray-600 text-sm mb-2 line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: sanitizeText(product.description) }}
                />
                <div className="mb-3">
                  {product.on_offer ? (
                    <div>
                      <p className="text-sm text-gray-500 line-through">₹{product.price}</p>
                      <p className="text-xl font-bold text-blue-600">
                        ₹{product.discount_type === 'flat' 
                          ? Math.max(0, product.price - (product.discount_value || 0))
                          : Math.round(product.price * (1 - (product.discount_value || 0) / 100))
                        }
                      </p>
                      <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                        {product.discount_type === 'flat' 
                          ? `Save ₹${product.discount_value}`
                          : `-${product.discount_value}% Off`
                        }
                      </span>
                    </div>
                  ) : (
                    <p className="text-xl font-bold text-blue-600">₹{product.price}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(product)}
                    className="flex items-center space-x-1"
                  >
                    <Edit className="w-3 h-3" />
                    <span>Edit</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(product.id)}
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          resetForm()
        }}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Product Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              required
            />
          </div>
          
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
              What's Included (one per line)
            </label>
            <textarea
              value={formData.kit_contents}
              onChange={(e) => setFormData({ ...formData, kit_contents: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="LED lights (5 pieces)&#10;Resistors (10 pieces)&#10;Breadboard&#10;Jumper wires&#10;9V battery holder&#10;Instruction manual"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Learning Outcomes (one per line)
            </label>
            <textarea
              value={formData.learning_outcomes}
              onChange={(e) => setFormData({ ...formData, learning_outcomes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Basic electronics understanding&#10;Circuit design principles&#10;Problem-solving skills&#10;Hands-on building experience"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tools Needed (one per line)
            </label>
            <textarea
              value={formData.tools_required}
              onChange={(e) => setFormData({ ...formData, tools_required: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Scissors&#10;Small screwdriver&#10;9V battery&#10;Cardboard (for chassis)"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Basic Assembly Steps
            </label>
            <textarea
              value={formData.assembly_steps}
              onChange={(e) => setFormData({ ...formData, assembly_steps: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Connect the LED to the breadboard using jumper wires. Add resistors to control current flow. Connect the battery and watch your circuit come to life!"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Images (one URL per line)
            </label>
            <textarea
              value={formData.image_urls}
              onChange={(e) => setFormData({ ...formData, image_urls: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg&#10;https://example.com/image3.jpg"
            />
            <p className="text-xs text-gray-500 mt-1">
              Add multiple image URLs, one per line. The first image will be used as the main product image.
            </p>
          </div>
          
          {/* Discount Section */}
          <div className="border-t pt-4">
            <div className="flex items-center space-x-2 mb-4">
              <input
                type="checkbox"
                id="on_offer"
                checked={formData.on_offer}
                onChange={(e) => setFormData({ ...formData, on_offer: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="on_offer" className="text-sm font-medium text-gray-700">
                Apply Discount
              </label>
            </div>
            
            {formData.on_offer && (
              <div className="space-y-4 bg-blue-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Type
                    </label>
                    <select
                      value={formData.discount_type}
                      onChange={(e) => setFormData({ ...formData, discount_type: e.target.value as 'flat' | 'percentage' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="flat">Flat ₹</option>
                      <option value="percentage">Percentage %</option>
                    </select>
                  </div>
                  
                  <Input
                    label="Discount Value"
                    type="number"
                    value={formData.discount_value}
                    onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                    placeholder={formData.discount_type === 'flat' ? '50' : '20'}
                  />
                </div>
                
                <Input
                  label="Discount Expiry Date (Optional)"
                  type="date"
                  value={formData.discount_expiry_date}
                  onChange={(e) => setFormData({ ...formData, discount_expiry_date: e.target.value })}
                />
                
                {/* Price Preview */}
                {formData.price && formData.discount_value && (
                  <div className="bg-white p-3 rounded-md border">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Price Preview:</h4>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-500 line-through">₹{formData.price}</span>
                      <span className="text-lg font-bold text-blue-600">₹{Math.round(calculateFinalPrice())}</span>
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                        {formData.discount_type === 'flat' 
                          ? `Save ₹${formData.discount_value}`
                          : `-${formData.discount_value}% Off`
                        }
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="flex space-x-3">
            <Button type="submit">
              {editingProduct ? 'Update Product' : 'Add Product'}
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
    </div>
  )
}
