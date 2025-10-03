import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Settings, ShoppingCart, LogOut, BookOpen, ChevronDown } from 'lucide-react'
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
      <header className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section - Fixed width for consistency */}
            <div className="flex items-center flex-shrink-0 min-w-0">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow overflow-hidden border border-gray-100">
                  <img 
                    src="/public/favicon.ico" 
                    alt="XolveTech Logo" 
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      // Fallback to gradient background with X if favicon fails to load
                      const container = e.currentTarget.parentElement;
                      const nextSibling = e.currentTarget.nextElementSibling;
                      
                      if (container) {
                        container.className = "w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow";
                      }
                      
                      e.currentTarget.style.display = 'none';
                      
                      if (nextSibling && nextSibling instanceof HTMLElement) {
                        nextSibling.style.display = 'block';
                      }
                    }}
                  />
                  <span className="text-white font-bold text-lg hidden">X</span>
                </div>
                <span className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  XolveTech
                </span>
              </Link>
            </div>

            {/* Desktop Navigation - Centered */}
            <nav className="hidden lg:flex items-center justify-center flex-1 max-w-2xl mx-8">
              <div className="flex items-center space-x-1">
                {navigation.map((item) => (
                  <div key={item.name} className="relative group">
                    {item.dropdown ? (
                      <>
                        <button
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-1 ${
                            isActive(item.href) || item.dropdown.some(sub => isActive(sub.href))
                              ? 'text-blue-600 bg-blue-50 shadow-sm'
                              : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                          }`}
                        >
                          <span>{item.name}</span>
                          <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                        </button>
                        <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                          <div className="py-2">
                            {item.dropdown.map((subItem) => (
                              <Link
                                key={subItem.name}
                                to={subItem.href}
                                className={`block px-4 py-3 text-sm transition-colors ${
                                  isActive(subItem.href)
                                    ? 'text-blue-600 bg-blue-50 border-r-2 border-blue-600'
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
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          isActive(item.href)
                            ? 'text-blue-600 bg-blue-50 shadow-sm'
                            : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                        }`}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </nav>

            {/* Right Section - Actions */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                title="Shopping Cart"
              >
                <ShoppingCart className="w-6 h-6" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium shadow-sm">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </button>

              {/* User Actions */}
              {user ? (
                <div className="flex items-center space-x-2">
                  <div className="hidden sm:block text-sm text-gray-600 max-w-32 truncate">
                    {user.user_metadata?.full_name || user.email}
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    {/* Partner Dashboard */}
                    {isPartner && (
                      <Link
                        to="/partners"
                        className={`p-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          isActive('/partners')
                            ? 'text-green-600 bg-green-50 shadow-sm'
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
                        className={`p-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          isActive('/admin')
                            ? 'text-orange-600 bg-orange-50 shadow-sm'
                            : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                        }`}
                        title="Admin Dashboard"
                      >
                        <Settings className="w-5 h-5" />
                      </Link>
                    )}
                    
                    <button
                      onClick={handleSignOut}
                      className="p-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                      title="Sign Out"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAuthClick('signin')}
                    className="font-medium"
                  >
                    Sign In
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleAuthClick('signup')}
                    className="font-medium shadow-sm"
                  >
                    Sign Up
                  </Button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <div className="lg:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                  className="p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                >
                  {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white">
            <div className="px-4 pt-2 pb-3 space-y-1 max-h-96 overflow-y-auto">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.dropdown ? (
                    <>
                      <div className="px-3 py-3 text-base font-semibold text-gray-900 border-b border-gray-100 bg-gray-50 rounded-t-lg">
                        {item.name}
                      </div>
                      <div className="bg-gray-50 rounded-b-lg mb-2">
                        {item.dropdown.map((subItem, index) => (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            className={`block px-6 py-3 text-base font-medium transition-colors ${
                              index === item.dropdown!.length - 1 ? 'rounded-b-lg' : ''
                            } ${
                              isActive(subItem.href)
                                ? 'text-blue-600 bg-blue-100 border-r-4 border-blue-600'
                                : 'text-gray-700 hover:text-blue-600 hover:bg-blue-100'
                            }`}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      to={item.href}
                      className={`block px-3 py-3 rounded-lg text-base font-medium transition-colors mb-1 ${
                        isActive(item.href)
                          ? 'text-blue-600 bg-blue-50 border-r-4 border-blue-600'
                          : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
              
              {/* Mobile User Actions */}
              {user ? (
                <div className="border-t border-gray-100 pt-4 mt-4">
                  <div className="px-3 py-2 text-sm font-medium text-gray-900 bg-gray-50 rounded-lg mb-3">
                    {user.user_metadata?.full_name || user.email}
                  </div>
                  
                  <div className="space-y-1">
                    {/* Partner Dashboard - Mobile */}
                    {isPartner && (
                      <Link
                        to="/partners"
                        className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium transition-colors ${
                          isActive('/partners')
                            ? 'text-green-600 bg-green-50 border-r-4 border-green-600'
                            : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <BookOpen className="w-5 h-5" />
                        <span>Partner Dashboard</span>
                      </Link>
                    )}
                    
                    {/* Admin Settings - Mobile */}
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium transition-colors ${
                          isActive('/admin')
                            ? 'text-orange-600 bg-orange-50 border-r-4 border-orange-600'
                            : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Settings className="w-5 h-5" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                    
                    <button
                      onClick={() => {
                        handleSignOut()
                        setIsMenuOpen(false)
                      }}
                      className="flex items-center space-x-3 w-full text-left px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-t border-gray-100 pt-4 mt-4 space-y-2">
                  <button
                    onClick={() => {
                      handleAuthClick('signin')
                      setIsMenuOpen(false)
                    }}
                    className="block w-full text-left px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      handleAuthClick('signup')
                      setIsMenuOpen(false)
                    }}
                    className="block w-full text-left px-3 py-3 rounded-lg text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
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