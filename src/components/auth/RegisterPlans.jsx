import { useNavigate } from 'react-router-dom'
import logoImage from '../../assets/Jignasa space Navbar Logo.png'

const RegisterPlans = () => {
  const navigate = useNavigate()

  const plans = [
    {
      name: 'CSE(DS) - Non JIGNASA Member',
      price: '₹99',
      duration: 'Lifetime',
      features: [
        'Access to all learning domains',
        'Progress tracking',
        'Community support',
        'All premium resources',
        'Same features for all packs'
      ],
      popular: false
    },
    {
      name: 'Other Branches (RGMCET)',
      price: '₹249',
      duration: 'Lifetime',
      features: [
        'Access to all learning domains',
        'Progress tracking',
        'Community support',
        'All premium resources',
        'Same features for all packs'
      ],
      popular: true
    },
    {
      name: 'Other Colleges',
      price: '₹499',
      duration: 'Lifetime',
      features: [
        'Access to all learning domains',
        'Progress tracking',
        'Community support',
        'All premium resources',
        'Same features for all packs'
      ],
      popular: false
    }
  ]

  const handleWhatsAppRedirect = (planName, price) => {
    const message = `Hi! I'm interested in the ${planName} (${price}) for JIGNASA's Space. Can you provide more details about the subscription?`
    const whatsappUrl = `https://wa.me/919490627247?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const handleBackToLogin = () => {
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src={logoImage} alt="Jignasa's Space" className="h-16 w-auto" />
          </div>
          <p className="text-xl text-gray-300 mb-2">
            Choose Your Learning Journey
          </p>
          <p className="text-gray-400">
            Unlock exclusive access to premium learning content
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div key={index} className="card relative flex flex-col h-full min-h-[500px]">
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  
                </div>
              )}
              
              <div className="text-center mb-6 flex-shrink-0">
                <h3 className="text-xl font-semibold text-accent mb-2">
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400 ml-2">/ {plan.duration}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="text-gray-300 text-sm">
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleWhatsAppRedirect(plan.name, plan.price)}
                className="btn-primary w-full mt-auto"
              >
                💬 Buy Now 
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <button
            onClick={handleBackToLogin}
            className="btn-secondary"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  )
}

export default RegisterPlans 