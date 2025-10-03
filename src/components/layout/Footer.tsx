import React from 'react'
import { Link } from 'react-router-dom'
import { Mail, Phone, Instagram, MapPin } from 'lucide-react'

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">X</span>
              </div>
              <span className="text-xl font-bold">XolveTech</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Delivering affordable, eco-friendly STEM kits to build the next generation of innovators. 
              Representing Bihar's youth innovation on the global stage.
            </p>
            <div className="text-sm text-gray-400">
              <p className="font-semibold text-blue-400 mb-2">Innovate Boldly. Build Together</p>
              <p>Featured by Youth | Community-driven innovation</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/products" className="text-gray-400 hover:text-white transition-colors">Products</Link></li>
              <li><Link to="/components" className="text-gray-400 hover:text-white transition-colors">Components Store</Link></li>
              <li><Link to="/custom-projects" className="text-gray-400 hover:text-white transition-colors">Custom Project Request</Link></li>
              <li><Link to="/how-it-works" className="text-gray-400 hover:text-white transition-colors">How It Works</Link></li>
              <li><Link to="/learning" className="text-gray-400 hover:text-white transition-colors">Learning</Link></li>
              <li><Link to="/team" className="text-gray-400 hover:text-white transition-colors">Team</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
              <li>
                <button 
                  onClick={() => {
                    const event = new CustomEvent('openComponentRequest');
                    window.dispatchEvent(event);
                  }}
                  aria-label="Request a specific component not in our catalog"
                  className="text-gray-400 hover:text-white transition-colors text-left"
                >
                  Request a Component
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-blue-400" />
                <a href="mailto:xolvetech@gmail.com" className="text-gray-400 hover:text-white transition-colors">
                  xolvetech@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-green-400" />
                <a href="tel:+919386387397" className="text-gray-400 hover:text-white transition-colors">
                  +91 9386387397
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Instagram className="w-4 h-4 text-pink-400" />
                <a href="https://instagram.com/xolvetech" className="text-gray-400 hover:text-white transition-colors">
                  @xolvetech
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-red-400" />
                <span className="text-gray-400">Patna, Bihar</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-center md:text-left">
              &copy; 2025 XolveTech. All rights reserved. Built with passion in Bihar, India. Arduino STEM Education for All.
            </p>
            <ul className="list-none flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-2" role="navigation" aria-label="Footer policy links">
              <li><Link to="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">

                Terms of Service
              </Link></li>
              <li><Link to="/cancellation-refund" className="text-gray-400 hover:text-white transition-colors text-sm">
                Cancellation & Refund
              </Link></li>
              <li><Link to="/shipping-delivery" className="text-gray-400 hover:text-white transition-colors text-sm">
                Shipping & Delivery
              </Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
                Privacy Policy
              </Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}