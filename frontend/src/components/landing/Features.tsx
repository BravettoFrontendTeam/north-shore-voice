import { motion } from 'framer-motion'
import { 
  Mic, 
  Clock, 
  TrendingUp, 
  Shield, 
  Zap, 
  Brain,
  BarChart3,
  MessageSquare,
  Settings
} from 'lucide-react'

const features = [
  {
    icon: Mic,
    title: 'Custom Voice AI',
    description: 'Clone your voice or create a unique AI voice that represents your brand perfectly.',
    color: 'from-primary-500 to-cyan-500',
  },
  {
    icon: Clock,
    title: '24/7 Availability',
    description: 'Never miss a call again. Your AI assistant handles every call, any time of day.',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: TrendingUp,
    title: 'Instant Scaling',
    description: 'Handle unlimited concurrent calls without hiring additional staff.',
    color: 'from-orange-500 to-amber-500',
  },
  {
    icon: Brain,
    title: 'Context-Aware',
    description: 'AI learns your business inside out, providing accurate and helpful responses.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: BarChart3,
    title: 'Real-time Analytics',
    description: 'Track call performance, customer sentiment, and key metrics in real-time.',
    color: 'from-blue-500 to-indigo-500',
  },
  {
    icon: MessageSquare,
    title: 'Full Transcriptions',
    description: 'Every conversation is transcribed and searchable for quality assurance.',
    color: 'from-rose-500 to-red-500',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'SOC 2 compliant with end-to-end encryption for all communications.',
    color: 'from-slate-500 to-gray-500',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Sub-second response times for natural, flowing conversations.',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    icon: Settings,
    title: 'Easy Integration',
    description: 'Connect with your CRM, calendar, and existing phone systems in minutes.',
    color: 'from-cyan-500 to-blue-500',
  },
]

export default function Features() {
  return (
    <section id="features" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-900" />
      
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
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Everything You Need to
            <span className="block gradient-text">Transform Your Phone System</span>
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Powered by cutting-edge AI technology, North Shore Voice gives you enterprise-grade 
            capabilities at a fraction of the cost.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="card h-full hover:border-primary-500/30 group-hover:shadow-lg group-hover:shadow-primary-500/10 transition-all duration-300">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-white/60 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-white/60 mb-6">
            Ready to supercharge your business communications?
          </p>
          <a href="#pricing" className="btn-primary inline-flex items-center gap-2">
            View Pricing
            <TrendingUp className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}

