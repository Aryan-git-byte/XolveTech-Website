import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Package, Images } from 'lucide-react'
import { Product } from '../../types'
import { supabase } from '../../lib/supabase'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { sanitizeText } from '../../utils/sanitize'

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
    const imageUrls = getImageUrls(product.image_urls)
    const imageUrlsString = imageUrls.join('\n') // Re-typing this line to ensure no hidden characters

    setFormData({
      title: product.title,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      // Join array fields for display in textarea
      kit_contents: product.kit_contents ? product.kit_contents.join('\n') : '',
      learning_outcomes: product.learning_outcomes ? product.learning_outcomes.join('\n') : '',
      tools_required: product.tools_required ? product.tools_required.join('\n') : '',
      assembly_steps: product.assembly_steps || '',
      image_urls: imageUrlsString,
      on_offer: product.on_offer || false,