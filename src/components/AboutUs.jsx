import { useState } from 'react'
import hameedImg from '../assets/team/Hameed.jpg'
import harshithImg from '../assets/team/Harshith.jpg'
import kedhaImg from '../assets/team/Kedha.jpg'
import jyoshnaImg from '../assets/team/Jyoshna.png'
import shashankImg from '../assets/team/Shashank.jpeg'
import thanuImg from '../assets/team/Thanu Sree.jpeg'
import vamsiImg from '../assets/team/Vamsi.jpeg'
import activity1Img from '../assets/Our Journey/Activity 1.jpg'
import activity2Img from '../assets/Our Journey/Activity 2.jpg'
import activity3Img from '../assets/Our Journey/Activity 3.jpg'
import activity4Img from '../assets/Our Journey/Activity 4.jpg'
import activity5Img from '../assets/Our Journey/Activity 5.jpg'
import activity6Img from '../assets/Our Journey/Activity 6.jpg'
import activity7Img from '../assets/Our Journey/Activity 7.jpeg'
import baskharaRaoImg from '../assets/special thanks/Baskhara Rao.JPG'
import kiranRaoImg from '../assets/special thanks/Kiran Rao.JPG'


const AboutUs = () => {
  // Image slider images (dummy images - you can replace these)
  const sliderImages = [
    { 
      id: 1, 
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop',
      title: 'Learning Together',
      description: 'Collaborative learning environments that foster growth and innovation.'
    },
    { 
      id: 2, 
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop',
      title: 'Innovation Hub',
      description: 'Cutting-edge technology and creative solutions for modern education.'
    },
    { 
      id: 3, 
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop',
      title: 'Global Community',
      description: 'Connecting learners worldwide through shared knowledge and experiences.'
    },
    { 
      id: 4, 
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=400&fit=crop',
      title: 'Future Ready',
      description: 'Preparing students for the challenges and opportunities of tomorrow.'
    }
  ]

  // Journey gallery images (10 images with similar aspect ratios to team profiles)
  const journeyImages = [
    { id: 1, image: activity1Img, title: ' ' },
    { id: 2, image: activity2Img, title: ' ' },
    { id: 3, image: activity3Img, title: ' ' },
    { id: 4, image: activity4Img, title: ' ' },
    { id: 5, image: activity5Img, title: ' ' },
    { id: 6, image: activity6Img, title: ' ' },
    { id: 7, image: activity7Img, title: ' ' },

  ]

  // Team members
  const teamMembers = [
    {
      id: 0,
      name: 'Abdul Hameed Syed',
      role: 'Lead Developer',
      photo: hameedImg,
      description: ' Builds and leads the website’s development, ensuring it’s fast, secure, and user-friendly.',
      expertise: 'Full Stack Development, React, Node.js'
    },
    {
      id: 1,
      name: 'Harshith Reddy Ireddy',
      role: 'UI/UX Designer',
      photo: harshithImg,
      description: 'Crafts intuitive and engaging interfaces to ensure a smooth and delightful user experience.',
      expertise: 'UI/UX Design, Figma,'
    },
    {
      id: 2,
      name: 'Kedareswari M',
      role: 'Web Researcher',
      photo: kedhaImg,
      description: 'Gathers valuable content and insights from the web to support development and decision-making.',
      expertise: ' Technology & Educational Content, Digital Trends'
    },
    {
      id: 3,
      name: 'Jyoshna Penugonda',
      role: 'Domain Expert',
      photo: jyoshnaImg,
      description: 'Provides deep knowledge and guidance in the core subject area to ensure the project aligns with real-world needs.',
      expertise: 'Product Management, Agile Methodologies'
    },
    {
      id: 4,
      name: 'Shashank Chowdary V',
      role: 'Senior Club Lead',
      photo: shashankImg,
      description: 'Works at Cognizant',
      expertise: 'Service Now Certified'
    },
    {
      id: 5,
      name: 'Thanu Sree J',
      role: 'Senior Club Lead',
      photo: thanuImg,
      description: 'Works at Aziro',
      expertise: 'Artificial Intelligence, Data Science'
    },
    {
      id: 6,
      name: 'Vamsi Charan J',
      role: 'Senior Club Lead',
      photo: vamsiImg,
      description: 'Owns Clothing Brand - Elevate Threads',
      expertise: 'Data Analytics, Data Visualization, Machine Learning'
    },
    {
      id: 7,
      name: 'David Wilson',
      role: 'Backend Developer',
      photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face',
      description: 'Building robust server-side solutions and APIs for seamless user experiences.',
      expertise: 'Node.js, Express, Database Design'
    }
  ]

  // Special Thanks members
  const thanksMembers = [
    {
      id: 1,
      name: 'Dr. B.Bhaskara Rao',
      role: 'Head of Department ( CSE DATA SCIENCE )',
      photo: baskharaRaoImg,
      description: 'Providing invaluable guidance and support to our learning community.',
      contribution: 'Mentorship & Guidance'
    },
    {
      id: 2,
      name: 'Dr. P Kiran Rao',
      role: 'Data Science Clubs Mentor',
      photo: kiranRaoImg,
      description: 'Building and nurturing our global community of learners and educators.',
      contribution: 'Technical Support & Assistance'
    }
  ]

  // Image slider state
  const [currentImageSlide, setCurrentImageSlide] = useState(0)

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-400/10 via-black to-yellow-400/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <img 
            src="/assets/Jignasa space Navbar Logo.png" 
            alt="Jignasa's Space Logo" 
            className="mx-auto mb-6 max-w-md"
          />
        </div>
      </div>

      {/* 1. Image Slider - Rounded Squares */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-yellow-300 text-center mb-12">Our Journey</h2>
          
          {/* Journey Gallery - Horizontal Scrolling (Replacing the big image slider) */}
          <div className="mb-8">
            <div className="overflow-x-auto">
              <div className="flex space-x-6 pb-4" style={{ minWidth: 'max-content' }}>
                {journeyImages.map((item) => (
                  <div key={item.id} className="flex-shrink-0">
                    <div className="bg-gray-900 rounded-2xl p-4 border-2 border-yellow-900 hover:border-yellow-400 transition-all duration-300 shadow-lg hover:shadow-yellow-400/30">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className={`w-64 rounded-xl object-cover object-center mb-3 border-2 border-yellow-400 ${[1,2,3].includes(item.id) ? 'h-[288px]' : 'h-48'}`}
                      />
                      <h4 className="text-sm font-semibold text-yellow-300 text-center">{item.title}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* About Jignasa Text */}
          <div className="bg-gray-900 rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-yellow-300 mb-6">About JIGNASA - The Learning Club</h3>
            <div className="text-gray-300 space-y-4 text-lg leading-relaxed">
              <p>
              At Jignasa, we believe that learning should never be limited by boundaries. Rooted in the Data Science department of RGMCET, Nandyal, our mission is to spark curiosity and empower students to explore all possible domains, not just one.
              </p>
              <p>
              Through Jignasa’s Space, we aim to simplify complex topics — offering a “spoon-fed” approach to learning that makes every concept feel accessible.
              </p>
              <p>
              Because we know that every learner starts somewhere, and sometimes… all it takes is a nudge, a guide, and a little belief.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Meet our team - Responsive Grid */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-yellow-300 text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {teamMembers.slice(0, 4).map((member) => (
              <div key={member.id} className="bg-gray-900 rounded-2xl p-6 flex flex-col items-center shadow-lg hover:shadow-yellow-400/30 transition-shadow duration-300 border-2 border-yellow-900 hover:border-yellow-400">
                <img src={member.photo} alt={member.name} className="w-32 h-32 rounded-full mb-4 border-4 border-yellow-400 object-cover shadow-md bg-gray-800" style={{ objectPosition: 'center', width: '128px', height: '128px', aspectRatio: '1/1' }} />
                <h3 className="text-xl font-bold text-yellow-300 mb-1 text-center">{member.name}</h3>
                <div className="text-yellow-400 text-sm mb-2 text-center">{member.role}</div>
                <p className="text-gray-300 text-sm mb-2 text-center">{member.description}</p>
                <div className="text-xs text-gray-400 text-center">{member.expertise}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8">
            {teamMembers.slice(4, 7).map((member) => (
              <div key={member.id} className="bg-gray-900 rounded-2xl p-6 flex flex-col items-center shadow-lg hover:shadow-yellow-400/30 transition-shadow duration-300 border-2 border-yellow-900 hover:border-yellow-400">
                <img src={member.photo} alt={member.name} className="w-32 h-32 rounded-full mb-4 border-4 border-yellow-400 object-cover shadow-md bg-gray-800" style={{ objectPosition: 'center', width: '128px', height: '128px', aspectRatio: '1/1' }} />
                <h3 className="text-xl font-bold text-yellow-300 mb-1 text-center">{member.name}</h3>
                <div className="text-yellow-400 text-sm mb-2 text-center">{member.role}</div>
                <p className="text-gray-300 text-sm mb-2 text-center">{member.description}</p>
                <div className="text-xs text-gray-400 text-center">{member.expertise}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Special Thanks - Row Layout */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-yellow-300 text-center mb-12">Special Thanks</h2>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
            {thanksMembers.map((member) => (
              <div key={member.id} className="bg-black rounded-2xl p-6 flex flex-col items-center shadow-lg hover:shadow-yellow-400/30 transition-shadow duration-300 border-2 border-yellow-900 hover:border-yellow-400">
                <img 
                  src={member.photo} 
                  alt={member.name} 
                  className="w-32 h-32 rounded-full mb-4 border-4 border-yellow-400 object-cover shadow-md bg-gray-800" 
                  style={{ objectPosition: 'center', width: '128px', height: '128px', aspectRatio: '1/1' }}
                />
                <h3 className="text-xl font-bold text-yellow-300 mb-1 text-center">{member.name}</h3>
                <div className="text-yellow-400 text-sm mb-2 text-center">{member.role}</div>
                <p className="text-gray-300 text-sm mb-2 text-center">{member.description}</p>
                <div className="text-xs text-gray-400 text-center">{member.contribution}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Co-clubs & Communities */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-yellow-400 mb-8">Our Co-clubs & Communities</h2>
          
          {/* Clubs Gallery - Horizontal Sliding */}
          <div className="overflow-x-auto mb-8">
            <div className="flex space-x-8 pb-4" style={{ minWidth: 'max-content' }}>
              <div className="flex-shrink-0">
                <div className="bg-black rounded-2xl p-6 border-2 border-yellow-900 hover:border-yellow-400 transition-all duration-300 shadow-lg hover:shadow-yellow-400/30">
                  <img 
                    src="/assets/clubs/club1.png" 
                    alt="Club 1"
                    className="w-48 h-32 rounded-xl object-cover mb-3 border-2 border-yellow-400"
                  />
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="bg-black rounded-2xl p-6 border-2 border-yellow-900 hover:border-yellow-400 transition-all duration-300 shadow-lg hover:shadow-yellow-400/30">
                  <img 
                    src="/assets/clubs/club2.png" 
                    alt="Club 2"
                    className="w-48 h-32 rounded-xl object-cover mb-3 border-2 border-yellow-400"
                  />
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="bg-black rounded-2xl p-6 border-2 border-yellow-900 hover:border-yellow-400 transition-all duration-300 shadow-lg hover:shadow-yellow-400/30">
                  <img 
                    src="/assets/clubs/club3.png" 
                    alt="Club 3"
                    className="w-48 h-32 rounded-xl object-cover mb-3 border-2 border-yellow-400"
                  />
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="bg-black rounded-2xl p-6 border-2 border-yellow-900 hover:border-yellow-400 transition-all duration-300 shadow-lg hover:shadow-yellow-400/30">
                  <img 
                    src="/assets/clubs/club4.png" 
                    alt="Club 4"
                    className="w-48 h-32 rounded-xl object-cover mb-3 border-2 border-yellow-400"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-lg text-gray-200 mb-6">
            We collaborate with various clubs and communities to create a vibrant learning ecosystem.
          </p>
        </div>
      </section>
    </div>
  )
}

export default AboutUs 