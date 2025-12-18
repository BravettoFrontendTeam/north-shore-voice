import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Phone, Sparkles, ArrowRight, Play, CheckCircle } from 'lucide-react'

export default function Hero() {
  const highlights = [
    'Custom AI Voice Clone',
    '24/7 Availability',
    'Instant Scaling',
    'Real-time Analytics',
  ]

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-primary-900/20 to-slate-900" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/30 rounded-full filter blur-[128px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full filter blur-[128px] animate-pulse delay-1000" />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/30 rounded-full mb-8"
            >
              <Sparkles className="w-4 h-4 text-primary-400" />
              <span className="text-primary-300 text-sm font-medium">Powered by AbëVoice AI</span>
            </motion.div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Your Business
              <span className="block gradient-text">Never Sleeps</span>
            </h1>

            <p className="text-lg sm:text-xl text-white/60 mb-8 max-w-xl mx-auto lg:mx-0">
              Transform your phone system with AI that sounds just like you. 
              Handle unlimited calls, 24/7, with perfect consistency.
            </p>

            {/* Highlights */}
            <div className="grid grid-cols-2 gap-3 mb-10 max-w-md mx-auto lg:mx-0">
              {highlights.map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span className="text-white/80 text-sm">{item}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/signup" className="btn-primary inline-flex items-center justify-center gap-2 group">
                Start Free Trial
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/demo" className="btn-secondary inline-flex items-center justify-center gap-2">
                <Play className="w-4 h-4" />
                Try Live Demo
              </Link>
            </div>

            {/* Trust Badge */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 text-white/40 text-sm"
            >
              Trusted by <span className="text-white/60 font-medium">500+</span> businesses worldwide
            </motion.p>
          </motion.div>

          {/* Right Content - Phone Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-cyan-500 rounded-3xl blur-3xl opacity-20 animate-pulse" />
              
              {/* Main Card */}
              <div className="relative glass-panel p-8 rounded-3xl border border-white/20">
                {/* AI Call Interface Preview */}
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-cyan-400 rounded-xl flex items-center justify-center">
                        <Phone className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Active Call</p>
                        <p className="text-white/50 text-sm">Duration: 2:34</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
                      <span className="text-success text-sm font-medium">Live</span>
                    </div>
                  </div>

                  {/* Waveform Animation */}
                  <div className="flex items-center justify-center gap-1 h-24 bg-slate-800/50 rounded-xl p-4">
                    {[...Array(20)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1.5 bg-gradient-to-t from-primary-500 to-cyan-400 rounded-full"
                        animate={{
                          height: [20, Math.random() * 60 + 20, 20],
                        }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          delay: i * 0.05,
                        }}
                      />
                    ))}
                  </div>

                  {/* Transcript Preview */}
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-primary-400 text-xs font-medium">AI</span>
                      </div>
                      <div className="bg-slate-800/50 rounded-2xl rounded-tl-sm px-4 py-2">
                        <p className="text-white/80 text-sm">
                          Good morning! Thank you for calling North Shore Voice. How can I help you today?
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3 justify-end">
                      <div className="bg-primary-500/20 rounded-2xl rounded-tr-sm px-4 py-2">
                        <p className="text-white/80 text-sm">
                          I'd like to schedule an appointment for next week.
                        </p>
                      </div>
                      <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white/60 text-xs font-medium">C</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">98%</p>
                      <p className="text-white/50 text-xs">Accuracy</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-success">+</p>
                      <p className="text-white/50 text-xs">Positive</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">0.3s</p>
                      <p className="text-white/50 text-xs">Response</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-4 -right-4 bg-gradient-to-br from-success to-emerald-600 rounded-xl px-4 py-2 shadow-lg"
              >
                <p className="text-white text-sm font-medium">24/7 Active</p>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute -bottom-4 -left-4 bg-slate-800 border border-white/20 rounded-xl px-4 py-2 shadow-lg"
              >
                <p className="text-white/80 text-sm">1,234 calls handled today</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2"
        >
          <div className="w-1.5 h-3 bg-white/40 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  )
}

