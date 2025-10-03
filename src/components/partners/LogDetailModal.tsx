import React, { useState, useEffect } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  Calendar,
  User,
  DollarSign,
  FileText,
  Tag,
  Clock
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

interface LogDetailModalProps {
  isOpen: boolean
  onClose: () => void
  log: any
  onUpdate: () => void
}

export const LogDetailModal: React.FC<LogDetailModalProps> = ({
  isOpen,
  onClose,
  log,
  onUpdate
}) => {
  const { user } = useAuth()
  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState('')
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  useEffect(() => {
    if (isOpen && log) {
      fetchComments()
    }
  }, [isOpen, log])

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*, created_by_user:users!created_by(full_name)')
        .eq('log_id', log.id)
        .order('created_at', { ascending: true })

      if (error) throw error
      setComments(data || [])
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsSubmittingComment(true)
    try {
      const { error } = await supabase
        .from('comments')
        .insert([{
          content: newComment.trim(),
          log_id: log.id,
          created_by: user?.id
        }])

      if (error) throw error

      setNewComment('')
      fetchComments()
    } catch (error) {
      console.error('Error adding comment:', error)
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const handleStatusUpdate = async (newStatus: 'approved' | 'rejected') => {
    setIsUpdatingStatus(true)
    try {
      const { error } = await supabase
        .from(`${log.type}_logs`)
        .update({
          status: newStatus,
          decision_by: user?.id,
          decision_at: new Date().toISOString()
        })
        .eq('id', log.id)

      if (error) throw error

      onUpdate()
      onClose()
    } catch (error) {
      console.error('Error updating status:', error)
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const renderLogDetails = () => {
    switch (log.type) {
      case 'work':
        return (
          <div className="space-y-3">
            {log.hours_spent && (
              <div className="flex justify-between">
                <span className="text-gray-600">Hours Spent:</span>
                <span className="font-medium">{log.hours_spent} hours</span>
              </div>
            )}
            {log.date && (
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{new Date(log.date).toLocaleDateString()}</span>
              </div>
            )}
            {log.deliverables && (
              <div>
                <span className="text-gray-600 block mb-1">Deliverables:</span>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-wrap">{log.deliverables}</p>
                </div>
              </div>
            )}
            {log.code_repo_link && (
              <div className="flex justify-between">
                <span className="text-gray-600">Repository:</span>
                <a 
                  href={log.code_repo_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  View Code
                </a>
              </div>
            )}
            {log.blockers && (
              <div>
                <span className="text-gray-600 block mb-1">Blockers:</span>
                <div className="bg-red-50 p-3 rounded-lg">
                  <p className="text-red-800 whitespace-pre-wrap">{log.blockers}</p>
                </div>
              </div>
            )}
          </div>
        )

      case 'expense':
        return (
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-bold text-red-600">₹{log.amount?.toLocaleString()}</span>
            </div>
            {log.category && (
              <div className="flex justify-between">
                <span className="text-gray-600">Category:</span>
                <span className="font-medium">{log.category}</span>
              </div>
            )}
            {log.vendor_name && (
              <div className="flex justify-between">
                <span className="text-gray-600">Vendor:</span>
                <span className="font-medium">{log.vendor_name}</span>
              </div>
            )}
            {log.purchase_date && (
              <div className="flex justify-between">
                <span className="text-gray-600">Purchase Date:</span>
                <span className="font-medium">{new Date(log.purchase_date).toLocaleDateString()}</span>
              </div>
            )}
            {log.payment_method && (
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-medium">{log.payment_method}</span>
              </div>
            )}
            {log.gst_applicable && log.gst_amount && (
              <div className="flex justify-between">
                <span className="text-gray-600">GST Amount:</span>
                <span className="font-medium">₹{log.gst_amount}</span>
              </div>
            )}
            {log.proof_image && (
              <div>
                <span className="text-gray-600 block mb-2">Receipt/Proof:</span>
                <img 
                  src={log.proof_image} 
                  alt="Receipt" 
                  className="max-w-full h-auto rounded-lg border"
                />
              </div>
            )}
          </div>
        )

      case 'transaction':
        return (
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-bold text-green-600">₹{log.amount?.toLocaleString()}</span>
            </div>
            {log.mode && (
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Mode:</span>
                <span className="font-medium">{log.mode}</span>
              </div>
            )}
            {log.customer_name && (
              <div className="flex justify-between">
                <span className="text-gray-600">Customer:</span>
                <span className="font-medium">{log.customer_name}</span>
              </div>
            )}
            {log.invoice_id && (
              <div className="flex justify-between">
                <span className="text-gray-600">Invoice ID:</span>
                <span className="font-medium">{log.invoice_id}</span>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${log.type.charAt(0).toUpperCase() + log.type.slice(1)} Log Details`}>
      <div className="space-y-6">
        {/* Header Info */}
        <div className="border-b pb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-semibold text-gray-900">{log.title}</h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
              <Clock className="w-3 h-3 mr-1" />
              {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Created by {log.created_by_user?.full_name || 'Unknown'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(log.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          {log.tags && log.tags.length > 0 && (
            <div className="flex items-center space-x-2 mt-3">
              <Tag className="w-4 h-4 text-gray-400" />
              <div className="flex flex-wrap gap-1">
                {log.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        {log.description && (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Description</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap">{log.description}</p>
            </div>
          </div>
        )}

        {/* Log-specific details */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Details</h4>
          {renderLogDetails()}
        </div>

        {/* Notes */}
        {log.notes && (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Internal Notes</h4>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-800 whitespace-pre-wrap">{log.notes}</p>
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            Comments ({comments.length})
          </h4>
          
          {/* Existing Comments */}
          <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">
                    {comment.created_by_user?.full_name || 'Unknown'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700 text-sm">{comment.content}</p>
              </div>
            ))}
          </div>

          {/* Add Comment Form */}
          <form onSubmit={handleAddComment} className="flex space-x-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button
              type="submit"
              disabled={isSubmittingComment || !newComment.trim()}
              size="sm"
            >
              {isSubmittingComment ? 'Adding...' : 'Add'}
            </Button>
          </form>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4 border-t">
          <Button onClick={onClose} variant="outline" className="flex-1">
            Close
          </Button>
          
          {/* Approval buttons for founder */}
          {log.status === 'pending' && user?.email === 'aryan@xolvetech.in' && (
            <>
              <Button
                onClick={() => handleStatusUpdate('approved')}
                disabled={isUpdatingStatus}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center space-x-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Approve</span>
              </Button>
              <Button
                onClick={() => handleStatusUpdate('rejected')}
                disabled={isUpdatingStatus}
                className="bg-red-600 hover:bg-red-700 text-white flex items-center space-x-2"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </Modal>
  )
}