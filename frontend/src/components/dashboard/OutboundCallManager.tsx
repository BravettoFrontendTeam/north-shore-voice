import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  PhoneOutgoing,
  Users,
  Play,
  Pause,
  Square,
  Plus,
  Upload,
  Calendar,
  Clock,
  Target,
  TrendingUp,
  CheckCircle,
  XCircle,
  Voicemail,
  Edit,
  Trash2,
  Eye,
  FileText,
  Phone,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  Settings,
  X,
  Save,
} from 'lucide-react'

interface Campaign {
  id: string
  name: string
  status: 'draft' | 'scheduled' | 'running' | 'paused' | 'completed' | 'cancelled'
  totalContacts: number
  completedCalls: number
  answeredCalls: number
  voicemailCalls: number
  failedCalls: number
  progress: number
  startedAt?: string
  scheduledAt?: string
}

interface Contact {
  id: string
  phoneNumber: string
  name?: string
  status: 'pending' | 'called' | 'completed' | 'failed'
  result?: string
  attempts: number
}

interface OutboundStats {
  totalCalls: number
  answeredCalls: number
  voicemailCalls: number
  failedCalls: number
  answerRate: number
  conversionRate: number
  activeCampaigns: number
  scheduledCampaigns: number
}

export default function OutboundCallManager() {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'quickcall' | 'callbacks' | 'analytics'>('campaigns')
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [stats, setStats] = useState<OutboundStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showCampaignCreator, setShowCampaignCreator] = useState(false)
  const [expandedCampaign, setExpandedCampaign] = useState<string | null>(null)
  
  // Quick call state
  const [quickCallNumber, setQuickCallNumber] = useState('')
  const [quickCallName, setQuickCallName] = useState('')
  const [quickCallScript, setQuickCallScript] = useState('')
  const [isCallingQuick, setIsCallingQuick] = useState(false)
  
  // Campaign creator state
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    description: '',
    scriptTemplate: '',
    voiceId: 'abe',
    contacts: [] as Contact[],
  })

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 10000)
    return () => clearInterval(interval)
  }, [])

  const fetchData = async () => {
    try {
      setStats({
        totalCalls: 89,
        answeredCalls: 52,
        voicemailCalls: 24,
        failedCalls: 13,
        answerRate: 58,
        conversionRate: 12,
        activeCampaigns: 2,
        scheduledCampaigns: 1,
      })

      setCampaigns([
        {
          id: 'c1',
          name: 'Q1 Customer Outreach',
          status: 'running',
          totalContacts: 150,
          completedCalls: 89,
          answeredCalls: 52,
          voicemailCalls: 24,
          failedCalls: 13,
          progress: 59,
          startedAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: 'c2',
          name: 'Follow-up Campaign',
          status: 'paused',
          totalContacts: 75,
          completedCalls: 32,
          answeredCalls: 21,
          voicemailCalls: 8,
          failedCalls: 3,
          progress: 43,
          startedAt: new Date(Date.now() - 172800000).toISOString(),
        },
        {
          id: 'c3',
          name: 'New Leads Intro',
          status: 'scheduled',
          totalContacts: 200,
          completedCalls: 0,
          answeredCalls: 0,
          voicemailCalls: 0,
          failedCalls: 0,
          progress: 0,
          scheduledAt: new Date(Date.now() + 86400000).toISOString(),
        },
        {
          id: 'c4',
          name: 'Holiday Special',
          status: 'completed',
          totalContacts: 100,
          completedCalls: 100,
          answeredCalls: 65,
          voicemailCalls: 28,
          failedCalls: 7,
          progress: 100,
          startedAt: new Date(Date.now() - 604800000).toISOString(),
        },
      ])

      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error)
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'running': return 'bg-green-100 text-green-700 border-green-200'
      case 'paused': return 'bg-amber-100 text-amber-700 border-amber-200'
      case 'scheduled': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'completed': return 'bg-gray-100 text-gray-700 border-gray-200'
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getStatusIcon = (status: Campaign['status']) => {
    switch (status) {
      case 'running': return <Play className="w-3 h-3" />
      case 'paused': return <Pause className="w-3 h-3" />
      case 'scheduled': return <Calendar className="w-3 h-3" />
      case 'completed': return <CheckCircle className="w-3 h-3" />
      case 'cancelled': return <XCircle className="w-3 h-3" />
      default: return <FileText className="w-3 h-3" />
    }
  }

  const handleCampaignAction = async (campaignId: string, action: 'start' | 'pause' | 'resume' | 'cancel') => {
    // In production, call API
    console.log(`${action} campaign:`, campaignId)
    
    setCampaigns(prev => prev.map(c => {
      if (c.id === campaignId) {
        switch (action) {
          case 'start':
          case 'resume':
            return { ...c, status: 'running' as const }
          case 'pause':
            return { ...c, status: 'paused' as const }
          case 'cancel':
            return { ...c, status: 'cancelled' as const }
        }
      }
      return c
    }))
  }

  const handleQuickCall = async () => {
    if (!quickCallNumber) return
    
    setIsCallingQuick(true)
    try {
      // In production, call API
      await new Promise(resolve => setTimeout(resolve, 2000))
      alert(`Initiating call to ${quickCallNumber}`)
    } finally {
      setIsCallingQuick(false)
    }
  }

  const handleCreateCampaign = async () => {
    // In production, call API
    console.log('Create campaign:', newCampaign)
    setShowCampaignCreator(false)
    setNewCampaign({
      name: '',
      description: '',
      scriptTemplate: '',
      voiceId: 'abe',
      contacts: [],
    })
  }

  const handleContactsUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // In production, parse CSV/Excel
    const mockContacts: Contact[] = Array.from({ length: 10 }, (_, i) => ({
      id: `new_${i}`,
      phoneNumber: `+1555${String(i).padStart(7, '0')}`,
      name: `Contact ${i + 1}`,
      status: 'pending',
      attempts: 0,
    }))

    setNewCampaign(prev => ({
      ...prev,
      contacts: [...prev.contacts, ...mockContacts],
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Outbound Call Manager</h1>
          <p className="text-gray-500 mt-1">Manage campaigns and outgoing calls</p>
        </div>
        <button
          onClick={() => setShowCampaignCreator(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Campaign
        </button>
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
              <p className="text-sm text-gray-500">Total Calls</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.totalCalls || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <PhoneOutgoing className="w-6 h-6 text-blue-600" />
            </div>
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
              <p className="text-sm text-gray-500">Answer Rate</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.answerRate || 0}%</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-green-600" />
            </div>
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
              <p className="text-sm text-gray-500">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.conversionRate || 0}%</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
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
              <p className="text-sm text-gray-500">Active Campaigns</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.activeCampaigns || 0}</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Play className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {[
              { id: 'campaigns', label: 'Campaigns', icon: Users },
              { id: 'quickcall', label: 'Quick Call', icon: Phone },
              { id: 'callbacks', label: 'Scheduled Callbacks', icon: Calendar },
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
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Campaigns Tab */}
          {activeTab === 'campaigns' && (
            <div className="space-y-4">
              {campaigns.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p>No campaigns yet</p>
                  <button
                    onClick={() => setShowCampaignCreator(true)}
                    className="mt-4 text-blue-600 hover:underline"
                  >
                    Create your first campaign
                  </button>
                </div>
              ) : (
                campaigns.map((campaign) => (
                  <motion.div
                    key={campaign.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-gray-200 rounded-xl overflow-hidden"
                  >
                    <div
                      className="p-4 bg-white cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => setExpandedCampaign(
                        expandedCampaign === campaign.id ? null : campaign.id
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <button className="text-gray-400">
                            {expandedCampaign === campaign.id ? (
                              <ChevronDown className="w-5 h-5" />
                            ) : (
                              <ChevronRight className="w-5 h-5" />
                            )}
                          </button>
                          <div>
                            <h3 className="font-semibold text-gray-900">{campaign.name}</h3>
                            <p className="text-sm text-gray-500">
                              {campaign.totalContacts} contacts
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium border rounded-full ${getStatusColor(campaign.status)}`}>
                            {getStatusIcon(campaign.status)}
                            {campaign.status}
                          </span>

                          {/* Progress Bar */}
                          <div className="w-32">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>{campaign.progress}%</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-500 rounded-full transition-all"
                                style={{ width: `${campaign.progress}%` }}
                              />
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            {campaign.status === 'running' && (
                              <button
                                onClick={() => handleCampaignAction(campaign.id, 'pause')}
                                className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                title="Pause"
                              >
                                <Pause className="w-4 h-4" />
                              </button>
                            )}
                            {campaign.status === 'paused' && (
                              <button
                                onClick={() => handleCampaignAction(campaign.id, 'resume')}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Resume"
                              >
                                <Play className="w-4 h-4" />
                              </button>
                            )}
                            {campaign.status === 'scheduled' && (
                              <button
                                onClick={() => handleCampaignAction(campaign.id, 'start')}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Start Now"
                              >
                                <Play className="w-4 h-4" />
                              </button>
                            )}
                            {['running', 'paused', 'scheduled'].includes(campaign.status) && (
                              <button
                                onClick={() => handleCampaignAction(campaign.id, 'cancel')}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Cancel"
                              >
                                <Square className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {expandedCampaign === campaign.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-gray-200 bg-gray-50 overflow-hidden"
                        >
                          <div className="p-4 grid md:grid-cols-4 gap-4">
                            <div className="text-center p-3 bg-white rounded-lg">
                              <p className="text-2xl font-bold text-green-600">{campaign.answeredCalls}</p>
                              <p className="text-sm text-gray-500">Answered</p>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg">
                              <p className="text-2xl font-bold text-amber-600">{campaign.voicemailCalls}</p>
                              <p className="text-sm text-gray-500">Voicemail</p>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg">
                              <p className="text-2xl font-bold text-red-600">{campaign.failedCalls}</p>
                              <p className="text-sm text-gray-500">Failed</p>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg">
                              <p className="text-2xl font-bold text-gray-600">
                                {campaign.totalContacts - campaign.completedCalls}
                              </p>
                              <p className="text-sm text-gray-500">Remaining</p>
                            </div>
                          </div>
                          <div className="px-4 pb-4">
                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <span>
                                Answer Rate: {campaign.completedCalls > 0 
                                  ? Math.round((campaign.answeredCalls / campaign.completedCalls) * 100) 
                                  : 0}%
                              </span>
                              {campaign.startedAt && (
                                <span>Started: {new Date(campaign.startedAt).toLocaleDateString()}</span>
                              )}
                              {campaign.scheduledAt && (
                                <span>Scheduled: {new Date(campaign.scheduledAt).toLocaleDateString()}</span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {/* Quick Call Tab */}
          {activeTab === 'quickcall' && (
            <div className="max-w-lg mx-auto space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Make a Quick Call</h3>
                <p className="text-gray-500">Initiate a single outbound call with AI</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={quickCallNumber}
                    onChange={(e) => setQuickCallNumber(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Name (optional)
                  </label>
                  <input
                    type="text"
                    value={quickCallName}
                    onChange={(e) => setQuickCallName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Call Script (optional)
                  </label>
                  <textarea
                    value={quickCallScript}
                    onChange={(e) => setQuickCallScript(e.target.value)}
                    rows={4}
                    placeholder="Hi {name}, this is North Shore Voice calling about..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use {'{name}'} to personalize with contact name
                  </p>
                </div>

                <button
                  onClick={handleQuickCall}
                  disabled={!quickCallNumber || isCallingQuick}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isCallingQuick ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Initiating Call...
                    </>
                  ) : (
                    <>
                      <Phone className="w-5 h-5" />
                      Start Call
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Callbacks Tab */}
          {activeTab === 'callbacks' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Scheduled Callbacks</h3>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Plus className="w-4 h-4" />
                  Schedule Callback
                </button>
              </div>

              {/* Mock callbacks */}
              {[
                { id: '1', name: 'John Smith', phone: '+1 (555) 123-4567', time: '2:00 PM', reason: 'Follow-up on quote' },
                { id: '2', name: 'Sarah Johnson', phone: '+1 (555) 987-6543', time: '3:30 PM', reason: 'Product demo' },
                { id: '3', name: 'Mike Brown', phone: '+1 (555) 456-7890', time: 'Tomorrow 10:00 AM', reason: 'Contract discussion' },
              ].map((callback) => (
                <div
                  key={callback.id}
                  className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{callback.name}</p>
                      <p className="text-sm text-gray-500">{callback.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{callback.time}</p>
                      <p className="text-sm text-gray-500">{callback.reason}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <Phone className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Daily Trend */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Daily Call Trend</h4>
                  <div className="h-48 flex items-end justify-between gap-2">
                    {[
                      { total: 15, answered: 9 },
                      { total: 18, answered: 11 },
                      { total: 12, answered: 7 },
                      { total: 22, answered: 13 },
                      { total: 22, answered: 12 },
                    ].map((day, i) => (
                      <div key={i} className="flex-1 flex flex-col gap-1">
                        <div
                          className="bg-green-500 rounded-t-lg transition-all"
                          style={{ height: `${(day.answered / 25) * 100}%` }}
                        />
                        <div
                          className="bg-gray-300 rounded-b-lg transition-all"
                          style={{ height: `${((day.total - day.answered) / 25) * 100}%` }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                  </div>
                  <div className="flex items-center gap-4 mt-4 text-sm">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-green-500 rounded" /> Answered
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-gray-300 rounded" /> Other
                    </span>
                  </div>
                </div>

                {/* Outcome Breakdown */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Call Outcomes</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Answered</span>
                        <span className="font-medium text-green-600">58%</span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '58%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Voicemail</span>
                        <span className="font-medium text-amber-600">27%</span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: '27%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Failed/No Answer</span>
                        <span className="font-medium text-red-600">15%</span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full" style={{ width: '15%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Performing Campaigns */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Campaign Performance</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm text-gray-500">
                        <th className="pb-3 font-medium">Campaign</th>
                        <th className="pb-3 font-medium">Calls</th>
                        <th className="pb-3 font-medium">Answer Rate</th>
                        <th className="pb-3 font-medium">Conversions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {[
                        { name: 'Q1 Customer Outreach', calls: 89, answerRate: 72, conversions: 8 },
                        { name: 'Follow-up Campaign', calls: 32, answerRate: 65, conversions: 5 },
                        { name: 'Holiday Special', calls: 100, answerRate: 65, conversions: 12 },
                      ].map((campaign, i) => (
                        <tr key={i} className="border-t border-gray-200">
                          <td className="py-3 font-medium text-gray-900">{campaign.name}</td>
                          <td className="py-3 text-gray-600">{campaign.calls}</td>
                          <td className="py-3">
                            <span className={campaign.answerRate >= 60 ? 'text-green-600' : 'text-amber-600'}>
                              {campaign.answerRate}%
                            </span>
                          </td>
                          <td className="py-3 text-gray-600">{campaign.conversions}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Campaign Creator Modal */}
      <AnimatePresence>
        {showCampaignCreator && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCampaignCreator(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Create New Campaign</h3>
                  <button
                    onClick={() => setShowCampaignCreator(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name *</label>
                  <input
                    type="text"
                    value={newCampaign.name}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Q1 Customer Outreach"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newCampaign.description}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, description: e.target.value }))}
                    rows={2}
                    placeholder="Describe the purpose of this campaign..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Call Script *</label>
                  <textarea
                    value={newCampaign.scriptTemplate}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, scriptTemplate: e.target.value }))}
                    rows={4}
                    placeholder="Hi {name}, this is North Shore Voice calling to follow up on your recent inquiry..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use {'{name}'}, {'{company}'} for personalization
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">AI Voice</label>
                  <select
                    value={newCampaign.voiceId}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, voiceId: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="abe">Abë (Professional)</option>
                    <option value="luna">Luna (Friendly)</option>
                    <option value="marcus">Marcus (Professional)</option>
                    <option value="evelyn">Evelyn (Warm)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact List ({newCampaign.contacts.length} contacts)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleContactsUpload}
                      className="hidden"
                      id="contacts-upload"
                    />
                    <label
                      htmlFor="contacts-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-gray-600">Upload CSV or Excel file</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Required columns: phone_number. Optional: name, email, company
                      </p>
                    </label>
                  </div>
                  
                  {newCampaign.contacts.length > 0 && (
                    <div className="mt-3 p-3 bg-green-50 rounded-lg flex items-center gap-2 text-green-700">
                      <CheckCircle className="w-5 h-5" />
                      <span>{newCampaign.contacts.length} contacts ready to call</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={() => setShowCampaignCreator(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCampaign}
                  disabled={!newCampaign.name || !newCampaign.scriptTemplate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Create Campaign
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

