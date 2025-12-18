import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  Loader2,
  Sparkles,
  ArrowLeft,
  Settings,
  VolumeX,
  AlertCircle,
  CheckCircle2,
  Waves
} from 'lucide-react'

// Types for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionResultList {
  length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  isFinal: boolean
  length: number
  item(index: number): SpeechRecognitionAlternative
  [index: number]: SpeechRecognitionAlternative
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  abort(): void
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onend: (() => void) | null
  onerror: ((event: Event & { error: string }) => void) | null
  onstart: (() => void) | null
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition
    webkitSpeechRecognition: new () => SpeechRecognition
  }
}

interface Message {
  id: number
  speaker: 'ai' | 'user'
  text: string
  timestamp: Date
  isInterim?: boolean
}

// AI Response Logic
const generateAIResponse = (userInput: string): string => {
  const lowerInput = userInput.toLowerCase().trim()
  
  // Greetings
  if (/^(hi|hello|hey|good morning|good afternoon|good evening)/.test(lowerInput)) {
    return "Hello! Welcome to North Shore Voice. I'm your AI assistant. How can I help you today?"
  }
  
  // Appointments
  if (lowerInput.includes('appointment') || lowerInput.includes('schedule') || lowerInput.includes('book')) {
    return "I'd be happy to help you schedule an appointment. What day and time works best for you? We have availability Monday through Friday, 9 AM to 5 PM."
  }
  
  // Pricing
  if (lowerInput.includes('price') || lowerInput.includes('cost') || lowerInput.includes('pricing') || lowerInput.includes('plan')) {
    return "Our pricing is simple and transparent. The Starter plan is $99 per month with 500 minutes. Our most popular Professional plan is $299 per month with 2,000 minutes. For larger needs, we offer custom Enterprise pricing. Which plan interests you?"
  }
  
  // Hours
  if (lowerInput.includes('hour') || lowerInput.includes('open') || lowerInput.includes('available') || lowerInput.includes('time')) {
    return "We're available Monday through Friday, 9 AM to 5 PM Pacific Time. Our AI system, however, is available 24/7 to handle your calls. How can I assist you?"
  }
  
  // Help
  if (lowerInput.includes('help') || lowerInput.includes('support') || lowerInput.includes('assist')) {
    return "I'm here to help! I can assist you with scheduling appointments, answering questions about our AI voice services, providing pricing information, or connecting you with our team. What would you like to know?"
  }
  
  // Features
  if (lowerInput.includes('feature') || lowerInput.includes('what can') || lowerInput.includes('do you')) {
    return "North Shore Voice offers AI-powered phone handling with custom voice cloning, 24/7 availability, real-time analytics, call transcriptions, and seamless CRM integration. Would you like to hear more about any specific feature?"
  }
  
  // Thanks
  if (lowerInput.includes('thank') || lowerInput.includes('thanks')) {
    return "You're very welcome! Is there anything else I can help you with today?"
  }
  
  // Goodbye
  if (lowerInput.includes('bye') || lowerInput.includes('goodbye') || lowerInput.includes('that\'s all') || lowerInput.includes('end')) {
    return "Thank you for calling North Shore Voice! It was a pleasure speaking with you. Have a wonderful day! Goodbye!"
  }
  
  // Human agent
  if (lowerInput.includes('human') || lowerInput.includes('person') || lowerInput.includes('agent') || lowerInput.includes('representative')) {
    return "I understand you'd like to speak with a human representative. I can transfer you to one of our team members. They're available during business hours, Monday through Friday, 9 AM to 5 PM Pacific. Would you like me to schedule a callback?"
  }
  
  // Demo/Trial
  if (lowerInput.includes('demo') || lowerInput.includes('trial') || lowerInput.includes('try')) {
    return "Great question! We offer a 14-day free trial with full access to all features. No credit card required to get started. Would you like me to help you set up your trial account?"
  }
  
  // Default response
  return "I appreciate your question. Could you tell me a bit more about what you're looking for? I'm here to help with scheduling, pricing, or any questions about our AI voice services."
}

export default function Demo() {
  // Call state
  const [isCallActive, setIsCallActive] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  
  // Audio state
  const [isMicEnabled, setIsMicEnabled] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(1)
  
  // Message state
  const [messages, setMessages] = useState<Message[]>([])
  const [interimTranscript, setInterimTranscript] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  
  // Error state
  const [error, setError] = useState<string | null>(null)
  const [micPermission, setMicPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt')
  
  // Settings
  const [showSettings, setShowSettings] = useState(false)
  const [silenceTimeout, setSilenceTimeout] = useState(3000) // 3 seconds
  const [selectedVoice, setSelectedVoice] = useState('abe')
  const [ttsMode, setTtsMode] = useState<'api' | 'browser' | null>(null)
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setInterval>>()
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout>>()
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const currentTranscriptRef = useRef('')

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, interimTranscript])

  // Call duration timer
  useEffect(() => {
    if (isCallActive) {
      timerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1)
      }, 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
      setCallDuration(0)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isCallActive])

  // Check microphone permission
  useEffect(() => {
    navigator.permissions?.query({ name: 'microphone' as PermissionName })
      .then(result => {
        setMicPermission(result.state as 'granted' | 'denied' | 'prompt')
        result.onchange = () => {
          setMicPermission(result.state as 'granted' | 'denied' | 'prompt')
        }
      })
      .catch(() => {
        // Permissions API not supported
      })
  }, [])

  // Initialize Speech Recognition
  const initSpeechRecognition = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    
    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.')
      return null
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      setIsListening(true)
      setError(null)
    }

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = ''
      let final = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          final += transcript
        } else {
          interim += transcript
        }
      }

      if (interim) {
        setInterimTranscript(interim)
        currentTranscriptRef.current = interim
        
        // Reset silence timer
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current)
        }
        
        silenceTimerRef.current = setTimeout(() => {
          if (currentTranscriptRef.current.trim()) {
            processUserSpeech(currentTranscriptRef.current.trim())
            currentTranscriptRef.current = ''
            setInterimTranscript('')
          }
        }, silenceTimeout)
      }

      if (final) {
        // Clear any pending silence timer
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current)
        }
        processUserSpeech(final.trim())
        setInterimTranscript('')
        currentTranscriptRef.current = ''
      }
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      if (event.error === 'not-allowed') {
        setMicPermission('denied')
        setError('Microphone access denied. Please allow microphone access to use voice input.')
      } else if (event.error === 'no-speech') {
        // Ignore no-speech errors
      } else {
        setError(`Speech recognition error: ${event.error}`)
      }
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
      // Restart if still enabled and call is active
      if (isMicEnabled && isCallActive && recognitionRef.current) {
        try {
          recognitionRef.current.start()
        } catch (e) {
          // Already started
        }
      }
    }

    return recognition
  }, [silenceTimeout, isMicEnabled, isCallActive])

  // Process user speech
  const processUserSpeech = async (text: string) => {
    if (!text || isProcessing) return

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      speaker: 'user',
      text,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setIsProcessing(true)

    // Stop listening while processing
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }

    // Generate AI response
    const aiResponse = generateAIResponse(text)

    // Add AI message
    const aiMessage: Message = {
      id: Date.now() + 1,
      speaker: 'ai',
      text: aiResponse,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, aiMessage])
    setIsProcessing(false)

    // Play AI response
    if (!isMuted) {
      await playAudio(aiResponse)
    }

    // Resume listening after audio finishes
    if (isMicEnabled && isCallActive && recognitionRef.current) {
      try {
        recognitionRef.current.start()
      } catch (e) {
        // Already started
      }
    }
  }

  // Browser fallback TTS
  const playBrowserTTS = (text: string): Promise<void> => {
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.95
      utterance.pitch = 1
      utterance.volume = volume
      
      // Try to get a natural voice
      const voices = speechSynthesis.getVoices()
      const preferredVoice = voices.find(v => 
        v.name.includes('Google') || 
        v.name.includes('Microsoft') || 
        v.lang.startsWith('en')
      )
      if (preferredVoice) {
        utterance.voice = preferredVoice
      }
      
      utterance.onend = () => {
        setIsPlaying(false)
        resolve()
      }
      utterance.onerror = () => {
        setIsPlaying(false)
        resolve()
      }
      
      speechSynthesis.speak(utterance)
    })
  }

  // Play audio with AbëVoice API (with browser fallback)
  const playAudio = async (text: string) => {
    setIsPlaying(true)
    try {
      const response = await fetch('http://localhost:5000/api/voice/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text, 
          voice: selectedVoice,
          stability: 0.5,
          similarity_boost: 0.75,
        }),
      })
      
      const data = await response.json()
      
      if (data.success && data.audio_base64) {
        setTtsMode('api')
        const audio = new Audio(`data:audio/mpeg;base64,${data.audio_base64}`)
        audio.volume = volume
        
        return new Promise<void>((resolve) => {
          audio.onended = () => {
            setIsPlaying(false)
            resolve()
          }
          audio.onerror = () => {
            // Fallback to browser TTS on error
            console.log('AbëVoice failed, using browser TTS fallback')
            setTtsMode('browser')
            playBrowserTTS(text).then(resolve)
          }
          audio.play().catch(() => {
            // Fallback to browser TTS
            console.log('AbëVoice playback failed, using browser TTS fallback')
            setTtsMode('browser')
            playBrowserTTS(text).then(resolve)
          })
        })
      } else {
        // API didn't return audio, use fallback
        console.log('AbëVoice API unavailable, using browser TTS fallback')
        setTtsMode('browser')
        await playBrowserTTS(text)
      }
    } catch (error) {
      console.error('Audio API error, using fallback:', error)
      setTtsMode('browser')
      // Fallback to browser TTS
      await playBrowserTTS(text)
    }
  }

  // Start call
  const startCall = async () => {
    setIsCallActive(true)
    setMessages([])
    setError(null)
    
    // Initial greeting
    const greeting = "Thank you for calling North Shore Voice! I'm your AI assistant powered by advanced voice technology. How can I help you today?"
    
    setMessages([{
      id: 1,
      speaker: 'ai',
      text: greeting,
      timestamp: new Date(),
    }])
    
    // Play greeting
    if (!isMuted) {
      await playAudio(greeting)
    }
    
    // Enable mic after greeting
    enableMicrophone()
  }

  // Enable microphone
  const enableMicrophone = async () => {
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true })
      setMicPermission('granted')
      
      // Initialize and start recognition
      const recognition = initSpeechRecognition()
      if (recognition) {
        recognitionRef.current = recognition
        recognition.start()
        setIsMicEnabled(true)
      }
    } catch (err) {
      console.error('Microphone error:', err)
      setMicPermission('denied')
      setError('Could not access microphone. Please check your browser permissions.')
    }
  }

  // Toggle microphone
  const toggleMicrophone = () => {
    if (isMicEnabled) {
      // Disable
      if (recognitionRef.current) {
        recognitionRef.current.stop()
        recognitionRef.current = null
      }
      setIsMicEnabled(false)
      setIsListening(false)
      setInterimTranscript('')
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current)
      }
    } else {
      // Enable
      enableMicrophone()
    }
  }

  // End call
  const endCall = () => {
    // Stop recognition
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    
    // Clear timers
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
    }
    
    // Reset state
    setIsCallActive(false)
    setIsMicEnabled(false)
    setIsListening(false)
    setMessages([])
    setInterimTranscript('')
    setIsPlaying(false)
    setIsProcessing(false)
    currentTranscriptRef.current = ''
  }

  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full filter blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full filter blur-[128px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-slate-900/50 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary-400" />
            <span className="text-white font-semibold">Live Voice Demo</span>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="relative z-20 border-b border-white/10 bg-slate-800/80 backdrop-blur-xl"
          >
            <div className="max-w-4xl mx-auto px-4 py-4">
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-white/60 text-sm mb-2">Silence Timeout</label>
                  <select
                    value={silenceTimeout}
                    onChange={(e) => setSilenceTimeout(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary-500"
                  >
                    <option value={2000}>2 seconds</option>
                    <option value={3000}>3 seconds</option>
                    <option value={4000}>4 seconds</option>
                    <option value={5000}>5 seconds</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-2">AI Voice</label>
                  <select
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary-500"
                  >
                    <option value="abe">Abë (Professional)</option>
                    <option value="luna">Luna (Friendly)</option>
                    <option value="marcus">Marcus (Professional)</option>
                    <option value="evelyn">Evelyn (Warm)</option>
                    <option value="jasper">Jasper (Casual)</option>
                    <option value="zephyr">Zephyr (Energetic)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-2">Volume</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="relative z-10 max-w-2xl mx-auto px-4 py-8">
        {/* Error Banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-4 bg-error/10 border border-error/30 rounded-xl flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-error font-medium">Error</p>
                <p className="text-error/80 text-sm">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-error/60 hover:text-error"
              >
                ×
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phone Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* Call Status Bar */}
          <div className={`px-6 py-4 flex items-center justify-between transition-colors ${
            isCallActive 
              ? 'bg-gradient-to-r from-success/20 to-emerald-500/20 border-b border-success/20' 
              : 'bg-white/5 border-b border-white/10'
          }`}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                isCallActive ? 'bg-success/20' : 'bg-white/10'
              }`}>
                <Phone className={`w-6 h-6 ${isCallActive ? 'text-success' : 'text-white/60'}`} />
              </div>
              <div>
                <p className="text-white font-semibold">
                  {isCallActive ? 'Call in Progress' : 'North Shore Voice Demo'}
                </p>
                <div className="flex items-center gap-3 text-sm">
                  {isCallActive ? (
                    <>
                      <span className="text-success font-mono">{formatDuration(callDuration)}</span>
                      {isListening && (
                        <span className="flex items-center gap-1 text-primary-400">
                          <span className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
                          Listening
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-white/50">Click to start a demo call</span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Status Indicators */}
            {isCallActive && (
              <div className="flex items-center gap-2 flex-wrap justify-end">
                {ttsMode && (
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${
                    ttsMode === 'api' ? 'bg-emerald-500/20' : 'bg-amber-500/20'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      ttsMode === 'api' ? 'bg-emerald-400' : 'bg-amber-400'
                    }`} />
                    <span className={`text-xs font-medium ${
                      ttsMode === 'api' ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {ttsMode === 'api' ? 'AbëVoice' : 'Browser TTS'}
                    </span>
                  </div>
                )}
                {isProcessing && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-500/20 rounded-full">
                    <Loader2 className="w-4 h-4 text-primary-400 animate-spin" />
                    <span className="text-primary-400 text-xs font-medium">Processing</span>
                  </div>
                )}
                {isPlaying && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/20 rounded-full">
                    <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <span className="text-cyan-400 text-xs font-medium">Speaking</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Messages Area */}
          <div className="h-[400px] overflow-y-auto p-6 space-y-4">
            {!isCallActive ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-500/20 to-cyan-500/20 rounded-3xl flex items-center justify-center mb-6">
                  <Mic className="w-12 h-12 text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Voice-Enabled Demo</h3>
                <p className="text-white/50 max-w-sm mb-6">
                  Experience real AI voice conversations. Speak naturally and our AI will respond with human-like voice.
                </p>
                <div className="flex flex-wrap justify-center gap-2 text-xs">
                  {micPermission === 'granted' && (
                    <span className="flex items-center gap-1 px-3 py-1.5 bg-success/10 text-success rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> Microphone Ready
                    </span>
                  )}
                  {micPermission === 'denied' && (
                    <span className="flex items-center gap-1 px-3 py-1.5 bg-error/10 text-error rounded-full">
                      <AlertCircle className="w-3 h-3" /> Microphone Blocked
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${message.speaker === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      message.speaker === 'ai' 
                        ? 'bg-gradient-to-br from-primary-500 to-cyan-500' 
                        : 'bg-white/10'
                    }`}>
                      {message.speaker === 'ai' ? (
                        <Sparkles className="w-5 h-5 text-white" />
                      ) : (
                        <span className="text-white/70 text-sm font-medium">You</span>
                      )}
                    </div>
                    <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                      message.speaker === 'ai' 
                        ? 'bg-slate-700/50 rounded-tl-sm' 
                        : 'bg-primary-500/20 rounded-tr-sm'
                    }`}>
                      <p className="text-white/90 text-sm leading-relaxed">{message.text}</p>
                      <p className="text-white/30 text-xs mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </motion.div>
                ))}
                
                {/* Interim transcript (what user is currently saying) */}
                {interimTranscript && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3 flex-row-reverse"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                      <Waves className="w-5 h-5 text-primary-400 animate-pulse" />
                    </div>
                    <div className="max-w-[75%] rounded-2xl rounded-tr-sm px-4 py-3 bg-primary-500/10 border border-primary-500/30">
                      <p className="text-white/70 text-sm italic">{interimTranscript}</p>
                      <p className="text-primary-400/60 text-xs mt-1 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-pulse" />
                        Listening...
                      </p>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Controls */}
          <div className="p-6 bg-slate-900/50 border-t border-white/10">
            {isCallActive ? (
              <div className="flex items-center justify-center gap-4">
                {/* Mute/Unmute Audio */}
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-4 rounded-2xl transition-all ${
                    isMuted 
                      ? 'bg-warning/20 text-warning hover:bg-warning/30' 
                      : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                  }`}
                  title={isMuted ? 'Unmute AI Voice' : 'Mute AI Voice'}
                >
                  {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                </button>

                {/* Mic Toggle */}
                <button
                  onClick={toggleMicrophone}
                  className={`p-5 rounded-2xl transition-all ${
                    isMicEnabled 
                      ? isListening
                        ? 'bg-success text-white shadow-lg shadow-success/30 scale-110'
                        : 'bg-success/80 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                  title={isMicEnabled ? 'Disable Microphone' : 'Enable Microphone'}
                >
                  {isMicEnabled ? (
                    <Mic className={`w-7 h-7 ${isListening ? 'animate-pulse' : ''}`} />
                  ) : (
                    <MicOff className="w-7 h-7" />
                  )}
                </button>

                {/* End Call */}
                <button
                  onClick={endCall}
                  className="p-4 bg-error hover:bg-error/80 rounded-2xl text-white shadow-lg shadow-error/30 transition-all hover:scale-105"
                  title="End Call"
                >
                  <PhoneOff className="w-6 h-6" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={startCall}
                  className="w-20 h-20 bg-gradient-to-br from-success to-emerald-600 hover:from-success/90 hover:to-emerald-600/90 rounded-full flex items-center justify-center text-white shadow-2xl shadow-success/40 transition-all hover:scale-105"
                >
                  <Phone className="w-9 h-9" />
                </button>
                <p className="text-white/50 text-sm">Tap to start call</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <p className="text-white/40 text-sm mb-4">
            🎤 Speak naturally after enabling the microphone. The AI will respond after {silenceTimeout / 1000} seconds of silence.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {['Schedule appointment', 'Pricing info', 'Business hours', 'Get help'].map((suggestion) => (
              <span
                key={suggestion}
                className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-white/50 text-xs"
              >
                "{suggestion}"
              </span>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  )
}
