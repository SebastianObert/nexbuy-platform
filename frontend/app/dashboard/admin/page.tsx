"use client"

import { useState } from "react"
import Link from "next/link"
import ThemeToggle from "@/components/theme-toggle"
import { detectAnomaly, type AnomalyInput, type AnomalyResult } from "@/lib/ai-client"

const METRICS = [
  { label: "Group Buy Aktif",              value: "42",    delta: "+4%",     color: "var(--nb-primary)", icon: "🛍️" },
  { label: "Produk Diflag AI",             value: "02",    delta: "Mendesak",color: "var(--nb-red)",     icon: "🚨" },
  { label: "Pengguna Terverifikasi",       value: "12.4K", delta: "Global",  color: "var(--nb-text)",    icon: "👤" },
  { label: "Total Escrow Terlindungi",     value: "$842K", delta: "+12%",    color: "var(--nb-cyan)",    icon: "🔒" },
]

interface GroupbuyProduct {
  gb_id:         string
  nama_produk:   string
  total_pembeli: number
  total_escrow:  string
  join_per_jam:  number
  behavior:      AnomalyInput
}

const GROUPBUY_PRODUCTS: GroupbuyProduct[] = [
  {
    gb_id: "GB-7721", nama_produk: "Neo65 Aluminum Kit",
    total_pembeli: 78,  total_escrow: "Rp 93.600.000",  join_per_jam: 42,
    behavior: { user_id: "GB-7721", events_per_hour: 420, avg_inter_sec: 1.2, std_inter_sec: 0.3, min_inter_sec: 0.1, n_sessions: 1, events_per_session: 350, cart_ratio: 0.01, purchase_ratio: 0.00, n_types: 1, night_ratio: 0.92, unique_products: 1 },
  },
  {
    gb_id: "GB-7722", nama_produk: "GMK Eclipse Keycaps",
    total_pembeli: 189, total_escrow: "Rp 160.650.000", join_per_jam: 8,
    behavior: { user_id: "GB-7722", events_per_hour: 8,   avg_inter_sec: 520, std_inter_sec: 210, min_inter_sec: 60,  n_sessions: 4, events_per_session: 7,   cart_ratio: 0.20, purchase_ratio: 0.11, n_types: 3, night_ratio: 0.07, unique_products: 15 },
  },
  {
    gb_id: "GB-7723", nama_produk: "Resin Oni Artisan",
    total_pembeli: 47,  total_escrow: "Rp 31.960.000",  join_per_jam: 5,
    behavior: { user_id: "GB-7723", events_per_hour: 5,   avg_inter_sec: 700, std_inter_sec: 300, min_inter_sec: 80,  n_sessions: 3, events_per_session: 6,   cart_ratio: 0.25, purchase_ratio: 0.14, n_types: 4, night_ratio: 0.05, unique_products: 22 },
  },
  {
    gb_id: "GB-7724", nama_produk: "Cyberpunk Deskmat",
    total_pembeli: 156, total_escrow: "Rp 53.040.000",  join_per_jam: 28,
    behavior: { user_id: "GB-7724", events_per_hour: 280, avg_inter_sec: 2.5, std_inter_sec: 0.8, min_inter_sec: 0.5, n_sessions: 1, events_per_session: 240, cart_ratio: 0.02, purchase_ratio: 0.01, n_types: 1, night_ratio: 0.85, unique_products: 2 },
  },
  {
    gb_id: "GB-7725", nama_produk: "Titanium Switch Puller",
    total_pembeli: 112, total_escrow: "Rp 47.040.000",  join_per_jam: 6,
    behavior: { user_id: "GB-7725", events_per_hour: 6,   avg_inter_sec: 450, std_inter_sec: 190, min_inter_sec: 50,  n_sessions: 3, events_per_session: 8,   cart_ratio: 0.18, purchase_ratio: 0.10, n_types: 3, night_ratio: 0.09, unique_products: 18 },
  },
]

const RISK_STYLE = {
  LOW:    { color: "var(--nb-green)"  },
  MEDIUM: { color: "var(--nb-yellow)" },
  HIGH:   { color: "var(--nb-red)"    },
}

const DEMO_RESULTS: { [id: string]: AnomalyResult } = {
  "GB-7721": { trust_score: 12, risk_level: "HIGH",   is_anomaly: true,  user_id: "GB-7721", risk_flag: true,  message: "Trust score critically low — manual review required."  },
  "GB-7722": { trust_score: 71, risk_level: "LOW",    is_anomaly: false, user_id: "GB-7722", risk_flag: false, message: "No anomalies detected."                                },
  "GB-7723": { trust_score: 84, risk_level: "LOW",    is_anomaly: false, user_id: "GB-7723", risk_flag: false, message: "No anomalies detected."                                },
  "GB-7724": { trust_score: 38, risk_level: "HIGH",   is_anomaly: true,  user_id: "GB-7724", risk_flag: true,  message: "Anomaly detected — escrow hold recommended."          },
  "GB-7725": { trust_score: 55, risk_level: "MEDIUM", is_anomaly: false, user_id: "GB-7725", risk_flag: true,  message: "Moderate risk — monitoring in progress."               },
}

type ActionMap = { [gbId: string]: "batalkan" | "abaikan" }

const NAV_ITEMS = [
  { label: "Admin",   href: "/dashboard/admin", active: true  },
]

export default function AdminDashboardPage() {
  const [scanResults, setScanResults] = useState<{ [id: string]: AnomalyResult }>(DEMO_RESULTS)
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState<string | null>(null)
  const [scanned,     setScanned]     = useState(true)
  const [actions,     setActions]     = useState<ActionMap>({})

  const handleScanAll = async () => {
    setLoading(true)
    setError(null)
    setScanResults({})
    setActions({})
    try {
      const results = await Promise.all(GROUPBUY_PRODUCTS.map(p => detectAnomaly(p.behavior)))
      const map: { [id: string]: AnomalyResult } = {}
      results.forEach((r, i) => { map[GROUPBUY_PRODUCTS[i].gb_id] = r })
      setScanResults(map)
      setScanned(true)
    } catch {
      setError("Anomaly Service tidak tersedia. Pastikan start-ai.bat sudah dijalankan.")
    } finally {
      setLoading(false)
    }
  }

  const flaggedProducts = GROUPBUY_PRODUCTS.filter(p => scanResults[p.gb_id]?.risk_level === "HIGH")
  const batalkanCount   = Object.values(actions).filter(a => a === "batalkan").length

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

      {/* ── Main ───────────────────────────────────────────────── */}
      <main className="nb-container py-10 flex-1">

        {/* Header */}
        <header className="mb-8">
          <span className="nb-label text-xs mb-1 block" style={{ color: "var(--nb-red)" }}>Administrative Interface</span>
          <h1 className="nb-h1" style={{ color: "var(--nb-text)" }}>Trust & Safety Console</h1>
        </header>

        {/* Metrics */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {METRICS.map(s => (
            <div key={s.label} className="nb-stat-card flex items-center gap-4 hover:border-[var(--nb-primary)] transition-colors"
              style={{ border: "1px solid var(--nb-stroke)" }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: `${s.color}15` }}>{s.icon}</div>
              <div className="min-w-0">
                <p className="nb-h3 text-xl font-bold" style={{ color: s.color }}>{s.value}</p>
                <p className="text-xs" style={{ color: "var(--nb-text-sub)" }}>{s.delta}</p>
                <p className="text-xs truncate mt-0.5" style={{ color: "var(--nb-text-dim)" }}>{s.label}</p>
              </div>
            </div>
          ))}
        </section>

        {/* AI Anomaly Detection */}
        <section>

          {/* Section header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                style={{ background: "var(--nb-red)15", border: "1px solid var(--nb-red)30" }}>🛡️</div>
              <div>
                <h2 className="nb-h3" style={{ color: "var(--nb-text)" }}>AI Anomaly Detection</h2>
                <p className="text-xs" style={{ color: "var(--nb-red)" }}>Isolation Forest — Trust Score per Produk</p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {scanned && (
                <>
                  <span className="nb-label text-xs px-3 py-1.5 rounded-lg"
                    style={{ background: "var(--nb-red)15", border: "1px solid var(--nb-red)30", color: "var(--nb-red)" }}>
                    {flaggedProducts.length} Produk Diflag
                  </span>
                  <span className="nb-label text-xs px-3 py-1.5 rounded-lg"
                    style={{ background: "var(--nb-red)20", border: "1px solid var(--nb-red)30", color: "var(--nb-red)" }}>
                    {batalkanCount} Dibatalkan
                  </span>
                </>
              )}
              <button onClick={handleScanAll} disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: "var(--nb-red)15", border: "1px solid var(--nb-red)40", color: "var(--nb-red)" }}>
                {loading
                  ? <><span className="inline-block animate-spin">⟳</span> Scanning...</>
                  : <><span>📡</span> Scan Semua Produk</>
                }
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="nb-card p-4 flex items-start gap-3 mb-5" style={{ borderLeft: "3px solid var(--nb-cyan)" }}>
            <span className="text-lg flex-shrink-0 mt-0.5">ℹ️</span>
            <p className="text-sm leading-relaxed" style={{ color: "var(--nb-text-sub)" }}>
              AI scan pola pembelian setiap produk secara otomatis menggunakan{" "}
              <strong style={{ color: "var(--nb-primary)" }}>Isolation Forest</strong>.
              Produk dengan Trust Score rendah (Risk{" "}
              <strong style={{ color: "var(--nb-red)" }}>HIGH</strong>) = pola pembelian mencurigakan (bot/fake demand).
              Admin batalkan produk → produk tidak jadi terjual →{" "}
              <strong style={{ color: "var(--nb-cyan)" }}>semua pembeli di-refund</strong>.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="p-4 rounded-xl flex items-start gap-3 mb-5"
              style={{ background: "var(--nb-red)12", border: "1px solid var(--nb-red)", color: "var(--nb-red)" }}>
              <span className="text-lg flex-shrink-0">⚠</span>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Empty state */}
          {!scanned && !loading && !error && (
            <div className="nb-card flex flex-col items-center justify-center gap-3 py-20 text-center">
              <span className="text-6xl opacity-30">📡</span>
              <p className="text-base font-semibold" style={{ color: "var(--nb-text-sub)" }}>Belum ada hasil scan</p>
              <p className="text-sm" style={{ color: "var(--nb-text-dim)" }}>
                Klik <strong style={{ color: "var(--nb-red)" }}>Scan Semua Produk</strong> untuk mulai analisis AI
              </p>
            </div>
          )}

          {/* Results Table */}
          {scanned && Object.keys(scanResults).length > 0 && (
            <div className="nb-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead style={{ background: "var(--nb-surface-low)", borderBottom: "1px solid var(--nb-stroke)" }}>
                    <tr>
                      {["ID GB", "Nama Produk", "Total Pembeli", "Total Escrow", "Join/Jam", "Trust Score", "Risk", "Aksi Admin"].map((h, i) => (
                        <th key={h} className={`px-4 py-3 nb-label text-xs ${i === 7 ? "text-right" : ""}`}
                          style={{ color: "var(--nb-text-sub)" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {GROUPBUY_PRODUCTS.map((p, idx) => {
                      const result = scanResults[p.gb_id]
                      if (!result) return null
                      const style  = RISK_STYLE[result.risk_level]
                      const acted  = actions[p.gb_id]
                      const isHigh = result.risk_level === "HIGH"

                      return (
                        <tr key={p.gb_id}
                          style={{
                            borderTop: idx > 0 ? "1px solid var(--nb-stroke)" : undefined,
                            opacity: acted === "batalkan" ? 0.4 : 1,
                            background: isHigh && !acted ? "var(--nb-red)08" : "transparent",
                          }}>
                          <td className="px-4 py-3">
                            <p className="nb-label text-xs font-semibold" style={{ color: "var(--nb-primary)" }}>{p.gb_id}</p>
                            {isHigh && !acted && <p className="text-xs mt-0.5" style={{ color: "var(--nb-red)" }}>⚠ diflag AI</p>}
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-sm font-semibold" style={{ color: "var(--nb-text)" }}>{p.nama_produk}</p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-sm" style={{ color: "var(--nb-text)" }}>{p.total_pembeli} orang</p>
                            {acted === "batalkan" && <p className="text-xs mt-0.5" style={{ color: "var(--nb-red)" }}>semua di-refund</p>}
                          </td>
                          <td className="px-4 py-3 nb-label text-xs" style={{ color: "var(--nb-primary)" }}>{p.total_escrow}</td>
                          <td className="px-4 py-3">
                            <span className="text-sm font-bold" style={{ color: p.join_per_jam > 20 ? "var(--nb-red)" : "var(--nb-green)" }}>
                              {p.join_per_jam}x/jam
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-14 h-2 rounded-full overflow-hidden" style={{ background: "var(--nb-stroke)" }}>
                                <div className="h-full rounded-full transition-all duration-700" style={{
                                  width: `${result.trust_score}%`,
                                  background: result.trust_score >= 60 ? "var(--nb-green)" : result.trust_score >= 40 ? "var(--nb-yellow)" : "var(--nb-red)"
                                }} />
                              </div>
                              <span className="text-sm font-bold" style={{ color: style.color }}>{result.trust_score.toFixed(0)}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="nb-label text-xs px-2.5 py-1 rounded-lg"
                              style={{ background: `${style.color}15`, color: style.color, border: `1px solid ${style.color}30` }}>
                              {result.risk_level}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            {acted ? (
                              <span className="nb-label text-xs px-3 py-1 rounded-lg"
                                style={acted === "batalkan"
                                  ? { background: "var(--nb-red)20", color: "var(--nb-red)" }
                                  : { background: "var(--nb-surface-low)", color: "var(--nb-text-sub)" }}>
                                {acted === "batalkan" ? "✕ Dibatalkan" : "✓ Diabaikan"}
                              </span>
                            ) : isHigh ? (
                              <div className="flex justify-end gap-2">
                                <button onClick={() => setActions(a => ({ ...a, [p.gb_id]: "batalkan" }))}
                                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                                  style={{ background: "var(--nb-red)15", border: "1px solid var(--nb-red)40", color: "var(--nb-red)" }}>
                                  Batalkan
                                </button>
                                <button onClick={() => setActions(a => ({ ...a, [p.gb_id]: "abaikan" }))}
                                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:border-[var(--nb-primary)]"
                                  style={{ border: "1px solid var(--nb-stroke)", color: "var(--nb-text-sub)" }}>
                                  Abaikan
                                </button>
                              </div>
                            ) : (
                              <span className="text-xs" style={{ color: "var(--nb-green)" }}>✓ Aman</span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-3 flex items-center gap-2" style={{ borderTop: "1px solid var(--nb-stroke)" }}>
                <span className="text-sm">ℹ️</span>
                <p className="text-xs" style={{ color: "var(--nb-text-dim)" }}>
                  Tombol <strong style={{ color: "var(--nb-red)" }}>Batalkan</strong> hanya muncul pada Risk HIGH.
                  Risk MEDIUM dipantau sistem. Risk LOW aman.
                </p>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="mt-auto" style={{ borderTop: "1px solid var(--nb-stroke)" }}>
        <div className="nb-container py-4 flex justify-between items-center">
          <span className="font-bold text-sm" style={{ color: "var(--nb-primary)", fontFamily: "var(--font-display)" }}>NexBuy</span>
          <p className="text-xs" style={{ color: "var(--nb-text-dim)" }}>© 2024 NexBuy Admin Console</p>
        </div>
      </footer>
    </div>
  )
}
