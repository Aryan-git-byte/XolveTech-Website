import React, { useState, useEffect } from 'react'
import { MessageSquare, Eye, Mail, Phone } from 'lucide-react'
import { Contact } from '../../types'
import { supabase } from '../../lib/supabase'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { sanitizeText } from '../../utils/sanitize'

export const ContactsManager: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('timestamp', { ascending: false })

      if (error) throw error
      setContacts(data || [])
    } catch (error) {
      console.error('Error fetching contacts:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading messages...</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Contact Messages</h2>
      </div>

      {contacts.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No messages found</h3>
          <p className="text-gray-600">Contact messages will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contacts.map((contact) => (
            <div key={contact.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">{contact.name}</h3>
                <span className="text-xs text-gray-400">
                  {new Date(contact.timestamp).toLocaleDateString()}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{contact.email}</p>
              
              <p 
                className="text-gray-700 mb-4 line-clamp-3"
                dangerouslySetInnerHTML={{ __html: sanitizeText(contact.message) }}
              />
              
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedContact(contact)
                    setIsModalOpen(true)
                  }}
                  className="flex items-center space-x-1"
                >
                  <Eye className="w-3 h-3" />
                  <span>View</span>
                </Button>
                <a
                  href={`mailto:${contact.email}`}
                  className="inline-flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Mail className="w-3 h-3 mr-1" />
                  Reply
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedContact && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedContact(null)
          }}
          title="Contact Message"
        >
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
              <p><strong>Name:</strong> {selectedContact.name}</p>
              <p><strong>Email:</strong> {selectedContact.email}</p>
              <p><strong>Date:</strong> {new Date(selectedContact.timestamp).toLocaleDateString()}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Message</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p 
                  className="text-gray-700 whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: sanitizeText(selectedContact.message) }}
                />
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button
                onClick={() => {
                  setIsModalOpen(false)
                  setSelectedContact(null)
                }}
              >
                Close
              </Button>
              <a
                href={`mailto:${selectedContact.email}?subject=Re: Your message to XolveTech`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Mail className="w-4 h-4 mr-2" />
                Reply via Email
              </a>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}