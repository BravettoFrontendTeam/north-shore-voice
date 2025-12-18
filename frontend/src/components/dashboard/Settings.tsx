import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  User,
  Building,
  CreditCard,
  Bell,
  Shield,
  Key,
  Clock,
  Globe,
  Save,
  ExternalLink,
} from 'lucide-react'

const tabs = [
  { id: 'profile', name: 'Profile', icon: User },
  { id: 'business', name: 'Business', icon: Building },
  { id: 'billing', name: 'Billing', icon: CreditCard },
  { id: 'notifications', name: 'Notifications', icon: Bell },
  { id: 'security', name: 'Security', icon: Shield },
  { id: 'api', name: 'API Keys', icon: Key },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                <span className="text-3xl font-bold text-white">JD</span>
              </div>
              <div>
                <button className="btn-primary text-sm">
                  Upload Photo
                </button>
                <p className="text-white/50 text-sm mt-2">JPG, PNG or GIF. Max 2MB.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  First Name
                </label>
                <input type="text" className="input-field" defaultValue="John" />
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Last Name
                </label>
                <input type="text" className="input-field" defaultValue="Doe" />
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Email Address
                </label>
                <input type="email" className="input-field" defaultValue="john@company.com" />
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Phone Number
                </label>
                <input type="tel" className="input-field" defaultValue="+1 (555) 123-4567" />
              </div>
            </div>
          </div>
        )

      case 'business':
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Company Name
                </label>
                <input type="text" className="input-field" defaultValue="North Shore Voice" />
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Industry
                </label>
                <select className="input-field">
                  <option>Technology</option>
                  <option>Healthcare</option>
                  <option>Finance</option>
                  <option>Retail</option>
                </select>
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Website
                </label>
                <input type="url" className="input-field" defaultValue="https://northshorevoice.ai" />
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Business Phone
                </label>
                <input type="tel" className="input-field" defaultValue="+1 (800) 123-4567" />
              </div>
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Business Address
              </label>
              <textarea rows={3} className="input-field resize-none" defaultValue="123 Business Ave, Suite 100
San Francisco, CA 94102" />
            </div>

            <div className="p-4 bg-white/5 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-5 h-5 text-primary-400" />
                <h4 className="text-white font-medium">Business Hours</h4>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                  <div key={day} className="flex items-center justify-between">
                    <span className="text-white/70 text-sm">{day}</span>
                    <span className="text-white/50 text-sm">9:00 AM - 5:00 PM</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'billing':
        return (
          <div className="space-y-6">
            {/* Current Plan */}
            <div className="p-6 bg-gradient-to-r from-primary-500/20 to-cyan-500/20 rounded-xl border border-primary-500/30">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-white">Professional Plan</h4>
                  <p className="text-white/60">2,000 minutes/month</p>
                </div>
                <span className="text-3xl font-bold text-white">$299<span className="text-lg text-white/60">/mo</span></span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/60">Minutes Used</span>
                <span className="text-white font-medium">1,234 / 2,000</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-4">
                <div className="h-full w-[62%] bg-gradient-to-r from-primary-500 to-cyan-500 rounded-full" />
              </div>
              <button className="text-primary-400 hover:text-primary-300 text-sm font-medium">
                Upgrade Plan →
              </button>
            </div>

            {/* Payment Method */}
            <div>
              <h4 className="text-white font-medium mb-4">Payment Method</h4>
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                <div className="w-12 h-8 bg-white/10 rounded flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-white/60" />
                </div>
                <div className="flex-1">
                  <p className="text-white">•••• •••• •••• 4242</p>
                  <p className="text-white/50 text-sm">Expires 12/2025</p>
                </div>
                <button className="text-primary-400 hover:text-primary-300 text-sm font-medium">
                  Update
                </button>
              </div>
            </div>

            {/* Billing History */}
            <div>
              <h4 className="text-white font-medium mb-4">Billing History</h4>
              <div className="space-y-2">
                {[
                  { date: 'Jan 1, 2024', amount: '$299.00', status: 'Paid' },
                  { date: 'Dec 1, 2023', amount: '$299.00', status: 'Paid' },
                  { date: 'Nov 1, 2023', amount: '$299.00', status: 'Paid' },
                ].map((invoice) => (
                  <div key={invoice.date} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <span className="text-white/70">{invoice.date}</span>
                    <span className="text-white font-medium">{invoice.amount}</span>
                    <span className="text-success text-sm">{invoice.status}</span>
                    <button className="text-primary-400 hover:text-primary-300 text-sm">
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'notifications':
        return (
          <div className="space-y-6">
            {[
              { title: 'Email Notifications', description: 'Receive email notifications for important events', enabled: true },
              { title: 'Call Summaries', description: 'Get daily summaries of call activity', enabled: true },
              { title: 'Weekly Reports', description: 'Receive weekly analytics reports', enabled: true },
              { title: 'SMS Alerts', description: 'Get SMS alerts for urgent notifications', enabled: false },
              { title: 'Marketing Updates', description: 'Receive product updates and news', enabled: false },
            ].map((setting) => (
              <div key={setting.title} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div>
                  <h4 className="text-white font-medium">{setting.title}</h4>
                  <p className="text-white/50 text-sm">{setting.description}</p>
                </div>
                <button
                  className={`w-12 h-6 rounded-full transition-colors ${
                    setting.enabled ? 'bg-primary-500' : 'bg-white/20'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transform transition-transform ${
                      setting.enabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        )

      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h4 className="text-white font-medium mb-4">Change Password</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Current Password
                  </label>
                  <input type="password" className="input-field" />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    New Password
                  </label>
                  <input type="password" className="input-field" />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Confirm New Password
                  </label>
                  <input type="password" className="input-field" />
                </div>
              </div>
            </div>

            <div className="p-4 bg-white/5 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">Two-Factor Authentication</h4>
                  <p className="text-white/50 text-sm">Add an extra layer of security</p>
                </div>
                <button className="btn-primary text-sm">
                  Enable 2FA
                </button>
              </div>
            </div>

            <div className="p-4 bg-white/5 rounded-xl">
              <h4 className="text-white font-medium mb-4">Active Sessions</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-primary-400" />
                    <div>
                      <p className="text-white text-sm">Chrome on Windows</p>
                      <p className="text-white/50 text-xs">San Francisco, CA • Current</p>
                    </div>
                  </div>
                  <span className="text-success text-xs">Active</span>
                </div>
              </div>
            </div>
          </div>
        )

      case 'api':
        return (
          <div className="space-y-6">
            <div className="p-4 bg-warning/10 border border-warning/30 rounded-xl">
              <p className="text-warning text-sm">
                Keep your API keys secure. Never share them publicly or commit them to version control.
              </p>
            </div>

            <div>
              <h4 className="text-white font-medium mb-4">Your API Keys</h4>
              <div className="space-y-3">
                <div className="p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">Production Key</span>
                    <span className="text-success text-xs">Active</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <code className="flex-1 bg-slate-800 px-4 py-2 rounded-lg text-white/70 font-mono text-sm">
                      nsv_prod_••••••••••••••••••••••••
                    </code>
                    <button className="text-primary-400 hover:text-primary-300 text-sm font-medium">
                      Reveal
                    </button>
                    <button className="text-primary-400 hover:text-primary-300 text-sm font-medium">
                      Copy
                    </button>
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">Test Key</span>
                    <span className="text-white/50 text-xs">Development</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <code className="flex-1 bg-slate-800 px-4 py-2 rounded-lg text-white/70 font-mono text-sm">
                      nsv_test_••••••••••••••••••••••••
                    </code>
                    <button className="text-primary-400 hover:text-primary-300 text-sm font-medium">
                      Reveal
                    </button>
                    <button className="text-primary-400 hover:text-primary-300 text-sm font-medium">
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div>
                <h4 className="text-white font-medium">API Documentation</h4>
                <p className="text-white/50 text-sm">Learn how to integrate with our API</p>
              </div>
              <a href="#" className="text-primary-400 hover:text-primary-300 text-sm font-medium flex items-center gap-2">
                View Docs <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-white/60">Manage your account and preferences</p>
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <div className="card p-2">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                    activeTab === tab.id
                      ? 'bg-primary-500/20 text-primary-400'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3"
        >
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">
                {tabs.find((t) => t.id === activeTab)?.name}
              </h2>
              <button className="btn-primary flex items-center gap-2 text-sm">
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
            {renderTabContent()}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

