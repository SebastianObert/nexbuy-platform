"use client"

import { useState } from "react"
import Link from "next/link"
import { detectAnomaly, type AnomalyInput, type AnomalyResult } from "@/lib/ai-client"

const METRICS = [
  { label: "GROUP BUY AKTIF",             value: "42",    delta: "+4%",     color: "text-primary",    bar: "bg-primary w-2/3",           glow: "shadow-[0_0_8px_#adc6ff]" },
  { label: "PRODUK DIFLAG AI",            value: "02",    delta: "MENDESAK",color: "text-error",      bar: "bg-error w-1/4",             glow: "" },
  { label: "TOTAL PENGGUNA TERVERIFIKASI",value: "12.4K", delta: "GLOBAL",  color: "text-on-surface", bar: "bg-on-surface-variant w-4/5", glow: "" },
  { label: "TOTAL ESCROW TERLINDUNGI",    value: "$842K", delta: "+12%",    color: "text-neon-cyan",  bar: "bg-neon-cyan w-3/4",         glow: "shadow-[0_0_8px_#22D3EE]" },
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
  LOW:    { color: "text-success-green", bg: "bg-success-green/10", border: "border-success-green/30" },
  MEDIUM: { color: "text-warning",       bg: "bg-warning/10",        border: "border-warning/30" },
  HIGH:   { color: "text-error",         bg: "bg-error/10",          border: "border-error/30" },
}

type ActionMap = { [gbId: string]: "batalkan" | "abaikan" }

export default function AdminDashboardPage() {
  const [scanResults, setScanResults] = useState<{ [id: string]: AnomalyResult }>({})
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState<string | null>(null)
  const [scanned,     setScanned]     = useState(false)
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
    <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col">

      {/* Navbar */}
      <nav className="bg-deep-void/80 backdrop-blur-xl sticky top-0 z-50 border-b border-surface-stroke shadow-[0_0_20px_rgba(34,211,238,0.1)]">
        <div className="flex justify-between items-center w-full max-w-container-max mx-auto px-margin-desktop h-20">
          <div className="font-headline-sm text-headline-sm tracking-tighter text-primary uppercase">Nexbuy</div>
          <div className="hidden md:flex items-center gap-stack-lg">
            <Link href="/home" className="font-headline-sm text-headline-sm text-on-surface-variant hover:text-primary transition-all">Beranda</Link>
            <a href="#"    className="font-headline-sm text-headline-sm text-primary font-bold border-b-2 border-primary pb-1">Admin</a>
          </div>
          <div className="flex items-center gap-stack-md">
            <div className="relative">
              <span className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer">notifications</span>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
            </div>
            <Link href="/login">
              <span className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer">logout</span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-container-max mx-auto px-margin-desktop py-stack-lg w-full">

        {/* Header */}
        <header className="mb-section-gap">
          <span className="font-label-mono text-label-mono text-primary uppercase tracking-widest">ADMINISTRATIVE INTERFACE v2.04</span>
          <h1 className="font-display-lg text-headline-md md:text-display-lg text-on-surface uppercase mt-stack-sm">
            Trust & Safety Console
          </h1>
        </header>

        {/* Metrics */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-section-gap">
          {METRICS.map(({ label, value, delta, color, bar, glow }) => (
            <div key={label} className="glass-panel p-stack-md rounded-lg flex flex-col gap-stack-sm hover:border-primary transition-colors">
              <span className="font-label-mono text-label-mono text-on-surface-variant uppercase">{label}</span>
              <div className="flex items-baseline gap-2">
                <span className={`font-headline-md text-headline-md ${color}`}>{value}</span>
                <span className="font-label-mono text-label-mono text-success-green">{delta}</span>
              </div>
              <div className="w-full h-1 bg-surface-stroke overflow-hidden rounded-full">
                <div className={`h-full ${bar} ${glow}`} />
              </div>
            </div>
          ))}
        </section>

        {/* AI Anomaly Detection */}
        <section className="mb-section-gap">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-stack-md mb-stack-md">
            <div className="flex items-center gap-stack-md">
              <div className="w-10 h-10 bg-error/10 border border-error/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-error">security</span>
              </div>
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface uppercase">AI Anomaly Detection</h2>
                <p className="font-label-mono text-label-mono text-error">ISOLATION FOREST — TRUST SCORE PER PRODUK</p>
              </div>
            </div>
            <div className="flex items-center gap-stack-sm flex-wrap">
              {scanned && (
                <>
                  <span className="font-label-mono text-[10px] bg-error/10 border border-error/30 text-error px-3 py-1 rounded">
                    {flaggedProducts.length} PRODUK DIFLAG
                  </span>
                  <span className="font-label-mono text-[10px] bg-error/20 border border-error/30 text-error px-3 py-1 rounded">
                    {batalkanCount} DIBATALKAN
                  </span>
                </>
              )}
              <button onClick={handleScanAll} disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-error/20 border border-error/40 text-error font-label-mono text-label-mono hover:bg-error hover:text-on-error transition-all disabled:opacity-50 uppercase">
                {loading
                  ? <><span className="material-symbols-outlined animate-spin text-[18px]">autorenew</span>SCANNING...</>
                  : <><span className="material-symbols-outlined text-[18px]">radar</span>SCAN SEMUA PRODUK</>
                }
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="glass-panel p-stack-md rounded-lg flex items-start gap-3 mb-stack-md border-l-4 border-l-neon-cyan">
            <span className="material-symbols-outlined text-neon-cyan mt-0.5">info</span>
            <p className="font-body-md text-body-md text-on-surface-variant text-sm">
              AI scan pola pembelian setiap produk secara otomatis menggunakan <strong className="text-primary">Isolation Forest</strong>.
              Produk dengan Trust Score rendah (Risk <strong className="text-error">HIGH</strong>) = pola pembelian mencurigakan (bot/fake demand).
              Admin batalkan produk → produk tidak jadi terjual → <strong className="text-neon-cyan">semua pembeli di-refund</strong>.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="p-stack-md bg-error-container/20 border border-error/30 rounded flex items-start gap-3 mb-stack-md">
              <span className="material-symbols-outlined text-error">warning</span>
              <p className="font-body-md text-body-md text-error">{error}</p>
            </div>
          )}

          {/* Empty state */}
          {!scanned && !loading && !error && (
            <div className="glass-panel rounded-lg flex flex-col items-center justify-center gap-3 py-20 text-center">
              <span className="material-symbols-outlined text-7xl text-surface-stroke">radar</span>
              <p className="font-headline-sm text-headline-sm text-on-surface-variant">Belum ada hasil scan</p>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Klik <strong className="text-error">SCAN SEMUA PRODUK</strong> untuk mulai analisis AI
              </p>
            </div>
          )}

          {/* Results Table */}
          {scanned && Object.keys(scanResults).length > 0 && (
            <div className="glass-panel rounded-lg overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-high border-b border-surface-stroke">
                  <tr>
                    {["ID GB", "NAMA PRODUK", "TOTAL PEMBELI", "TOTAL ESCROW", "JOIN/JAM", "TRUST SCORE", "RISK", "AKSI ADMIN"].map((h, i) => (
                      <th key={h} className={`p-stack-md font-label-mono text-label-mono text-on-surface-variant text-[11px] ${i === 7 ? "text-right" : ""}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-stroke">
                  {GROUPBUY_PRODUCTS.map(p => {
                    const result = scanResults[p.gb_id]
                    if (!result) return null
                    const style  = RISK_STYLE[result.risk_level]
                    const acted  = actions[p.gb_id]
                    const isHigh = result.risk_level === "HIGH"

                    return (
                      <tr key={p.gb_id} className={`transition-colors ${acted === "batalkan" ? "opacity-40" : "hover:bg-surface-container/30"} ${isHigh && !acted ? "bg-error/5" : ""}`}>
                        <td className="p-stack-md">
                          <p className="font-label-mono text-label-mono text-primary">{p.gb_id}</p>
                          {isHigh && !acted && <p className="font-label-mono text-[9px] text-error uppercase">⚠ diflag AI</p>}
                        </td>
                        <td className="p-stack-md">
                          <p className="font-body-md text-on-surface font-bold">{p.nama_produk}</p>
                        </td>
                        <td className="p-stack-md">
                          <p className="font-label-mono text-label-mono text-on-surface">{p.total_pembeli} orang</p>
                          {acted === "batalkan" && <p className="font-label-mono text-[9px] text-error">semua di-refund</p>}
                        </td>
                        <td className="p-stack-md font-label-mono text-label-mono text-primary">{p.total_escrow}</td>
                        <td className="p-stack-md">
                          <span className={`font-label-mono text-label-mono font-bold ${p.join_per_jam > 20 ? "text-error" : "text-success-green"}`}>
                            {p.join_per_jam}x/jam
                          </span>
                        </td>
                        <td className="p-stack-md">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-surface-stroke rounded-full overflow-hidden">
                              <div className="h-full rounded-full" style={{
                                width: `${result.trust_score}%`,
                                background: result.trust_score >= 60 ? "#10B981" : result.trust_score >= 40 ? "#F59E0B" : "#ffb4ab"
                              }} />
                            </div>
                            <span className={`font-label-mono text-label-mono font-bold ${style.color}`}>{result.trust_score.toFixed(0)}</span>
                          </div>
                        </td>
                        <td className="p-stack-md">
                          <span className={`font-label-mono text-[10px] px-2 py-1 rounded border ${style.color} ${style.bg} ${style.border}`}>
                            {result.risk_level}
                          </span>
                        </td>
                        <td className="p-stack-md text-right">
                          {acted ? (
                            <span className={`font-label-mono text-[10px] px-3 py-1 rounded ${acted === "batalkan" ? "bg-error/20 text-error" : "bg-surface-container text-on-surface-variant"}`}>
                              {acted === "batalkan" ? "✗ PRODUK DIBATALKAN" : "✓ DIABAIKAN"}
                            </span>
                          ) : isHigh ? (
                            <div className="flex justify-end gap-2">
                              <button onClick={() => setActions(a => ({ ...a, [p.gb_id]: "batalkan" }))}
                                className="px-3 py-1 bg-error/10 border border-error/40 text-error font-label-mono text-[10px] rounded hover:bg-error hover:text-on-error transition-all uppercase">
                                Batalkan Produk
                              </button>
                              <button onClick={() => setActions(a => ({ ...a, [p.gb_id]: "abaikan" }))}
                                className="px-3 py-1 border border-surface-stroke text-on-surface-variant font-label-mono text-[10px] rounded hover:border-primary hover:text-primary transition-all uppercase">
                                Abaikan
                              </button>
                            </div>
                          ) : (
                            <span className="font-label-mono text-[10px] text-success-green">✓ Aman</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              <div className="p-stack-md border-t border-surface-stroke flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant">info</span>
                <p className="font-label-mono text-[10px] text-on-surface-variant">
                  Tombol <strong className="text-error">Batalkan Produk</strong> hanya muncul pada Risk HIGH.
                  Risk MEDIUM dipantau sistem. Risk LOW aman.
                </p>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-deep-void py-stack-lg border-t border-surface-stroke mt-auto">
        <div className="max-w-container-max mx-auto px-margin-desktop flex justify-between items-center">
          <div className="font-headline-sm text-headline-sm text-primary">NEXBUY</div>
          <p className="font-body-md text-body-md text-on-surface-variant">© 2024 NEXBUY ADMIN CONSOLE</p>
        </div>
      </footer>
    </div>
  )
}
