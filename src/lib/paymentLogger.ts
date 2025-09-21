// Simple logging utility for payment operations
interface LogEntry {
  timestamp: string
  level: 'info' | 'warn' | 'error' | 'debug'
  event: string
  data?: any
}

class SimpleLogger {
  private logs: LogEntry[] = []
  private maxLogs = 50

  private createLogEntry(level: LogEntry['level'], event: string, data?: any): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      event,
      data: this.sanitizeLogData(data)
    }
  }

  private sanitizeLogData(data: any): any {
    if (!data) return data

    // Remove sensitive information from logs
    const sensitiveKeys = ['password', 'secret', 'key', 'token']
    
    if (typeof data === 'object') {
      const sanitized = { ...data }
      
      Object.keys(sanitized).forEach(key => {
        if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
          sanitized[key] = '[REDACTED]'
        }
      })
      
      return sanitized
    }
    
    return data
  }

  private addLog(entry: LogEntry) {
    this.logs.push(entry)
    
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }

    if (import.meta.env.DEV) {
      const emoji = {
        info: '💡',
        warn: '⚠️',
        error: '❌',
        debug: '🔍'
      }[entry.level]

      console.log(`${emoji} [Payment] ${entry.event}`, entry.data || '')
    }
  }

  info(event: string, data?: any) {
    this.addLog(this.createLogEntry('info', event, data))
  }

  warn(event: string, data?: any) {
    this.addLog(this.createLogEntry('warn', event, data))
  }

  error(event: string, data?: any) {
    this.addLog(this.createLogEntry('error', event, data))
  }

  debug(event: string, data?: any) {
    this.addLog(this.createLogEntry('debug', event, data))
  }

  getLogs(): LogEntry[] {
    return [...this.logs]
  }

  clearLogs() {
    this.logs = []
  }
}

export const paymentLogger = new SimpleLogger()