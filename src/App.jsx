import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './components/auth/Login'
import RegisterPlans from './components/auth/RegisterPlans'
import TestUserSetup from './components/TestUserSetup'
import BulkUserImport from './components/BulkUserImport'
import Home from './components/Home'
import Explore from './components/Explore'
import Dashboard from './components/dashboard/Dashboard'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import DomainPage from './components/DomainPage'
import AboutUs from './components/AboutUs'
import { ShimmerAuthLoading } from './components/Shimmer'
import ForgotPassword from './components/auth/ForgotPassword'
import ResetPassword from './components/auth/ResetPassword'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <ShimmerAuthLoading />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

// Main Layout Component
const MainLayout = ({ children }) => {
  const { user } = useAuth()
  
  if (!user) return children
  
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterPlans />} />
          <Route path="/test-setup" element={<TestUserSetup />} />
          <Route path="/bulk-import" element={<BulkUserImport />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Home />
                </MainLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/explore" 
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Explore />
                </MainLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/explore/:domainId" 
            element={
              <ProtectedRoute>
                <MainLayout>
                  <DomainPage />
                </MainLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/about" 
            element={
              <ProtectedRoute>
                <MainLayout>
                  <AboutUs />
                </MainLayout>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
