import React from 'react'
import { Link } from 'react-router-dom'
import { Search, Package, Wrench, Award, BookOpen, Recycle } from 'lucide-react'
import { Button } from '../components/ui/Button'

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <Search className="w-12 h-12 text-blue-600" />,
      title: 'Choose Your Kit',
      description: 'Browse our collection of hands-on STEM kits and find the perfect one for your interests and skill level.'
    },
    {
      icon: <Package className="w-12 h-12 text-orange-600" />,
      title: 'Receive Your Parts',
      description: 'Get real electronic components, tools, and a detailed 12-page guidebook delivered to your door.'
    },
    {
      icon: <Wrench className="w-12 h-12 text-green-600" />,
      title: 'Build Using Guidebook',
      description: 'Follow step-by-step instructions, cut your own cardboard chassis, and assemble your project safely.'
    },
    {
      icon: <Award className="w-12 h-12 text-purple-600" />,
      title: 'Claim Your Badge',
      description: 'Complete your project and scan the QR code to earn digital badges and recognition for your achievement!'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">How XolveTech Works</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              From choosing your kit to claiming your badge – here's your journey to becoming a STEM innovator
            </p>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center relative">
                <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4 mx-auto">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -left-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <div className="w-8 h-0.5 bg-gray-300"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's in the Box */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What's in Every Box?</h2>
            <p className="text-lg text-gray-600">
              Real components and comprehensive learning materials designed for hands-on discovery
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Real Electronic Components</h3>
                  <p className="text-gray-600">Authentic hardware parts – LEDs, sensors, motors, and more. No pre-cut chassis; you'll cut cardboard yourself to boost learning!</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">12-Page Printed Guidebook</h3>
                  <p className="text-gray-600">Complete with welcome, component checklist, safety rules, step-by-step assembly, troubleshooting, and QR codes for extra resources.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Rewards & Recognition</h3>
                  <p className="text-gray-600">Digital badges, stickers, and achievement certificates. Scan QR codes to claim your rewards and showcase your skills!</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Guidebook Structure</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">1. Welcome</span>
                  <span className="text-blue-600">Page 1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">2. About This Kit</span>
                  <span className="text-blue-600">Page 2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">3. Component Checklist</span>
                  <span className="text-blue-600">Page 3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">4. Tools Needed</span>
                  <span className="text-blue-600">Page 4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">5. Safety Rules</span>
                  <span className="text-blue-600">Page 5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">6-8. Step-by-Step Assembly</span>
                  <span className="text-blue-600">Pages 6-8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">9. How It Works</span>
                  <span className="text-blue-600">Page 9</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">10. Troubleshooting</span>
                  <span className="text-blue-600">Page 10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">11. Rewards & Recognition</span>
                  <span className="text-blue-600">Page 11</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">12. Learn More + Contact</span>
                  <span className="text-blue-600">Page 12</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Revenue Flow Model */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <Recycle className="w-12 h-12 text-green-200 mr-3" />
              <h2 className="text-3xl font-bold">Our Circular Impact Model</h2>
            </div>
            <p className="text-xl mb-8 text-green-100 max-w-4xl mx-auto">
              Every kit purchase directly funds XolveTech's Innovation Division. We reinvest profits into 
              new experiments, impactful research, and developing even better learning experiences.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold mb-2">1</div>
                <p className="text-sm">You Buy Kits</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold mb-2">2</div>
                <p className="text-sm">Profits Fund Research</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold mb-2">3</div>
                <p className="text-sm">Better Products Created</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold mb-2">4</div>
                <p className="text-sm">Greater Impact Achieved</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-orange-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your STEM Journey?</h2>
          <p className="text-xl mb-8 text-orange-100">
            Join thousands of students who are already building, learning, and innovating with XolveTech
          </p>
          <Link
            to="/products"
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-orange-600 bg-white hover:bg-gray-50 transition-colors"
          >
            Explore Our Kits
          </Link>
        </div>
      </section>
    </div>
  )
}