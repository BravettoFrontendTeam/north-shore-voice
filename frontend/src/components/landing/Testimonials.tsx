import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Sarah Mitchell',
    role: 'CEO',
    company: 'TechStart Solutions',
    image: 'SM',
    content: 'North Shore Voice transformed our customer service. We went from missing 40% of calls to handling 100% with consistent quality. Our customers love it.',
    rating: 5,
  },
  {
    name: 'David Chen',
    role: 'Operations Director',
    company: 'Pacific Medical Group',
    image: 'DC',
    content: 'The AI handles appointment scheduling flawlessly. It understands complex requests and our patient satisfaction scores have never been higher.',
    rating: 5,
  },
  {
    name: 'Jennifer Brooks',
    role: 'Founder',
    company: 'Brooks Law Firm',
    image: 'JB',
    content: 'As a small law firm, we needed to project professionalism 24/7. North Shore Voice gave us enterprise-level phone handling at a fraction of the cost.',
    rating: 5,
  },
  {
    name: 'Michael Torres',
    role: 'CTO',
    company: 'CloudScale Inc',
    image: 'MT',
    content: 'The API integration was seamless. We connected it to our CRM in under an hour. The real-time analytics help us optimize our sales process daily.',
    rating: 5,
  },
  {
    name: 'Emily Watson',
    role: 'Customer Success Manager',
    company: 'RetailMax',
    image: 'EW',
    content: 'Our holiday season calls increased by 300%, but North Shore Voice handled everything without a hitch. The voice cloning feature is incredibly realistic.',
    rating: 5,
  },
  {
    name: 'Robert Kim',
    role: 'Managing Partner',
    company: 'Kim & Associates',
    image: 'RK',
    content: 'The transcription accuracy is remarkable. We use the call summaries for training and quality assurance. It\'s become an essential part of our operations.',
    rating: 5,
  },
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-900" />
      
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
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Trusted by Industry
            <span className="block gradient-text">Leaders Worldwide</span>
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            See why hundreds of businesses have made North Shore Voice their 
            go-to AI phone solution.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="card h-full relative">
                {/* Quote Icon */}
                <Quote className="w-8 h-8 text-primary-500/30 absolute top-6 right-6" />

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-white/80 leading-relaxed mb-6">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">{testimonial.image}</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{testimonial.name}</p>
                    <p className="text-white/50 text-sm">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { value: '500+', label: 'Active Businesses' },
            { value: '2M+', label: 'Calls Handled' },
            { value: '99.9%', label: 'Uptime' },
            { value: '4.9/5', label: 'Customer Rating' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-4xl font-bold gradient-text mb-2">{stat.value}</p>
              <p className="text-white/60 text-sm">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

