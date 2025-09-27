import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Settings, ShoppingCart, LogOut, BookOpen } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'
import { AuthModal } from '../auth/AuthModal'
import { CartDrawer } from '../cart/CartDrawer'
import { Button } from '../ui/Button'

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
  const location = useLocation()
  const { user, isAdmin, isPartner, signOut } = useAuth()
  const { itemCount } = useCart()

  // Listen for custom auth modal events
  useEffect(() => {
    const handleOpenAuthModal = (event: CustomEvent) => {
      setAuthMode(event.detail?.mode || 'signin')
      setIsAuthModalOpen(true)
    }

    window.addEventListener('openAuthModal', handleOpenAuthModal as EventListener)
    return () => {
      window.removeEventListener('openAuthModal', handleOpenAuthModal as EventListener)
    }
  }, [])
  
  const navigation = [
    { name: 'Home', href: '/' },
    { 
      name: 'Products', 
      href: '/products',
      dropdown: [
        { name: 'STEM Kits', href: '/products' },
        { name: 'Components', href: '/components' },
        { name: 'Custom Projects', href: '/custom-projects' }
      ]
    },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Learning', href: '/learning' },
    { name: 'Team', href: '/team' },
    { name: 'Contact', href: '/contact' },
  ]

  const isActive = (path: string) => location.pathname === path

  const handleAuthClick = (mode: 'signin' | 'signup') => {
    setAuthMode(mode)
    setIsAuthModalOpen(true)
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">X</span>
                </div>
                <span className="text-xl font-bold text-gray-900">XolveTech</span>
              </Link>
            </div>

            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <div key={item.name} className="relative group">
                  {item.dropdown ? (
                    <>
                      <button
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1 ${
                          isActive(item.href) || item.dropdown.some(sub => isActive(sub.href))
                            ? 'text-blue-600 bg-blue-50'
                            : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                        }`}
                      >
                        <span>{item.name}</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div className="py-1">
                          {item.dropdown.map((subItem) => (
                            <Link
                              key={subItem.name}
                              to={subItem.href}
                              className={`block px-4 py-2 text-sm transition-colors ${
                                isActive(subItem.href)
                                  ? 'text-blue-600 bg-blue-50'
                                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                              }`}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link
                      to={item.href}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive(item.href)
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Auth Buttons */}
              {user ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700 hidden sm:block">
                    {user.user_metadata?.full_name || user.email}
                  </span>
                  
                  {/* Partner Notebook */}
                  {isPartner && (
                    <Link
                      to="/partners"
                      className={`p-2 rounded-md text-sm font-medium transition-colors ${
                        isActive('/partner')
                          ? 'text-green-600 bg-green-50'
                          : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                      }`}
                      title="Partner Dashboard"
                    >
                      <BookOpen className="w-5 h-5" />
                    </Link>
                  )}
                  
                  {/* Admin Settings */}
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className={`p-2 rounded-md text-sm font-medium transition-colors ${
                        isActive('/admin')
                          ? 'text-orange-600 bg-orange-50'
                          : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                      }`}
                      title="Admin Settings"
                    >
                      <Settings className="w-5 h-5" />
                    </Link>
                  )}
                  
                  <button
                    onClick={handleSignOut}
                    className="p-2 text-gray-700 hover:text-red-600 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAuthClick('signin')}
                  >
                    Sign In
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleAuthClick('signup')}
                  >
                    Sign Up
                  </Button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                  className="text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.dropdown ? (
                    <>
                      <div className="px-3 py-2 text-base font-medium text-gray-900 border-b border-gray-200">
                        {item.name}
                      </div>
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.href}
                          className={`block px-6 py-2 rounded-md text-base font-medium transition-colors ${
                            isActive(subItem.href)
                              ? 'text-blue-600 bg-blue-50'
                              : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                          }`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </>
                  ) : (
                    <Link
                      to={item.href}
                      className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                        isActive(item.href)
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
              
              {user ? (
                <div className="border-t pt-2 mt-2">
                  <div className="px-3 py-2 text-sm text-gray-600">
                    {user.user_metadata?.full_name || user.email}
                  </div>
                  
                  {/* Partner Notebook - Mobile */}
                  {isPartner && (
                    <Link
                      to="/partner"
                      className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                        isActive('/partner')
                          ? 'text-green-600 bg-green-50'
                          : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-2">
                        <BookOpen className="w-4 h-4" />
                        <span>Partner Dashboard</span>
                      </div>
                    </Link>
                  )}
                  
                  {/* Admin Settings - Mobile */}
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                        isActive('/admin')
                          ? 'text-orange-600 bg-orange-50'
                          : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-2">
                        <Settings className="w-4 h-4" />
                        <span>Admin</span>
                      </div>
                    </Link>
                  )}
                  
                  <button
                    onClick={() => {
                      handleSignOut()
                      setIsMenuOpen(false)
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </div>
                  </button>
                </div>
              ) : (
                <div className="border-t pt-2 mt-2 space-y-1">
                  <button
                    onClick={() => {
                      handleAuthClick('signin')
                      setIsMenuOpen(false)
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      handleAuthClick('signup')
                      setIsMenuOpen(false)
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  )
}
