import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { Home } from './pages/Home'
import { Products } from './pages/Products'
import { Components } from './pages/Components'
import { CustomProjects } from './pages/CustomProjects'
import { HowItWorks } from './pages/HowItWorks'
import { Learning } from './pages/Learning'
import { Team } from './pages/Team'
import { Contact } from './pages/Contact'
import { TermsOfService } from './pages/TermsOfService'
import { PrivacyPolicy } from './pages/PrivacyPolicy'
import { CancellationRefundPolicy } from './pages/CancellationRefundPolicy'
import { ShippingDeliveryPolicy } from './pages/ShippingDeliveryPolicy'
import { OrderSuccess } from './pages/OrderSuccess'
import { PaymentSuccess } from './pages/PaymentSuccess'
import { PasswordReset } from './pages/PasswordReset'
import { AdminLogin } from './pages/admin/AdminLogin'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { Partners } from './pages/Partners'
import { PartnerLogin } from './pages/PartnerLogin'
import { ProtectedRoute } from './components/auth/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/components" element={<Components />} />
                <Route path="/custom-projects" element={<CustomProjects />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/learning" element={<Learning />} />
                <Route path="/team" element={<Team />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/cancellation-refund" element={<CancellationRefundPolicy />} />
                <Route path="/shipping-delivery" element={<ShippingDeliveryPolicy />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="/reset-password" element={<PasswordReset />} />
              
                <Route path="/partners/login" element={<PartnerLogin />} />
                <Route path="/partners" element={<Partners />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}

export default App