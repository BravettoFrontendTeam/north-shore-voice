import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Mic,
  Upload,
  Play,
  Pause,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  Settings,
  Sparkles,
} from 'lucide-react'

const voiceModels = [
  {
    id: 1,
    name: 'Primary Voice',
    status: 'ready',
    samples: 24,
    createdAt: '2024-01-15',
    personality: { friendliness: 80, professionalism: 90, energy: 60, formality: 70 },
  },
  {
    id: 2,
    name: 'Friendly Tone',
    status: 'training',
    samples: 18,
    createdAt: '2024-01-18',
    personality: { friendliness: 95, professionalism: 70, energy: 85, formality: 40 },
  },
  {
    id: 3,
    name: 'Formal Voice',
    status: 'ready',
    samples: 30,
    createdAt: '2024-01-10',
    personality: { friendliness: 60, professionalism: 95, energy: 50, formality: 95 },
  },
]

const trainingData = [
  { id: 1, name: 'greeting_01.wav', duration: '0:15', uploaded: '2 days ago' },
  { id: 2, name: 'faq_response_02.wav', duration: '0:28', uploaded: '2 days ago' },
  { id: 3, name: 'closing_statement.wav', duration: '0:12', uploaded: '3 days ago' },
  { id: 4, name: 'product_info_01.wav', duration: '0:45', uploaded: '5 days ago' },
]

export default function VoiceTraining() {
  const [selectedModel, setSelectedModel] = useState(voiceModels[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [personality, setPersonality] = useState(selectedModel.personality)

  const statusColors = {
    ready: 'text-success bg-success/10 border-success/30',
    training: 'text-warning bg-warning/10 border-warning/30',
    failed: 'text-error bg-error/10 border-error/30',
  }

  const statusIcons = {
    ready: CheckCircle,
    training: Clock,
    failed: AlertCircle,
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
          <h1 className="text-2xl font-bold text-white">Voice Training</h1>
          <p className="text-white/60">Train and customize your AI voice models</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Create New Model
        </button>
      </motion.div>

      {/* Voice Models Grid */}
      <div className="grid lg:grid-cols-3 gap-4">
        {voiceModels.map((model, index) => {
          const StatusIcon = statusIcons[model.status as keyof typeof statusIcons]
          return (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => {
                setSelectedModel(model)
                setPersonality(model.personality)
              }}
              className={`card cursor-pointer transition-all duration-200 ${
                selectedModel.id === model.id
                  ? 'border-primary-500/50 shadow-lg shadow-primary-500/10'
                  : 'hover:border-white/20'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Mic className="w-6 h-6 text-white" />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[model.status as keyof typeof statusColors]}`}>
                  <StatusIcon className="w-3 h-3 inline mr-1" />
                  {model.status}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">{model.name}</h3>
              <p className="text-white/60 text-sm mb-4">
                {model.samples} training samples • Created {model.createdAt}
              </p>
              <div className="flex items-center gap-3">
                <button className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white text-sm font-medium transition-colors flex items-center justify-center gap-2">
                  <Play className="w-4 h-4" />
                  Preview
                </button>
                <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Personality Adjustment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Personality Settings</h3>
            <span className="text-white/60 text-sm">{selectedModel.name}</span>
          </div>
          
          <div className="space-y-6">
            {Object.entries(personality).map(([key, value]) => (
              <div key={key}>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-white/80 text-sm capitalize">{key}</label>
                  <span className="text-primary-400 text-sm font-medium">{value}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={value}
                  onChange={(e) => setPersonality({ ...personality, [key]: parseInt(e.target.value) })}
                  className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-4
                    [&::-webkit-slider-thumb]:h-4
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-gradient-to-r
                    [&::-webkit-slider-thumb]:from-primary-500
                    [&::-webkit-slider-thumb]:to-cyan-500
                    [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-webkit-slider-thumb]:shadow-lg"
                />
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-6 pt-6 border-t border-white/10">
            <button className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white text-sm font-medium transition-colors">
              Reset to Default
            </button>
            <button className="flex-1 btn-primary text-sm">
              Save Changes
            </button>
          </div>
        </motion.div>

        {/* Training Data */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Training Data</h3>
            <button className="text-primary-400 hover:text-primary-300 text-sm font-medium flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload Audio
            </button>
          </div>

          {/* Upload Zone */}
          <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center mb-6 hover:border-primary-500/50 transition-colors cursor-pointer">
            <Upload className="w-8 h-8 text-white/40 mx-auto mb-3" />
            <p className="text-white/60 text-sm mb-1">
              Drag and drop audio files here
            </p>
            <p className="text-white/40 text-xs">
              Supports WAV, MP3, M4A (max 10MB each)
            </p>
          </div>

          {/* File List */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {trainingData.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-4 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center text-primary-400 hover:bg-primary-500/30 transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{file.name}</p>
                  <p className="text-white/50 text-xs">
                    {file.duration} • {file.uploaded}
                  </p>
                </div>
                <button className="p-2 text-white/40 hover:text-error transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Business Context */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-white mb-6">Business Context</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Company Name
            </label>
            <input
              type="text"
              placeholder="Your Company Inc."
              className="input-field"
              defaultValue="North Shore Voice"
            />
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
              <option>Other</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-white/80 text-sm font-medium mb-2">
              Custom Greeting
            </label>
            <textarea
              rows={3}
              placeholder="Enter your custom greeting message..."
              className="input-field resize-none"
              defaultValue="Thank you for calling North Shore Voice. How may I assist you today?"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-white/80 text-sm font-medium mb-2">
              Fallback Message
            </label>
            <textarea
              rows={2}
              placeholder="Message when AI cannot understand the request..."
              className="input-field resize-none"
              defaultValue="I apologize, but I didn't quite catch that. Could you please repeat your question?"
            />
          </div>
        </div>
        <div className="flex justify-end mt-6 pt-6 border-t border-white/10">
          <button className="btn-primary">
            Save Business Context
          </button>
        </div>
      </motion.div>
    </div>
  )
}
