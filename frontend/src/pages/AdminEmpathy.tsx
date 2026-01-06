import React, { useEffect, useState } from 'react'
import { getEmpathyConfig, saveEmpathyConfig, testAbeKeys } from '../services/admin'

export default function AdminEmpathy() {
  const [config, setConfig] = useState<any>({
    friendliness: 50,
    empathy: 50,
    warmth: 50,
    professionalism: 50,
    context_window: 'medium',
  })
  const [status, setStatus] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    getEmpathyConfig().then((r) => {
      if (mounted && r && r.config) setConfig(r.config)
    })
    return () => {
      mounted = false
    }
  }, [])

  const onSave = async () => {
    setLoading(true)
    await saveEmpathyConfig('default', config)
    setLoading(false)
    alert('Saved')
  }

  const onTest = async () => {
    setLoading(true)
    const r = await testAbeKeys('default')
    setStatus(r)
    if (r && r.sample_base64) {
      const blob = new Blob([Uint8Array.from(atob(r.sample_base64), (c) => c.charCodeAt(0))], { type: 'audio/mpeg' })
      const url = URL.createObjectURL(blob)
      const a = new Audio(url)
      await a.play()
    }
    setLoading(false)
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Empathy Controls (Admin)</h2>
      <div style={{ maxWidth: 600 }}>
        <label>Friendliness: {config.friendliness}</label>
        <input type="range" min={0} max={100} value={config.friendliness} onChange={(e) => setConfig({ ...config, friendliness: Number(e.target.value) })} />

        <label>Empathy: {config.empathy}</label>
        <input type="range" min={0} max={100} value={config.empathy} onChange={(e) => setConfig({ ...config, empathy: Number(e.target.value) })} />

        <label>Warmth: {config.warmth}</label>
        <input type="range" min={0} max={100} value={config.warmth} onChange={(e) => setConfig({ ...config, warmth: Number(e.target.value) })} />

        <label>Professionalism: {config.professionalism}</label>
        <input type="range" min={0} max={100} value={config.professionalism} onChange={(e) => setConfig({ ...config, professionalism: Number(e.target.value) })} />

        <label>Context window</label>
        <select value={config.context_window} onChange={(e) => setConfig({ ...config, context_window: e.target.value })}>
          <option value="short">short</option>
          <option value="medium">medium</option>
          <option value="long">long</option>
        </select>

        <div style={{ marginTop: 10 }}>
          <button onClick={onSave} disabled={loading}>Save</button>
          <button onClick={onTest} style={{ marginLeft: 8 }} disabled={loading}>Test</button>
        </div>

        {status && (
          <pre style={{ background: '#f6f6f6', padding: 8 }}>{JSON.stringify(status, null, 2)}</pre>
        )}
      </div>
    </div>
  )
}
