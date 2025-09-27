import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { ArrowRight, Lightbulb, Wrench, BookOpen, Users, Award, Recycle } from 'lucide-react'
import { Button } from '../components/ui/Button'
import XolveLogo from '../assets/xolvetech-logo.png'

export const Home: React.FC = () => {
  const categories = [
    {
      icon: <Lightbulb className="w-8 h-8 text-blue-600" />,
      title: 'Electronics',
      description: 'Arduino LED circuits, electronic sensors, digital logic kits, breadboard projects, microcontroller programming',
    },
    {
      icon: <Wrench className="w-8 h-8 text-orange-600" />,
      title: 'Mechanics',
      description: 'DC motors, servo motors, gears, mechanical engineering projects, robotics components, automation kits',
    },
    {
      icon: <BookOpen className="w-8 h-8 text-green-600" />,
      title: 'Programming',
      description: 'Arduino programming, Python coding, microcontroller projects, IoT development, embedded systems',
    },
    {
      icon: <Users className="w-8 h-8 text-purple-600" />,
      title: 'Collaborative',
      description: 'Team STEM projects, collaborative learning, group innovation challenges, educational workshops',
    },
  ]

  return (
    <>
      <Helmet>
        <title>XolveTech - Best STEM Learning Kits India | Arduino Electronics Programming Kits for Students</title>
        <meta name="description" content="Buy affordable STEM learning kits in India. Arduino electronics, programming, robotics kits for students. DIY projects, hands-on learning, Bihar innovation. Free shipping across India." />
        <meta name="keywords" content="STEM kits India, Arduino kits, electronics learning, programming education, robotics kits, DIY electronics, educational toys India, Bihar startup, student projects, microcontroller kits, IoT learning, maker education, coding for kids, engineering kits, science projects, technology education, hands-on learning, project-based learning, STEM toys, educational electronics, innovation lab, Arduino programming, breadboard kits, sensor kits, motor kits, LED projects, circuit building, electronics components, educational robotics, STEM education India, learning kits online, buy Arduino India, electronics projects, programming tutorials, maker kits, engineering education, technology learning, innovation education, student innovation, young entrepreneurs Bihar, affordable STEM kits, eco-friendly education, sustainable learning" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="XolveTech - Best STEM Learning Kits India | Arduino Electronics Programming" />
        <meta property="og:description" content="Affordable STEM learning kits from Bihar's young innovators. Arduino, electronics, programming kits for students. Free shipping across India." />
        <meta property="og:image" content="https://xolvetech.in/og-image.png" />
        <meta property="og:url" content="https://xolvetech.in/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="XolveTech" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="XolveTech - Best STEM Learning Kits India" />
        <meta name="twitter:description" content="Affordable Arduino, electronics, programming kits for students. Bihar innovation, free shipping India." />
        <meta name="twitter:image" content="https://xolvetech.in/og-image.png" />
        
        {/* Additional SEO Tags */}
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="author" content="XolveTech" />
        <meta name="geo.region" content="IN-BR" />
        <meta name="geo.placename" content="Patna, Bihar, India" />
        <link rel="canonical" href="https://xolvetech.in/" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": "https://xolvetech.in/#organization",
                "name": "XolveTech",
                "url": "https://xolvetech.in",
                "logo": "https://xolvetech.in/logo.png",
                "description": "Leading STEM education company providing affordable Arduino, electronics, and programming learning kits for students across India",
                "foundingDate": "2024",
                "foundingLocation": {
                  "@type": "Place",
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Patna",
                    "addressRegion": "Bihar",
                    "addressCountry": "IN"
                  }
                },
                "contactPoint": {
                  "@type": "ContactPoint",
                  "telephone": "+91-9386387397",
                  "contactType": "customer service",
                  "availableLanguage": ["English", "Hindi"]
                },
                "sameAs": [
                  "https://www.instagram.com/xolvetech",
                  "https://www.linkedin.com/company/xolvetech"
                ],
                "offers": {
                  "@type": "AggregateOffer",
                  "priceCurrency": "INR",
                  "lowPrice": "299",
                  "highPrice": "2999",
                  "availability": "https://schema.org/InStock"
                }
              },
              {
                "@type": "WebSite",
                "@id": "https://xolvetech.in/#website",
                "url": "https://xolvetech.in",
                "name": "XolveTech",
                "description": "Arduino STEM Learning Kits and Electronics Education Solutions",
                "publisher": {
                  "@id": "https://xolvetech.in/#organization"
                },
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": "https://xolvetech.in/products?search={search_term_string}",
                  "query-input": "required name=search_term_string"
                }
              },
              {
                "@type": "WebPage",
                "@id": "https://xolvetech.in/#webpage",
                "url": "https://xolvetech.in",
                "name": "XolveTech - Best STEM Learning Kits India",
                "isPartOf": {
                  "@id": "https://xolvetech.in/#website"
                },
                "about": {
                  "@id": "https://xolvetech.in/#organization"
                },
                "description": "Buy affordable STEM learning kits in India. Arduino electronics, programming, robotics kits for students. DIY projects, hands-on learning, Bihar innovation."
              }
            ]
          })}
        </script>
      </Helmet>
      
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-4 px-6 md:px-20" role="banner">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Left – Text & Buttons */}
          <div className="md:w-1/2 space-y-2">
            <div className="inline-block bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-1">
              Youth-Led STEM Innovation from Bihar, India
            </div>
            <p className="text-lg text-orange-200 mb-2 font-medium">
              Arduino STEM Kits · Electronics Components · Custom Robotics Projects
            </p>
            <h1 className="text-4xl font-bold leading-tight" itemProp="headline">
              We Build <span className="text-orange-400">Bold STEM Innovators</span>
            </h1>
            <p className="text-lg text-white/90 mb-2">
              Student-led startup from Patna, Bihar creating hands-on Arduino STEM learning kits, electronics projects, 
              and programming education that make STEM learning fun, accessible, and impactful across India. 
              Offering custom robotics projects and individual electronic components for DIY innovation.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-1">
              <Link to="/products">
                <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white" aria-label="View STEM Learning Kits and Arduino Products">
                  View STEM Kits <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/components">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white" aria-label="Explore Electronics Components and Arduino Parts">
                  Electronics Components
                </Button>
              </Link>
              <Link to="/custom-projects">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-2 ml-1" aria-label="Submit Custom Robotics and Arduino Project Request">
                  Custom Robotics Projects
                </Button>
              </Link>
            </div>
          </div>

          {/* Right – Logo + Feature Cards */}
          <div className="md:w-2/5 bg-white/5 p-6 md:p-8 rounded-2xl shadow-2xl backdrop-blur-sm border border-white/10">
            {/* Logo Block */}
            <div className="bg-white rounded-xl p-6 shadow-md mb-6">
              <img 
                src={XolveLogo} 
                alt="XolveTech STEM Education Logo - Arduino Learning Kits Bihar India" 
                className="w-30 h-auto mx-auto" 
                itemProp="logo"
                width="400"
                height="auto"
                loading="eager"
              />
              <p className="text-center text-black mt-4 font-medium">
                Hands-on Arduino STEM Learning Kits India
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-600 rounded-xl p-4 flex flex-col items-center text-white">
                <Lightbulb className="w-8 h-8 text-orange-400 mb-2" />
                <p className="text-sm font-medium">Arduino Electronics</p>
              </div>
              <div className="bg-green-600 rounded-xl p-4 flex flex-col items-center text-white">
                <Award className="w-8 h-8 text-yellow-400 mb-2" />
                <p className="text-sm font-medium">Learning Rewards</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Banner */}
      <section className="bg-orange-600 text-white py-6" role="complementary">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-2">Fast and Safe STEM Kit Delivery Across India</h2>
          <p className="text-orange-100">MRP includes Arduino kits, electronics components, packaging & shipping – No hidden fees</p>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-16 bg-gray-50" role="main">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Explore Our Arduino STEM Learning Kits</h2>
            <p className="text-lg text-gray-600">
              From Arduino electronics to Python programming, we have hands-on STEM kits for every curious student mind in India
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-lg mb-4 group-hover:bg-blue-50 transition-colors">
                  {category.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.title}</h3>
                <p className="text-gray-600">{category.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/products">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700" aria-label="Buy Arduino STEM Learning Kits Online India">
                Buy Arduino STEM Kits <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* What's in the Box */}
      <section className="py-16 bg-white" role="complementary">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What's in Every Arduino STEM Kit?</h2>
            <p className="text-lg text-gray-600">
              Real Arduino components, detailed programming guidebook, and everything you need to build and learn electronics
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wrench className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Real Arduino Components</h3>
              <p className="text-gray-600">
                Authentic Arduino boards, sensors, LEDs, resistors, breadboards – no toys, just real engineering components for learning
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">12-Page Arduino Programming Guidebook</h3>
              <p className="text-gray-600">
                Step-by-step Arduino programming, circuit assembly, safety rules, troubleshooting, and QR codes for video tutorials
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">STEM Learning Rewards & Digital Badges</h3>
              <p className="text-gray-600">
                Complete Arduino projects to earn digital STEM badges and achievement stickers – showcase your programming skills!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Revenue Flow Model */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-green-700 text-white" role="complementary">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <Recycle className="w-12 h-12 text-green-200 mr-3" />
            <h2 className="text-3xl font-bold">Our STEM Education Impact Model</h2>
          </div>
          <p className="text-xl mb-8 text-green-100 max-w-4xl mx-auto">
            Every Arduino STEM kit you buy fuels our Innovation Division. Profits are reinvested into new Arduino experiments, 
            impactful STEM research, and creating even better programming and electronics learning experiences for students across India.
          </p>
          <div className="bg-white/10 rounded-lg p-6 max-w-2xl mx-auto">
            <p className="text-lg font-medium">
              Arduino Kit Sales → STEM Innovation Research → Better Educational Products → Greater Learning Impact
            </p>
          </div>
        </div>
      </section>

      {/* Featured Recognition */}
      <section className="py-16 bg-white" role="complementary">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            Student STEM Innovation from Bihar, India
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Representing Bihar's STEM Youth Innovation on the Global Stage
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            XolveTech is proud to showcase how young Arduino and electronics innovators from Patna, Bihar are making a global impact 
            in STEM education and programming learning. Join our community of student builders, makers, and technology change-makers.
          </p>
          <Link to="/team">
            <Button size="lg" variant="outline" aria-label="Meet Our Young STEM Innovation Team from Bihar">
              Meet Our STEM Innovation Team
            </Button>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center" role="region" aria-label="Call to action">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Building Arduino Projects?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of young STEM innovators who are learning Arduino programming, building electronics projects, and creating with XolveTech across India
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products">
              <Button
                size="lg"
                className="!bg-orange-600 !text-white !border-none hover:!bg-orange-700 shadow-md"
                aria-label="Shop Arduino STEM Learning Kits Online India"
              >
                Shop Arduino STEM Kits
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                size="lg"
                variant="outline"
                className="!bg-white !text-blue-600 !border-white hover:!bg-blue-50"
                aria-label="Contact XolveTech STEM Education Team"
              >
                Contact STEM Team
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
    </>
  )
}
