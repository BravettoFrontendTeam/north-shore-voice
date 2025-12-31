import { useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Phone,
  Zap,
  LayoutDashboard,
  BarChart3,
  Mic,
  Settings,
  Users,
  FileText,
  Bell,
  LogOut,
  Menu,
  X,
  ChevronDown,
  PhoneIncoming,
  PhoneOutgoing,
} from 'lucide-react'

// Dashboard Sub-pages
import DashboardHome from '../components/dashboard/DashboardHome'
import Analytics from '../components/dashboard/Analytics'
import VoiceTraining from '../components/dashboard/VoiceTraining'
import CallLogs from '../components/dashboard/CallLogs'
import SettingsPage from '../components/dashboard/Settings'
import InboundCallDashboard from '../components/dashboard/InboundCallDashboard'
import OutboundCallManager from '../components/dashboard/OutboundCallManager'

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Inbound Calls', href: '/dashboard/inbound', icon: PhoneIncoming },
  { name: 'Outbound Calls', href: '/dashboard/outbound', icon: PhoneOutgoing },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Voice Training', href: '/dashboard/voice-training', icon: Mic },
  { name: 'Call Logs', href: '/dashboard/call-logs', icon: FileText },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-slate-950 border-r border-white/10 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <Link to="/" className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-cyan-400 rounded-xl flex items-center justify-center">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <Zap className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1" />
              </div>
              <div>
                <span className="text-lg font-bold text-white">North Shore</span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 text-white/60 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => {
              const isActive =
                item.href === '/dashboard'
                  ? location.pathname === '/dashboard'
                  : location.pathname.startsWith(item.href)

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Bottom Section */}
          <div className="p-4 border-t border-white/10">
            {/* Usage Stats */}
            <div className="mb-4 p-4 bg-white/5 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/60 text-sm">Minutes Used</span>
                <span className="text-white text-sm font-medium">1,234 / 2,000</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-500 to-cyan-500 rounded-full"
                  style={{ width: '62%' }}
                />
              </div>
            </div>

            {/* Help Link */}
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-white transition-colors"
            >
              <Users className="w-5 h-5" />
              <span className="font-medium">Help & Support</span>
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center justify-between px-4 py-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-white/60 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Page Title */}
            <h1 className="text-xl font-semibold text-white hidden lg:block">
              {navigation.find((item) =>
                item.href === '/dashboard'
                  ? location.pathname === '/dashboard'
                  : location.pathname.startsWith(item.href)
              )?.name || 'Dashboard'}
            </h1>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 text-white/60 hover:text-white">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full" />
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">JD</span>
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-white text-sm font-medium">John Doe</p>
                    <p className="text-white/50 text-xs">Professional Plan</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-white/60" />
                </button>

                {/* Dropdown */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-slate-800 border border-white/10 rounded-xl shadow-xl overflow-hidden"
                    >
                      <Link
                        to="/dashboard/settings"
                        className="flex items-center gap-3 px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </Link>
                      <Link
                        to="/"
                        className="flex items-center gap-3 px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 transition-colors border-t border-white/10"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="inbound" element={<InboundCallDashboard />} />
            <Route path="outbound" element={<OutboundCallManager />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="voice-training" element={<VoiceTraining />} />
            <Route path="call-logs" element={<CallLogs />} />
            <Route path="settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
