import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import logoImage from '../assets/Jignasa space Navbar Logo.png'

const Navbar = () => {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    setIsMobileMenuOpen(false)
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <nav className="bg-black border-b border-gray-800 shadow-lg relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group no-underline" onClick={closeMobileMenu}>
              <img src={logoImage} alt="Jignasa's Space" className="h-8 w-auto transition-transform duration-300 group-hover:scale-110" />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-bold no-underline transition-all duration-300 hover:text-accent no-underline ${
                isActive('/') ? 'text-accent' : 'text-gray-300'
              }`}
            >
               Home
            </Link>
            <Link
              to="/explore"
              className={`text-sm font-bold transition-all duration-300 hover:text-accent no-underline ${
                isActive('/explore') ? 'text-accent' : 'text-gray-300'
              }`}
            >
               Explore
            </Link>
            <Link
              to="/dashboard"
              className={`text-sm font-bold transition-all duration-300 hover:text-accent no-underline ${
                isActive('/dashboard') ? 'text-accent' : 'text-gray-300'
              }`}
            >
               Dashboard
            </Link>
            <Link
              to="/about"
              className={`text-sm font-bold transition-all duration-300 hover:text-accent no-underline ${
                isActive('/about') ? 'text-accent' : 'text-gray-300'
              }`}
            >
               About Us
            </Link>
          </div>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleSignOut}
                  className="bg-black text-yellow-400 border-2 border-yellow-400 rounded-full px-4 py-2 font-bold transition-all duration-200 hover:bg-yellow-400 hover:text-black focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <span className='font-bold'>Sign Out</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="bg-black border-2 border-yellow-400 text-yellow-400 hover:text-yellow-300 hover:border-yellow-300 focus:outline-none focus:text-yellow-300 transition-all duration-300 p-2 rounded-lg"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay - Dropdown Below Hamburger */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 right-4 w-56 bg-black border-2 border-yellow-400 rounded-xl shadow-2xl z-50 transition-all duration-300">
          <div className="px-6 py-6 space-y-4">
            {/* Mobile Navigation Links */}
            <div className="space-y-4">
              <Link
                to="/"
                className={`block text-lg font-bold transition-all duration-300 hover:text-yellow-400 no-underline py-2 px-3 rounded-lg hover:bg-yellow-400/10 ${
                  isActive('/') ? 'text-yellow-400 bg-yellow-400/20' : 'text-gray-300'
                }`}
                onClick={closeMobileMenu}
              >
                Home
              </Link>
              <Link
                to="/explore"
                className={`block text-lg font-bold transition-all duration-300 hover:text-yellow-400 no-underline py-2 px-3 rounded-lg hover:bg-yellow-400/10 ${
                  isActive('/explore') ? 'text-yellow-400 bg-yellow-400/20' : 'text-gray-300'
                }`}
                onClick={closeMobileMenu}
              >
                Explore
              </Link>
              <Link
                to="/dashboard"
                className={`block text-lg font-bold transition-all duration-300 hover:text-yellow-400 no-underline py-2 px-3 rounded-lg hover:bg-yellow-400/10 ${
                  isActive('/dashboard') ? 'text-yellow-400 bg-yellow-400/20' : 'text-gray-300'
                }`}
                onClick={closeMobileMenu}
              >
                Dashboard
              </Link>
              <Link
                to="/about"
                className={`block text-lg font-bold transition-all duration-300 hover:text-yellow-400 no-underline py-2 px-3 rounded-lg hover:bg-yellow-400/10 ${
                  isActive('/about') ? 'text-yellow-400 bg-yellow-400/20' : 'text-gray-300'
                }`}
                onClick={closeMobileMenu}
              >
                About Us
              </Link>
            </div>

            {/* Mobile User Menu */}
            {user && (
              <div className="pt-4 border-t border-yellow-400/30">
                <button
                  onClick={handleSignOut}
                  className="w-full bg-black text-yellow-400 border-2 border-yellow-400 rounded-full px-4 py-3 font-bold transition-all duration-200 hover:bg-yellow-400 hover:text-black focus:outline-none focus:ring-2 focus:ring-yellow-400 flex items-center justify-center space-x-2"
                >
                  <span className='font-bold'>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar 