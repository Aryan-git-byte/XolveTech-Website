import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Package, Images } from 'lucide-react'
import { Product } from '../../types'
import { supabase } from '../../lib/supabase'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'

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

interface ProductsManagerProps {
  onUpdate: () => void
}

export const ProductsManager: React.FC<ProductsManagerProps> = ({ onUpdate }) => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({})
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    kit_contents: '',
    learning_outcomes: '',
    tools_required: '',
    assembly_steps: '',
    image_urls: '',
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
      
      // Debug logging to see the actual data structure
      console.log('🔍 Raw data from database:', data)
      if (data && data.length > 0) {
        const firstProduct = data[0]
        console.log('🔍 First product:', firstProduct)
        console.log('🔍 image_urls value:', firstProduct.image_urls)
        console.log('🔍 image_urls type:', typeof firstProduct.image_urls)
        console.log('🔍 Is image_urls an array?:', Array.isArray(firstProduct.image_urls))
        console.log('🔍 image_urls length:', firstProduct.image_urls?.length)
        
        // Check if it's a JSON string that needs parsing
        if (typeof firstProduct.image_urls === 'string') {
          try {
            const parsed = JSON.parse(firstProduct.image_urls)
            console.log('🔍 Parsed image_urls:', parsed)
            console.log('🔍 Parsed is array?:', Array.isArray(parsed))
          } catch (parseError) {
            console.log('🔍 image_urls is not valid JSON:', (parseError as Error).message)
          }
        }
      }
      
      setProducts(data || [])
    } catch (error) {
      console.error('❌ Error fetching products:', error)
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

  const validateForm = (): boolean => {
    const newFormErrors: {[key: string]: string} = {}
    
    // Required field validation
    if (!formData.title.trim()) {
      newFormErrors.title = 'Product title is required'
    }
    
    if (!formData.description.trim()) {
      newFormErrors.description = 'Description is required'
    }
    
    if (!formData.category.trim()) {
      newFormErrors.category = 'Category is required'
    }
    
    // Validate price
    const priceValue = parseFloat(formData.price)
    if (!formData.price || isNaN(priceValue) || priceValue <= 0) {
      newFormErrors.price = 'Price must be a positive number'
    }
    
    // Validate discount value if offer is enabled
    if (formData.on_offer && formData.discount_value) {
      const discountValue = parseFloat(formData.discount_value)
      if (isNaN(discountValue) || discountValue <= 0) {
        newFormErrors.discount_value = 'Discount value must be a positive number'
      } else if (formData.discount_type === 'percentage' && discountValue > 100) {
        newFormErrors.discount_value = 'Percentage discount cannot exceed 100%'
      } else if (formData.discount_type === 'flat' && discountValue >= priceValue) {
        newFormErrors.discount_value = 'Flat discount cannot be greater than or equal to the price'
      }
    }
    
    setFormErrors(newFormErrors)
    return Object.keys(newFormErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form before submission
    if (!validateForm()) {
      return
    }
    
    // Convert newline-separated URLs to array - handle both \n and \r\n
    const imageUrls = formData.image_urls
      .split(/\r?\n/)
      .map(url => url.trim())
      .filter(url => url.length > 0)
    
    console.log('🔍 Image URLs processed:', imageUrls) // Debug log
    console.log('🔍 Image URLs type:', typeof imageUrls) // Debug log
    console.log('🔍 Image URLs is array?:', Array.isArray(imageUrls)) // Debug log
    
    const productData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      category: formData.category.trim(),
      kit_contents: formData.kit_contents.split(/\r?\n/).map(item => item.trim()).filter(Boolean),
      learning_outcomes: formData.learning_outcomes.split(/\r?\n/).map(item => item.trim()).filter(Boolean),
      tools_required: formData.tools_required.split(/\r?\n/).map(item => item.trim()).filter(Boolean),
      assembly_steps: formData.assembly_steps.trim() || null,
      image_urls: imageUrls.length > 0 ? imageUrls : [], // Use empty array instead of null
      on_offer: formData.on_offer,
      discount_type: formData.on_offer ? formData.discount_type : null,
      discount_value: formData.on_offer && formData.discount_value ? parseFloat(formData.discount_value) : null,
      discount_expiry_date: formData.on_offer && formData.discount_expiry_date ? formData.discount_expiry_date : null
    }

    console.log('💾 Product data to save:', productData) // Debug log
    console.log('💾 image_urls in productData:', productData.image_urls)
    console.log('💾 image_urls type:', typeof productData.image_urls)
    console.log('💾 image_urls is array?:', Array.isArray(productData.image_urls))

    try {
      let result
      if (editingProduct) {
        result = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id)
          .select() // Add select to get the updated data back
        
        if (result.error) throw result.error
        console.log('Updated product:', result.data)
      } else {
        result = await supabase
          .from('products')
          .insert([productData])
          .select() // Add select to get the inserted data back
        
        if (result.error) throw result.error
        console.log('Inserted product:', result.data)
      }

      await fetchProducts() // Wait for fetch to complete
      onUpdate()
      setIsModalOpen(false)
      resetForm()
    } catch (error) {
      console.error('Error saving product:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      const errorDetails = (error as any)?.details || 'No additional details'
      const errorHint = (error as any)?.hint || 'No hints available'
      console.error('Error details:', errorMessage, errorDetails, errorHint)
      alert(`Error saving product: ${errorMessage}`)
    }
  }

  const handleEdit = (product: Product) => {
    console.log('🔍 Full product object:', product) // Debug log
    console.log('🔍 product.image_urls type:', typeof product.image_urls) // Debug log
    console.log('🔍 product.image_urls value:', product.image_urls) // Debug log
    console.log('🔍 Is array?:', Array.isArray(product.image_urls)) // Debug log
    
    setEditingProduct(product)
    
    // Handle the JSON string format that's coming from the database
    const imageUrls = getImageUrls(product.image_urls)
    const imageUrlsString = imageUrls.join('\n')
    
    setFormData({
      title: product.title || '',
      description: product.description || '',
      price: product.price?.toString() || '',
      category: product.category || '',
      kit_contents: Array.isArray(product.kit_contents) 
        ? product.kit_contents.join('\n') 
        : product.kit_contents || '',
      learning_outcomes: Array.isArray(product.learning_outcomes) 
        ? product.learning_outcomes.join('\n') 
        : product.learning_outcomes || '',
      tools_required: Array.isArray(product.tools_required) 
        ? product.tools_required.join('\n') 
        : product.tools_required || '',
      assembly_steps: product.assembly_steps || '',
      image_urls: imageUrlsString,
      on_offer: product.on_offer || false,
      discount_type: product.discount_type || 'flat',
      discount_value: product.discount_value?.toString() || '',
      discount_expiry_date: product.discount_expiry_date || ''
    })
    
    setIsModalOpen(true)
  }

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)

      if (error) throw error

      await fetchProducts()
      onUpdate()
    } catch (error) {
      console.error('Error deleting product:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`Error deleting product: ${errorMessage}`)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      category: '',
      kit_contents: '',
      learning_outcomes: '',
      tools_required: '',
      assembly_steps: '',
      image_urls: '',
      on_offer: false,
      discount_type: 'flat',
      discount_value: '',
      discount_expiry_date: ''
    })
    setEditingProduct(null)
    setFormErrors({})
  }

  const handleOpenModal = () => {
    resetForm()
    setIsModalOpen(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Package className="w-6 h-6" />
          Products Manager
        </h2>
        <Button onClick={handleOpenModal} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-8">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
          <p className="text-gray-500 mb-4">Get started by adding your first product</p>
          <Button onClick={handleOpenModal} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const imageUrls = getImageUrls(product.image_urls)
            const finalPrice = product.on_offer && product.discount_value
              ? product.discount_type === 'flat'
                ? Math.max(0, product.price - product.discount_value)
                : product.price * (1 - product.discount_value / 100)
              : product.price

            return (
              <div key={product.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{product.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                    <div className="flex items-center gap-2">
                      {product.on_offer ? (
                        <>
                          <span className="text-lg font-bold text-green-600">₹{finalPrice.toFixed(2)}</span>
                          <span className="text-sm text-gray-500 line-through">₹{product.price.toFixed(2)}</span>
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                            {product.discount_type === 'flat' 
                              ? `₹${product.discount_value} OFF` 
                              : `${product.discount_value}% OFF`}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-gray-900">₹{product.price.toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(product)}
                      className="p-1"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(product.id)}
                      className="p-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {imageUrls.length > 0 && (
                  <div className="mb-3">
                    <div className="flex items-center gap-1 mb-2">
                      <Images className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-500">{imageUrls.length} image{imageUrls.length !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {imageUrls.slice(0, 3).map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`${product.title} ${index + 1}`}
                          className="w-full h-16 object-cover rounded border"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {product.description}
                </p>

                <div className="text-xs text-gray-500">
                  Created: {new Date(product.created_at).toLocaleDateString()}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Title *
            </label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter product title"
              className={formErrors.title ? 'border-red-500' : ''}
            />
            {formErrors.title && <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter product description"
              rows={3}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.description ? 'border-red-500' : ''}`}
            />
            {formErrors.description && <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₹) *
              </label>
              <Input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="0.00"
                className={formErrors.price ? 'border-red-500' : ''}
              />
              {formErrors.price && <p className="text-red-500 text-xs mt-1">{formErrors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <Input
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                placeholder="e.g., Electronics, Robotics"
                className={formErrors.category ? 'border-red-500' : ''}
              />
              {formErrors.category && <p className="text-red-500 text-xs mt-1">{formErrors.category}</p>}
            </div>
          </div>

          {/* Offer Settings */}
          <div className="border border-gray-200 rounded-lg p-4 space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="on_offer"
                checked={formData.on_offer}
                onChange={(e) => setFormData(prev => ({ ...prev, on_offer: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="on_offer" className="text-sm font-medium text-gray-700">
                This product is on offer
              </label>
            </div>

            {formData.on_offer && (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Type
                  </label>
                  <select
                    aria-label="Discount Type"
                    value={formData.discount_type}
                    onChange={(e) => setFormData(prev => ({ ...prev, discount_type: e.target.value as 'flat' | 'percentage' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="flat">Flat (₹)</option>
                    <option value="percentage">Percentage (%)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Value
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.discount_value}
                    onChange={(e) => setFormData(prev => ({ ...prev, discount_value: e.target.value }))}
                    placeholder={formData.discount_type === 'flat' ? '0.00' : '0'}
                    className={formErrors.discount_value ? 'border-red-500' : ''}
                  />
                  {formErrors.discount_value && <p className="text-red-500 text-xs mt-1">{formErrors.discount_value}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <Input
                    type="date"
                    value={formData.discount_expiry_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, discount_expiry_date: e.target.value }))}
                  />
                </div>
              </div>
            )}

            {formData.on_offer && formData.price && formData.discount_value && (
              <div className="bg-green-50 p-3 rounded-md">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Final Price: </span>
                  <span className="text-lg font-bold text-green-600">₹{calculateFinalPrice().toFixed(2)}</span>
                  <span className="text-gray-500 line-through ml-2">₹{formData.price}</span>
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kit Contents (one per line)
            </label>
            <textarea
              value={formData.kit_contents}
              onChange={(e) => setFormData(prev => ({ ...prev, kit_contents: e.target.value }))}
              placeholder="Arduino Uno&#10;Breadboard&#10;Jumper wires&#10;LED lights"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Learning Outcomes (one per line)
            </label>
            <textarea
              value={formData.learning_outcomes}
              onChange={(e) => setFormData(prev => ({ ...prev, learning_outcomes: e.target.value }))}
              placeholder="Learn basic electronics&#10;Understand programming concepts&#10;Build problem-solving skills"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tools Required (one per line)
            </label>
            <textarea
              value={formData.tools_required}
              onChange={(e) => setFormData(prev => ({ ...prev, tools_required: e.target.value }))}
              placeholder="Screwdriver&#10;Computer with USB port&#10;Internet connection"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assembly Steps
            </label>
            <textarea
              value={formData.assembly_steps}
              onChange={(e) => setFormData(prev => ({ ...prev, assembly_steps: e.target.value }))}
              placeholder="Step-by-step assembly instructions..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URLs (one per line)
            </label>
            <textarea
              value={formData.image_urls}
              onChange={(e) => setFormData(prev => ({ ...prev, image_urls: e.target.value }))}
              placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              {editingProduct ? 'Update Product' : 'Add Product'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}