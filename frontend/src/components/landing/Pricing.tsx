import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Check, Zap, Star, Building2 } from 'lucide-react'

const plans = [
  {
    name: 'Starter',
    icon: Zap,
    price: 99,
    description: 'Perfect for small businesses getting started with AI voice.',
    callsIncluded: 500,
    features: [
      '500 minutes/month',
      '1 voice model',
      'Basic analytics',
      'Email support',
      'Call transcriptions',
      'Business hours config',
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Professional',
    icon: Star,
    price: 299,
    description: 'For growing businesses that need advanced features.',
    callsIncluded: 2000,
    features: [
      '2,000 minutes/month',
      '3 voice models',
      'Advanced analytics',
      'Priority support',
      'Custom integrations',
      'A/B testing',
      'API access',
      'Team collaboration',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    icon: Building2,
    price: null,
    description: 'Custom solutions for large organizations.',
    callsIncluded: null,
    features: [
      'Unlimited minutes',
      'Unlimited voice models',
      'Custom AI training',
      'Dedicated support',
      'SLA guarantee',
      'White-label options',
      'Advanced security',
      'Custom analytics',
      'On-premise option',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-primary-950/30 to-slate-900" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-primary-500/10 border border-primary-500/30 rounded-full text-primary-400 text-sm font-medium mb-4">
            Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Simple, Transparent
            <span className="block gradient-text">Pricing for Everyone</span>
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Start with a 14-day free trial. No credit card required. 
            Cancel anytime.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className={`relative ${plan.popular ? 'lg:-mt-4 lg:mb-4' : ''}`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <span className="bg-gradient-to-r from-primary-500 to-cyan-500 text-white text-sm font-semibold px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className={`h-full glass-panel p-8 ${plan.popular ? 'border-primary-500/50 shadow-lg shadow-primary-500/20' : 'border-white/10'}`}>
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-lg ${plan.popular ? 'bg-gradient-to-br from-primary-500 to-cyan-500' : 'bg-white/10'} flex items-center justify-center`}>
                    <plan.icon className={`w-5 h-5 ${plan.popular ? 'text-white' : 'text-white/70'}`} />
                  </div>
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                </div>

                {/* Price */}
                <div className="mb-4">
                  {plan.price !== null ? (
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-white">${plan.price}</span>
                      <span className="text-white/50">/month</span>
                    </div>
                  ) : (
                    <span className="text-4xl font-bold text-white">Custom</span>
                  )}
                </div>

                <p className="text-white/60 text-sm mb-6">{plan.description}</p>

                {/* Calls Included */}
                {plan.callsIncluded && (
                  <div className="bg-white/5 rounded-lg px-4 py-3 mb-6">
                    <p className="text-white font-medium">
                      <span className="text-primary-400">{plan.callsIncluded.toLocaleString()}</span> minutes included
                    </p>
                  </div>
                )}

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className={`w-5 h-5 flex-shrink-0 ${plan.popular ? 'text-primary-400' : 'text-success'}`} />
                      <span className="text-white/70 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  to={plan.price !== null ? '/signup' : '#contact'}
                  className={`block w-full text-center py-3 rounded-lg font-semibold transition-all duration-200 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-primary-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-primary-500/30'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ Teaser */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-white/60">
            Have questions? {' '}
            <a href="#contact" className="text-primary-400 hover:text-primary-300 underline underline-offset-4">
              Contact our team
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  )
}

