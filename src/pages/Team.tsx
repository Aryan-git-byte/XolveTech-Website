import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Mail, Phone, Instagram, MapPin } from 'lucide-react'

export const Team: React.FC = () => {
  const teamMembers = [
    {
      name: 'Aryan Kumar',
      title: 'Founder',
      role: 'Innovation, Product Design & Full-Stack Development',
      vision: 'Leading innovation in Arduino STEM education, developing cutting-edge products and full-stack solutions for India\'s next generation of makers',
      photo: 'https://wzqvcfhjjedtgemqadsf.supabase.co/storage/v1/object/public/xolvetech-assets//aryan.jpg',
      description: 'Founder and visionary behind XolveTech, specializing in full-stack development, Arduino programming, Python, Firebase integration, and innovative product design. Leading the Kilkari project and driving technological advancement in Bihar\'s STEM education landscape.',
      altText: 'Aryan Kumar – Founder of XolveTech, leading innovation, product design, and full-stack development',
      seoTags: 'Aryan Kumar, XolveTech Founder, student entrepreneur, full-stack developer, Arduino, Python, Firebase, Patna tech leader, Kilkari innovator'
    },
    {
      name: 'Ayush',
      title: 'Hardware Engineer',
      role: 'Hardware Design, Circuit Assembly & STEM Kit Development',
      vision: 'Engineering the future of hands-on STEM learning through precision hardware design, circuit innovation, and quality Arduino kit assembly for students across India',
      photo: 'https://wzqvcfhjjedtgemqadsf.supabase.co/storage/v1/object/public/xolvetech-assets//ayush.jpg',
      description: 'Hardware and assembly specialist managing circuit design, prototyping, robotics development, and STEM kit construction. Expert in IoT systems, electronics troubleshooting, and ensuring every Arduino kit meets the highest quality standards for student learning.',
      altText: 'Ayush – Hardware and assembly lead at XolveTech, managing circuits, prototyping, and STEM kit build',
      seoTags: 'Ayush, XolveTech hardware engineer, robotics Bihar, student maker, circuit builder, STEM projects India, IoT enthusiast'
    },
    {
      name: 'Shubham',
      title: 'Outreach & Communications Lead',
      role: 'Digital Strategy, Community Building & Social Media',
      vision: 'Connecting young innovators across India through strategic digital communication, building vibrant STEM communities, and amplifying Bihar\'s technological achievements globally',
      photo: 'https://wzqvcfhjjedtgemqadsf.supabase.co/storage/v1/object/public/xolvetech-assets//shubham.jpg',
      description: 'Digital strategist and community builder managing XolveTech\'s social media presence, outreach campaigns, and stakeholder communications. Specializes in youth engagement, brand awareness, and creating compelling narratives around STEM education innovation.',
      altText: 'Shubham – Outreach and social media lead at XolveTech, building awareness and handling digital communication',
      seoTags: 'Shubham, XolveTech social media manager, youth communicator, Bihar tech outreach, student strategist, digital campaigner'
    }
  ]

  return (
    <>
      <Helmet>
        <title>Meet XolveTech Team - Young STEM Innovators from Bihar India | Arduino Education Founders</title>
        <meta name="description" content="Meet Aryan Kumar, Ayush, and Shubham - the passionate student entrepreneurs from Patna, Bihar behind XolveTech's Arduino STEM education revolution. Leading innovation in full-stack development, hardware engineering, and digital outreach." />
        <meta name="keywords" content="Aryan Kumar XolveTech founder, Ayush hardware engineer Bihar, Shubham social media Bihar, young entrepreneurs Bihar, student startup India, STEM education founders, Arduino education team, Bihar innovation, Patna startup, young innovators India, student entrepreneurs, STEM team Bihar, electronics education founders, Arduino kit creators, youth startup India, Bihar student entrepreneurs, STEM innovation team, educational technology founders, young makers India, student-led startup, Bihar tech entrepreneurs, Arduino education pioneers, full-stack developer Bihar, IoT enthusiast India, digital strategist Bihar" />
        
        <meta property="og:title" content="Meet XolveTech Team - Aryan Kumar, Ayush & Shubham | Young STEM Innovators from Bihar" />
        <meta property="og:description" content="Meet the passionate student entrepreneurs from Patna, Bihar behind XolveTech's Arduino STEM education revolution - Aryan Kumar (Founder), Ayush (Hardware Engineer), and Shubham (Outreach Lead)." />
        <meta property="og:image" content="https://xolvetech.com/team-og.png" />
        <meta property="og:url" content="https://xolvetech.com/team" />
        
        <link rel="canonical" href="https://xolvetech.com/team" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "name": "XolveTech Team - Arduino STEM Education Innovators",
            "description": "Meet Aryan Kumar, Ayush, and Shubham - the young STEM innovators and student entrepreneurs behind XolveTech's Arduino education mission in India",
            "url": "https://xolvetech.com/team",
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
              Meet Aryan Kumar, Ayush, and Shubham - young Arduino and electronics innovators from Patna, Bihar 
              who are passionate about making STEM education accessible, exciting, and affordable for students 
              across India through hands-on learning and cutting-edge technology
            </p>
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-16" role="main">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-8 text-center"
                itemScope
                itemType="https://schema.org/Person"
              >
                <div className="mb-6">
                  <img
                    src={member.photo}
                    alt={member.altText}
                    className="w-32 h-32 rounded-full mx-auto object-cover shadow-lg"
                    loading="lazy"
                    itemProp="image"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1" itemProp="name">{member.name}</h3>
                <p className="text-blue-600 font-semibold mb-2" itemProp="jobTitle">{member.title}</p>
                <p className="text-gray-600 text-sm mb-4" itemProp="description">{member.role}</p>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-gray-700 italic text-sm">"{member.vision}"</p>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed" itemProp="description">{member.description}</p>
                
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
              At XolveTech, led by Aryan Kumar's vision and supported by Ayush's hardware expertise and Shubham's 
              community building, we believe that every young mind in India has the potential to innovate and create 
              with Arduino and electronics. Our mission is to provide affordable, high-quality Arduino STEM learning 
              kits that inspire curiosity and build the next generation of technology problem-solvers from Bihar and across India.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Arduino Education Accessibility</h3>
              <p className="text-gray-600">
                Making Arduino and electronics STEM education accessible to Indian students from all backgrounds 
                through affordable pricing, innovative design, and comprehensive learning resources
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sustainable STEM Learning</h3>
              <p className="text-gray-600">
                Committed to eco-friendly practices and sustainable materials in all our Arduino kits, 
                electronics components, and packaging while maintaining the highest quality standards
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Bihar Innovation Leadership</h3>
              <p className="text-gray-600">
                Representing Bihar's youth innovation on the global STEM stage and inspiring the next generation 
                of Arduino innovators, electronics makers, and technology entrepreneurs across India
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
            can come from anywhere in India. Our Arduino kits are designed in Patna by Aryan Kumar, engineered 
            by Ayush, promoted by Shubham, and shipped across India with love and dedication to student learning.
          </p>
          <div className="bg-white/10 rounded-lg p-6 max-w-2xl mx-auto">
            <p className="text-lg font-medium">
              "Arduino and STEM innovation knows no boundaries – it starts with student curiosity, grows with 
              educational opportunity, and flourishes with passionate mentorship."
            </p>
            <p className="text-sm text-green-200 mt-2">- Aryan Kumar, Ayush & Shubham, XolveTech Team</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white" role="complementary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Contact Our STEM Team</h2>
            <p className="text-xl text-gray-600 mb-8">
              Have questions about Arduino kits, want to collaborate on STEM education, or interested in the 
              Kilkari project? Aryan, Ayush, and Shubham would love to hear from you!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a
                href="mailto:xolvetech@gmail.com"
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                aria-label="Email XolveTech STEM education team - Aryan Kumar, Ayush, and Shubham"
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
