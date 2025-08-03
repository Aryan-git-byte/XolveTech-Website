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
          } catch (e) {
            console.log('🔍 image_urls is not valid JSON:', e.message)
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
      console.error('Error details:', error.message, error.details, error.hint)
      // You might want to show an error message to the user here
      alert(`Error saving product: ${error.message}`)
    }
  }

  const handleEdit = (product: Product) => {
    console.log('🔍 Full product object:', product) // Debug log
    console.log('🔍 product.image_urls type:', typeof product.image_urls) // Debug log
    console.log('🔍 product.image_urls value:', product.image_urls) // Debug log
    console.log('🔍 Is array?:', Array.isArray(product.image_urls)) // Debug log
    
    setEditingProduct(product)
    
    // Handle the JSON string format that's coming from the database
    let imageUrlsString = ''
    if (product.image_urls) {
      if (Array.isArray(product.image_urls)) {
        // If it's already an array (shouldn't happen based on your logs)
        imageUrlsString = product.image_urls.join('\n')
      } else if (typeof product.image_urls === 'string') {
        // This is what's happening - it's a JSON string
        try {
          const parsed = JSON.parse(product.image_urls)
          if (Array.isArray(parsed)) {
            imageUrlsString = parsed.join('\n')
          } else {
            imageUrlsString = product.image_urls
          }
        } catch {
          // If parsing fails, treat it as a single URL
          imageUrlsString = product.image_urls
        }
      }
    }
    
    console.log('🔍 Final imageUrlsString:', imageUrlsString) // Debug log
    
    setFormData({
      title: product.title || '',
      description: product.description || '',
      price: product.price?.toString() || '',
      category: product.category || '',
      kit_contents: Array.isArray(product.kit_contents) ? product.kit_contents.join('\n') : 
                   typeof product.kit_contents === 'string' ? JSON.parse(product.kit_contents).join('\n') : '',
      learning_outcomes: Array.isArray(product.learning_outcomes) ? product.learning_outcomes.join('\n') : 
                        typeof product.learning_outcomes === 'string' ? JSON.parse(product.learning_outcomes).join('\n') : '',
      tools_required: Array.isArray(product.tools_required) ? product.tools_required.join('\n') : 
                     typeof product.tools_required === 'string' ? JSON.parse(product.tools_required).join('\n') : '',
      assembly_steps: product.assembly_steps || '',
      image_urls: imageUrlsString,
      on_offer: product.on_offer || false,
      discount_type: product.discount_type || 'flat',
      discount_value: product.discount_value?.toString() || '',
      discount_expiry_date: product.discount_expiry_date ? product.discount_expiry_date.split('T')[0] : ''
    })
    setFormErrors({})
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
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
    setFormErrors({})
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
              {product.image_urls && (
                (() => {
                  // Handle both array and JSON string formats
                  let imageArray = []
                  if (Array.isArray(product.image_urls)) {
                    imageArray = product.image_urls
                  } else if (typeof product.image_urls === 'string') {
                    try {
                      imageArray = JSON.parse(product.image_urls)
                    } catch {
                      imageArray = [product.image_urls] // Treat as single URL
                    }
                  }
                  
                  return imageArray.length > 0 && (
                    <div className="relative">
                      <img
                        src={imageArray[0]}
                        alt={product.title}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          // Hide image if it fails to load
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                      {imageArray.length > 1 && (
                        <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                          +{imageArray.length - 1} more
                        </div>
                      )}
                    </div>
                  )
                })()
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
                  {product.on_offer && product.discount_value ? (
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
            error={formErrors.title}
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formErrors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              rows={3}
              required
            />
            {formErrors.description && (
              <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price (₹)"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              error={formErrors.price}
              required
            />
            <Input
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              error={formErrors.category}
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
                    step="0.01"
                    value={formData.discount_value}
                    onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                    error={formErrors.discount_value}
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
