import React, { useState, useEffect } from 'react'
import { FileText, Video, Download, Calendar, Tag } from 'lucide-react'
import { Resource } from '../types'
import { supabase } from '../lib/supabase'
import { SearchBar } from '../components/ui/SearchBar'
import { Button } from '../components/ui/Button'
import { sanitizeText } from '../utils/sanitize'

export const Learning: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')

  useEffect(() => {
    fetchResources()
  }, [])

  const fetchResources = async () => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('uploaded_at', { ascending: false })

      if (error) throw error
      setResources(data || [])
    } catch (error) {
      console.error('Error fetching resources:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.kit_tag.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === 'all' || resource.type === selectedType

    return matchesSearch && matchesType
  })

  const handleDownload = (resource: Resource) => {
    window.open(resource.file_url, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading resources...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Learning Resources</h1>
            <p className="text-lg text-gray-600">
              Access guides, tutorials, and educational content to enhance your STEM learning experience
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="w-full md:w-96">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search resources..."
              />
            </div>
            <div className="flex items-center space-x-4">
              <select
                aria-label="Filter by resource type"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="pdf">PDF Guides</option>
                <option value="video">Video Tutorials</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredResources.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <FileText className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No resources found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => (
                <div
                  key={resource.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        {resource.type === 'pdf' ? (
                          <FileText className="w-6 h-6 text-red-600" />
                        ) : (
                          <Video className="w-6 h-6 text-blue-600" />
                        )}
                        <span className="text-sm font-medium text-gray-500 uppercase">
                          {resource.type}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(resource.uploaded_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <h3 
                      className="text-lg font-semibold text-gray-900 mb-2"
                      dangerouslySetInnerHTML={{ __html: sanitizeText(resource.title) }}
                    />
                    
                    <div className="flex items-center space-x-1 mb-4">
                      <Tag className="w-4 h-4 text-gray-400" />
                      <span 
                        className="text-sm text-gray-600"
                        dangerouslySetInnerHTML={{ __html: sanitizeText(resource.kit_tag) }}
                      />
                    </div>
                    
                    <Button
                      onClick={() => handleDownload(resource)}
                      aria-label={`${resource.type === 'pdf' ? 'Download PDF' : 'Watch video'}: ${resource.title}`}
                      className="w-full flex items-center justify-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>
                        {resource.type === 'pdf' ? 'Download PDF' : 'Watch Video'}
                      </span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Additional Learning Content */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Learning Tips</h2>
            <p className="text-lg text-gray-600">
              Make the most of your STEM learning experience with these helpful tips
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Read First</h3>
              <p className="text-gray-600">
                Always start with the PDF guide to understand the concepts before building
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛠️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Hands-On Practice</h3>
              <p className="text-gray-600">
                Get your hands dirty! The best learning happens when you're actively building
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ask Questions</h3>
              <p className="text-gray-600">
                Don't hesitate to reach out to our team if you need help or have questions
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}