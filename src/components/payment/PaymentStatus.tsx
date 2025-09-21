import React from 'react'
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react'

interface PaymentStatusProps {
  status: 'loading' | 'success' | 'error' | 'warning'
  title: string
  message: string
  details?: string
  onRetry?: () => void
  onClose?: () => void
}

export const PaymentStatus: React.FC<PaymentStatusProps> = ({
  status,
  title,
  message,
  details,
  onRetry,
  onClose
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'loading':
        return {
          icon: <Clock className="w-8 h-8 text-blue-600 animate-pulse" />,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          titleColor: 'text-blue-900',
          messageColor: 'text-blue-700'
        }
      case 'success':
        return {
          icon: <CheckCircle className="w-8 h-8 text-green-600" />,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          titleColor: 'text-green-900',
          messageColor: 'text-green-700'
        }
      case 'error':
        return {
          icon: <XCircle className="w-8 h-8 text-red-600" />,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          titleColor: 'text-red-900',
          messageColor: 'text-red-700'
        }
      case 'warning':
        return {
          icon: <AlertTriangle className="w-8 h-8 text-yellow-600" />,
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          titleColor: 'text-yellow-900',
          messageColor: 'text-yellow-700'
        }
    }
  }

  const config = getStatusConfig()

  return (
    <div className={`p-6 rounded-lg border ${config.bgColor} ${config.borderColor}`}>
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          {config.icon}
        </div>
        <div className="flex-1">
          <h3 className={`text-lg font-semibold ${config.titleColor} mb-2`}>
            {title}
          </h3>
          <p className={`${config.messageColor} mb-3`}>
            {message}
          </p>
          {details && (
            <div className="bg-white bg-opacity-50 rounded-md p-3 mb-4">
              <p className="text-sm text-gray-600 font-mono">
                {details}
              </p>
            </div>
          )}
          <div className="flex space-x-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            )}
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}