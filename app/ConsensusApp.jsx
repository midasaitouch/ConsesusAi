'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

// ─── Data ─────────────────────────────────────────────────
const CATEGORIES = {
  Cozinha: {
    icon: '🍳', color: '#f97316',
    products: ['Frigorífico','Placa de indução','Forno','Micro-ondas','Máquina lava-loiça','Robot de cozinha','Cafeteira','Exaustor'],
  },
  Sala: {
    icon: '📺', color: '#6366f1',
    products: ['Televisão','Barra de som','Videoprojetor','Aspirador robot','Coluna de som','Ar condicionado'],
  },
  Quarto: {
    icon: '🛏️', color: '#22d3ee',
    products: ['Colchão','Ar condicionado','Purificador de ar','Desumidificador','Ventoinha'],
  },
  'Casa de banho': {
    icon: '🚿', color: '#4ade80',
    products: ['Máquina de lavar roupa','Secadora','Epilador','Escova de dentes eléctrica','Balança inteligente'],
  },
}

const STEPS = [
  { t: 'A pesquisar produtos no mercado...', i: '🔍' },
  { t: 'A analisar características técnicas...', i: '⚙️' },
  { t: 'A consultar múltiplas IA...', i: '🤖' },
  { t: 'A comparar preços e avaliações...', i: '🔗' },
  { t: 'A calcular pontuações finais...', i: '📊' },
]

const BADGE_COLORS = {
  'Melhor Escolha':     '#22d3ee',
  'Melhor Preço':       '#4ade80',
  'Melhor Desempenho':  '#f97316',
  'Equilíbrio Perfeito':'#818cf8',
  'Escolha Premium':    '#e879f9',
  'Boa Escolha':        '#94a3b8',
}

// ─── Score Ring ────────────────────────────────────────────
function ScoreRing({ score }) {
  const r = 28, circ = 2 * Math.PI * r, dash = (score / 20) * circ
  const color = score >= 18 ? '#22d3ee' : score >= 16 ? '#818cf8' : '#f97316'
  return (
    <div style={{ position: 'relative', width: 72, height: 72, flexShrink: 0 }}>
      <svg width="72" height="72">
        <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="5" />
        <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transformOrigin: 'center', transform: 'rotate(-90deg)', filter: `drop-shadow(0 0 6px ${color})` }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 16, fontWeight: 800, color, lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: 9, color: 'rgba(255,255,255,.4)', lineHeight: 1 }}>/20</span>
      </div>
    </div>
  )
}

// ─── Product Card ──────────────────────────────────────────
function ProductCard({ p, index }) {
  const [open, setOpen] = useState(false)
  const bc = BADGE_COLORS[p.badge] || '#6366f1'
  const isTop = index === 0
  return (
    <div onClick={() => setOpen(o => !o)} style={{
      background: isTop ? 'linear-gradient(135deg,rgba(34,211,238,.08),rgba(99,102,241,.06))' : 'rgba(255,255,255,.03)',
      border: `1px solid ${isTop ? 'rgba(34,211,238,.25)' : 'rgba(255,255,255,.07)'}`,
      borderRadius: 16, padding: '18px 20px', cursor: 'pointer',
      marginBottom: 12, backdropFilter: 'blur(10px)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0, background: 'rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: 'rgba(255,255,255,.3)' }}>
          #{p.rank}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', letterSpacing: '-.01em', lineHeight: 1.3 }}>{p.name}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: bc, background: `${bc}18`, border: `1px solid ${bc}40`, padding: '2px 8px', borderRadius: 20, whiteSpace: 'nowrap' }}>{p.badge}</span>
          </div>
          <div style={{ fontSize: 12, color: '#22d3ee', marginTop: 2, fontWeight: 600 }}>~{Number(p.avgPrice).toLocaleString('pt-PT')}€</div>
        </div>
        <ScoreRing score={p.score} />
      </div>
      {open && (
        <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,.06)' }}>
          {p.bestFor && <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 14, lineHeight: 1.6 }}><span style={{ color: '#22d3ee', fontWeight: 600 }}>✦ </span>{p.bestFor}</p>}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#4ade80', letterSpacing: '.08em', marginBottom: 8 }}>VANTAGENS</div>
              {p.pros.map((x, i) => <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 5 }}><span style={{ color: '#4ade80', flexShrink: 0, fontSize: 11 }}>+</span><span style={{ fontSize: 11, color: '#cbd5e1', lineHeight: 1.4 }}>{x}</span></div>)}
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#f87171', letterSpacing: '.08em', marginBottom: 8 }}>PONTOS FRACOS</div>
              {p.cons.map((x, i) => <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 5 }}><span style={{ color: '#f87171', flexShrink: 0, fontSize: 11 }}>−</span><span style={{ fontSize: 11, color: '#cbd5e1', lineHeight: 1.4 }}>{x}</span></div>)}
            </div>
          </div>
        </div>
      )}
      <div style={{ marginTop: 10, fontSize: 10, color: 'rgba(255,255,255,.2)', textAlign: 'right' }}>{open ? '▲ fechar' : '▼ ver detalhes'}</div>
    </div>
  )
}

// ─── Loading ───────────────────────────────────────────────
function LoadingScreen() {
  const [step, setStep] = useState(0)
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const t = setInterval(() => {
      setStep(s => Math.min(s + 1, STEPS.length - 1))
      setProgress(p => Math.min(p + 100 / STEPS.length, 95))
    }, 1300)
    return () => clearInterval(t)
  }, [])
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', padding: 32 }}>
      <div style={{ position: 'relative', width: 120, height: 120, marginBottom: 40 }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid rgba(99,102,241,.2)', animation: 'spin 3s linear infinite' }} />
        <div style={{ position: 'absolute', inset: 10, borderRadius: '50%', border: '2px solid rgba(34,211,238,.3)', animation: 'spin 2s linear infinite reverse' }} />
        <div style={{ position: 'absolute', inset: 22, borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,.3),rgba(34,211,238,.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, animation: 'pulse 1.5s ease-in-out infinite' }}>
          {STEPS[step].i}
        </div>
      </div>
      <div style={{ fontSize: 14, color: '#94a3b8', height: 22 }}>{STEPS[step].t}</div>
      <div style={{ width: 220, height: 3, background: 'rgba(255,255,255,.06)', borderRadius: 4, overflow: 'hidden', marginTop: 24 }}>
        <div style={{ height: '100%', borderRadius: 4, background: 'linear-gradient(90deg,#6366f1,#22d3ee)', width: `${progress}%`, transition: 'width 1.2s ease', boxShadow: '0 0 8px rgba(34,211,238,.6)' }} />
      </div>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,.2)', marginTop: 12 }}>Gemini 1.5 Flash · Google AI</div>
    </div>
  )
}

// ─── Install Banner ────────────────────────────────────────
function InstallBanner() {
  const [visible, setVisible] = useState(false)
  const promptRef = useRef(null)
  useEffect(() => {
    const fn = e => { e.preventDefault(); promptRef.current = e; if (!localStorage.getItem('cai-install')) setTimeout(() => setVisible(true), 5000) }
    window.addEventListener('beforeinstallprompt', fn)
    return () => window.removeEventListener('beforeinstallprompt', fn)
  }, [])
  if (!visible) return null
  return (
    <div style={{ position: 'fixed', bottom: 'calc(20px + env(safe-area-inset-bottom,0px))', left: '50%', transform: 'translateX(-50%)', width: 'calc(100% - 40px)', maxWidth: 400, background: 'rgba(15,23,42,.96)', border: '1px solid rgba(99,102,241,.3)', borderRadius: 16, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, backdropFilter: 'blur(20px)', boxShadow: '0 8px 32px rgba(0,0,0,.4)', zIndex: 100 }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, background: 'linear-gradient(135deg,#6366f1,#22d3ee)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>✦</div>
      <div style={{ flex: 1 }}>
        <strong style={{ fontSize: 13, color: '#f1f5f9', display: 'block', marginBottom: 2 }}>Instalar ConsensusAI</strong>
        <span style={{ fontSize: 11, color: '#94a3b8' }}>Adicionar ao ecrã inicial</span>
      </div>
      <button onClick={async () => { if (!promptRef.current) return; promptRef.current.prompt(); await promptRef.current.userChoice; setVisible(false) }} style={{ background: 'linear-gradient(135deg,#6366f1,#22d3ee)', border: 'none', borderRadius: 10, padding: '8px 14px', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Instalar</button>
      <button onClick={() => { setVisible(false); localStorage.setItem('cai-install', '1') }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.3)', fontSize: 20, cursor: 'pointer', lineHeight: 1 }}>×</button>
    </div>
  )
}

// ─── Shared styles ─────────────────────────────────────────
const S = {
  inp: { width: '100%', background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 12, padding: '13px 16px', color: '#f1f5f9', fontSize: 14, fontFamily: 'inherit', outline: 'none' },
  lbl: { display: 'block', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.3)', letterSpacing: '.08em', marginBottom: 8 },
  field: { marginBottom: 20 },
}

// ─── Main App ──────────────────────────────────────────────
export default function ConsensusApp() {
  const [screen, setScreen]     = useState('home')
  const [category, setCategory] = useState(null)
  const [product, setProduct]   = useState('')
  const [results, setResults]   = useState(null)
  const [error, setError]       = useState(null)

  // ✅ FIX: useRef for text inputs — zero re-renders while typing
  const budgetRef = useRef(null)
  const usageRef  = useRef(null)
  const prefsRef  = useRef(null)

  useEffect(() => {
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {})
  }, [])

  const catCfg = category ? CATEGORIES[category] : null

  function getFormValues() {
    return {
      budget: budgetRef.current?.value || '',
      usage:  usageRef.current?.value  || '',
      prefs:  prefsRef.current?.value  || '',
    }
  }

  const canSearch = useCallback(() => {
    const { budget, usage } = getFormValues()
    return !!(category && product && budget && usage)
  }, [category, product])

  async function handleSearch() {
    const { budget, usage, prefs } = getFormValues()
    if (!category || !product || !budget || !usage) return
    setError(null)
    setScreen('loading')
    try {
      const res = await fetch('/api/consensus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, product, budget, usage, preferences: prefs }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || `Erro ${res.status}`)
      setResults(data)
      setScreen('results')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (e) {
      setError(e.message || 'Erro desconhecido. Tente novamente.')
      setScreen('home')
    }
  }

  function handleReset() {
    setScreen('home'); setCategory(null); setProduct('')
    setResults(null); setError(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function selectCategory(name) {
    setCategory(name)
    setProduct('')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#080c14', fontFamily: "'DM Sans',-apple-system,sans-serif", color: '#f1f5f9', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:.8;transform:scale(1)} 50%{opacity:1;transform:scale(1.05)} }
        @keyframes fadeIn{ from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .screen { animation: fadeIn .3s ease; }
        select { -webkit-appearance: none; }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
      `}</style>

      {/* Blobs */}
      <div style={{ position: 'fixed', top: -200, left: -200, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,.13),transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: -150, right: -150, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(34,211,238,.09),transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 440, margin: '0 auto', padding: `0 20px calc(40px + env(safe-area-inset-bottom,0px))` }}>

        {/* ── HOME ── */}
        {screen === 'home' && (
          <div className="screen">
            <div style={{ paddingTop: 48, paddingBottom: 28, textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 8 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#6366f1,#22d3ee)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>✦</div>
                <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-.03em', background: 'linear-gradient(90deg,#e2e8f0,#94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ConsensusAI</span>
              </div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,.35)' }}>Juntos, as IA escolhem melhor.</p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(74,222,128,.08)', border: '1px solid rgba(74,222,128,.2)', borderRadius: 20, padding: '4px 12px', marginTop: 10 }}>
                <span style={{ fontSize: 10 }}>⚡</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#4ade80', letterSpacing: '.05em' }}>GRÁTIS · SEM CONTA · SEM CONFIGURAÇÃO</span>
              </div>
            </div>

            {error && (
              <div style={{ background: 'rgba(248,113,113,.1)', border: '1px solid rgba(248,113,113,.3)', borderRadius: 12, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#f87171', lineHeight: 1.5 }}>
                ⚠️ {error}
              </div>
            )}

            {/* Category */}
            <div style={S.field}>
              <label style={S.lbl}>CATEGORIA</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {Object.entries(CATEGORIES).map(([name, cfg]) => (
                  <button key={name} onClick={() => selectCategory(name)} style={{
                    background: category === name ? `${cfg.color}18` : 'rgba(255,255,255,.03)',
                    border: `1.5px solid ${category === name ? cfg.color + '70' : 'rgba(255,255,255,.07)'}`,
                    borderRadius: 12, padding: '13px 14px', cursor: 'pointer',
                    color: category === name ? cfg.color : 'rgba(255,255,255,.4)',
                    fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
                    display: 'flex', alignItems: 'center', gap: 8, transition: 'all .2s',
                  }}>
                    <span style={{ fontSize: 16 }}>{cfg.icon}</span>{name}
                  </button>
                ))}
              </div>
            </div>

            {/* Product */}
            {catCfg && (
              <div style={{ ...S.field }}>
                <label style={S.lbl}>PRODUTO</label>
                <select value={product} onChange={e => setProduct(e.target.value)} style={{
                  ...S.inp,
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none'%3E%3Cpath d='M1 1l5 5 5-5' stroke='rgba(255,255,255,0.3)' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center', paddingRight: 36,
                }}>
                  <option value="">Seleccione um produto…</option>
                  {catCfg.products.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            )}

            {/* ✅ FIX: uncontrolled inputs with ref — no re-render on each keystroke */}
            <div style={S.field}>
              <label style={S.lbl}>ORÇAMENTO (€)</label>
              <input ref={budgetRef} type="number" inputMode="numeric" placeholder="ex: 700" defaultValue="" style={S.inp} />
            </div>

            <div style={S.field}>
              <label style={S.lbl}>UTILIZAÇÃO PRINCIPAL</label>
              <input ref={usageRef} type="text" placeholder="ex: Netflix + PS5, família de 4 pessoas…" defaultValue="" style={S.inp} />
            </div>

            <div style={{ ...S.field, marginBottom: 28 }}>
              <label style={S.lbl}>PREFERÊNCIAS OPCIONAIS</label>
              <input ref={prefsRef} type="text" placeholder="ex: marca, tamanho, cor, eficiência energética…" defaultValue="" style={S.inp} />
            </div>

            <button onClick={handleSearch} style={{
              width: '100%', padding: 16, borderRadius: 14, border: 'none',
              fontSize: 15, fontWeight: 700, letterSpacing: '-.01em', fontFamily: 'inherit',
              cursor: 'pointer',
              background: 'linear-gradient(135deg,#6366f1,#22d3ee)',
              color: '#fff', boxShadow: '0 0 30px rgba(99,102,241,.35)',
              transition: 'opacity .2s',
            }}>
              Encontrar a melhor escolha ✦
            </button>

            <div style={{ marginTop: 20, padding: '14px 16px', background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.05)', borderRadius: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,.2)', letterSpacing: '.06em' }}>MOTOR DE IA</span>
                <span style={{ fontSize: 10, color: '#4ade80', fontWeight: 700 }}>⚡ 1500 pesquisas/dia grátis</span>
              </div>
              <span style={{ fontSize: 11, color: '#4ade80', background: 'rgba(74,222,128,.08)', border: '1px solid rgba(74,222,128,.2)', padding: '4px 12px', borderRadius: 20, fontWeight: 700 }}>Gemini 1.5 Flash</span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,.3)', marginLeft: 8 }}>by Google</span>
            </div>
          </div>
        )}

        {/* ── LOADING ── */}
        {screen === 'loading' && <LoadingScreen />}

        {/* ── RESULTS ── */}
        {screen === 'results' && results && (
          <div className="screen">
            <div style={{ paddingTop: 40, paddingBottom: 20 }}>
              <button onClick={handleReset} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,.35)', fontSize: 13, padding: '0 0 16px', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit' }}>← nova pesquisa</button>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 9, background: 'linear-gradient(135deg,#6366f1,#22d3ee)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>✦</div>
                  <span style={{ fontSize: 18, fontWeight: 900, letterSpacing: '-.03em', background: 'linear-gradient(90deg,#e2e8f0,#94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ConsensusAI</span>
                </div>
                <span style={{ fontSize: 10, color: '#4ade80', background: 'rgba(74,222,128,.08)', border: '1px solid rgba(74,222,128,.2)', padding: '3px 8px', borderRadius: 20, fontWeight: 600 }}>⚡ Gemini</span>
              </div>
            </div>

            <div style={{ background: 'linear-gradient(135deg,rgba(99,102,241,.1),rgba(34,211,238,.06))', border: '1px solid rgba(34,211,238,.2)', borderRadius: 14, padding: '14px 18px', marginBottom: 24 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#22d3ee', letterSpacing: '.08em', marginBottom: 6 }}>✦ CONSENSO DAS IA</div>
              <p style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.6 }}>{results.consensusNote}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
              <div style={{ background: 'rgba(34,211,238,.06)', border: '1px solid rgba(34,211,238,.15)', borderRadius: 12, padding: '12px 14px' }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: '#22d3ee', letterSpacing: '.08em', marginBottom: 4 }}>🏆 MELHOR ESCOLHA</div>
                <div style={{ fontSize: 11, color: '#e2e8f0', fontWeight: 600, lineHeight: 1.4 }}>{results.topPick}</div>
              </div>
              <div style={{ background: 'rgba(74,222,128,.06)', border: '1px solid rgba(74,222,128,.15)', borderRadius: 12, padding: '12px 14px' }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: '#4ade80', letterSpacing: '.08em', marginBottom: 4 }}>💰 MELHOR PREÇO</div>
                <div style={{ fontSize: 11, color: '#e2e8f0', fontWeight: 600, lineHeight: 1.4 }}>{results.budgetPick}</div>
              </div>
            </div>

            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.3)', letterSpacing: '.08em', marginBottom: 16 }}>TOP 5 PRODUTOS</div>
            {results.products.map((p, i) => <ProductCard key={i} p={p} index={i} />)}

            <div style={{ marginTop: 24, textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,.2)', lineHeight: 1.6 }}>
              Gerado por Gemini 1.5 Flash · Verifique os preços antes de comprar.
            </div>
            <button onClick={handleReset} style={{ width: '100%', marginTop: 20, padding: 14, background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 12, color: 'rgba(255,255,255,.35)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
              Nova pesquisa
            </button>
          </div>
        )}
      </div>
      <InstallBanner />
    </div>
  )
}
