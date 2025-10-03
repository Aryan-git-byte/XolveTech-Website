import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, FileText, Video, Upload } from 'lucide-react'
import { Resource } from '../../types'
import { supabase } from '../../lib/supabase'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { sanitizeText } from '../../utils/sanitize'

interface ResourcesManagerProps {
  onUpdate: () => void
}

export const ResourcesManager: React.FC<ResourcesManagerProps> = ({ onUpdate }) => {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingResource, setEditingResource] = useState<Resource | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    type: 'pdf' as 'pdf' | 'video',
    kit_tag: '',
    file_url: ''
  })

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingResource) {
        const { error } = await supabase
          .from('resources')
          .update(formData)
          .eq('id', editingResource.id)
        
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('resources')
          .insert([formData])
        
        if (error) throw error
      }

      fetchResources()
      onUpdate()
      setIsModalOpen(false)
      resetForm()
    } catch (error) {
      console.error('Error saving resource:', error)
    }
  }

  const handleEdit = (resource: Resource) => {
    setEditingResource(resource)
    setFormData({
      title: resource.title,
      type: resource.type,
      kit_tag: resource.kit_tag,
      file_url: resource.file_url
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this resource?')) {
      try {
        const { error } = await supabase
          .from('resources')
          .delete()
          .eq('id', id)
        
        if (error) throw error
        fetchResources()
        onUpdate()
      } catch (error) {
        console.error('Error deleting resource:', error)
      }
    }
  }

  const resetForm = () => {
    setEditingResource(null)
    setFormData({
      title: '',
      type: 'pdf',
      kit_tag: '',
      file_url: ''
    })
  }

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading resources...</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Learning Resources</h2>
        <Button
          onClick={() => {
            resetForm()
            setIsModalOpen(true)
          }}
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Resource</span>
        </Button>
      </div>

      {resources.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
          <p className="text-gray-600">Add learning materials to help your customers</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <div key={resource.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {resource.type === 'pdf' ? (
                    <FileText className="w-5 h-5 text-red-600" />
                  ) : (
                    <Video className="w-5 h-5 text-blue-600" />
                  )}
                  <span className="text-sm font-medium text-gray-500 uppercase">
                    {resource.type}
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(resource.uploaded_at).toLocaleDateString()}
                </span>
              </div>
              
              <h3 
                className="text-lg font-semibold text-gray-900 mb-2"
                dangerouslySetInnerHTML={{ __html: sanitizeText(resource.title) }}
              />
              <p className="text-sm text-gray-600 mb-3">
                Tag: <span dangerouslySetInnerHTML={{ __html: sanitizeText(resource.kit_tag) }} />
              </p>
              
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(resource)}
                  className="flex items-center space-x-1"
                >
                  <Edit className="w-3 h-3" />
                  <span>Edit</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(resource.id)}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Delete</span>
                </Button>
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
        title={editingResource ? 'Edit Resource' : 'Add New Resource'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Resource Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resource Type
            </label>
            <select
              aria-label="Resource Type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'pdf' | 'video' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="pdf">PDF Guide</option>
              <option value="video">Video Tutorial</option>
            </select>
          </div>
          
          <Input
            label="Kit Tag"
            value={formData.kit_tag}
            onChange={(e) => setFormData({ ...formData, kit_tag: e.target.value })}
            placeholder="e.g., Electronics, Mechanics, Programming"
            required
          />
          
          <Input
            label="File URL"
            value={formData.file_url}
            onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
            placeholder="https://example.com/file.pdf"
            required
          />
          
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <div className="flex items-center space-x-2 text-blue-700">
              <Upload className="w-4 h-4" />
              <span className="text-sm font-medium">Upload Tip</span>
            </div>
            <p className="text-sm text-blue-600 mt-1">
              Upload your files to Supabase Storage and use the public URL here.
            </p>
          </div>
          
          <div className="flex space-x-3">
            <Button type="submit">
              {editingResource ? 'Update Resource' : 'Add Resource'}
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