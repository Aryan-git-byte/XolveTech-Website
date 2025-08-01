import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Search, ShoppingCart, Filter } from 'lucide-react'
import { Product } from '../types'
import { supabase } from '../lib/supabase'
import { SearchBar } from '../components/ui/SearchBar'
import { ProductModal } from '../components/products/ProductModal'
import { ProductCard } from '../components/products/ProductCard'

export const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

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

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))]

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Buy Arduino STEM Learning Kits Online India | Electronics Programming Robotics Kits - XolveTech</title>
        <meta name="description" content="Shop best Arduino STEM learning kits online in India. Electronics, programming, robotics kits for students. DIY projects, hands-on learning. Free shipping across India. Bihar innovation." />
        <meta name="keywords" content="buy Arduino kits India, STEM learning kits online, electronics kits India, programming kits students, robotics kits online, DIY electronics India, Arduino projects, breadboard kits, sensor kits, microcontroller learning, IoT kits India, maker kits online, engineering kits students, science project kits, technology learning kits, hands-on STEM education, project-based learning kits, educational electronics India, Arduino programming kits, circuit building kits, LED project kits, motor control kits, automation learning kits, embedded systems kits, coding kits kids, electronics components India, Arduino boards India, STEM toys online, educational robotics kits" />
        
        <meta property="og:title" content="Buy Arduino STEM Learning Kits Online India - XolveTech" />
        <meta property="og:description" content="Shop best Arduino, electronics, programming, robotics STEM kits for students. DIY projects, hands-on learning. Free shipping India." />
        <meta property="og:image" content="https://xolvetech.in/products-og.png" />
        <meta property="og:url" content="https://xolvetech.in/products" />
        
        <meta name="twitter:title" content="Arduino STEM Learning Kits India - XolveTech" />
        <meta name="twitter:description" content="Best Arduino, electronics, programming kits for students. DIY projects, free shipping India." />
        
        <link rel="canonical" href="https://xolvetech.in/products" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "CollectionPage",
                "@id": "https://xolvetech.in/products",
                "name": "Arduino STEM Learning Kits",
                "description": "Complete collection of Arduino, electronics, programming, and robotics STEM learning kits for students in India",
                "url": "https://xolvetech.in/products",
                "mainEntity": {
                  "@type": "ItemList",
                  "numberOfItems": products.length,
                  "itemListElement": products.map((product, index) => ({
                    "@type": "ListItem",
                    "position": index + 1,
                    "item": {
                      "@type": "Product",
                      "@id": `https://xolvetech.in/products/${product.id}`,
                      "name": product.title,
                      "description": product.description,
                      "category": product.category,
                      "brand": {
                        "@type": "Brand",
                        "name": "XolveTech"
                      },
                      "offers": {
                        "@type": "Offer",
                        "url": `https://xolvetech.in/products/${product.id}`,
                        "price": product.price,
                        "priceCurrency": "INR",
                        "availability": "https://schema.org/InStock",
                        "itemCondition": "https://schema.org/NewCondition",
                        "priceValidUntil": "2025-12-31",
                        "seller": {
                          "@type": "Organization",
                          "name": "XolveTech"
                        }
                      },
                      "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": "4.5",
                        "reviewCount": "25",
                        "bestRating": "5",
                        "worstRating": "1"
                      },
                      "image": product.image_url || "https://xolvetech.in/default-product-image.png"
                    }
                  }))
                }
              },
              {
                "@type": "Organization",
                "@id": "https://xolvetech.in/#organization",
                "name": "XolveTech",
                "url": "https://xolvetech.in",
                "description": "Leading provider of Arduino STEM learning kits and electronics education solutions in India",
                "sameAs": [
                  "https://www.facebook.com/xolvetech",
                  "https://www.twitter.com/xolvetech",
                  "https://www.instagram.com/xolvetech"
                ]
              },
              {
                "@type": "WebSite",
                "@id": "https://xolvetech.in/#website",
                "url": "https://xolvetech.in",
                "name": "XolveTech",
                "description": "Arduino STEM Learning Kits and Electronics Education Solutions",
                "publisher": {
                  "@id": "https://xolvetech.in/#organization"
                },
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": "https://xolvetech.in/products?search={search_term_string}",
                  "query-input": "required name=search_term_string"
                }
              }
            ]
          })}
        </script>
      </Helmet>
      
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white shadow-sm" role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Arduino STEM Learning Kits India</h1>
            <p className="text-lg text-gray-600">
              Discover our collection of hands-on Arduino electronics, programming, and robotics learning kits designed to spark curiosity and innovation in Indian students
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 bg-white border-b" role="search">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="w-full md:w-96">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search Arduino kits, electronics, programming..."
              />
            </div>
            <div className="flex items-center space-x-4">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Filter STEM kits by category"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-8" role="main">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <ShoppingCart className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No Arduino STEM kits found</h3>
              <p className="text-gray-600">Try adjusting your search for electronics, programming, or robotics kits</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" itemScope itemType="https://schema.org/ItemList">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedProduct(null)
          }}
        />
      )}
    </div>
    </>
  )
}
