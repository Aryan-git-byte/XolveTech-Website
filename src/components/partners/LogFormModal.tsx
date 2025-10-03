import React, { useState, useEffect } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

interface LogFormModalProps {
  isOpen: boolean
  onClose: () => void
  logType: 'work' | 'expense' | 'transaction' | 'contribution' | 'withdrawal'
  onSuccess: () => void
}

export const LogFormModal: React.FC<LogFormModalProps> = ({
  isOpen,
  onClose,
  logType,
  onSuccess
}) => {
  const { user } = useAuth()
  const [formData, setFormData] = useState<any>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [projects, setProjects] = useState<any[]>([])

  useEffect(() => {
    if (isOpen) {
      resetForm()
      fetchProjects()
    }
  }, [isOpen, logType])

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('name')

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
    }
  }

  const resetForm = () => {
    const baseForm = {
      title: '',
      description: '',
      tags: '',
      project_id: '',
      notes: ''
    }

    switch (logType) {
      case 'work':
        setFormData({
          ...baseForm,
          project: '',
          hours_spent: '',
          date: new Date().toISOString().split('T')[0],
          deliverables: '',
          code_repo_link: '',
          blockers: '',
          task_priority: 'medium',
          due_date: ''
        })
        break
      case 'expense':
        setFormData({
          ...baseForm,
          amount: '',
          currency: 'INR',
          category: '',
          vendor_name: '',
          purchase_date: new Date().toISOString().split('T')[0],
          payment_method: '',
          invoice_number: '',
          gst_applicable: false,
          gst_amount: '',
          reimbursable: false,
          reimbursement_to: '',
          bank_txn_id: '',
          proof_image: '',
          estimated_budget: '',
          priority: 'medium'
        })
        break
      case 'transaction':
        setFormData({
          ...baseForm,
          amount: '',
          mode: '',
          customer_name: '',
          invoice_id: '',
          received_date: new Date().toISOString().split('T')[0]
        })
        break
      case 'contribution':
        setFormData({
          ...baseForm,
          contribution_type: 'capital',
          amount: '',
          mode: '',
          proof: '',
          remarks: ''
        })
        break
      case 'withdrawal':
        setFormData({
          ...baseForm,
          purpose: '',
          amount: '',
          method: '',
          requested_by: user?.id,
          withdrawal_date: new Date().toISOString().split('T')[0],
          emergency_flag: false
        })
        break
    }
    setError('')
  }

  // Function to clean numeric fields before sending to API
  const cleanFormData = (data: any, logType: string) => {
    const cleaned = { ...data }

    // Define numeric fields for each log type
    const numericFields: { [key: string]: string[] } = {
      work: ['hours_spent'],
      expense: ['amount', 'gst_amount', 'estimated_budget'],
      transaction: ['amount'],
      contribution: ['amount'],
      withdrawal: ['amount', 'balance_after']
    }

    // Clean numeric fields for this log type
    const fieldsToClean = numericFields[logType] || []
    
    fieldsToClean.forEach(field => {
      if (cleaned[field] === '' || cleaned[field] === undefined || cleaned[field] === null) {
        // For required fields, you might want to keep them as 0 or handle validation
        if (field === 'amount' && ['expense', 'transaction', 'withdrawal'].includes(logType)) {
          // Amount is required for these log types, but let validation handle it
          delete cleaned[field] // Remove the field entirely so validation can catch it
        } else {
          // For optional numeric fields, set to null
          cleaned[field] = null
        }
      } else if (typeof cleaned[field] === 'string') {
        // Convert string numbers to actual numbers
        const numValue = parseFloat(cleaned[field])
        if (!isNaN(numValue)) {
          cleaned[field] = numValue
        } else {
          cleaned[field] = null
        }
      }
    })

    // Handle empty strings for other optional fields
    Object.keys(cleaned).forEach(key => {
      if (cleaned[key] === '') {
        // Keep empty strings for text fields, but convert to null for optional fields that shouldn't be empty strings
        const optionalFields = ['project_id', 'description', 'notes', 'tags', 'vendor_name', 'invoice_number', 'code_repo_link', 'blockers', 'due_date', 'payment_method', 'bank_txn_id', 'proof_image', 'reimbursement_to', 'mode', 'customer_name', 'invoice_id', 'proof', 'remarks', 'method']
        if (optionalFields.includes(key)) {
          cleaned[key] = cleaned[key] === '' ? null : cleaned[key]
        }
      }
    })

    return cleaned
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      // Validate required fields
      if (!formData.title?.trim()) {
        throw new Error('Title is required')
      }

      // Validate required amount fields
      if (['expense', 'transaction', 'withdrawal'].includes(logType)) {
        if (!formData.amount || formData.amount === '' || parseFloat(formData.amount) <= 0) {
          throw new Error('Amount is required and must be greater than 0')
        }
      }

      if (logType === 'withdrawal' && !formData.purpose?.trim()) {
        throw new Error('Purpose is required for withdrawal')
      }

      if (logType === 'expense' && !formData.category) {
        throw new Error('Category is required for expense')
      }

      // Convert tags string to array
      const tags = formData.tags ? formData.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean) : []
      
      // Clean the form data
      const cleanedData = cleanFormData(formData, logType)
      
      const logData = {
        ...cleanedData,
        tags,
        created_by: user?.id,
        status: 'pending'
      }

      // Remove any undefined values
      Object.keys(logData).forEach(key => {
        if (logData[key] === undefined) {
          delete logData[key]
        }
      })

      console.log('Sending cleaned data:', logData) // Debug log

      const { error } = await supabase
        .from(`${logType}_logs`)
        .insert([logData])

      if (error) throw error

      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error creating log:', error)
      setError(error instanceof Error ? error.message : 'Failed to create log')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
  }

  const renderFormFields = () => {
    switch (logType) {
      case 'work':
        return (
          <>
            <Input
              label="Work Title *"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Brief description of work done"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Hours Spent"
                type="number"
                step="0.25"
                value={formData.hours_spent}
                onChange={(e) => handleChange('hours_spent', e.target.value)}
                placeholder="2.5"
              />
              <Input
                label="Date *"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deliverables
              </label>
              <textarea
                value={formData.deliverables}
                onChange={(e) => handleChange('deliverables', e.target.value)}
                placeholder="What was completed or delivered..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Deliverables"
              />
            </div>
            <Input
              label="Code Repository Link"
              value={formData.code_repo_link}
              onChange={(e) => handleChange('code_repo_link', e.target.value)}
              placeholder="https://github.com/..."
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Blockers
              </label>
              <textarea
                value={formData.blockers}
                onChange={(e) => handleChange('blockers', e.target.value)}
                placeholder="Any issues or blockers encountered..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Blockers"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="task-priority" className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  id="task-priority"
                  value={formData.task_priority}
                  onChange={(e) => handleChange('task_priority', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Task Priority"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <Input
                label="Due Date"
                type="date"
                value={formData.due_date}
                onChange={(e) => handleChange('due_date', e.target.value)}
              />
            </div>
          </>
        )

      case 'expense':
        return (
          <>
            <Input
              label="Expense Title *"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Brief description of expense"
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Detailed description of the expense..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Expense Description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Amount (₹) *"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                placeholder="0.00"
                required
              />
              <div>
                <label htmlFor="expense-category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  id="expense-category"
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  aria-label="Expense Category"
                >
                  <option value="">Select category</option>
                  <option value="Materials">Materials</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Delivery">Delivery</option>
                  <option value="Travel">Travel</option>
                  <option value="Tools">Tools</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Vendor Name"
                value={formData.vendor_name}
                onChange={(e) => handleChange('vendor_name', e.target.value)}
                placeholder="Vendor or store name"
              />
              <Input
                label="Purchase Date"
                type="date"
                value={formData.purchase_date}
                onChange={(e) => handleChange('purchase_date', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="payment-method" className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  id="payment-method"
                  value={formData.payment_method}
                  onChange={(e) => handleChange('payment_method', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Payment Method"
                >
                  <option value="">Select method</option>
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="Bank">Bank Transfer</option>
                  <option value="Card">Card</option>
                  <option value="Credit">Credit</option>
                </select>
              </div>
              <Input
                label="Invoice Number"
                value={formData.invoice_number}
                onChange={(e) => handleChange('invoice_number', e.target.value)}
                placeholder="Invoice/receipt number"
              />
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.gst_applicable}
                  onChange={(e) => handleChange('gst_applicable', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">GST Applicable</span>
              </label>
              {formData.gst_applicable && (
                <Input
                  label="GST Amount (₹)"
                  type="number"
                  step="0.01"
                  value={formData.gst_amount}
                  onChange={(e) => handleChange('gst_amount', e.target.value)}
                  placeholder="0.00"
                />
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Estimated Budget (₹)"
                type="number"
                step="0.01"
                value={formData.estimated_budget}
                onChange={(e) => handleChange('estimated_budget', e.target.value)}
                placeholder="0.00"
              />
              <div>
                <label htmlFor="expense-priority" className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  id="expense-priority"
                  value={formData.priority}
                  onChange={(e) => handleChange('priority', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Expense Priority"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>
            <Input
              label="Proof Image URL"
              value={formData.proof_image}
              onChange={(e) => handleChange('proof_image', e.target.value)}
              placeholder="Upload receipt/invoice to Supabase Storage"
            />
          </>
        )

      case 'transaction':
        return (
          <>
            <Input
              label="Transaction Title *"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Income source description"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Amount (₹) *"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                placeholder="0.00"
                required
              />
              <div>
                <label htmlFor="transaction-mode" className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Mode
                </label>
                <select
                  id="transaction-mode"
                  value={formData.mode}
                  onChange={(e) => handleChange('mode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Transaction Payment Mode"
                >
                  <option value="">Select mode</option>
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="Bank">Bank Transfer</option>
                  <option value="Card">Card</option>
                  <option value="Online">Online Payment</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Customer Name"
                value={formData.customer_name}
                onChange={(e) => handleChange('customer_name', e.target.value)}
                placeholder="Customer or client name"
              />
              <Input
                label="Invoice ID"
                value={formData.invoice_id}
                onChange={(e) => handleChange('invoice_id', e.target.value)}
                placeholder="Invoice or order ID"
              />
            </div>
            <Input
              label="Received Date"
              type="date"
              value={formData.received_date}
              onChange={(e) => handleChange('received_date', e.target.value)}
            />
          </>
        )

      case 'contribution':
        return (
          <>
            <div>
              <label htmlFor="contribution-type" className="block text-sm font-medium text-gray-700 mb-1">
                Contribution Type *
              </label>
              <select
                id="contribution-type"
                value={formData.contribution_type}
                onChange={(e) => handleChange('contribution_type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                aria-label="Contribution Type"
              >
                <option value="capital">Capital Investment</option>
                <option value="temporary loan">Temporary Loan</option>
                <option value="refund">Refund</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Amount (₹)"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                placeholder="0.00"
              />
              <div>
                <label htmlFor="contribution-mode" className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Mode
                </label>
                <select
                  id="contribution-mode"
                  value={formData.mode}
                  onChange={(e) => handleChange('mode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Contribution Payment Mode"
                >
                  <option value="">Select mode</option>
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="Bank">Bank Transfer</option>
                </select>
              </div>
            </div>
            <Input
              label="Proof (UTR/Screenshot URL)"
              value={formData.proof}
              onChange={(e) => handleChange('proof', e.target.value)}
              placeholder="Upload proof to Supabase Storage"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Remarks
              </label>
              <textarea
                value={formData.remarks}
                onChange={(e) => handleChange('remarks', e.target.value)}
                placeholder="Terms if loan, purpose, or additional notes..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Contribution Remarks"
              />
            </div>
          </>
        )

      case 'withdrawal':
        return (
          <>
            <Input
              label="Purpose *"
              value={formData.purpose}
              onChange={(e) => handleChange('purpose', e.target.value)}
              placeholder="Reason for withdrawal"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Amount (₹) *"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                placeholder="0.00"
                required
              />
              <div>
                <label htmlFor="withdrawal-method" className="block text-sm font-medium text-gray-700 mb-1">
                  Method
                </label>
                <select
                  id="withdrawal-method"
                  value={formData.method}
                  onChange={(e) => handleChange('method', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Withdrawal Method"
                >
                  <option value="">Select method</option>
                  <option value="cash">Cash</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="UPI">UPI</option>
                </select>
              </div>
            </div>
            <Input
              label="Withdrawal Date"
              type="date"
              value={formData.withdrawal_date}
              onChange={(e) => handleChange('withdrawal_date', e.target.value)}
            />
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.emergency_flag}
                onChange={(e) => handleChange('emergency_flag', e.target.checked)}
                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <span className="text-sm font-medium text-gray-700">Emergency Withdrawal</span>
            </label>
          </>
        )

      default:
        return null
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Add ${logType.charAt(0).toUpperCase() + logType.slice(1)} Log`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {renderFormFields()}

        {/* Common fields */}
        <div>
          <label htmlFor="project-select" className="block text-sm font-medium text-gray-700 mb-1">
            Project
          </label>
          <select
            id="project-select"
            value={formData.project_id}
            onChange={(e) => handleChange('project_id', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Project Selection"
          >
            <option value="">Select project (optional)</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Tags"
          value={formData.tags}
          onChange={(e) => handleChange('tags', e.target.value)}
          placeholder="urgent, marketing, development (comma-separated)"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="Internal notes or comments..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Additional Notes"
          />
        </div>

        <div className="flex space-x-3 pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? 'Creating...' : 'Create Log'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  )
}