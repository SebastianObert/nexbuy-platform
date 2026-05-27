"use client"

import { useState } from "react"
import Link from "next/link"
import ThemeToggle from "@/components/theme-toggle"
import { predictMOQ, predictSuccess, type MOQOutput, type SuccessOutput } from "@/lib/ai-client"

const CATEGORIES = [
  "Technology", "Design", "Games", "Film & Video", "Music",
  "Publishing", "Art", "Food", "Fashion", "Theater", "Comics",
]


const PROJECTS = [
  { id: "NB-7741", name: "Neo65 Aluminum Kit",  category: "Keyboard Kits", price: "Rp 4.2M",  moq: 100, progress: 78,  aiScore: 92, deadline: "15 Jul", status: "Live"    },
  { id: "NB-1109", name: "GMK Eclipse Keycaps", category: "Keycaps",       price: "Rp 850K",  moq: 250, progress: 189, aiScore: 85, deadline: "30 Jun", status: "Live"    },
  { id: "NB-5561", name: "Resin Oni Artisan",   category: "Artisan",       price: "Rp 680K",  moq: 50,  progress: 47,  aiScore: 96, deadline: "10 Jun", status: "Live"    },
  { id: "NB-3302", name: "Teal75 Aluminum",     category: "Keyboard Kits", price: "Rp 6.8M",  moq: 80,  progress: 80,  aiScore: 88, deadline: "—",      status: "Selesai" },
]

const STATS = [
  { label: "Proyek Aktif",    value: "3",    delta: "+1",   color: "var(--nb-primary)"   },
  { label: "Total Peserta",   value: "314",  delta: "+22%", color: "var(--nb-secondary)" },
  { label: "Fill Rate",       value: "84%",  delta: "+5%",  color: "var(--nb-cyan)"      },
  { label: "Avg Trust Score", value: "4.8",  delta: "↑",    color: "var(--nb-green)"     },
]

const CONFIDENCE_CONFIG = {
  high:   { label: "TINGGI", color: "var(--nb-green)"   },
  medium: { label: "SEDANG", color: "var(--nb-primary)" },
  low:    { label: "RENDAH", color: "var(--nb-red)"     },
}

const RISK_CONFIG = {
  low:    { label: "Risiko Rendah", color: "var(--nb-green)",  icon: "✓" },
  medium: { label: "Risiko Sedang", color: "var(--nb-yellow)", icon: "⚠" },
  high:   { label: "Risiko Tinggi", color: "var(--nb-red)",    icon: "✕" },
}

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard/creator", active: true },
]

const EMPTY_FORM = { name: "", category: "Technology", price: "", moq: "", deadline: "", description: "", photo: "" }

export default function CreatorDashboardPage() {
  const [activeTab, setActiveTab] = useState<"kampanye" | "ai">("kampanye")
  const [showForm, setShowForm]   = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [campaignForm, setCampaignForm] = useState(EMPTY_FORM)

  const [form, setForm] = useState({
    goal_usd: "", main_category: "Technology", country: "US", duration_days: "30",
  })
  const [moqResult,     setMoqResult]     = useState<MOQOutput | null>(null)
  const [successResult, setSuccessResult] = useState<SuccessOutput | null>(null)
  const [loading,       setLoading]       = useState(false)
  const [error,         setError]         = useState<string | null>(null)

  const handleCampaignSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitted(true)
    setShowForm(false)
    setCampaignForm(EMPTY_FORM)
  }

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
        predictMOQ({ goal_usd: goalUsd, main_category: form.main_category, country: form.country, duration_days: durationDay }),
        predictSuccess({ goal: goalUsd, category: form.main_category, country: form.country, duration_days: durationDay }),
      ])
      setMoqResult(moq)
      setSuccessResult(success)
    } catch {
      setError("AI Engine tidak tersedia. Pastikan server berjalan di localhost:8000.")
    } finally {
      setLoading(false)
    }
  }

  const conf = moqResult     ? CONFIDENCE_CONFIG[moqResult.confidence]         : null
  const risk = successResult ? RISK_CONFIG[successResult.risk_level] : null

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--nb-bg)", color: "var(--nb-text)" }}>

      {/* ── Navbar ─────────────────────────────────────────────── */}
      <nav className="nb-navbar sticky top-0 z-50">
        <div className="nb-container h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/home" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                style={{ background: "linear-gradient(135deg, var(--nb-primary), var(--nb-secondary))" }}>N</div>
              <span className="font-bold text-base" style={{ color: "var(--nb-text)", fontFamily: "var(--font-display)" }}>NexBuy</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              {NAV_ITEMS.map(n => (
                <Link key={n.label} href={n.href}
                  className="text-sm font-medium transition-colors hover:text-[var(--nb-primary)] pb-0.5"
                  style={{
                    color: n.active ? "var(--nb-primary)" : "var(--nb-text-sub)",
                    borderBottom: n.active ? "2px solid var(--nb-primary)" : "2px solid transparent",
                  }}>{n.label}</Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login" className="nb-btn-ghost px-4 py-2 text-sm flex items-center gap-1.5">
              <span>🚪</span> Keluar
            </Link>
          </div>
        </div>
      </nav>

      <main className="nb-container py-10 flex-1">

        {/* Header */}
        <header className="mb-8">
          <span className="nb-label text-xs mb-1 block" style={{ color: "var(--nb-secondary)" }}>Creator Interface</span>
          <h1 className="nb-h1" style={{ color: "var(--nb-text)" }}>Command Center</h1>
        </header>

        {/* Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {STATS.map(s => (
            <div key={s.label} className="nb-stat-card flex items-center gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2 mb-1">
                  <p className="nb-h3 text-xl font-bold" style={{ color: s.color }}>{s.value}</p>
                  <span className="text-xs font-semibold" style={{ color: "var(--nb-green)" }}>{s.delta}</span>
                </div>
                <p className="text-xs truncate" style={{ color: "var(--nb-text-sub)" }}>{s.label}</p>
                <div className="nb-progress-track h-1 mt-2">
                  <div className="nb-progress-fill h-1" style={{ width: "70%", background: s.color }} />
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* ── Tab Bar ────────────────────────────────────────────── */}
        <div className="flex gap-1 p-1 rounded-xl mb-8 w-fit" style={{ background: "var(--nb-surface-low)", border: "1px solid var(--nb-stroke)" }}>
          <button onClick={() => setActiveTab("kampanye")}
            className="px-6 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{ background: activeTab === "kampanye" ? "var(--nb-secondary)" : "transparent", color: activeTab === "kampanye" ? "#fff" : "var(--nb-text-sub)" }}>
            🏷️ Kampanye Saya
          </button>
          <button onClick={() => setActiveTab("ai")}
            className="px-6 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{ background: activeTab === "ai" ? "var(--nb-primary)" : "transparent", color: activeTab === "ai" ? "#fff" : "var(--nb-text-sub)" }}>
            🤖 AI Analyzer
          </button>
        </div>

        {/* ── KAMPANYE TAB ──────────────────────────────────────── */}
        {activeTab === "kampanye" && (
          <section>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="nb-h3" style={{ color: "var(--nb-text)" }}>Kampanye Group Buy</h2>
                <p className="text-sm mt-1" style={{ color: "var(--nb-text-sub)" }}>
                  Buat dan kelola campaign penjualan produk hobby-mu di NexBuy.
                </p>
              </div>
              <button onClick={() => { setShowForm(true); setSubmitted(false) }}
                className="nb-btn-primary px-5 py-2.5 text-sm font-semibold rounded-xl flex items-center gap-2">
                <span>+</span> Buat Kampanye Baru
              </button>
            </div>

            {/* Success banner */}
            {submitted && (
              <div className="mb-6 p-4 rounded-xl flex items-center gap-3"
                style={{ background: "var(--nb-green)12", border: "1px solid var(--nb-green)40" }}>
                <span className="text-lg">✓</span>
                <p className="text-sm font-medium" style={{ color: "var(--nb-green)" }}>
                  Kampanye berhasil disubmit! Tim NexBuy akan mereview dalam 1×24 jam.
                </p>
              </div>
            )}

            {/* Create Campaign Form */}
            {showForm && (
              <div className="nb-card p-6 mb-6">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="nb-h3" style={{ color: "var(--nb-text)" }}>Form Kampanye Baru</h3>
                  <button onClick={() => setShowForm(false)}
                    className="text-xl transition-colors hover:text-[var(--nb-red)]"
                    style={{ color: "var(--nb-text-dim)" }}>✕</button>
                </div>
                <form onSubmit={handleCampaignSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="nb-label text-xs" style={{ color: "var(--nb-text-sub)" }}>Nama Produk</label>
                    <input required placeholder="e.g. Neo65 Aluminum Kit"
                      value={campaignForm.name}
                      onChange={e => setCampaignForm(f => ({ ...f, name: e.target.value }))}
                      className="nb-input h-11 px-4 text-sm" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="nb-label text-xs" style={{ color: "var(--nb-text-sub)" }}>Kategori</label>
                    <select value={campaignForm.category}
                      onChange={e => setCampaignForm(f => ({ ...f, category: e.target.value }))}
                      className="nb-input h-11 px-4 text-sm">
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="nb-label text-xs" style={{ color: "var(--nb-text-sub)" }}>Harga per Unit (Rp)</label>
                    <input required type="number" placeholder="e.g. 4200000"
                      value={campaignForm.price}
                      onChange={e => setCampaignForm(f => ({ ...f, price: e.target.value }))}
                      className="nb-input h-11 px-4 text-sm" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="nb-label text-xs" style={{ color: "var(--nb-text-sub)" }}>Target MOQ (peserta)</label>
                    <input required type="number" placeholder="e.g. 100"
                      value={campaignForm.moq}
                      onChange={e => setCampaignForm(f => ({ ...f, moq: e.target.value }))}
                      className="nb-input h-11 px-4 text-sm" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="nb-label text-xs" style={{ color: "var(--nb-text-sub)" }}>Deadline GB</label>
                    <input required type="date"
                      value={campaignForm.deadline}
                      onChange={e => setCampaignForm(f => ({ ...f, deadline: e.target.value }))}
                      className="nb-input h-11 px-4 text-sm" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="nb-label text-xs" style={{ color: "var(--nb-text-sub)" }}>Deskripsi Singkat</label>
                    <input required placeholder="Spesifikasi & keunggulan produk"
                      value={campaignForm.description}
                      onChange={e => setCampaignForm(f => ({ ...f, description: e.target.value }))}
                      className="nb-input h-11 px-4 text-sm" />
                  </div>
                  <div className="md:col-span-2 flex flex-col gap-1.5">
                    <label className="nb-label text-xs" style={{ color: "var(--nb-text-sub)" }}>Foto Produk</label>
                    <label
                      className="flex flex-col items-center justify-center gap-3 rounded-xl cursor-pointer transition-all h-36"
                      style={{
                        border: `2px dashed ${campaignForm.photo ? "var(--nb-primary)" : "var(--nb-stroke)"}`,
                        background: campaignForm.photo ? "var(--nb-primary)08" : "var(--nb-surface-low)",
                      }}>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => {
                          const file = e.target.files?.[0]
                          if (file) setCampaignForm(f => ({ ...f, photo: file.name }))
                        }}
                      />
                      {campaignForm.photo ? (
                        <>
                          <span className="text-2xl">✓</span>
                          <p className="text-sm font-medium" style={{ color: "var(--nb-primary)" }}>{campaignForm.photo}</p>
                          <p className="text-xs" style={{ color: "var(--nb-text-dim)" }}>Klik untuk ganti foto</p>
                        </>
                      ) : (
                        <>
                          <span className="text-3xl">📷</span>
                          <div className="text-center">
                            <p className="text-sm font-medium" style={{ color: "var(--nb-text)" }}>Upload foto produk</p>
                            <p className="text-xs mt-0.5" style={{ color: "var(--nb-text-dim)" }}>PNG, JPG, WEBP — maks 5MB</p>
                          </div>
                        </>
                      )}
                    </label>
                  </div>
                  <div className="md:col-span-2 p-3 rounded-xl flex items-start gap-3"
                    style={{ background: "var(--nb-primary)0f", border: "1px solid var(--nb-primary)25" }}>
                    <span className="text-base mt-0.5">💡</span>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--nb-text-sub)" }}>
                      Gunakan tab <strong style={{ color: "var(--nb-primary)" }}>AI Analyzer</strong> untuk mendapatkan rekomendasi MOQ dan prediksi keberhasilan sebelum melisting campaign.
                    </p>
                  </div>
                  <div className="md:col-span-2 flex justify-end gap-3">
                    <button type="button" onClick={() => setShowForm(false)} className="nb-btn-ghost px-6 py-2.5 text-sm rounded-xl">
                      Batal
                    </button>
                    <button type="submit" className="nb-btn-primary px-6 py-2.5 text-sm font-semibold rounded-xl">
                      Submit Kampanye
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Campaigns Table */}
            <div className="nb-card overflow-hidden">
              <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--nb-stroke)" }}>
                <p className="text-sm font-semibold" style={{ color: "var(--nb-text)" }}>Semua Kampanye</p>
              </div>
              <div className="divide-y" style={{ borderColor: "var(--nb-stroke)" }}>
                {PROJECTS.map((p) => (
                  <div key={p.id} className="flex items-center gap-4 px-5 py-4 hover:bg-[var(--nb-surface-low)] transition-colors">
                    {/* Icon */}
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                      style={{ background: "var(--nb-surface-low)", border: "1px solid var(--nb-stroke)" }}>
                      {p.category === "Keyboard Kits" ? "⌨️" : p.category === "Keycaps" ? "🎹" : "🎭"}
                    </div>

                    {/* Name + ID */}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold truncate" style={{ color: "var(--nb-text)" }}>{p.name}</p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--nb-text-dim)" }}>{p.id} · {p.category}</p>
                    </div>

                    {/* Progress */}
                    <div className="hidden md:block w-32">
                      <div className="flex justify-between text-xs mb-1">
                        <span style={{ color: "var(--nb-primary)" }}>{p.progress}/{p.moq}</span>
                        <span style={{ color: "var(--nb-text-dim)" }}>{Math.round((p.progress / p.moq) * 100)}%</span>
                      </div>
                      <div className="nb-progress-track h-1.5">
                        <div className="nb-progress-fill h-1.5" style={{ width: `${Math.min((p.progress / p.moq) * 100, 100)}%` }} />
                      </div>
                    </div>

                    {/* Price */}
                    <div className="hidden lg:block text-right w-24">
                      <p className="text-sm font-bold" style={{ color: "var(--nb-primary)" }}>{p.price}</p>
                      <p className="text-xs" style={{ color: "var(--nb-text-dim)" }}>sd {p.deadline}</p>
                    </div>

                    {/* AI Score */}
                    <span className="nb-label text-xs px-2 py-0.5 rounded-lg flex-shrink-0"
                      style={{ background: "var(--nb-green)15", color: "var(--nb-green)", border: "1px solid var(--nb-green)30" }}>
                      AI {p.aiScore}
                    </span>

                    {/* Status */}
                    <span className="nb-label text-xs px-2.5 py-1 rounded-lg flex-shrink-0"
                      style={{
                        background: p.status === "Live" ? "var(--nb-primary)15" : "var(--nb-surface-low)",
                        color: p.status === "Live" ? "var(--nb-primary)" : "var(--nb-text-dim)",
                        border: `1px solid ${p.status === "Live" ? "var(--nb-primary)30" : "var(--nb-stroke)"}`,
                      }}>
                      {p.status === "Live" ? "● Live" : p.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── AI ANALYZER TAB ──────────────────────────────────── */}
        {activeTab === "ai" && (
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* AI Form */}
            <div className="lg:col-span-2 flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: "var(--nb-secondary)18", border: "1px solid var(--nb-stroke)" }}>🤖</div>
                <div>
                  <h2 className="nb-h3" style={{ color: "var(--nb-text)" }}>AI Project Analyzer</h2>
                  <p className="text-xs" style={{ color: "var(--nb-secondary)" }}>MOQ Recommendation + Success Prediction</p>
                </div>
              </div>

              <div className="nb-card p-6">
                <form onSubmit={handleCalculate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="nb-label text-xs" style={{ color: "var(--nb-text-sub)" }}>Target Dana (USD)</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold" style={{ color: "var(--nb-text-dim)" }}>$</span>
                      <input type="number" min="1" placeholder="5000"
                        value={form.goal_usd}
                        onChange={(e) => setForm(f => ({ ...f, goal_usd: e.target.value }))}
                        className="nb-input w-full h-11 pl-8 pr-4 text-sm" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="nb-label text-xs" style={{ color: "var(--nb-text-sub)" }}>Durasi (Hari)</label>
                    <input type="number" min="1" max="90" placeholder="30"
                      value={form.duration_days}
                      onChange={(e) => setForm(f => ({ ...f, duration_days: e.target.value }))}
                      className="nb-input w-full h-11 px-4 text-sm" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="nb-label text-xs" style={{ color: "var(--nb-text-sub)" }}>Kategori</label>
                    <select value={form.main_category}
                      onChange={(e) => setForm(f => ({ ...f, main_category: e.target.value }))}
                      className="nb-input w-full h-11 px-4 text-sm">
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="nb-label text-xs" style={{ color: "var(--nb-text-sub)" }}>Negara</label>
                    <select value={form.country}
                      onChange={(e) => setForm(f => ({ ...f, country: e.target.value }))}
                      className="nb-input w-full h-11 px-4 text-sm">
                      {[["US","Amerika Serikat"],["ID","Indonesia"],["GB","Inggris"],["JP","Jepang"],["CA","Kanada"],["AU","Australia"],["SG","Singapura"],["DE","Jerman"]].map(([v,l]) => (
                        <option key={v} value={v}>{l} ({v})</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <button type="submit" disabled={loading}
                      className="nb-btn-primary w-full h-11 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                      {loading ? <><span className="inline-block animate-spin">⟳</span> Menganalisis...</> : <><span>✨</span> Analisis dengan AI</>}
                    </button>
                  </div>
                </form>

                {error && (
                  <div className="mt-4 p-4 rounded-xl flex items-start gap-3"
                    style={{ background: "var(--nb-red)12", border: "1px solid var(--nb-red)", color: "var(--nb-red)" }}>
                    <span className="text-lg flex-shrink-0">⚠</span>
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                {(moqResult || successResult) && (
                  <div className="mt-6 pt-6 space-y-6" style={{ borderTop: "1px solid var(--nb-stroke)" }}>

                    {successResult && risk && (
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-sm" style={{ color: "var(--nb-cyan)" }}>📊</span>
                          <span className="nb-label text-xs" style={{ color: "var(--nb-cyan)" }}>Success Prediction</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 rounded-xl" style={{ background: "var(--nb-surface-low)", border: "1px solid var(--nb-cyan)30" }}>
                            <p className="nb-label text-xs mb-2" style={{ color: "var(--nb-text-sub)" }}>Probabilitas Keberhasilan</p>
                            <div className="flex items-end gap-2 mb-3">
                              <span className="text-3xl font-bold" style={{ color: "var(--nb-cyan)", fontFamily: "var(--font-display)" }}>
                                {successResult.probability.toFixed(1)}%
                              </span>
                            </div>
                            <div className="nb-progress-track h-2">
                              <div className="nb-progress-fill h-2 transition-all duration-700"
                                style={{
                                  width: `${successResult.probability}%`,
                                  background: successResult.probability >= 70
                                    ? "linear-gradient(90deg, var(--nb-green), var(--nb-cyan))"
                                    : successResult.probability >= 40
                                    ? "linear-gradient(90deg, var(--nb-yellow), var(--nb-primary))"
                                    : "linear-gradient(90deg, var(--nb-red), var(--nb-yellow))",
                                }} />
                            </div>
                            <p className="text-xs mt-2" style={{ color: "var(--nb-text-dim)" }}>
                              {successResult.probability >= 70 ? "Project ini punya peluang sukses yang baik"
                                : successResult.probability >= 40 ? "Peluang moderat — pertimbangkan penyesuaian strategi"
                                : "Peluang rendah — disarankan turunkan target atau MOQ"}
                            </p>
                          </div>
                          <div className="p-4 rounded-xl" style={{ background: "var(--nb-surface-low)", border: `1px solid ${risk.color}30` }}>
                            <p className="nb-label text-xs mb-2" style={{ color: "var(--nb-text-sub)" }}>Level Risiko</p>
                            <div className="flex items-center gap-3 mb-3">
                              <span className="text-2xl font-bold" style={{ color: risk.color }}>{risk.icon}</span>
                              <span className="text-base font-semibold" style={{ color: risk.color }}>{risk.label}</span>
                            </div>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold nb-label"
                              style={{ background: `${risk.color}15`, color: risk.color }}>
                              ● {successResult.risk_level.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {moqResult && conf && (
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-sm" style={{ color: "var(--nb-secondary)" }}>✨</span>
                          <span className="nb-label text-xs" style={{ color: "var(--nb-secondary)" }}>MOQ Recommendation</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="p-4 rounded-xl text-center"
                            style={{ background: "var(--nb-surface-low)", border: "1px solid var(--nb-secondary)30" }}>
                            <p className="nb-label text-xs mb-1" style={{ color: "var(--nb-text-sub)" }}>Rekomendasi MOQ</p>
                            <p className="text-2xl font-bold" style={{ color: "var(--nb-secondary)", fontFamily: "var(--font-display)" }}>
                              {moqResult.recommended_moq}
                            </p>
                            <p className="text-xs mt-0.5" style={{ color: "var(--nb-text-dim)" }}>peserta</p>
                          </div>
                          <div className="p-4 rounded-xl text-center"
                            style={{ background: "var(--nb-surface-low)", border: "1px solid var(--nb-stroke)" }}>
                            <p className="nb-label text-xs mb-1" style={{ color: "var(--nb-text-sub)" }}>Range</p>
                            <p className="text-2xl font-bold" style={{ color: "var(--nb-text)", fontFamily: "var(--font-display)" }}>
                              {moqResult.moq_range_low}–{moqResult.moq_range_high}
                            </p>
                            <p className="text-xs mt-0.5" style={{ color: "var(--nb-text-dim)" }}>peserta</p>
                          </div>
                          <div className="p-4 rounded-xl text-center"
                            style={{ background: "var(--nb-surface-low)", border: `1px solid ${conf.color}30` }}>
                            <p className="nb-label text-xs mb-1" style={{ color: "var(--nb-text-sub)" }}>Keyakinan AI</p>
                            <p className="text-2xl font-bold" style={{ color: conf.color, fontFamily: "var(--font-display)" }}>
                              {conf.label}
                            </p>
                            <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs nb-label"
                              style={{ background: `${conf.color}15`, color: conf.color }}>
                              {moqResult.confidence.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="p-4 rounded-xl flex items-start gap-3"
                          style={{ background: "var(--nb-secondary)0f", border: "1px solid var(--nb-secondary)25" }}>
                          <span className="text-lg flex-shrink-0 mt-0.5">💡</span>
                          <p className="text-sm leading-relaxed" style={{ color: "var(--nb-text-sub)" }}>
                            {moqResult.category_insight}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Info Sidebar */}
            <div className="flex flex-col gap-4">
              <h2 className="nb-h3" style={{ color: "var(--nb-text)" }}>Proyek Aktif</h2>
              {PROJECTS.filter(p => p.status === "Live").map((p) => (
                <div key={p.id} className="nb-card p-4 hover:border-[var(--nb-primary)] transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div className="min-w-0 mr-2">
                      <p className="text-sm font-semibold truncate" style={{ color: "var(--nb-text)" }}>{p.name}</p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--nb-text-dim)" }}>{p.id}</p>
                    </div>
                    <span className="nb-label text-xs px-2 py-0.5 rounded-lg flex-shrink-0"
                      style={{ background: "var(--nb-green)15", color: "var(--nb-green)", border: "1px solid var(--nb-green)30" }}>
                      AI {p.aiScore}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs mb-2" style={{ color: "var(--nb-text-sub)" }}>
                    <span style={{ color: "var(--nb-primary)" }}>{p.progress}/{p.moq} peserta</span>
                    <span>sd {p.deadline}</span>
                  </div>
                  <div className="nb-progress-track h-1.5">
                    <div className="nb-progress-fill h-1.5" style={{ width: `${Math.min((p.progress / p.moq) * 100, 100)}%` }} />
                  </div>
                  <div className="mt-1.5 text-right">
                    <span className="text-xs" style={{ color: "var(--nb-green)" }}>
                      {Math.round((p.progress / p.moq) * 100)}% terpenuhi
                    </span>
                  </div>
                </div>
              ))}

              <div className="nb-card p-4" style={{ borderLeft: "3px solid var(--nb-cyan)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm">ℹ️</span>
                  <span className="nb-label text-xs" style={{ color: "var(--nb-cyan)" }}>Tentang AI</span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--nb-text-sub)" }}>
                  Prediksi menggunakan{" "}
                  <strong style={{ color: "var(--nb-primary)" }}>Random Forest</strong> &{" "}
                  <strong style={{ color: "var(--nb-secondary)" }}>Isolation Forest</strong>{" "}
                  yang dilatih dari 133K kampanye Kickstarter.
                </p>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="mt-auto" style={{ borderTop: "1px solid var(--nb-stroke)" }}>
        <div className="nb-container py-4 flex justify-between items-center">
          <p className="text-xs" style={{ color: "var(--nb-text-dim)" }}>© 2024 NexBuy Creator Portal</p>
          <div className="flex gap-4">
            <a href="#" className="text-xs transition-colors hover:text-[var(--nb-primary)]" style={{ color: "var(--nb-text-dim)" }}>Dokumentasi AI</a>
            <a href="#" className="text-xs transition-colors hover:text-[var(--nb-primary)]" style={{ color: "var(--nb-text-dim)" }}>Bantuan</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
