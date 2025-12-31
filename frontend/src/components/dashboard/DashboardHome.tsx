import { motion } from 'framer-motion'
import {
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  Clock,
  ThumbsUp,
  Activity,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'

const stats = [
  {
    name: 'Total Calls Today',
    value: '247',
    change: '+12%',
    trend: 'up',
    icon: Phone,
    color: 'from-primary-500 to-cyan-500',
  },
  {
    name: 'Avg. Call Duration',
    value: '3:24',
    change: '+8%',
    trend: 'up',
    icon: Clock,
    color: 'from-emerald-500 to-teal-500',
  },
  {
    name: 'Success Rate',
    value: '96.8%',
    change: '+2.4%',
    trend: 'up',
    icon: ThumbsUp,
    color: 'from-purple-500 to-pink-500',
  },
  {
    name: 'Active Sessions',
    value: '12',
    change: '-3',
    trend: 'down',
    icon: Activity,
    color: 'from-orange-500 to-amber-500',
  },
]

const callData = [
  { time: '00:00', calls: 12 },
  { time: '04:00', calls: 8 },
  { time: '08:00', calls: 45 },
  { time: '12:00', calls: 78 },
  { time: '16:00', calls: 65 },
  { time: '20:00', calls: 34 },
  { time: '23:59', calls: 18 },
]

const weeklyData = [
  { day: 'Mon', calls: 145 },
  { day: 'Tue', calls: 178 },
  { day: 'Wed', calls: 234 },
  { day: 'Thu', calls: 189 },
  { day: 'Fri', calls: 267 },
  { day: 'Sat', calls: 98 },
  { day: 'Sun', calls: 76 },
]

const recentCalls = [
  {
    id: 1,
    caller: '+1 (555) 123-4567',
    type: 'incoming',
    duration: '4:32',
    status: 'completed',
    time: '2 min ago',
    sentiment: 'positive',
  },
  {
    id: 2,
    caller: '+1 (555) 987-6543',
    type: 'incoming',
    duration: '2:15',
    status: 'completed',
    time: '8 min ago',
    sentiment: 'neutral',
  },
  {
    id: 3,
    caller: '+1 (555) 456-7890',
    type: 'outgoing',
    duration: '6:48',
    status: 'completed',
    time: '15 min ago',
    sentiment: 'positive',
  },
  {
    id: 4,
    caller: '+1 (555) 321-0987',
    type: 'incoming',
    duration: '1:23',
    status: 'missed',
    time: '22 min ago',
    sentiment: 'neutral',
  },
  {
    id: 5,
    caller: '+1 (555) 654-3210',
    type: 'incoming',
    duration: '5:17',
    status: 'completed',
    time: '35 min ago',
    sentiment: 'positive',
  },
]

export default function DashboardHome() {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">Welcome back, John! 👋</h1>
          <p className="text-white/60">Here's what's happening with your AI phone system today.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-success/10 border border-success/30 rounded-xl">
          <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
          <span className="text-success text-sm font-medium">System Active</span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className={`flex items-center gap-1 text-sm ${stat.trend === 'up' ? 'text-success' : 'text-error'}`}>
                {stat.trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                {stat.change}
              </div>
            </div>
            <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-white/60 text-sm">{stat.name}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Call Volume Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Today's Call Volume</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={callData}>
                <defs>
                  <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="time" stroke="rgba(255,255,255,0.4)" fontSize={12} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="calls"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorCalls)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Weekly Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Weekly Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="day" stroke="rgba(255,255,255,0.4)" fontSize={12} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Bar
                  dataKey="calls"
                  fill="url(#barGradient)"
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent Calls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Recent Calls</h3>
          <a href="/dashboard/call-logs" className="text-primary-400 hover:text-primary-300 text-sm font-medium">
            View All →
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Caller</th>
                <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Type</th>
                <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Duration</th>
                <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Status</th>
                <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Time</th>
                <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Sentiment</th>
              </tr>
            </thead>
            <tbody>
              {recentCalls.map((call) => (
                <tr key={call.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4">
                    <span className="text-white font-medium">{call.caller}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {call.type === 'incoming' ? (
                        <PhoneIncoming className="w-4 h-4 text-success" />
                      ) : (
                        <PhoneOutgoing className="w-4 h-4 text-primary-400" />
                      )}
                      <span className="text-white/70 capitalize">{call.type}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-white/70">{call.duration}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        call.status === 'completed'
                          ? 'bg-success/10 text-success'
                          : 'bg-error/10 text-error'
                      }`}
                    >
                      {call.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-white/50 text-sm">{call.time}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        call.sentiment === 'positive'
                          ? 'bg-success/10 text-success'
                          : 'bg-white/10 text-white/70'
                      }`}
                    >
                      {call.sentiment}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
