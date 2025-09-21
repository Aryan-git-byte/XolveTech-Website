import React, { useState, useEffect } from 'react'
import { 
  BarChart3, 
  Plus, 
  Clock, 
  CheckCircle, 
  DollarSign, 
  TrendingUp,
  FileText,
  Users,
  Calendar,
  Bell
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { Button } from '../ui/Button'
import { LogsManager } from './LogsManager'
import { TasksManager } from './TasksManager'
import { AnalyticsDashboard } from './AnalyticsDashboard'
import { NotificationsPanel } from './NotificationsPanel'

interface DashboardStats {
  pendingApprovals: number
  totalBalance: number
  monthlyExpenses: number
  monthlyIncome: number
  myContributions: number
  myWithdrawals: number
  tasksAssigned: number
  tasksCompleted: number
}

export const PartnerDashboard: React.FC = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [stats, setStats] = useState<DashboardStats>({
    pendingApprovals: 0,
    totalBalance: 0,
    monthlyExpenses: 0,
    monthlyIncome: 0,
    myContributions: 0,
    myWithdrawals: 0,
    tasksAssigned: 0,
    tasksCompleted: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [user])

  const fetchDashboardStats = async () => {
    if (!user) return

    try {
      // Get current month start
      const monthStart = new Date()
      monthStart.setDate(1)
      monthStart.setHours(0, 0, 0, 0)

      // Fetch various stats in parallel
      const [
        pendingLogs,
        expenses,
        transactions,
        contributions,
        withdrawals,
        tasks
      ] = await Promise.all([
        // Pending approvals count
        supabase
          .from('expense_logs')
          .select('id')
          .eq('status', 'pending'),
        
        // Monthly expenses
        supabase
          .from('expense_logs')
          .select('amount')
          .eq('status', 'approved')
          .gte('created_at', monthStart.toISOString()),
        
        // Monthly income
        supabase
          .from('transaction_logs')
          .select('amount')
          .eq('status', 'approved')
          .gte('created_at', monthStart.toISOString()),
        
        // My contributions
        supabase
          .from('contribution_logs')
          .select('amount')
          .eq('created_by', user.id)
          .eq('status', 'approved'),
        
        // My withdrawals
        supabase
          .from('withdrawal_logs')
          .select('amount')
          .eq('created_by', user.id)
          .eq('status', 'approved'),
        
        // My tasks
        supabase
          .from('tasks')
          .select('id, status')
          .eq('assigned_to', user.id)
      ])

      const monthlyExpenses = expenses.data?.reduce((sum, exp) => sum + (exp.amount || 0), 0) || 0
      const monthlyIncome = transactions.data?.reduce((sum, txn) => sum + (txn.amount || 0), 0) || 0
      const myContributions = contributions.data?.reduce((sum, cont) => sum + (cont.amount || 0), 0) || 0
      const myWithdrawals = withdrawals.data?.reduce((sum, with_) => sum + (with_.amount || 0), 0) || 0
      
      const tasksAssigned = tasks.data?.length || 0
      const tasksCompleted = tasks.data?.filter(task => task.status === 'completed').length || 0

      setStats({
        pendingApprovals: pendingLogs.data?.length || 0,
        totalBalance: monthlyIncome - monthlyExpenses,
        monthlyExpenses,
        monthlyIncome,
        myContributions,
        myWithdrawals,
        tasksAssigned,
        tasksCompleted
      })
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'logs', label: 'Logs', icon: FileText },
    { id: 'tasks', label: 'Tasks', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ]

  const quickStats = [
    {
      title: 'Pending Approvals',
      value: stats.pendingApprovals,
      icon: Clock,
      color: 'text-yellow-600',
      bg: 'bg-yellow-100'
    },
    {
      title: 'Monthly Balance',
      value: `₹${stats.totalBalance.toLocaleString()}`,
      icon: DollarSign,
      color: stats.totalBalance >= 0 ? 'text-green-600' : 'text-red-600',
      bg: stats.totalBalance >= 0 ? 'bg-green-100' : 'bg-red-100'
    },
    {
      title: 'My Contributions',
      value: `₹${stats.myContributions.toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      title: 'Tasks Assigned',
      value: `${stats.tasksCompleted}/${stats.tasksAssigned}`,
      icon: CheckCircle,
      color: 'text-purple-600',
      bg: 'bg-purple-100'
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading partner dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Partner Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Welcome back, {user?.user_metadata?.full_name || user?.email}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {quickStats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 ${stat.bg} rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm">
          {activeTab === 'dashboard' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Your recent logs and activities will appear here</p>
                <Button 
                  onClick={() => setActiveTab('logs')} 
                  className="mt-4 flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Log</span>
                </Button>
              </div>
            </div>
          )}
          {activeTab === 'logs' && <LogsManager onUpdate={fetchDashboardStats} />}
          {activeTab === 'tasks' && <TasksManager />}
          {activeTab === 'analytics' && <AnalyticsDashboard />}
          {activeTab === 'notifications' && <NotificationsPanel />}
        </div>
      </div>
    </div>
  )
}