import React, { useState, useEffect } from 'react'
import { 
  Plus, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Briefcase,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react'
import { Button } from '../ui/Button'
import { SearchBar } from '../ui/SearchBar'
import { LogFormModal } from './LogFormModal'
import { LogDetailModal } from './LogDetailModal'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

interface Log {
  id: string
  type: 'work' | 'expense' | 'transaction' | 'contribution' | 'withdrawal'
  title: string
  amount?: number
  status: 'pending' | 'approved' | 'rejected' | 'archived'
  created_at: string
  created_by: string
  decision_by?: string
  decision_at?: string
  [key: string]: any
}

interface LogsManagerProps {
  onUpdate: () => void
}

export const LogsManager: React.FC<LogsManagerProps> = ({ onUpdate }) => {
  const { user } = useAuth()
  const [logs, setLogs] = useState<Log[]>([])
  const [loading, setLoading] = useState(true)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedLogType, setSelectedLogType] = useState<Log['type']>('expense')
  const [selectedLog, setSelectedLog] = useState<Log | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    try {
      // Fetch all log types - FIXED: Changed users to profiles
      const [workLogs, expenseLogs, transactionLogs, contributionLogs, withdrawalLogs] = await Promise.all([
        supabase.from('work_logs').select('*, created_by_user:profiles!created_by(full_name)').order('created_at', { ascending: false }),
        supabase.from('expense_logs').select('*, created_by_user:profiles!created_by(full_name)').order('created_at', { ascending: false }),
        supabase.from('transaction_logs').select('*, created_by_user:profiles!created_by(full_name)').order('created_at', { ascending: false }),
        supabase.from('contribution_logs').select('*, created_by_user:profiles!created_by(full_name)').order('created_at', { ascending: false }),
        supabase.from('withdrawal_logs').select('*, created_by_user:profiles!created_by(full_name)').order('created_at', { ascending: false })
      ])

      // Combine all logs with type information
      const allLogs: Log[] = [
        ...(workLogs.data?.map(log => ({ ...log, type: 'work' as const })) || []),
        ...(expenseLogs.data?.map(log => ({ ...log, type: 'expense' as const })) || []),
        ...(transactionLogs.data?.map(log => ({ ...log, type: 'transaction' as const })) || []),
        ...(contributionLogs.data?.map(log => ({ ...log, type: 'contribution' as const })) || []),
        ...(withdrawalLogs.data?.map(log => ({ ...log, type: 'withdrawal' as const })) || [])
      ]

      // Sort by creation date
      allLogs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      
      setLogs(allLogs)
    } catch (error) {
      console.error('Error fetching logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter
    const matchesType = typeFilter === 'all' || log.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'work': return <Briefcase className="w-5 h-5 text-blue-600" />
      case 'expense': return <TrendingDown className="w-5 h-5 text-red-600" />
      case 'transaction': return <TrendingUp className="w-5 h-5 text-green-600" />
      case 'contribution': return <DollarSign className="w-5 h-5 text-purple-600" />
      case 'withdrawal': return <TrendingDown className="w-5 h-5 text-orange-600" />
      default: return <FileText className="w-5 h-5 text-gray-600" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'rejected': return <XCircle className="w-4 h-4 text-red-600" />
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />
      default: return <Clock className="w-4 h-4 text-gray-600" />
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

  const handleApproveLog = async (logId: string, logType: string) => {
    try {
      const { error } = await supabase
        .from(`${logType}_logs`)
        .update({
          status: 'approved',
          decision_by: user?.id,
          decision_at: new Date().toISOString()
        })
        .eq('id', logId)

      if (error) throw error
      
      fetchLogs()
      onUpdate()
    } catch (error) {
      console.error('Error approving log:', error)
    }
  }

  const handleRejectLog = async (logId: string, logType: string) => {
    try {
      const { error } = await supabase
        .from(`${logType}_logs`)
        .update({
          status: 'rejected',
          decision_by: user?.id,
          decision_at: new Date().toISOString()
        })
        .eq('id', logId)

      if (error) throw error
      
      fetchLogs()
      onUpdate()
    } catch (error) {
      console.error('Error rejecting log:', error)
    }
  }

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading logs...</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        <h2 className="text-2xl font-bold text-gray-900">Logs Management</h2>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => {
              setSelectedLogType('expense')
              setIsFormModalOpen(true)
            }}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700"
          >
            <TrendingDown className="w-4 h-4" />
            <span>Add Expense</span>
          </Button>
          <Button
            onClick={() => {
              setSelectedLogType('transaction')
              setIsFormModalOpen(true)
            }}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Add Income</span>
          </Button>
          <Button
            onClick={() => {
              setSelectedLogType('work')
              setIsFormModalOpen(true)
            }}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
          >
            <Briefcase className="w-4 h-4" />
            <span>Log Work</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search logs..."
          />
        </div>
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            aria-label="Type filter"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="work">Work</option>
            <option value="expense">Expense</option>
            <option value="transaction">Transaction</option>
            <option value="contribution">Contribution</option>
            <option value="withdrawal">Withdrawal</option>
          </select>
          <select
            aria-label="Status filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Logs List */}
      {filteredLogs.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No logs found</h3>
          <p className="text-gray-600 mb-4">Start by adding your first log entry</p>
          <Button
            onClick={() => {
              setSelectedLogType('expense')
              setIsFormModalOpen(true)
            }}
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Log</span>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredLogs.map((log) => (
            <div
              key={`${log.type}-${log.id}`}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="flex-shrink-0">
                    {getLogIcon(log.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {log.title}
                      </h3>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full uppercase">
                        {log.type}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{new Date(log.created_at).toLocaleDateString()}</span>
                      {log.amount && (
                        <span className="font-medium">₹{log.amount.toLocaleString()}</span>
                      )}
                      <span>by {log.created_by_user?.full_name || 'Unknown'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                    {getStatusIcon(log.status)}
                    <span className="ml-1 capitalize">{log.status}</span>
                  </span>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedLog(log)
                        setIsDetailModalOpen(true)
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    
                    {/* Approval buttons for pending logs */}
                    {log.status === 'pending' && user?.email === 'aryan@xolvetech.in' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleApproveLog(log.id, log.type)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleRejectLog(log.id, log.type)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Log Form Modal */}
      <LogFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        logType={selectedLogType}
        onSuccess={() => {
          fetchLogs()
          onUpdate()
        }}
      />

      {/* Log Detail Modal */}
      {selectedLog && (
        <LogDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false)
            setSelectedLog(null)
          }}
          log={selectedLog}
          onUpdate={() => {
            fetchLogs()
            onUpdate()
          }}
        />
      )}
    </div>
  )
}
