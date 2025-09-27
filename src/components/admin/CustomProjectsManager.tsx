import React, { useState, useEffect } from 'react'
import { Eye, CheckCircle, Clock, XCircle, Wrench } from 'lucide-react'
import { CustomProject } from '../../types'
import { supabase } from '../../lib/supabase'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { sanitizeText } from '../../utils/sanitize'

interface CustomProjectsManagerProps {
  onUpdate: () => void
}

export const CustomProjectsManager: React.FC<CustomProjectsManagerProps> = ({ onUpdate }) => {
  const [projects, setProjects] = useState<CustomProject[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<CustomProject | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('custom_projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error('Error fetching custom projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateProjectStatus = async (projectId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('custom_projects')
        .update({ status })
        .eq('id', projectId)

      if (error) throw error
      fetchProjects()
      onUpdate()
    } catch (error) {
      console.error('Error updating project status:', error)
    }
  }

  const filteredProjects = projects.filter(project => {
    if (statusFilter === 'all') return true
    return project.status === statusFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'in-review':
        return 'bg-blue-100 text-blue-800'
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-purple-100 text-purple-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'in-review':
        return <Eye className="w-4 h-4" />
      case 'approved':
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      case 'cancelled':
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading custom projects...</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Custom Project Requests</h2>
        <select
          aria-label="Filter projects by status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-review">In Review</option>
          <option value="approved">Approved</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <Wrench className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No custom projects found</h3>
          <p className="text-gray-600">Custom project requests will appear here</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Budget
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProjects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{project.name}</div>
                      <div className="text-sm text-gray-500">{project.contact_info}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {project.project_desc}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{project.budget_range}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {getStatusIcon(project.status)}
                      <span className="ml-1 capitalize">{project.status.replace('-', ' ')}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(project.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        aria-label={`View details for project by ${project.name}`}
                        onClick={() => {
                          setSelectedProject(project)
                          setIsModalOpen(true)
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <select
                        value={project.status}
                        onChange={(e) => updateProjectStatus(project.id, e.target.value)}
                        aria-label={`Update status for project by ${project.name}`}
                        className="text-sm border border-gray-300 rounded-md px-2 py-1"
                      >
                        <option value="pending">Pending</option>
                        <option value="in-review">In Review</option>
                        <option value="approved">Approved</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedProject && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedProject(null)
          }}
          title="Custom Project Details"
        >
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold mb-2">Customer Information</h3>
              <p><strong>Name:</strong> {selectedProject.name}</p>
              <p><strong>Contact:</strong> {selectedProject.contact_info}</p>
              <p><strong>Date Submitted:</strong> {new Date(selectedProject.created_at).toLocaleDateString()}</p>
            </div>
            
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold mb-2">Project Details</h3>
              <p><strong>Budget Range:</strong> {selectedProject.budget_range}</p>
              <div className="mt-2">
                <strong>Project Description:</strong>
                <div className="bg-gray-50 p-4 rounded-lg mt-1">
                  <p 
                    className="text-gray-700 whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: sanitizeText(selectedProject.project_desc) }}
                  />
                </div>
              </div>
              {selectedProject.image_url && (
                <div className="mt-3">
                  <strong>Attached Image:</strong>
                  <div className="mt-1">
                    <img
                      src={selectedProject.image_url}
                      alt="Project sketch"
                      width="400"
                      height="auto"
                      loading="lazy"
                      className="max-w-full h-auto rounded-lg border"
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Current Status</h3>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedProject.status)}`}>
                  {getStatusIcon(selectedProject.status)}
                  <span className="ml-1 capitalize">{selectedProject.status.replace('-', ' ')}</span>
                </span>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button
                onClick={() => {
                  setIsModalOpen(false)
                  setSelectedProject(null)
                }}
              >
                Close
              </Button>
              <a
                href={`mailto:${selectedProject.contact_info}?subject=Re: Custom Project Request&body=Hello ${selectedProject.name},%0D%0A%0D%0AThank you for your custom project request. We have reviewed your requirements and would like to discuss the next steps.%0D%0A%0D%0ABest regards,%0D%0AXolveTech Team`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Contact Customer
              </a>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}