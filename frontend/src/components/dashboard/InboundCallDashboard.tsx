import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Phone,
  PhoneIncoming,
  PhoneMissed,
  Voicemail,
  Users,
  Clock,
  TrendingUp,
  Settings,
  Play,
  Pause,
  PhoneForwarded,
  Volume2,
  UserCheck,
  AlertCircle,
  CheckCircle,
  XCircle,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
} from 'lucide-react'

interface QueuedCall {
  id: string
  callerNumber: string
  callerName?: string
  position: number
  waitTime: number
  priority: number
}

interface ActiveCall {
  id: string
  callerNumber: string
  callerName?: string
  duration: number
  status: string
  routedTo: string
}

interface RoutingRule {
  id: string
  name: string
  conditionType: string
  actionType: string
  priority: number
  isActive: boolean
}

interface InboundStats {
  totalCalls: number
  answeredCalls: number
  missedCalls: number
  voicemailCalls: number
  avgDuration: number
  avgWaitTime: number
  currentQueueLength: number
  activeAgents: number
}

export default function InboundCallDashboard() {
  const [activeTab, setActiveTab] = useState<'live' | 'queue' | 'routing' | 'analytics'>('live')
  const [queuedCalls, setQueuedCalls] = useState<QueuedCall[]>([])
  const [activeCalls, setActiveCalls] = useState<ActiveCall[]>([])
  const [routingRules, setRoutingRules] = useState<RoutingRule[]>([])
  const [stats, setStats] = useState<InboundStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showRuleEditor, setShowRuleEditor] = useState(false)
  const [editingRule, setEditingRule] = useState<RoutingRule | null>(null)

  useEffect(() => {
    fetchData()
    // Set up polling for real-time updates
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchData = async () => {
    try {
      // Fetch mock data - in production, call actual APIs
      setStats({
        totalCalls: 156,
        answeredCalls: 142,
        missedCalls: 8,
        voicemailCalls: 6,
        avgDuration: 245,
        avgWaitTime: 12,
        currentQueueLength: 3,
        activeAgents: 2,
      })

      setQueuedCalls([
        { id: 'q1', callerNumber: '+1 (555) 123-4567', callerName: 'John Smith', position: 1, waitTime: 45, priority: 0 },
        { id: 'q2', callerNumber: '+1 (555) 987-6543', position: 2, waitTime: 23, priority: 0 },
        { id: 'q3', callerNumber: '+1 (555) 456-7890', callerName: 'Sarah Johnson', position: 3, waitTime: 10, priority: 1 },
      ])

      setActiveCalls([
        { id: 'a1', callerNumber: '+1 (555) 111-2222', callerName: 'Mike Brown', duration: 180, status: 'in_progress', routedTo: 'AI Agent' },
        { id: 'a2', callerNumber: '+1 (555) 333-4444', duration: 95, status: 'in_progress', routedTo: 'AI Agent' },
      ])

      setRoutingRules([
        { id: 'r1', name: 'Business Hours', conditionType: 'TIME_BASED', actionType: 'AI_AGENT', priority: 10, isActive: true },
        { id: 'r2', name: 'After Hours', conditionType: 'TIME_BASED', actionType: 'VOICEMAIL', priority: 5, isActive: true },
        { id: 'r3', name: 'VIP Callers', conditionType: 'CALLER_ID', actionType: 'AI_AGENT', priority: 20, isActive: true },
        { id: 'r4', name: 'Queue Overflow', conditionType: 'QUEUE_LENGTH', actionType: 'VOICEMAIL', priority: 15, isActive: false },
      ])

      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error)
      setIsLoading(false)
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleTransferCall = async (callId: string) => {
    // In production, call API
    console.log('Transfer call:', callId)
  }

  const handleEndCall = async (callId: string) => {
    // In production, call API
    console.log('End call:', callId)
  }

  const toggleRuleActive = async (ruleId: string) => {
    setRoutingRules(rules =>
      rules.map(r => r.id === ruleId ? { ...r, isActive: !r.isActive } : r)
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inbound Call Center</h1>
          <p className="text-gray-500 mt-1">Manage incoming calls and routing</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium">System Online</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Calls Today</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.totalCalls || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Phone className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-sm">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-green-600 font-medium">+12%</span>
            <span className="text-gray-500">vs yesterday</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Queue Length</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.currentQueueLength || 0}</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-sm">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">Avg wait: {stats?.avgWaitTime || 0}s</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Answer Rate</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats ? Math.round((stats.answeredCalls / stats.totalCalls) * 100) : 0}%
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <PhoneIncoming className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-sm">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-gray-600">{stats?.answeredCalls || 0} answered</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Missed Calls</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.missedCalls || 0}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <PhoneMissed className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-sm">
            <Voicemail className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">{stats?.voicemailCalls || 0} voicemails</span>
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {[
              { id: 'live', label: 'Live Calls', icon: Phone },
              { id: 'queue', label: 'Call Queue', icon: Users },
              { id: 'routing', label: 'Routing Rules', icon: Settings },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.id === 'queue' && queuedCalls.length > 0 && (
                  <span className="ml-1 px-2 py-0.5 text-xs bg-amber-100 text-amber-700 rounded-full">
                    {queuedCalls.length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Live Calls Tab */}
          {activeTab === 'live' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Active Calls</h3>
                <span className="text-sm text-gray-500">{activeCalls.length} active</span>
              </div>

              {activeCalls.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Phone className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p>No active calls at the moment</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeCalls.map((call) => (
                    <motion.div
                      key={call.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                          <Phone className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {call.callerName || call.callerNumber}
                          </p>
                          <p className="text-sm text-gray-500">
                            {call.callerName && call.callerNumber}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Duration</p>
                          <p className="font-mono font-medium text-gray-900">
                            {formatDuration(call.duration)}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Routed To</p>
                          <p className="font-medium text-gray-900">{call.routedTo}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleTransferCall(call.id)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Transfer"
                          >
                            <PhoneForwarded className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleEndCall(call.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="End Call"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Queue Tab */}
          {activeTab === 'queue' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Call Queue</h3>
                <span className="text-sm text-gray-500">{queuedCalls.length} waiting</span>
              </div>

              {queuedCalls.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p>Queue is empty</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {queuedCalls.map((call) => (
                    <motion.div
                      key={call.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-xl"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold">
                          {call.position}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {call.callerName || call.callerNumber}
                          </p>
                          <p className="text-sm text-gray-500">
                            {call.callerName && call.callerNumber}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Wait Time</p>
                          <p className="font-mono font-medium text-gray-900">
                            {formatDuration(call.waitTime)}
                          </p>
                        </div>
                        {call.priority > 0 && (
                          <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                            Priority
                          </span>
                        )}
                        <div className="flex items-center gap-2">
                          <button
                            className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                            title="Answer"
                          >
                            <Phone className="w-5 h-5" />
                          </button>
                          <button
                            className="p-2 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors"
                            title="Send to Voicemail"
                          >
                            <Voicemail className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Routing Rules Tab */}
          {activeTab === 'routing' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Routing Rules</h3>
                <button
                  onClick={() => {
                    setEditingRule(null)
                    setShowRuleEditor(true)
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Rule
                </button>
              </div>

              <div className="space-y-3">
                {routingRules
                  .sort((a, b) => b.priority - a.priority)
                  .map((rule) => (
                  <motion.div
                    key={rule.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center justify-between p-4 border rounded-xl transition-colors ${
                      rule.isActive
                        ? 'bg-white border-gray-200'
                        : 'bg-gray-50 border-gray-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => toggleRuleActive(rule.id)}
                        className={`w-10 h-6 rounded-full transition-colors ${
                          rule.isActive ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`block w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                            rule.isActive ? 'translate-x-4' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                      <div>
                        <p className="font-medium text-gray-900">{rule.name}</p>
                        <p className="text-sm text-gray-500">
                          {rule.conditionType.replace('_', ' ')} → {rule.actionType.replace('_', ' ')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                        Priority: {rule.priority}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingRule(rule)
                            setShowRuleEditor(true)
                          }}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Call Volume Chart Placeholder */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Call Volume by Hour</h4>
                  <div className="h-48 flex items-end justify-between gap-2">
                    {[18, 24, 22, 15, 28, 25, 20, 12].map((value, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-blue-500 rounded-t-lg transition-all hover:bg-blue-600"
                        style={{ height: `${(value / 30) * 100}%` }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>9AM</span>
                    <span>12PM</span>
                    <span>3PM</span>
                    <span>5PM</span>
                  </div>
                </div>

                {/* Sentiment Breakdown */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Call Sentiment</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Positive</span>
                        <span className="font-medium text-green-600">68%</span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '68%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Neutral</span>
                        <span className="font-medium text-gray-600">24%</span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gray-400 rounded-full" style={{ width: '24%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Negative</span>
                        <span className="font-medium text-red-600">8%</span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full" style={{ width: '8%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Call Reasons */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Top Call Reasons</h4>
                <div className="grid md:grid-cols-4 gap-4">
                  {[
                    { reason: 'Appointments', count: 45, icon: '📅' },
                    { reason: 'Pricing', count: 32, icon: '💰' },
                    { reason: 'Support', count: 28, icon: '🛠️' },
                    { reason: 'General Inquiry', count: 51, icon: '❓' },
                  ].map((item) => (
                    <div
                      key={item.reason}
                      className="bg-white rounded-lg p-4 border border-gray-200"
                    >
                      <span className="text-2xl mb-2 block">{item.icon}</span>
                      <p className="font-medium text-gray-900">{item.reason}</p>
                      <p className="text-sm text-gray-500">{item.count} calls</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Rule Editor Modal */}
      <AnimatePresence>
        {showRuleEditor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowRuleEditor(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {editingRule ? 'Edit Routing Rule' : 'New Routing Rule'}
                  </h3>
                  <button
                    onClick={() => setShowRuleEditor(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rule Name</label>
                  <input
                    type="text"
                    defaultValue={editingRule?.name}
                    placeholder="e.g., After Hours Routing"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Condition Type</label>
                  <select
                    defaultValue={editingRule?.conditionType || 'TIME_BASED'}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="TIME_BASED">Time Based</option>
                    <option value="CALLER_ID">Caller ID</option>
                    <option value="QUEUE_LENGTH">Queue Length</option>
                    <option value="KEYWORD">Keyword</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
                  <select
                    defaultValue={editingRule?.actionType || 'AI_AGENT'}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="AI_AGENT">Route to AI Agent</option>
                    <option value="VOICEMAIL">Send to Voicemail</option>
                    <option value="TRANSFER">Transfer to Number</option>
                    <option value="QUEUE">Add to Queue</option>
                    <option value="PLAY_MESSAGE">Play Message</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority (higher = first)</label>
                  <input
                    type="number"
                    defaultValue={editingRule?.priority || 10}
                    min="0"
                    max="100"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={() => setShowRuleEditor(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save Rule
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

