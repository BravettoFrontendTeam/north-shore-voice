import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Filter,
  Download,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Clock,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Play,
  FileText,
} from 'lucide-react'

const callLogs = [
  {
    id: 1,
    caller: '+1 (555) 123-4567',
    callerName: 'John Smith',
    type: 'incoming',
    duration: '4:32',
    status: 'completed',
    timestamp: '2024-01-18 14:32:00',
    sentiment: 'positive',
    topics: ['Appointment', 'Billing'],
    transcript: [
      { speaker: 'ai', text: 'Thank you for calling North Shore Voice. How may I assist you today?' },
      { speaker: 'caller', text: 'Hi, I would like to schedule an appointment for next week.' },
      { speaker: 'ai', text: 'Of course! I can help you with that. What day works best for you?' },
      { speaker: 'caller', text: 'Tuesday afternoon would be great if possible.' },
      { speaker: 'ai', text: 'I have availability on Tuesday at 2 PM or 4 PM. Which would you prefer?' },
    ],
  },
  {
    id: 2,
    caller: '+1 (555) 987-6543',
    callerName: 'Sarah Johnson',
    type: 'incoming',
    duration: '2:15',
    status: 'completed',
    timestamp: '2024-01-18 13:45:00',
    sentiment: 'neutral',
    topics: ['Product Info'],
    transcript: [
      { speaker: 'ai', text: 'Good afternoon! Thank you for calling. How can I help you?' },
      { speaker: 'caller', text: 'I have a question about your pricing plans.' },
      { speaker: 'ai', text: 'I would be happy to help with pricing information. Which plan are you interested in?' },
    ],
  },
  {
    id: 3,
    caller: '+1 (555) 456-7890',
    callerName: 'Mike Williams',
    type: 'outgoing',
    duration: '6:48',
    status: 'completed',
    timestamp: '2024-01-18 11:20:00',
    sentiment: 'positive',
    topics: ['Follow-up', 'Support'],
    transcript: [],
  },
  {
    id: 4,
    caller: '+1 (555) 321-0987',
    callerName: 'Unknown',
    type: 'incoming',
    duration: '0:00',
    status: 'missed',
    timestamp: '2024-01-18 10:15:00',
    sentiment: 'neutral',
    topics: [],
    transcript: [],
  },
  {
    id: 5,
    caller: '+1 (555) 654-3210',
    callerName: 'Emily Davis',
    type: 'incoming',
    duration: '5:17',
    status: 'completed',
    timestamp: '2024-01-18 09:30:00',
    sentiment: 'positive',
    topics: ['Appointment', 'General'],
    transcript: [],
  },
  {
    id: 6,
    caller: '+1 (555) 111-2222',
    callerName: 'Robert Brown',
    type: 'incoming',
    duration: '3:42',
    status: 'completed',
    timestamp: '2024-01-17 16:45:00',
    sentiment: 'negative',
    topics: ['Complaint'],
    transcript: [],
  },
]

export default function CallLogs() {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedCall, setExpandedCall] = useState<number | null>(null)
  const [filterType, setFilterType] = useState('all')

  const filteredLogs = callLogs.filter((log) => {
    const matchesSearch =
      log.caller.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.callerName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter =
      filterType === 'all' ||
      (filterType === 'incoming' && log.type === 'incoming') ||
      (filterType === 'outgoing' && log.type === 'outgoing') ||
      (filterType === 'missed' && log.status === 'missed')
    return matchesSearch && matchesFilter
  })

  const TypeIcon = {
    incoming: PhoneIncoming,
    outgoing: PhoneOutgoing,
    missed: PhoneMissed,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">Call Logs</h1>
          <p className="text-white/60">View and analyze all your call records</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Logs
        </button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search by phone number or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-12"
            />
          </div>

          {/* Type Filter */}
          <div className="flex gap-2">
            {['all', 'incoming', 'outgoing', 'missed'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                  filterType === type
                    ? 'bg-primary-500 text-white'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Call List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        {filteredLogs.map((call) => {
          const Icon = call.status === 'missed' ? PhoneMissed : TypeIcon[call.type as keyof typeof TypeIcon]
          const isExpanded = expandedCall === call.id

          return (
            <div
              key={call.id}
              className="card overflow-hidden"
            >
              {/* Main Row */}
              <div
                onClick={() => setExpandedCall(isExpanded ? null : call.id)}
                className="flex items-center gap-4 cursor-pointer"
              >
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  call.status === 'missed'
                    ? 'bg-error/20 text-error'
                    : call.type === 'incoming'
                    ? 'bg-success/20 text-success'
                    : 'bg-primary-500/20 text-primary-400'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <p className="text-white font-medium">{call.caller}</p>
                    {call.callerName !== 'Unknown' && (
                      <span className="text-white/50 text-sm">({call.callerName})</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white/50">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {call.duration}
                    </span>
                    <span>{call.timestamp}</span>
                  </div>
                </div>

                {/* Topics */}
                <div className="hidden md:flex items-center gap-2">
                  {call.topics.slice(0, 2).map((topic) => (
                    <span
                      key={topic}
                      className="px-2 py-1 bg-white/5 rounded-full text-xs text-white/70"
                    >
                      {topic}
                    </span>
                  ))}
                </div>

                {/* Sentiment */}
                <span className={`hidden sm:block px-3 py-1 rounded-full text-xs font-medium ${
                  call.sentiment === 'positive'
                    ? 'bg-success/10 text-success'
                    : call.sentiment === 'negative'
                    ? 'bg-error/10 text-error'
                    : 'bg-white/10 text-white/70'
                }`}>
                  {call.sentiment}
                </span>

                {/* Expand */}
                <button className="p-2 text-white/40 hover:text-white transition-colors">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>

              {/* Expanded Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 mt-4 border-t border-white/10">
                      {/* Actions */}
                      <div className="flex gap-3 mb-4">
                        <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white text-sm font-medium transition-colors flex items-center gap-2">
                          <Play className="w-4 h-4" />
                          Play Recording
                        </button>
                        <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white text-sm font-medium transition-colors flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Download Transcript
                        </button>
                      </div>

                      {/* Transcript */}
                      {call.transcript.length > 0 ? (
                        <div className="space-y-3 bg-slate-800/50 rounded-xl p-4">
                          <h4 className="text-white/80 text-sm font-medium mb-3">
                            <MessageSquare className="w-4 h-4 inline mr-2" />
                            Transcript
                          </h4>
                          {call.transcript.map((message, index) => (
                            <div
                              key={index}
                              className={`flex gap-3 ${
                                message.speaker === 'ai' ? '' : 'flex-row-reverse'
                              }`}
                            >
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                message.speaker === 'ai'
                                  ? 'bg-primary-500/20 text-primary-400'
                                  : 'bg-white/10 text-white/60'
                              }`}>
                                <span className="text-xs font-medium">
                                  {message.speaker === 'ai' ? 'AI' : 'C'}
                                </span>
                              </div>
                              <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                                message.speaker === 'ai'
                                  ? 'bg-slate-700/50 rounded-tl-sm'
                                  : 'bg-primary-500/20 rounded-tr-sm'
                              }`}>
                                <p className="text-white/80 text-sm">{message.text}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-white/50 text-sm text-center py-4">
                          No transcript available for this call
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </motion.div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-white/60 text-sm">
          Showing {filteredLogs.length} of {callLogs.length} calls
        </p>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white text-sm font-medium transition-colors">
            Previous
          </button>
          <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white text-sm font-medium transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

