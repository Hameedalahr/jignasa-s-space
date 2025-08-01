import logoImage from '../assets/Jignasa space Navbar Logo.png'
import rgmLogo from '../assets/rgm logo.png'
import dataScienceLogo from '../assets/datascience logo.png'

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center bg-black rounded-2xl p-8 border border-gray-800 mb-12">
          {/* RGMCET Information - Left */}
          <div className="text-center">
            <div className="mb-4">
              <img src={rgmLogo} alt="RGMCET" className="h-16 w-auto mx-auto" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Rajeev Gandhi Memorial College of Engineering and Technology</h3>
            <p className="text-gray-400 text-sm mb-2">Address: Nerawada, X' Roads, Nandyala, Andhra Pradesh 518501</p>
            
          </div>

          {/* Data Science Initiative - Right */}
          <div className="text-center">
            <div className="mb-4">
              <img src={dataScienceLogo} alt="Data Science Initiative" className="h-16 w-auto mx-auto" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">A Data Science Initiative</h3>
            <p className="text-gray-400 text-sm">
              Advancing education through innovative data science solutions and cutting-edge learning technologies.
            </p>
          </div>
        </div>

        {/* Contact & Social Links */}
        <div className="mt-0 pt-8 border-t-4 border-yellow-400">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {/* Contact Information */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
              <div className="space-y-2 text-gray-400 text-sm">
                <p>📧 Email: jignasa.ds@rgmcet.edu.in</p>
                <p>📞 Phone: +91 9490627247</p>
                
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
              <div className="space-y-2 text-gray-400 text-sm">
                <p><a href="/explore" className="hover:text-yellow-400 transition-colors">Explore Domains</a></p>
                <p><a href="/dashboard" className="hover:text-yellow-400 transition-colors">My Dashboard</a></p>
                <p><a href="/about" className="hover:text-yellow-400 transition-colors">About Us</a></p>
                <p><a href="#" className="hover:text-yellow-400 transition-colors">Help Center</a></p>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Follow Us</h4>
              <div className="flex justify-center space-x-4">
                <a href="https://www.linkedin.com/in/jignasa-data-science-312ab2325/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="https://www.instagram.com/jignasa.ds/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.807-.875-1.297-2.026-1.297-3.323s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323z"/>
                  </svg>
                </a>
                
                <a href="https://www.youtube.com/@Jignasa-DataScience" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center pt-8 border-t border-gray-800 mt-8">
          <p className="text-gray-400 text-sm">
            © 2025 All rights reserved. Made with ❤️ for learners worldwide.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 