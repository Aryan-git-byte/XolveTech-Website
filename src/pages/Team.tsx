import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Mail, Phone, Instagram, MapPin } from 'lucide-react'
import aryanPhoto from '../assets/aryan.webp'
import rishavPhoto from '../assets/rishav.webp'
import shubhamPhoto from '../assets/shubham.webp'
import ayushPhoto from '../assets/ayush.webp'

export const Team: React.FC = () => {
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())

  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => new Set(prev).add(index))
  }
  const teamMembers = [
    {
      name: 'Aryan Kumar',
      title: 'Founder & CTO',
      role: 'Product Strategy | Full-Stack Development | Innovation Leadership',
      vision: 'Leading innovation in Arduino STEM education, developing cutting-edge products and full-stack solutions for India\'s next generation of makers',
      photo: aryanPhoto,
      description: 'Aryan is the founder and driving force behind XolveTech. He leads product design, technology development, and strategic growth initiatives. Specializing in full-stack development, Arduino, Python, and Firebase, Aryan is responsible for all kit design, platform integration, and long-term innovation planning. While he doesn\'t handle daily operations, Aryan sets the vision and ensures quality across every product.',
      altText: 'Aryan Kumar – Founder & CTO of XolveTech, leading innovation, product design, and full-stack development',
      seoTags: 'Aryan Kumar, XolveTech Founder, Full-stack Developer, Arduino, Firebase, STEM Innovator, Product Architect'
    },
    {
      name: 'Rishav',
      title: 'Co-founder & Operations Head',
      role: 'Team Management | Task Execution | Internal Coordination',
      vision: 'Turning ideas into action by ensuring timely execution, resource alignment, and operational excellence across all of XolveTech\'s initiatives',
      photo: rishavPhoto,
      description: 'Rishav oversees the day-to-day operations of XolveTech. He ensures the team stays on track by managing task boards, conducting daily check-ins, and following up on progress. He bridges communication across the team and ensures smooth coordination from packaging to delivery. Rishav is the go-to person for execution clarity and internal structure.',
      altText: 'Rishav – Co-founder & Operations Head at XolveTech, managing team coordination and task execution',
      seoTags: 'Rishav, Co-founder, Operations Manager, Task Coordinator, Execution Lead, STEM Team Bihar'
    },
    {
      name: 'Shubham',
      title: 'Media & Content Manager',
      role: 'Reels | Editing | Storytelling & Outreach',
      vision: 'Connecting young innovators across India through compelling content and visual storytelling around STEM education',
      photo: shubhamPhoto,
      description: 'Shubham leads all things media at XolveTech—from scripting and shooting to editing and publishing. He runs the content pipeline, manages daily social output, and handles basic media interactions. With a focus on consistency and creativity, Shubham builds the public voice of XolveTech across platforms.',
      altText: 'Shubham – Media & Content Manager at XolveTech, creating content and managing social media outreach',
      seoTags: 'Shubham, Content Creator, Video Editor, STEM Reels, Instagram Manager, Bihar Tech Media'
    },
    {
      name: 'Ayush',
      title: 'Packaging, Inventory & Delivery Manager',
      role: 'Kit Assembly | Stock Management | Dispatch Logistics',
      vision: 'Engineering the future of hands-on STEM learning through precise hardware handling and reliable kit delivery across India',
      photo: ayushPhoto,
      description: 'Ayush manages everything physical—from kit packaging and inventory tracking to final dispatch. He ensures each STEM kit is complete, properly assembled, and ready for delivery. He monitors component stock and storage, sharing regular updates to avoid shortages. Ayush plays a crucial role in maintaining operational readiness on the ground.',
      altText: 'Ayush – Packaging, Inventory & Delivery Manager at XolveTech, handling kit assembly and logistics',
      seoTags: 'Ayush, Packaging Manager, Inventory Lead, STEM Kit Builder, Logistics Handler, Arduino Kit Assembly'
    }
  ]

  return (
    <>
      <Helmet>
        <title>Meet XolveTech Team - Young STEM Innovators from Bihar India | Arduino Education Founders</title>
        <meta name="description" content="Meet Aryan Kumar, Rishav, Shubham, and Ayush - the passionate student entrepreneurs from Patna, Bihar behind XolveTech's Arduino STEM education revolution. Leading innovation in full-stack development, operations, content creation, and logistics." />
        <meta name="keywords" content="Aryan Kumar XolveTech founder, Rishav operations Bihar, Shubham content creator Bihar, Ayush logistics Bihar, young entrepreneurs Bihar, student startup India, STEM education founders, Arduino education team, Bihar innovation, Patna startup, young innovators India, student entrepreneurs, STEM team Bihar, electronics education founders, Arduino kit creators, youth startup India, Bihar student entrepreneurs, STEM innovation team, educational technology founders, young makers India, student-led startup, Bihar tech entrepreneurs, Arduino education pioneers, full-stack developer Bihar, content creator India, operations manager Bihar" />
        
        <meta property="og:title" content="Meet XolveTech Team - Aryan Kumar, Rishav, Shubham & Ayush | Young STEM Innovators from Bihar" />
        <meta property="og:description" content="Meet the passionate student entrepreneurs from Patna, Bihar behind XolveTech's Arduino STEM education revolution - Aryan Kumar (Founder), Rishav (Operations), Shubham (Content), and Ayush (Logistics)." />
        <meta property="og:image" content="https://xolvetech.in/team-og.png" />
        <meta property="og:url" content="https://xolvetech.in/team" />
        
        <link rel="canonical" href="https://xolvetech.in/team" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "name": "XolveTech Team - Arduino STEM Education Innovators",
            "description": "Meet Aryan Kumar, Rishav, Shubham, and Ayush - the young STEM innovators and student entrepreneurs behind XolveTech's Arduino education mission in India",
            "url": "https://xolvetech.in/team",
            "mainEntity": {
              "@type": "Organization",
              "name": "XolveTech",
              "foundingLocation": "Patna, Bihar, India",
              "founder": teamMembers.map(member => ({
                "@type": "Person",
                "name": member.name,
                "jobTitle": member.title,
                "description": member.description,
                "keywords": member.seoTags
              }))
            }
          })}
        </script>
      </Helmet>
      
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16" role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
              Student-Led STEM Innovation from Bihar
            </div>
            <h1 className="text-4xl font-bold mb-4">Meet Our Young STEM Innovation Team</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Meet Aryan Kumar, Rishav, Shubham, and Ayush - young Arduino and electronics innovators from Patna, Bihar 
              who are passionate about making STEM education accessible, exciting, and affordable for students 
              across India through hands-on learning and cutting-edge technology
            </p>
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-16" role="main">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 text-center"
                itemScope
                itemType="https://schema.org/Person"
              >
                <div className="mb-6">
                  <div className="relative w-24 h-24 mx-auto">
                    <img
                      src={member.photo}
                      alt={member.altText}
                      className={`w-24 h-24 rounded-full object-cover shadow-lg transition-all duration-500 ${
                        loadedImages.has(index) 
                          ? 'blur-none opacity-100' 
                          : 'blur-md opacity-70'
                      }`}
                      loading="lazy"
                      decoding="async"
                      itemProp="image"
                      onLoad={() => handleImageLoad(index)}
                    />
                    {!loadedImages.has(index) && (
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-gray-200 rounded-full animate-pulse"></div>
                    )}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1" itemProp="name">{member.name}</h3>
                <p className="text-blue-600 font-semibold mb-2 text-sm" itemProp="jobTitle">{member.title}</p>
                <p className="text-gray-600 text-xs mb-4" itemProp="description">{member.role}</p>
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-gray-700 italic text-xs">"{member.vision}"</p>
                </div>
                <p className="text-gray-600 text-xs leading-relaxed" itemProp="description">{member.description}</p>
                
                {/* Hidden SEO tags for search engines */}
                <div className="sr-only" itemProp="keywords">{member.seoTags}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white" role="complementary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Arduino STEM Education Mission</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              At XolveTech, led by Aryan Kumar's vision, supported by Rishav's operational excellence, amplified through 
              Shubham's compelling storytelling, and delivered with Ayush's precision logistics, we believe that every young mind in India has the potential to innovate and create 
              with Arduino and electronics. Our mission is to provide affordable, high-quality Arduino STEM learning 
              kits that inspire curiosity and build the next generation of technology problem-solvers from Bihar and across India.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Strategic Innovation</h3>
              <p className="text-gray-600 text-sm">
                Aryan leads product strategy and technology development, ensuring cutting-edge Arduino solutions for Indian students
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚙️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Operational Excellence</h3>
              <p className="text-gray-600 text-sm">
                Rishav ensures smooth daily operations, team coordination, and timely execution of all STEM education initiatives
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Creative Storytelling</h3>
              <p className="text-gray-600 text-sm">
                Shubham creates compelling content and manages social media to connect with young innovators across India
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📦</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Reliable Delivery</h3>
              <p className="text-gray-600 text-sm">
                Ayush manages kit assembly, inventory, and logistics to ensure every STEM kit reaches students perfectly
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* From Bihar to the World */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-green-700 text-white" role="complementary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">From Patna, Bihar to All of India</h2>
          <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
            We're proud to represent Bihar's innovative spirit and show that world-class Arduino STEM education 
            can come from anywhere in India. Our Arduino kits are designed by Aryan Kumar, coordinated through Rishav's 
            operations, promoted through Shubham's creative content, and delivered with Ayush's precision logistics - 
            all shipped across India with love and dedication to student learning.
          </p>
          <div className="bg-white/10 rounded-lg p-6 max-w-2xl mx-auto">
            <p className="text-lg font-medium">
              "Arduino and STEM innovation knows no boundaries – it starts with student curiosity, grows with 
              educational opportunity, and flourishes with passionate mentorship and seamless execution."
            </p>
            <p className="text-sm text-green-200 mt-2">- Aryan Kumar, Rishav, Shubham & Ayush, XolveTech Team</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white" role="complementary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Contact Our STEM Team</h2>
            <p className="text-xl text-gray-600 mb-8">
              Have questions about Arduino kits, want to collaborate on STEM education, or interested in custom projects? 
              Aryan, Rishav, Shubham, and Ayush would love to hear from you!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a
                href="mailto:xolvetech@gmail.com"
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                aria-label="Email XolveTech STEM education team - Aryan Kumar, Rishav, Shubham, and Ayush"
              >
                <Mail className="w-5 h-5" />
                <span>xolvetech@gmail.com</span>
              </a>
              
              <a
                href="https://wa.me/919386387397"
                className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                aria-label="WhatsApp XolveTech for Arduino kit support and Kilkari project inquiries"
              >
                <Phone className="w-5 h-5" />
                <span>+91 9386387397</span>
              </a>
              
              <a
                href="https://instagram.com/xolvetech"
                className="flex items-center space-x-2 bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors"
                aria-label="Follow XolveTech on Instagram for STEM updates and team insights"
              >
                <Instagram className="w-5 h-5" />
                <span>@xolvetech</span>
              </a>
            </div>

            <div className="mt-8 flex items-center justify-center space-x-2 text-gray-600">
              <MapPin className="w-5 h-5" />
              <span itemProp="address">Patna, Bihar, India</span>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  )
}