"use client"

import { useState } from "react"
import Link from "next/link"
import { predictMOQ, predictSuccess, type MOQOutput, type SuccessOutput } from "@/lib/ai-client"

const CATEGORIES = [
  "Technology", "Design", "Games", "Film & Video", "Music",
  "Publishing", "Art", "Food", "Fashion", "Theater", "Comics",
]

const PROJECTS = [
  { id: "NB-7741", name: "Neo65 Aluminum Kit",  moq: 100, progress: 78,  aiScore: 92, deadline: "15 Jul" },
  { id: "NB-1109", name: "GMK Eclipse Keycaps", moq: 250, progress: 189, aiScore: 85, deadline: "30 Jun" },
  { id: "NB-5561", name: "Resin Oni Artisan",   moq: 50,  progress: 47,  aiScore: 96, deadline: "10 Jun" },
]

const STATS = [
  { label: "PROYEK AKTIF",    value: "3",    delta: "+1",   color: "text-primary",       bar: "bg-primary w-3/4" },
  { label: "TOTAL PESERTA",   value: "314",  delta: "+22%", color: "text-secondary",     bar: "bg-secondary w-2/3" },
  { label: "FILL RATE",       value: "84%",  delta: "+5%",  color: "text-neon-cyan",     bar: "bg-neon-cyan w-4/5" },
  { label: "AVG TRUST SCORE", value: "4.8",  delta: "↑",    color: "text-success-green", bar: "bg-success-green w-5/6" },
]

const CONFIDENCE_CONFIG = {
  high:   { label: "TINGGI",  color: "text-success-green", border: "border-success-green/30", bg: "bg-success-green/10" },
  medium: { label: "SEDANG",  color: "text-primary",       border: "border-primary/30",       bg: "bg-primary/10" },
  low:    { label: "RENDAH",  color: "text-error",         border: "border-error/30",         bg: "bg-error/10" },
}

const RISK_CONFIG = {
  low:    { label: "RISIKO RENDAH",   color: "text-success-green", bg: "bg-success-green/10", border: "border-success-green/30", icon: "verified" },
  medium: { label: "RISIKO SEDANG",   color: "text-warning",       bg: "bg-warning/10",        border: "border-warning/30",       icon: "warning" },
  high:   { label: "RISIKO TINGGI",   color: "text-error",         bg: "bg-error/10",          border: "border-error/30",         icon: "dangerous" },
}

export default function CreatorDashboardPage() {
  const [form, setForm] = useState({
    goal_usd:      "",
    main_category: "Technology",
    country:       "US",
    duration_days: "30",
  })

  const [moqResult,     setMoqResult]     = useState<MOQOutput | null>(null)
  const [successResult, setSuccessResult] = useState<SuccessOutput | null>(null)
  const [loading,       setLoading]       = useState(false)
  const [error,         setError]         = useState<string | null>(null)

  const handleCalculate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMoqResult(null)
    setSuccessResult(null)

    const goalUsd     = parseFloat(form.goal_usd) || 1000
    const durationDay = parseInt(form.duration_days) || 30

    try {
      const [moq, success] = await Promise.all([
        predictMOQ({
          goal_usd:      goalUsd,
          main_category: form.main_category,
          country:       form.country,
          duration_days: durationDay,
        }),
        predictSuccess({
          goal:          goalUsd,
          category:      form.main_category,
          country:       form.country,
          duration_days: durationDay,
        }),
      ])
      setMoqResult(moq)
      setSuccessResult(success)
    } catch {
      setError("AI Engine tidak tersedia. Pastikan server berjalan di localhost:8000.")
    } finally {
      setLoading(false)
    }
  }

  const conf = moqResult ? CONFIDENCE_CONFIG[moqResult.confidence] : null
  const risk = successResult ? RISK_CONFIG[successResult.risk_level] : null

  return (
    <div className="bg-deep-void text-on-surface font-body-md min-h-screen flex flex-col">

      {/* Navbar */}
      <nav className="bg-deep-void/80 backdrop-blur-xl border-b border-surface-stroke sticky top-0 z-50 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
        <div className="flex justify-between items-center w-full max-w-container-max mx-auto px-margin-desktop h-20">
          <div className="font-headline-sm text-headline-sm tracking-tighter text-primary uppercase">Nexbuy</div>
          <div className="hidden md:flex items-center gap-stack-lg">
            <Link href="/"  className="font-headline-sm text-headline-sm text-on-surface-variant hover:text-primary transition-all">Beranda</Link>
            <Link href="/"  className="font-headline-sm text-headline-sm text-on-surface-variant hover:text-primary transition-all">Produk</Link>
            <a href="#"     className="font-headline-sm text-headline-sm text-primary font-bold border-b-2 border-primary pb-1">Dashboard</a>
          </div>
          <div className="flex items-center gap-stack-md">
            <div className="relative">
              <span className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer">notifications</span>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
            </div>
            <Link href="/login" className="flex items-center gap-2 px-4 py-2 border border-surface-stroke hover:border-primary font-label-mono text-label-mono text-on-surface-variant hover:text-primary transition-all">
              <span className="material-symbols-outlined text-[18px]">logout</span>
              KELUAR
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-container-max mx-auto px-margin-desktop py-stack-lg w-full">

        {/* Header */}
        <header className="mb-section-gap">
          <span className="font-label-mono text-label-mono text-primary uppercase tracking-widest">CREATOR INTERFACE v1.0</span>
          <h1 className="font-display-lg text-headline-md md:text-display-lg text-on-surface uppercase mt-stack-sm">
            Command Center
          </h1>
        </header>

        {/* Stats */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-section-gap">
          {STATS.map(({ label, value, delta, color, bar }) => (
            <div key={label} className="glass-panel p-stack-md rounded-lg flex flex-col gap-stack-sm hover:border-primary transition-colors duration-500">
              <span className="font-label-mono text-label-mono text-on-surface-variant uppercase">{label}</span>
              <div className="flex items-baseline gap-2">
                <span className={`font-headline-md text-headline-md ${color}`}>{value}</span>
                <span className="font-label-mono text-label-mono text-success-green">{delta}</span>
              </div>
              <div className="w-full h-1 bg-surface-stroke overflow-hidden rounded-full">
                <div className={`h-full ${bar}`} />
              </div>
            </div>
          ))}
        </section>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter mb-section-gap">

          {/* AI Input Form */}
          <div className="lg:col-span-2 flex flex-col gap-stack-md">
            <div className="flex items-center gap-stack-md mb-2">
              <div className="w-10 h-10 bg-secondary-container/20 border border-secondary-container/40 flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary">psychology</span>
              </div>
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface uppercase">AI Project Analyzer</h2>
                <p className="font-label-mono text-label-mono text-secondary">MOQ RECOMMENDATION + SUCCESS PREDICTION</p>
              </div>
            </div>

            <div className="glass-panel rounded-lg p-stack-lg">
              <form onSubmit={handleCalculate} className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
                {/* Goal */}
                <div className="flex flex-col gap-2">
                  <label className="font-label-mono text-label-mono text-on-surface-variant uppercase">Target Dana (USD)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-label-mono text-label-mono text-outline">$</span>
                    <input
                      type="number" min="1" placeholder="5000"
                      value={form.goal_usd}
                      onChange={(e) => setForm(f => ({ ...f, goal_usd: e.target.value }))}
                      className="w-full bg-deep-void border border-surface-stroke pl-7 pr-4 py-3 text-on-surface font-body-md focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                {/* Durasi */}
                <div className="flex flex-col gap-2">
                  <label className="font-label-mono text-label-mono text-on-surface-variant uppercase">Durasi (Hari)</label>
                  <input
                    type="number" min="1" max="90" placeholder="30"
                    value={form.duration_days}
                    onChange={(e) => setForm(f => ({ ...f, duration_days: e.target.value }))}
                    className="w-full bg-deep-void border border-surface-stroke px-4 py-3 text-on-surface font-body-md focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                {/* Kategori */}
                <div className="flex flex-col gap-2">
                  <label className="font-label-mono text-label-mono text-on-surface-variant uppercase">Kategori</label>
                  <select
                    value={form.main_category}
                    onChange={(e) => setForm(f => ({ ...f, main_category: e.target.value }))}
                    className="w-full bg-deep-void border border-surface-stroke px-4 py-3 text-on-surface font-body-md focus:outline-none focus:border-primary transition-colors"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Negara */}
                <div className="flex flex-col gap-2">
                  <label className="font-label-mono text-label-mono text-on-surface-variant uppercase">Negara</label>
                  <select
                    value={form.country}
                    onChange={(e) => setForm(f => ({ ...f, country: e.target.value }))}
                    className="w-full bg-deep-void border border-surface-stroke px-4 py-3 text-on-surface font-body-md focus:outline-none focus:border-primary transition-colors"
                  >
                    {[["US","Amerika Serikat"],["ID","Indonesia"],["GB","Inggris"],["JP","Jepang"],["CA","Kanada"],["AU","Australia"],["SG","Singapura"],["DE","Jerman"]].map(([v,l]) => (
                      <option key={v} value={v}>{l} ({v})</option>
                    ))}
                  </select>
                </div>

                {/* Submit */}
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-secondary-container text-on-secondary-container font-headline-sm text-headline-sm py-4 hover:bg-secondary transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <><span className="material-symbols-outlined animate-spin">autorenew</span>MENGANALISIS...</>
                    ) : (
                      <><span className="material-symbols-outlined">auto_awesome</span>ANALISIS DENGAN AI</>
                    )}
                  </button>
                </div>
              </form>

              {/* Error */}
              {error && (
                <div className="mt-stack-md p-stack-md bg-error-container/20 border border-error/30 rounded flex items-start gap-3">
                  <span className="material-symbols-outlined text-error">warning</span>
                  <p className="font-body-md text-body-md text-error">{error}</p>
                </div>
              )}

              {/* Results */}
              {(moqResult || successResult) && (
                <div className="mt-stack-lg border-t border-surface-stroke pt-stack-lg space-y-stack-lg">

                  {/* ── Success Prediction Result ── */}
                  {successResult && risk && (
                    <div>
                      <div className="flex items-center gap-2 mb-stack-md">
                        <span className="material-symbols-outlined text-neon-cyan fill-icon">insights</span>
                        <span className="font-label-mono text-label-mono text-neon-cyan uppercase tracking-widest">Success Prediction</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
                        {/* Probability */}
                        <div className="bg-deep-void border border-neon-cyan/30 p-stack-md rounded-lg">
                          <p className="font-label-mono text-label-mono text-on-surface-variant uppercase mb-2">Probabilitas Keberhasilan</p>
                          <div className="flex items-end gap-2 mb-3">
                            <span className="font-display-lg text-headline-md text-neon-cyan">{successResult.probability.toFixed(1)}%</span>
                          </div>
                          {/* Progress bar */}
                          <div className="h-2 w-full bg-surface-stroke rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{
                                width: `${successResult.probability}%`,
                                background: successResult.probability >= 70
                                  ? "linear-gradient(90deg, #10B981, #22D3EE)"
                                  : successResult.probability >= 40
                                  ? "linear-gradient(90deg, #F59E0B, #adc6ff)"
                                  : "linear-gradient(90deg, #ffb4ab, #F59E0B)",
                              }}
                            />
                          </div>
                          <p className="font-label-mono text-[10px] text-on-surface-variant mt-1">
                            {successResult.probability >= 70 ? "Project ini punya peluang sukses yang baik"
                              : successResult.probability >= 40 ? "Peluang moderat — pertimbangkan penyesuaian strategi"
                              : "Peluang rendah — disarankan turunkan target atau MOQ"}
                          </p>
                        </div>

                        {/* Risk Level */}
                        <div className={`bg-deep-void border p-stack-md rounded-lg ${risk.border}`}>
                          <p className="font-label-mono text-label-mono text-on-surface-variant uppercase mb-2">Level Risiko</p>
                          <div className="flex items-center gap-3 mb-3">
                            <span className={`material-symbols-outlined text-3xl fill-icon ${risk.color}`}>{risk.icon}</span>
                            <span className={`font-headline-sm text-headline-sm ${risk.color}`}>{risk.label}</span>
                          </div>
                          <div className={`inline-flex items-center gap-1 px-3 py-1 rounded font-label-mono text-[10px] uppercase ${risk.bg} ${risk.color}`}>
                            <span className="material-symbols-outlined text-[12px]">circle</span>
                            {successResult.risk_level.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── MOQ Recommendation Result ── */}
                  {moqResult && conf && (
                    <div>
                      <div className="flex items-center gap-2 mb-stack-md">
                        <span className="material-symbols-outlined text-secondary fill-icon">auto_awesome</span>
                        <span className="font-label-mono text-label-mono text-secondary uppercase tracking-widest">MOQ Recommendation</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-md mb-stack-md">
                        <div className="bg-deep-void border border-secondary/30 p-stack-md rounded text-center">
                          <p className="font-label-mono text-label-mono text-on-surface-variant uppercase mb-1">Rekomendasi MOQ</p>
                          <p className="font-headline-md text-headline-md text-secondary">{moqResult.recommended_moq}</p>
                          <p className="font-label-mono text-[10px] text-on-surface-variant uppercase">peserta</p>
                        </div>
                        <div className="bg-deep-void border border-surface-stroke p-stack-md rounded text-center">
                          <p className="font-label-mono text-label-mono text-on-surface-variant uppercase mb-1">Range</p>
                          <p className="font-headline-md text-headline-md text-on-surface">{moqResult.moq_range_low} – {moqResult.moq_range_high}</p>
                          <p className="font-label-mono text-[10px] text-on-surface-variant uppercase">peserta</p>
                        </div>
                        <div className={`bg-deep-void border p-stack-md rounded text-center ${conf.border}`}>
                          <p className="font-label-mono text-label-mono text-on-surface-variant uppercase mb-1">Keyakinan AI</p>
                          <p className={`font-headline-md text-headline-md ${conf.color}`}>{conf.label}</p>
                          <p className={`font-label-mono text-[10px] uppercase px-2 py-0.5 rounded inline-block mt-1 ${conf.bg} ${conf.color}`}>
                            {moqResult.confidence.toUpperCase()}
                          </p>
                        </div>
                      </div>

                      <div className="bg-secondary-container/10 border border-secondary-container/30 p-stack-md rounded flex items-start gap-3">
                        <span className="material-symbols-outlined text-secondary mt-0.5">lightbulb</span>
                        <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{moqResult.category_insight}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Projects Sidebar */}
          <div className="flex flex-col gap-stack-md">
            <h2 className="font-headline-sm text-headline-sm text-on-surface uppercase">Proyek Aktif</h2>
            <div className="flex flex-col gap-stack-sm">
              {PROJECTS.map((p) => (
                <div key={p.id} className="glass-panel p-stack-md rounded-lg hover:border-primary transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-body-md text-on-surface font-bold">{p.name}</p>
                      <p className="font-label-mono text-[10px] text-on-surface-variant">{p.id}</p>
                    </div>
                    <span className="font-label-mono text-[10px] bg-success-green/10 text-success-green px-2 py-0.5 rounded border border-success-green/20">
                      AI {p.aiScore}
                    </span>
                  </div>
                  <div className="flex justify-between font-label-mono text-label-mono mb-2">
                    <span className="text-primary">{p.progress}/{p.moq} peserta</span>
                    <span className="text-on-surface-variant">sd {p.deadline}</span>
                  </div>
                  <div className="h-1 w-full progress-track rounded-full overflow-hidden">
                    <div className="h-full progress-fill" style={{ width: `${Math.min((p.progress / p.moq) * 100, 100)}%` }} />
                  </div>
                  <div className="mt-2 text-right">
                    <span className="font-label-mono text-[10px] text-success-green">{Math.round((p.progress / p.moq) * 100)}% terpenuhi</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Info card */}
            <div className="glass-panel p-stack-md rounded-lg border-l-4 border-l-neon-cyan mt-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-neon-cyan text-[18px]">info</span>
                <span className="font-label-mono text-label-mono text-neon-cyan uppercase">Tentang AI</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant text-sm">
                Prediksi menggunakan <strong className="text-primary">Random Forest</strong> & <strong className="text-secondary">Isolation Forest</strong> yang dilatih dari 133K kampanye Kickstarter.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-deep-void border-t border-surface-stroke py-stack-lg mt-auto">
        <div className="max-w-container-max mx-auto px-margin-desktop flex justify-between items-center">
          <span className="font-label-mono text-label-mono text-outline">© 2024 NEXBUY CREATOR PORTAL</span>
          <div className="flex gap-stack-md">
            <a href="#" className="font-label-mono text-label-mono text-outline hover:text-primary transition-colors">Dokumentasi AI</a>
            <a href="#" className="font-label-mono text-label-mono text-outline hover:text-primary transition-colors">Bantuan</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
