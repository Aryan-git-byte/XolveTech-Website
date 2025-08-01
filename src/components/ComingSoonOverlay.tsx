import React, { useState, useEffect } from 'react'
import { Clock, Eye, MessageSquare, ShoppingCart } from 'lucide-react'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

// Button component
const Button: React.FC<{
  onClick: () => void
  className: string
  size?: string
  children: React.ReactNode
}> = ({ onClick, className, children }) => (
  <button onClick={onClick} className={className}>
    {children}
  </button>
)

export const ComingSoonOverlay: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [isLaunched, setIsLaunched] = useState(false)

  useEffect(() => {
    // Target date: August 3, 2025, 00:00 local time
    const targetDate = new Date('2025-08-03T00:00:00').getTime()

    const updateCountdown = () => {
      const now = new Date().getTime()
      const difference = targetDate - now

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft({ days, hours, minutes, seconds })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        // Launch the website - hide the coming soon overlay
        setIsLaunched(true)
      }
    }

    // Update immediately
    updateCountdown()

    // Update every second
    const interval = setInterval(updateCountdown, 1000)

    // Don't render the overlay if launched
  if (isLaunched) {
    return null
  }

  return () => clearInterval(interval)
  }, [])

  const handlePreviewWebsite = () => {
    // Simulate hiding the overlay and showing the main website
    const overlay = document.querySelector('.fixed.inset-0')
    if (overlay) {
      overlay.style.display = 'none'
    }
  }

  const handleContactUs = () => {
    // Scroll to footer
    const footer = document.getElementById('contact-footer')
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 z-50 overflow-y-auto">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center py-8">
        <div className="text-center text-white px-4 sm:px-6 max-w-4xl mx-auto">
        {/* Logo Section */}
        <div className="mb-6 sm:mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-2xl">
            <span className="text-white font-bold text-2xl sm:text-3xl">X</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            XolveTech
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-blue-200 font-medium px-2">
            STEM Learning Kits for Young Innovators
          </p>
        </div>

        {/* Main Heading */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
            Launching on August 3
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-blue-200 max-w-2xl mx-auto px-2">
            Get ready for an amazing collection of Arduino STEM learning kits, 
            electronics components, and hands-on educational experiences from Bihar's young innovators.
          </p>
        </div>

        {/* Countdown Timer */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center justify-center mb-4 sm:mb-6">
            <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-orange-400 mr-2 sm:mr-3" />
            <h3 className="text-xl sm:text-2xl font-semibold">Countdown to Launch</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto px-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-400">
                {timeLeft.days.toString().padStart(2, '0')}
              </div>
              <div className="text-xs sm:text-sm text-blue-200 uppercase tracking-wide">Days</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-400">
                {timeLeft.hours.toString().padStart(2, '0')}
              </div>
              <div className="text-xs sm:text-sm text-blue-200 uppercase tracking-wide">Hours</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-400">
                {timeLeft.minutes.toString().padStart(2, '0')}
              </div>
              <div className="text-xs sm:text-sm text-blue-200 uppercase tracking-wide">Minutes</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-400">
                {timeLeft.seconds.toString().padStart(2, '0')}
              </div>
              <div className="text-xs sm:text-sm text-blue-200 uppercase tracking-wide">Seconds</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:gap-4 justify-center items-center max-w-sm sm:max-w-none mx-auto">
          <Button
            onClick={handlePreviewWebsite}
            className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 rounded-lg min-h-[48px]"
          >
            <Eye className="w-4 h-4 sm:w-5 sm:h-5 mr-2 inline" />
            Preview Website
          </Button>
          
          <Button
            onClick={handleContactUs}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 rounded-lg min-h-[48px]"
          >
            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 mr-2 inline" />
            Contact Us
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 sm:mt-12 text-center">
          <p className="text-blue-200 text-xs sm:text-sm px-4">
            🚀 Currently in final testing phase • 🔧 Arduino kits ready • 📦 Components stocked • 🎓 Learning resources prepared
          </p>
        </div>

        {/* Footer Contact Section */}
        <div id="contact-footer" className="mt-16 sm:mt-20 pt-8 border-t border-white/20">
          <div className="text-center">
            <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-white">Get in Touch</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-orange-400 mr-3" />
                <span className="text-blue-200">WhatsApp: +91 93863 87397</span>
              </div>
              <Button
                onClick={() => window.open('https://wa.me/919386387397', '_blank')}
                aria-label="Chat with XolveTech team on WhatsApp"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <MessageSquare className="w-4 h-4 mr-2 inline" />
                Chat on WhatsApp
              </Button>
            </div>
            <div className="mt-6 text-blue-200 text-sm">
              <p>XolveTech - Empowering Young Minds with STEM Education</p>
              <p className="mt-2">© 2025 XolveTech. Made with ❤️ in Bihar, India</p>
            </div>
          </div>
        </div>
              </div>
      </div>
    </div>
  )
}

export default ComingSoonOverlay