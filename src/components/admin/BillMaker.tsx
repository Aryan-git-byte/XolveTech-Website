import React, { useState, useEffect } from 'react'
import { FileText, Plus, Trash2, Download, Printer, RefreshCw, Package, Calculator, User, Mail, Phone, MapPin } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { supabase } from '../../lib/supabase'
import { Order } from '../../types'

interface LineItem {
  id: string
  name: string
  description: string
  quantity: number
  unitPrice: number
  lineTotal: number
}

interface CustomerInfo {
  name: string
  address: string
  contact: string
  email: string
}

interface BillCalculations {
  subtotal: number
  taxAmount: number
  discountAmount: number
  grandTotal: number
}

export const BillMaker: React.FC = () => {
  // Bill metadata
  const [billNumber, setBillNumber] = useState('')
  const [billDate, setBillDate] = useState('')
  
  // Customer information
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    address: '',
    contact: '',
    email: ''
  })
  
  // Line items
  const [lineItems, setLineItems] = useState<LineItem[]>([])
  
  // Financial calculations
  const [taxRate, setTaxRate] = useState(0) // Percentage (e.g., 18 for 18%)
  const [discount, setDiscount] = useState(0) // Flat amount
  const [calculations, setCalculations] = useState<BillCalculations>({
    subtotal: 0,
    taxAmount: 0,
    discountAmount: 0,
    grandTotal: 0
  })
  
  // Order import functionality
  const [orderIdToImport, setOrderIdToImport] = useState('')
  const [importLoading, setImportLoading] = useState(false)
  const [importError, setImportError] = useState('')
  
  // UI state
  const [isPrintMode, setIsPrintMode] = useState(false)

  // Generate bill number on component mount
  useEffect(() => {
    generateBillNumber()
    setBillDate(new Date().toISOString().split('T')[0])
  }, [])

  // Recalculate totals whenever line items, tax rate, or discount change
  useEffect(() => {
    calculateTotals()
  }, [lineItems, taxRate, discount])

  const generateBillNumber = () => {
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 1000)
    setBillNumber(`BILL_${timestamp}_${random}`)
  }

  const calculateTotals = () => {
    const subtotal = lineItems.reduce((sum, item) => sum + item.lineTotal, 0)
    const discountAmount = Math.min(discount, subtotal) // Discount can't exceed subtotal
    const taxableAmount = subtotal - discountAmount
    const taxAmount = (taxableAmount * taxRate) / 100
    const grandTotal = taxableAmount + taxAmount

    setCalculations({
      subtotal,
      taxAmount,
      discountAmount,
      grandTotal
    })
  }

  const addLineItem = () => {
    const newItem: LineItem = {
      id: `item_${Date.now()}_${Math.random()}`,
      name: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      lineTotal: 0
    }
    setLineItems([...lineItems, newItem])
  }

  const removeLineItem = (itemId: string) => {
    setLineItems(lineItems.filter(item => item.id !== itemId))
  }

  const handleLineItemChange = (itemId: string, field: keyof LineItem, value: string | number) => {
    setLineItems(lineItems.map(item => {
      if (item.id === itemId) {
        const updatedItem = { ...item, [field]: value }
        
        // Recalculate line total when quantity or unit price changes
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.lineTotal = updatedItem.quantity * updatedItem.unitPrice
        }
        
        return updatedItem
      }
      return item
    }))
  }

  const handleImportOrder = async () => {
    if (!orderIdToImport.trim()) {
      setImportError('Please enter an order ID')
      return
    }

    setImportLoading(true)
    setImportError('')

    try {
      const { data: order, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderIdToImport.trim())
        .single()

      if (error) {
        throw new Error('Order not found')
      }

      // Populate customer information
      setCustomerInfo({
        name: order.name || '',
        address: order.address || '',
        contact: order.contact || '',
        email: order.email || ''
      })

      // Convert cart items to line items
      if (order.cart_items && Array.isArray(order.cart_items)) {
        const importedLineItems: LineItem[] = order.cart_items.map((cartItem: any, index: number) => ({
          id: `imported_${Date.now()}_${index}`,
          name: cartItem.product?.title || 'Unknown Product',
          description: cartItem.product?.description || '',
          quantity: cartItem.quantity || 1,
          unitPrice: cartItem.product?.price || 0,
          lineTotal: (cartItem.quantity || 1) * (cartItem.product?.price || 0)
        }))
        
        setLineItems(importedLineItems)
      }

      setOrderIdToImport('')
      setImportError('')
    } catch (error) {
      console.error('Error importing order:', error)
      setImportError(error instanceof Error ? error.message : 'Failed to import order')
    } finally {
      setImportLoading(false)
    }
  }

  const handleClearBill = () => {
    setCustomerInfo({ name: '', address: '', contact: '', email: '' })
    setLineItems([])
    setTaxRate(0)
    setDiscount(0)
    setOrderIdToImport('')
    setImportError('')
    generateBillNumber()
    setBillDate(new Date().toISOString().split('T')[0])
  }

  const handlePrint = () => {
    setIsPrintMode(true)
    setTimeout(() => {
      window.print()
      setIsPrintMode(false)
    }, 100)
  }

  const handleCustomerInfoChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className={`p-6 ${isPrintMode ? 'print-mode' : ''}`}>
      <style jsx>{`
        @media print {
          .no-print { display: none !important; }
          .print-mode { 
            background: white !important;
            color: black !important;
          }
          .print-mode * {
            background: white !important;
            color: black !important;
            border-color: black !important;
          }
          .print-mode table {
            border-collapse: collapse;
          }
          .print-mode th, .print-mode td {
            border: 1px solid black !important;
            padding: 8px !important;
          }
        }
      `}</style>

      {/* Header */}
      <div className="flex justify-between items-center mb-6 no-print">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <FileText className="w-6 h-6 mr-2" />
            Bill Maker
          </h2>
          <p className="text-gray-600">Generate professional bills and memos</p>
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={handleClearBill}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Clear</span>
          </Button>
          <Button
            onClick={handlePrint}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
          >
            <Printer className="w-4 h-4" />
            <span>Print Bill</span>
          </Button>
        </div>
      </div>

      {/* Import Order Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 no-print">
        <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
          <Package className="w-5 h-5 mr-2" />
          Import Existing Order
        </h3>
        <div className="flex space-x-3">
          <div className="flex-1">
            <Input
              placeholder="Enter Order ID (e.g., XLV_1234567890_123)"
              value={orderIdToImport}
              onChange={(e) => setOrderIdToImport(e.target.value)}
              className="w-full"
            />
          </div>
          <Button
            onClick={handleImportOrder}
            disabled={importLoading || !orderIdToImport.trim()}
            className="flex items-center space-x-2"
          >
            {importLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Importing...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Import</span>
              </>
            )}
          </Button>
        </div>
        {importError && (
          <p className="text-red-600 text-sm mt-2">{importError}</p>
        )}
      </div>

      {/* Bill Content */}
      <div className="bg-white rounded-lg shadow-sm border">
        {/* Bill Header */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">X</span>
                </div>
                <span className="text-xl font-bold text-gray-900">XolveTech</span>
              </div>
              <p className="text-gray-600">STEM Learning Solutions</p>
              <p className="text-gray-600">Patna, Bihar, India</p>
              <p className="text-gray-600">Email: xolvetech@gmail.com</p>
              <p className="text-gray-600">Phone: +91 9386387397</p>
            </div>
            <div className="text-right">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">BILL / MEMO</h1>
              <div className="space-y-1">
                <div className="flex space-x-2 no-print">
                  <Input
                    label="Bill Number"
                    value={billNumber}
                    onChange={(e) => setBillNumber(e.target.value)}
                    className="w-48"
                  />
                </div>
                <div className="print:block hidden">
                  <p className="text-sm text-gray-600">Bill Number: {billNumber}</p>
                </div>
                <div className="flex space-x-2 no-print">
                  <Input
                    label="Date"
                    type="date"
                    value={billDate}
                    onChange={(e) => setBillDate(e.target.value)}
                    className="w-48"
                  />
                </div>
                <div className="print:block hidden">
                  <p className="text-sm text-gray-600">Date: {billDate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Bill To
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="no-print">
              <Input
                label="Customer Name"
                value={customerInfo.name}
                onChange={(e) => handleCustomerInfoChange('name', e.target.value)}
                placeholder="Enter customer name"
              />
            </div>
            <div className="no-print">
              <Input
                label="Email"
                value={customerInfo.email}
                onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
                placeholder="customer@email.com"
              />
            </div>
            <div className="no-print">
              <Input
                label="Contact Number"
                value={customerInfo.contact}
                onChange={(e) => handleCustomerInfoChange('contact', e.target.value)}
                placeholder="+91 9876543210"
              />
            </div>
            <div className="no-print">
              <Input
                label="Address"
                value={customerInfo.address}
                onChange={(e) => handleCustomerInfoChange('address', e.target.value)}
                placeholder="Complete address"
              />
            </div>
          </div>
          
          {/* Print view of customer info */}
          <div className="print:block hidden">
            <div className="space-y-1">
              <p className="font-semibold text-gray-900">{customerInfo.name}</p>
              {customerInfo.email && <p className="text-gray-700">{customerInfo.email}</p>}
              {customerInfo.contact && <p className="text-gray-700">{customerInfo.contact}</p>}
              {customerInfo.address && <p className="text-gray-700">{customerInfo.address}</p>}
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-center mb-4 no-print">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Package className="w-5 h-5 mr-2" />
              Items
            </h3>
            <Button
              onClick={addLineItem}
              className="flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Item</span>
            </Button>
          </div>

          {lineItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500 no-print">
              <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No items added yet. Click "Add Item" or import an existing order.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-2 font-semibold text-gray-900">Item Name</th>
                    <th className="text-left py-3 px-2 font-semibold text-gray-900">Description</th>
                    <th className="text-center py-3 px-2 font-semibold text-gray-900">Qty</th>
                    <th className="text-right py-3 px-2 font-semibold text-gray-900">Unit Price</th>
                    <th className="text-right py-3 px-2 font-semibold text-gray-900">Total</th>
                    <th className="text-center py-3 px-2 font-semibold text-gray-900 no-print">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map((item, index) => (
                    <tr key={item.id} className="border-b border-gray-100">
                      <td className="py-3 px-2">
                        <div className="no-print">
                          <Input
                            value={item.name}
                            onChange={(e) => handleLineItemChange(item.id, 'name', e.target.value)}
                            placeholder="Item name"
                            className="w-full"
                          />
                        </div>
                        <div className="print:block hidden">
                          <p className="font-medium">{item.name}</p>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="no-print">
                          <Input
                            value={item.description}
                            onChange={(e) => handleLineItemChange(item.id, 'description', e.target.value)}
                            placeholder="Description"
                            className="w-full"
                          />
                        </div>
                        <div className="print:block hidden">
                          <p className="text-sm text-gray-600">{item.description}</p>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <div className="no-print">
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleLineItemChange(item.id, 'quantity', parseInt(e.target.value) || 1)}
                            className="w-20 text-center"
                          />
                        </div>
                        <div className="print:block hidden">
                          <p>{item.quantity}</p>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <div className="no-print">
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) => handleLineItemChange(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                            className="w-24 text-right"
                          />
                        </div>
                        <div className="print:block hidden">
                          <p>₹{item.unitPrice.toFixed(2)}</p>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <p className="font-semibold">₹{item.lineTotal.toFixed(2)}</p>
                      </td>
                      <td className="py-3 px-2 text-center no-print">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeLineItem(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Calculations */}
        <div className="p-6">
          <div className="flex justify-between">
            {/* Tax and Discount Controls */}
            <div className="w-1/2 space-y-4 no-print">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Calculator className="w-5 h-5 mr-2" />
                Adjustments
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Tax Rate (%)"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={taxRate}
                  onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                  placeholder="0"
                />
                <Input
                  label="Discount (₹)"
                  type="number"
                  min="0"
                  step="0.01"
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
            </div>

            {/* Totals */}
            <div className="w-1/2 pl-8">
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">Subtotal:</span>
                  <span className="font-medium">₹{calculations.subtotal.toFixed(2)}</span>
                </div>
                
                {calculations.discountAmount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Discount:</span>
                    <span>-₹{calculations.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                
                {calculations.taxAmount > 0 && (
                  <div className="flex justify-between text-blue-600">
                    <span>Tax ({taxRate}%):</span>
                    <span>₹{calculations.taxAmount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-gray-900">Grand Total:</span>
                    <span className="text-blue-600">₹{calculations.grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <div className="text-center text-sm text-gray-600">
            <p className="font-semibold mb-1">Thank you for choosing XolveTech!</p>
            <p>Building the next generation of STEM innovators</p>
            <p className="mt-2">For support: xolvetech@gmail.com | +91 9386387397</p>
          </div>
        </div>
      </div>

      {/* Print Instructions */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg no-print">
        <h4 className="font-semibold text-yellow-800 mb-2">Print Instructions:</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Click "Print Bill" to generate a clean, professional printout</li>
          <li>• The printed version will hide all form controls and show only the bill content</li>
          <li>• Make sure all information is filled before printing</li>
          <li>• You can save as PDF using your browser's print dialog</li>
        </ul>
      </div>
    </div>
  )
}
