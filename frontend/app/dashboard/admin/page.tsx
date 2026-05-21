"use client"

import { useState } from "react"
import Link from "next/link"
import { detectAnomaly, type AnomalyResult } from "@/lib/ai-client"

const METRICS = [
  { label: "GROUP BUY AKTIF",          value: "42",   delta: "+4%",  color: "text-primary",       bar: "bg-primary w-2/3",        glow: "shadow-[0_0_8px_#adc6ff]" },
  { label: "PERSETUJUAN TERTUNDA",      value: "08",   delta: "MENDESAK", color: "text-secondary", bar: "bg-secondary w-1/4",      glow: "" },
  { label: "TOTAL PENGGUNA TERVERIFIKASI", value: "12.4K", delta: "GLOBAL", color: "text-on-surface",bar: "bg-on-surface-variant w-4/5", glow: "" },
  { label: "PENDAPATAN PLATFORM",       value: "$842K", delta: "+12%", color: "text-neon-cyan",     bar: "bg-neon-cyan w-3/4",      glow: "shadow-[0_0_8px_#22D3EE]" },
]

const PROJECTS_QUEUE = [
  { id: "GB-77421", name: "NEON-80 TKL",      creator: "CyberForge",  aiScore: 98, aiColor: "text-success-green", aiBg: "bg-success-green/10 border-success-green/20" },
  { id: "GB-11092", name: "VOID CAPS V2",     creator: "Luna Studio", aiScore: 72, aiColor: "text-secondary",     aiBg: "bg-secondary/10 border-secondary/20" },
  { id: "GB-55612", name: "TITAN SWITCHES",   creator: "Atlas Gears", aiScore: 89, aiColor: "text-primary",       aiBg: "bg-primary/10 border-primary/20" },
]

const CREATOR_QUEUE = [
  { name: 'Alex "Keyth" Rivera', subtitle: "PORTOFOLIO: 12 PROYEK" },
  { name: "Mecha_Design_Ltd",    subtitle: "ENTITAS BARU" },
]

const ALERTS = [
  {
    icon: "warning",
    iconColor: "text-error",
    bgBorder: "bg-error-container/20 border-error/30",
    title: "KETERLAMBATAN LOGISTIK: SHENZHEN",
    desc: "Fasilitas produksi 'Nexus-A' melaporkan penundaan 14 hari untuk housing CNC.",
    animate: true,
  },
  {
    icon: "info",
    iconColor: "text-secondary",
    bgBorder: "glass-panel border-l-4 border-l-secondary",
    title: "BATAS ESCROW TERCAPAI",
    desc: "Proyek 'Zenith-65' memerlukan otorisasi pelepasan dana manual.",
    animate: false,
  },
]

const RISK_CONFIG = {
  LOW:    { color: "text-success-green", bg: "bg-success-green/10", border: "border-success-green/30", icon: "verified",  label: "AMAN" },
  MEDIUM: { color: "text-warning",       bg: "bg-warning/10",        border: "border-warning/30",       icon: "warning",   label: "PERLU PANTAU" },
  HIGH:   { color: "text-error",         bg: "bg-error/10",          border: "border-error/30",         icon: "dangerous", label: "MENCURIGAKAN" },
}

const DEFAULT_FORM = {
  user_id: "user_demo",
  events_per_hour: "250",
  avg_inter_sec: "2.5",
  std_inter_sec: "0.8",
  min_inter_sec: "0.3",
  n_sessions: "1",
  events_per_session: "150",
  cart_ratio: "0.02",
  purchase_ratio: "0.01",
  n_types: "1",
  night_ratio: "0.9",
  unique_products: "2",
}

export default function AdminDashboardPage() {
  const [anomalyForm,   setAnomalyForm]   = useState(DEFAULT_FORM)
  const [anomalyResult, setAnomalyResult] = useState<AnomalyResult | null>(null)
  const [loading,       setLoading]       = useState(false)
  const [error,         setError]         = useState<string | null>(null)

  const handleScan = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setAnomalyResult(null)
    try {
      const result = await detectAnomaly({
        user_id:            anomalyForm.user_id,
        events_per_hour:    parseFloat(anomalyForm.events_per_hour),
        avg_inter_sec:      parseFloat(anomalyForm.avg_inter_sec),
        std_inter_sec:      parseFloat(anomalyForm.std_inter_sec),
        min_inter_sec:      parseFloat(anomalyForm.min_inter_sec),
        n_sessions:         parseInt(anomalyForm.n_sessions),
        events_per_session: parseFloat(anomalyForm.events_per_session),
        cart_ratio:         parseFloat(anomalyForm.cart_ratio),
        purchase_ratio:     parseFloat(anomalyForm.purchase_ratio),
        n_types:            parseInt(anomalyForm.n_types),
        night_ratio:        parseFloat(anomalyForm.night_ratio),
        unique_products:    parseInt(anomalyForm.unique_products),
      })
      setAnomalyResult(result)
    } catch {
      setError("Anomaly Service tidak tersedia. Pastikan server berjalan di localhost:8001.")
    } finally {
      setLoading(false)
    }
  }

  const risk = anomalyResult ? RISK_CONFIG[anomalyResult.risk_level] : null

  return (
    <div className="bg-background text-on-surface font-body-md selection:bg-primary selection:text-on-primary min-h-screen flex flex-col">
      {/* ── Navbar ─────────────────────────────────────────────── */}
      <nav className="bg-deep-void/80 backdrop-blur-xl sticky top-0 z-50 border-b border-surface-stroke shadow-[0_0_20px_rgba(34,211,238,0.1)]">
        <div className="flex justify-between items-center w-full max-w-container-max mx-auto px-margin-desktop h-20">
          <div className="font-headline-sm text-headline-sm tracking-tighter text-primary uppercase">Nexbuy</div>
          <div className="hidden md:flex items-center gap-stack-lg">
            <Link href="/"  className="font-headline-sm text-headline-sm text-on-surface-variant hover:text-primary transition-all">Beranda</Link>
            <Link href="/"  className="font-headline-sm text-headline-sm text-on-surface-variant hover:text-primary transition-all">Produk</Link>
            <a href="#"     className="font-headline-sm text-headline-sm text-on-surface-variant hover:text-primary transition-all">Group Buy</a>
            <a href="#"     className="font-headline-sm text-headline-sm text-primary font-bold border-b-2 border-primary pb-1">Akun</a>
          </div>
          <div className="flex items-center gap-stack-md">
            <div className="relative">
              <span className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer">shopping_cart</span>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer">notifications</span>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
            </div>
            <Link href="/login">
              <span className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer">logout</span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-container-max mx-auto px-margin-desktop py-stack-lg w-full">
        {/* ── Header ─────────────────────────────────────────────── */}
        <header className="mb-section-gap">
          <div className="flex flex-col gap-stack-sm">
            <span className="font-label-mono text-label-mono text-primary uppercase tracking-widest">
              ADMINISTRATIVE INTERFACE v2.04
            </span>
            <h1 className="font-display-lg text-headline-md md:text-display-lg text-on-surface uppercase">
              COMmand center
            </h1>
          </div>
        </header>

        {/* ── Overview Metrics ───────────────────────────────────── */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-section-gap">
          {METRICS.map(({ label, value, delta, color, bar, glow }) => (
            <div key={label} className="glass-panel p-stack-md rounded-lg flex flex-col gap-stack-sm hover:border-primary transition-colors duration-500">
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

        {/* ── Main Grid ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter mb-section-gap">
          {/* Project Verification Table */}
          <div className="lg:col-span-2 flex flex-col gap-stack-md">
            <div className="flex justify-between items-center">
              <h2 className="font-headline-sm text-headline-sm text-on-surface uppercase">VERIFIKASI PROYEK</h2>
              <span className="font-label-mono text-label-mono text-primary cursor-pointer hover:underline uppercase">
                LIHAT SEMUA ANTREAN
              </span>
            </div>
            <div className="glass-panel rounded-lg overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-high border-b border-surface-stroke">
                  <tr>
                    {["ID PROYEK", "KREATOR", "SKOR AI", "AKSI"].map((h, i) => (
                      <th key={h} className={`p-stack-md font-label-mono text-label-mono text-on-surface-variant ${i === 3 ? "text-right" : ""}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-stroke">
                  {PROJECTS_QUEUE.map((p) => (
                    <tr key={p.id} className="hover:bg-surface-container/30 transition-colors">
                      <td className="p-stack-md">
                        <div className="flex flex-col">
                          <span className="font-body-md text-on-surface font-bold">{p.name}</span>
                          <span className="font-label-mono text-[10px] text-on-surface-variant">{p.id}</span>
                        </div>
                      </td>
                      <td className="p-stack-md font-body-md text-on-surface-variant">{p.creator}</td>
                      <td className="p-stack-md">
                        <span className={`px-2 py-1 font-label-mono rounded text-[10px] border ${p.aiBg} ${p.aiColor}`}>
                          {p.aiScore}/100
                        </span>
                      </td>
                      <td className="p-stack-md text-right">
                        <div className="flex justify-end gap-2">
                          <button className="px-2 py-1 bg-primary text-on-primary font-label-mono text-[10px] rounded hover:opacity-90 transition-opacity uppercase">
                            SETUJUI
                          </button>
                          <button className="px-2 py-1 border border-error text-error font-label-mono text-[10px] rounded hover:bg-error/10 transition-colors uppercase">
                            TANGGUHKAN
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Alerts + Creator Queue */}
          <div className="flex flex-col gap-stack-lg">
            {/* System Alerts */}
            <div className="flex flex-col gap-stack-md">
              <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2 uppercase">
                <span className="material-symbols-outlined text-error">report</span>
                PERINGATAN SISTEM
              </h2>
              <div className="flex flex-col gap-stack-sm">
                {ALERTS.map((a) => (
                  <div key={a.title} className={`p-stack-md rounded-lg flex gap-stack-md border ${a.bgBorder} ${a.animate ? "animate-pulse" : ""}`}>
                    <span className={`material-symbols-outlined ${a.iconColor}`}>{a.icon}</span>
                    <div className="flex flex-col">
                      <span className="font-body-md text-on-surface font-bold uppercase">{a.title}</span>
                      <p className="text-[12px] text-on-surface-variant">{a.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Creator Queue */}
            <div className="flex flex-col gap-stack-md">
              <h2 className="font-headline-sm text-headline-sm text-on-surface uppercase">ANTREAN KREATOR</h2>
              <div className="flex flex-col gap-stack-sm">
                {CREATOR_QUEUE.map((c) => (
                  <div key={c.name} className="glass-panel p-stack-md rounded-lg flex items-center justify-between group hover:border-neon-cyan transition-colors">
                    <div className="flex items-center gap-stack-md">
                      <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center border border-surface-stroke">
                        <span className="material-symbols-outlined text-on-surface-variant">person</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-body-md text-on-surface">{c.name}</span>
                        <span className="font-label-mono text-[10px] text-on-surface-variant uppercase">{c.subtitle}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined text-success-green cursor-pointer">check_circle</span>
                      <span className="material-symbols-outlined text-error cursor-pointer">cancel</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── AI Anomaly Detection Widget ────────────────────────── */}
        <section className="mb-section-gap">
          <div className="flex items-center gap-stack-md mb-stack-lg">
            <div className="w-10 h-10 bg-error/10 border border-error/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-error">security</span>
            </div>
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface uppercase">AI Anomaly Detection</h2>
              <p className="font-label-mono text-label-mono text-error">ISOLATION FOREST — TRUST SCORE ENGINE</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
            {/* Form */}
            <div className="glass-panel rounded-lg p-stack-lg">
              <p className="font-label-mono text-label-mono text-on-surface-variant uppercase mb-stack-md">Input Perilaku User</p>
              <form onSubmit={handleScan} className="grid grid-cols-2 gap-stack-sm">
                {/* User ID */}
                <div className="col-span-2 flex flex-col gap-1">
                  <label className="font-label-mono text-[10px] text-on-surface-variant uppercase">User ID</label>
                  <input value={anomalyForm.user_id} onChange={e => setAnomalyForm(f => ({...f, user_id: e.target.value}))}
                    className="w-full bg-deep-void border border-surface-stroke px-3 py-2 text-on-surface font-body-md focus:outline-none focus:border-error transition-colors text-sm" />
                </div>

                {[
                  ["events_per_hour",    "Events/Jam",         "250"],
                  ["avg_inter_sec",      "Avg Jeda (detik)",   "2.5"],
                  ["std_inter_sec",      "Std Jeda (detik)",   "0.8"],
                  ["min_inter_sec",      "Min Jeda (detik)",   "0.3"],
                  ["n_sessions",         "Jumlah Sesi",        "1"],
                  ["events_per_session", "Events/Sesi",        "150"],
                  ["cart_ratio",         "Rasio Cart (0-1)",   "0.02"],
                  ["purchase_ratio",     "Rasio Beli (0-1)",   "0.01"],
                  ["n_types",            "Tipe Event",         "1"],
                  ["night_ratio",        "Rasio Malam (0-1)",  "0.9"],
                  ["unique_products",    "Produk Unik",        "2"],
                ].map(([key, lbl, ph]) => (
                  <div key={key} className="flex flex-col gap-1">
                    <label className="font-label-mono text-[10px] text-on-surface-variant uppercase">{lbl}</label>
                    <input
                      type="number" step="any" placeholder={ph}
                      value={anomalyForm[key as keyof typeof anomalyForm]}
                      onChange={e => setAnomalyForm(f => ({...f, [key]: e.target.value}))}
                      className="w-full bg-deep-void border border-surface-stroke px-3 py-2 text-on-surface font-body-md focus:outline-none focus:border-error transition-colors text-sm"
                    />
                  </div>
                ))}

                <div className="col-span-2 mt-2">
                  <button type="submit" disabled={loading}
                    className="w-full bg-error/20 border border-error/40 text-error font-headline-sm text-headline-sm py-3 hover:bg-error hover:text-on-error transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                    {loading
                      ? <><span className="material-symbols-outlined animate-spin">autorenew</span>SCANNING...</>
                      : <><span className="material-symbols-outlined">radar</span>SCAN ANOMALI</>
                    }
                  </button>
                </div>
              </form>

              {error && (
                <div className="mt-stack-md p-stack-md bg-error-container/20 border border-error/30 rounded flex items-start gap-3">
                  <span className="material-symbols-outlined text-error">warning</span>
                  <p className="font-body-md text-body-md text-error text-sm">{error}</p>
                </div>
              )}
            </div>

            {/* Result */}
            <div className="glass-panel rounded-lg p-stack-lg flex flex-col gap-stack-md">
              <p className="font-label-mono text-label-mono text-on-surface-variant uppercase">Hasil Analisis</p>

              {!anomalyResult && !error && (
                <div className="flex-1 flex flex-col items-center justify-center gap-3 py-8 text-center">
                  <span className="material-symbols-outlined text-5xl text-surface-stroke">radar</span>
                  <p className="font-body-md text-body-md text-on-surface-variant">Isi form dan klik Scan Anomali untuk analisis</p>
                </div>
              )}

              {anomalyResult && risk && (
                <>
                  {/* Trust Score */}
                  <div className={`p-stack-md rounded-lg border ${risk.border} ${risk.bg}`}>
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-label-mono text-label-mono text-on-surface-variant uppercase">Trust Score</span>
                      <span className={`font-label-mono text-[10px] px-2 py-1 rounded uppercase ${risk.bg} ${risk.color} border ${risk.border}`}>
                        {risk.label}
                      </span>
                    </div>
                    <div className="flex items-end gap-2 mb-3">
                      <span className={`font-display-lg text-headline-md ${risk.color}`}>
                        {anomalyResult.trust_score.toFixed(1)}
                      </span>
                      <span className="font-label-mono text-label-mono text-on-surface-variant mb-1">/ 100</span>
                    </div>
                    <div className="h-3 w-full bg-surface-stroke rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${anomalyResult.trust_score}%`,
                          background: anomalyResult.trust_score >= 60 ? "#10B981"
                            : anomalyResult.trust_score >= 40 ? "#F59E0B" : "#ffb4ab"
                        }}
                      />
                    </div>
                    <p className="font-label-mono text-[10px] text-on-surface-variant mt-2">
                      Threshold: &lt;40 = di-exclude dari pipeline AI
                    </p>
                  </div>

                  {/* Detail flags */}
                  <div className="grid grid-cols-2 gap-stack-sm">
                    <div className="bg-deep-void border border-surface-stroke p-3 rounded text-center">
                      <p className="font-label-mono text-[10px] text-on-surface-variant uppercase mb-1">Status</p>
                      <p className={`font-label-mono text-label-mono ${anomalyResult.is_anomaly ? "text-error" : "text-success-green"}`}>
                        {anomalyResult.is_anomaly ? "ANOMALI" : "NORMAL"}
                      </p>
                    </div>
                    <div className="bg-deep-void border border-surface-stroke p-3 rounded text-center">
                      <p className="font-label-mono text-[10px] text-on-surface-variant uppercase mb-1">Pipeline AI</p>
                      <p className={`font-label-mono text-label-mono ${anomalyResult.risk_flag ? "text-error" : "text-success-green"}`}>
                        {anomalyResult.risk_flag ? "EXCLUDED" : "INCLUDED"}
                      </p>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="bg-surface-container p-stack-md rounded flex items-start gap-3">
                    <span className={`material-symbols-outlined fill-icon ${risk.color}`}>{risk.icon}</span>
                    <p className="font-body-md text-body-md text-on-surface-variant text-sm leading-relaxed">
                      {anomalyResult.message}
                    </p>
                  </div>

                  {/* User ID */}
                  <div className="flex justify-between items-center pt-2 border-t border-surface-stroke">
                    <span className="font-label-mono text-[10px] text-on-surface-variant uppercase">User</span>
                    <span className="font-label-mono text-label-mono text-primary">{anomalyResult.user_id}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* ── Admin Flow Steps ───────────────────────────────────── */}
        <section className="py-section-gap border-t border-surface-stroke">
          <div className="text-center mb-stack-lg">
            <h2 className="font-headline-md text-headline-md text-on-surface uppercase">ALUR ADMINISTRASI UTAMA</h2>
            <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">
              Menjamin integritas setiap group buy melalui penyaringan ketat dan pelacakan logistik yang presisi.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {[
              { icon: "verified_user", label: "PENYARINGAN", desc: "Kami memverifikasi latar belakang kreator melalui audit identitas publik, performa proyek sebelumnya, dan validasi kontrak manufaktur.", color: "text-primary", border: "border-primary", tag: "TAHAP 01: KEPATUHAN", tagColor: "text-primary", hoverBg: "hover:bg-primary/5" },
              { icon: "lock",          label: "ESCROW",      desc: "Dana diamankan dalam brankas administratif multi-sig. Pencairan dilakukan secara bertahap ketika pencapaian produksi terverifikasi.", color: "text-secondary", border: "border-secondary", tag: "TAHAP 02: KEAMANAN", tagColor: "text-secondary", hoverBg: "hover:bg-secondary/5" },
              { icon: "local_shipping",label: "PEMENUHAN",   desc: "Integrasi pelacakan langsung dengan pusat internasional (DHL, FedEx, SF Express). Sistem notifikasi otomatis bila pengiriman stagnan 48 jam.", color: "text-neon-cyan", border: "border-neon-cyan", tag: "TAHAP 03: LOGISTIK", tagColor: "text-neon-cyan", hoverBg: "hover:bg-neon-cyan/5" },
            ].map(({ icon, label, desc, color, border, tag, tagColor, hoverBg }) => (
              <div key={label} className={`glass-panel p-stack-lg rounded-lg flex flex-col items-center text-center gap-stack-md group ${hoverBg} transition-all`}>
                <div className={`w-16 h-16 rounded-full bg-surface-container flex items-center justify-center border ${border} group-hover:active-glow transition-all`}>
                  <span className={`material-symbols-outlined ${color} text-3xl`}>{icon}</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface uppercase tracking-tight">{label}</h3>
                <p className="font-body-md text-on-surface-variant">{desc}</p>
                <div className={`w-full pt-stack-sm mt-auto border-t border-surface-stroke font-label-mono text-[10px] ${tagColor} uppercase`}>
                  {tag}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Analytics Banner ───────────────────────────────────── */}
        <section className="py-section-gap relative overflow-hidden rounded-xl mb-section-gap">
          <div className="absolute inset-0 z-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="w-full h-full object-cover opacity-20 grayscale"
              alt="Keyboard switches"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhpyNRaNa3Sm_1rOxv0AvLuzcAaeKE4sUK_YuImO2emnDhJnmA2ADUVMA9Il3S_tYPDYMWXam_OuY9eBDylLpofV3gA6D7GKfdBewX-vNf9X__mgS9MCevvysQxAZ-qY1Fc7G9E1dslCetGQ9bL1Oc_bZZxtTKrrd0_O-fH-ve53CDQJUtxnv4M3ayZupBdhFpefC7An1hUdPU7RlbYkLJl9Q3lnrpW4AAN_wXYlnfudcMkoSCnK-doOEZlUJNUjUfnF0YFt9UosZn"
            />
          </div>
          <div className="relative z-10 p-stack-lg flex flex-col md:flex-row justify-between items-center gap-stack-lg">
            <div className="flex flex-col gap-stack-sm max-w-xl">
              <h2 className="font-headline-md text-headline-md text-on-surface uppercase">ANALITIK PRESISI</h2>
              <p className="font-body-lg text-on-surface-variant">
                Dashboard kami memanfaatkan data waktu nyata dari pusat produksi untuk memberi pandangan 360° tentang pasar keyboard global.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-stack-sm w-full md:w-auto">
              <div className="bg-deep-void/80 border border-primary p-4 rounded text-center">
                <div className="font-label-mono text-[10px] text-primary uppercase">LATENSI</div>
                <div className="font-headline-sm text-headline-sm text-on-surface">14ms</div>
              </div>
              <div className="bg-deep-void/80 border border-secondary p-4 rounded text-center">
                <div className="font-label-mono text-[10px] text-secondary uppercase">WAKTU AKTIF</div>
                <div className="font-headline-sm text-headline-sm text-on-surface">99.9%</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="bg-deep-void py-section-gap border-t border-surface-stroke mt-auto">
        <div className="max-w-container-max mx-auto px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-stack-lg">
          <div className="flex flex-col items-center md:items-start gap-stack-sm">
            <div className="font-headline-sm text-headline-sm text-primary">NEXBUY</div>
            <p className="font-body-md text-body-md text-on-surface-variant text-center md:text-left uppercase">
              © 2024 NEXBUY PRECISION COLLECTIBLES. HAK CIPTA DILINDUNGI UNDANG-UNDANG.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-stack-md">
            {["Ketentuan Layanan","Kebijakan Privasi","Informasi Pengiriman","Discord","Instagram"].map((l) => (
              <a key={l} href="#" className="text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
