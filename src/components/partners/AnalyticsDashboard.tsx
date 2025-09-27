import React, { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  BarChart3,
  Download,
  Users
} from 'lucide-react'
import { Button } from '../ui/Button'
import { supabase } from '../../lib/supabase'

interface AnalyticsData {
  totalIncome: number
  totalExpenses: number
  netBalance: number
  monthlyIncome: number
  monthlyExpenses: number
  expensesByCategory: { [key: string]: number }
  contributionsByPartner: { [key: string]: number }
  recentTransactions: any[]
}

export const AnalyticsDashboard: React.FC = () => {
  const [data, setData] = useState<AnalyticsData>({
    totalIncome: 0,
    totalExpenses: 0,
    netBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    expensesByCategory: {},
    contributionsByPartner: {},
    recentTransactions: []
  })
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('month')

  useEffect(() => {
    fetchAnalyticsData()
  }, [selectedPeriod])

  const fetchAnalyticsData = async () => {
    try {
      // Calculate date range based on selected period
      const now = new Date()
      let startDate = new Date()
      
      switch (selectedPeriod) {
        case 'week':
          startDate.setDate(now.getDate() - 7)
          break
        case 'month':
          startDate.setMonth(now.getMonth() - 1)
          break
        case 'quarter':
          startDate.setMonth(now.getMonth() - 3)
          break
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1)
          break
      }

      // Fetch all approved logs
      const [expenses, transactions, contributions] = await Promise.all([
        supabase
          .from('expense_logs')
          .select('amount, category, created_at')
          .eq('status', 'approved')
          .gte('created_at', startDate.toISOString()),
        
        supabase
          .from('transaction_logs')
          .select('amount, created_at, customer_name')
          .eq('status', 'approved')
          .gte('created_at', startDate.toISOString()),
        
        supabase
          .from('contribution_logs')
          .select('amount, created_by, created_at, users!created_by(full_name)')
          .eq('status', 'approved')
          .gte('created_at', startDate.toISOString())
      ])

      // Calculate totals
      const totalExpenses = expenses.data?.reduce((sum, exp) => sum + (exp.amount || 0), 0) || 0
      const totalIncome = transactions.data?.reduce((sum, txn) => sum + (txn.amount || 0), 0) || 0
      const netBalance = totalIncome - totalExpenses

      // Group expenses by category
      const expensesByCategory: { [key: string]: number } = {}
      expenses.data?.forEach(exp => {
        const category = exp.category || 'Other'
        expensesByCategory[category] = (expensesByCategory[category] || 0) + (exp.amount || 0)
      })

      // Group contributions by partner
      const contributionsByPartner: { [key: string]: number } = {}
      contributions.data?.forEach(cont => {
        const partnerName = (Array.isArray(cont.users) && cont.users[0]?.full_name) || 'Unknown'
        contributionsByPartner[partnerName] = (contributionsByPartner[partnerName] || 0) + (cont.amount || 0)
      })

      setData({
        totalIncome,
        totalExpenses,
        netBalance,
        monthlyIncome: totalIncome,
        monthlyExpenses: totalExpenses,
        expensesByCategory,
        contributionsByPartner,
        recentTransactions: transactions.data?.slice(0, 5) || []
      })
    } catch (error) {
      console.error('Error fetching analytics data:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportData = async () => {
    try {
      // This would generate a comprehensive report
      const reportData = {
        period: selectedPeriod,
        generated_at: new Date().toISOString(),
        summary: {
          total_income: data.totalIncome,
          total_expenses: data.totalExpenses,
          net_balance: data.netBalance
        },
        expenses_by_category: data.expensesByCategory,
        contributions_by_partner: data.contributionsByPartner
      }

      // Create and download JSON file
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `xolvetech-analytics-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting data:', error)
    }
  }

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading analytics...</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        <h2 className="text-2xl font-bold text-gray-900">Analytics & Reports</h2>
        <div className="flex items-center space-x-3">
          <select
            aria-label="Select time period"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
          <Button
            onClick={exportData}
            className="flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Income</p>
              <p className="text-2xl font-bold text-green-600">₹{data.totalIncome.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600">₹{data.totalExpenses.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Balance</p>
              <p className={`text-2xl font-bold ${data.netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{data.netBalance.toLocaleString()}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              data.netBalance >= 0 ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <DollarSign className={`w-6 h-6 ${data.netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Expenses by Category */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Expenses by Category</h3>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {Object.entries(data.expensesByCategory).map(([category, amount]) => {
              const percentage = data.totalExpenses > 0 ? (amount / data.totalExpenses) * 100 : 0
              return (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">{category}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">₹{amount.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">{percentage.toFixed(1)}%</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Contributions by Partner */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Contributions by Partner</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {Object.entries(data.contributionsByPartner).map(([partner, amount]) => (
              <div key={partner} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-sm text-gray-700">{partner}</span>
                </div>
                <div className="text-sm font-medium text-gray-900">₹{amount.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.recentTransactions.map((transaction, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.customer_name || 'Unknown Customer'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    ₹{transaction.amount?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}