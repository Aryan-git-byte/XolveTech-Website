import React, { useState, useEffect } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { 
  Calendar, 
  User, 
  Flag, 
  MessageSquare,
  Edit,
  Trash2,
  CheckCircle
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

interface TaskDetailModalProps {
  isOpen: boolean
  onClose: () => void
  task: any
  onUpdate: () => void
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  isOpen,
  onClose,
  task,
  onUpdate
}) => {
  const { user } = useAuth()
  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState('')
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [buckets, setBuckets] = useState<any[]>([])

  useEffect(() => {
    if (isOpen && task) {
      fetchComments()
      fetchBuckets()
    }
  }, [isOpen, task])

  const fetchComments = async () => {
    try {
      // FIXED: Changed users to profiles
      const { data, error } = await supabase
        .from('comments')
        .select('*, created_by_user:profiles!created_by(full_name)')
        .eq('task_id', task.id)
        .order('created_at', { ascending: true })

      if (error) throw error
      setComments(data || [])
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }

  const fetchBuckets = async () => {
    try {
      const { data, error } = await supabase
        .from('task_buckets')
        .select('*')
        .order('order_index')

      if (error) throw error
      setBuckets(data || [])
    } catch (error) {
      console.error('Error fetching buckets:', error)
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
          task_id: task.id,
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

  const handleStatusChange = async (newBucketId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ bucket_id: newBucketId })
        .eq('id', task.id)

      if (error) throw error

      onUpdate()
      onClose()
    } catch (error) {
      console.error('Error updating task status:', error)
    }
  }

  const handleDeleteTask = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', task.id)

      if (error) throw error

      onUpdate()
      onClose()
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100'
      case 'high': return 'text-orange-600 bg-orange-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Task Details">
      <div className="space-y-6">
        {/* Task Header */}
        <div className="border-b pb-4">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">{task.title}</h3>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2 text-gray-600">
              <User className="w-4 h-4" />
              <span>Assigned to: {task.assigned_user?.full_name || 'Unassigned'}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Created: {new Date(task.created_at).toLocaleDateString()}</span>
            </div>
            {task.due_date && (
              <div className="flex items-center space-x-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
              </div>
            )}
            {task.priority && (
              <div className="flex items-center space-x-2">
                <Flag className="w-4 h-4 text-gray-400" />
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
              </div>
            )}
          </div>

          {task.project?.name && (
            <div className="mt-3">
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                Project: {task.project.name}
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        {task.description && (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Description</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap">{task.description}</p>
            </div>
          </div>
        )}

        {/* Status Update */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Update Status</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {buckets.map((bucket) => (
              <Button
                key={bucket.id}
                size="sm"
                variant={task.bucket_id === bucket.id ? 'primary' : 'outline'}
                onClick={() => handleStatusChange(bucket.id)}
                className="text-xs"
              >
                {bucket.name}
              </Button>
            ))}
          </div>
        </div>

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
          
          {/* Task management buttons */}
          {(task.created_by === user?.id || task.assigned_to === user?.id) && (
            <Button
              onClick={handleDeleteTask}
              className="bg-red-600 hover:bg-red-700 text-white flex items-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </Button>
          )}
        </div>
      </div>
    </Modal>
  )
}
