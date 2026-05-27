"use client"

import { useState } from "react"
import Link from "next/link"
import ThemeToggle from "@/components/theme-toggle"

const PRODUCTS = [
  { id: "aurora-r2",   detailId: "neo65-aluminum",  name: "Aurora R2",    creator: "Studio Kanvas", price: "Rp 4.2M", funded: 142, daysLeft: 12, aiScore: 92, badge: "LIVE GB", progressPct: 100, img: "/images/product-case.jpg"          },
  { id: "oceanus-set", detailId: "resin-oni-keycap", name: "Oceanus Set",  creator: "Resin Lab",     price: "Rp 850K", funded: 68,  daysLeft: 21, aiScore: 78, badge: null,      progressPct: 68,  img: "/images/product-keycap.png"         },
  { id: "specter-v3",  detailId: "eva-unit-01",      name: "Specter v3",   creator: "Mono Toys",     price: "Rp 1.4M", funded: 95,  daysLeft: 7,  aiScore: 88, badge: "LIVE GB", progressPct: 95,  img: "/images/product-figure.png"         },
  { id: "teal75",      detailId: "gmk-eclipse",      name: "Teal75 Alum",  creator: "Forge & Co",    price: "Rp 6.8M", funded: 53,  daysLeft: 28, aiScore: 71, badge: null,      progressPct: 53,  img: "/images/product-case.jpg"           },
]

const AI_ROWS = [
  { label: "Designer History",  value: "ELITE",    color: "var(--nb-green)"  },
  { label: "Timeline Integrity",value: "98%",      color: "var(--nb-primary)"},
  { label: "Social Sentiment",  value: "POSITIVE", color: "var(--nb-cyan)"   },
]

const HOW_STEPS = [
  { icon: "🔍", label: "Temukan", desc: "Jelajahi proyek artisan yang terkurasi." },
  { icon: "🤝", label: "Gabung",  desc: "Berikan dukungan selama jendela group buy." },
  { icon: "💳", label: "Danai",   desc: "Kekuatan kolektif menurunkan biaya manufaktur." },
  { icon: "📦", label: "Terima",  desc: "Mahakarya dirakit dan dikirimkan ke tanganmu." },
]

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState("Semua")
  const filters = ["Semua", "Keyboard", "Keycaps", "Figure", "Audio"]

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--nb-bg)", color: "var(--nb-text)" }}>

      {/* ── Navbar ─────────────────────────────────────────────── */}
      <nav className="nb-navbar sticky top-0 z-50">
        <div className="nb-container h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/home" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                style={{ background: "linear-gradient(135deg, var(--nb-primary), var(--nb-secondary))" }}>N</div>
              <span className="font-bold text-lg" style={{ fontFamily: "var(--font-display)", color: "var(--nb-text)" }}>NexBuy</span>
            </Link>
            <div className="hidden md:flex gap-6">
              <Link href="/home" className="text-sm font-semibold" style={{ color: "var(--nb-primary)" }}>Beranda</Link>
              <a href="#discover" className="text-sm font-medium transition-colors hover:text-[var(--nb-primary)]" style={{ color: "var(--nb-text-sub)" }}>Produk</a>
              <a href="#how"      className="text-sm font-medium transition-colors hover:text-[var(--nb-primary)]" style={{ color: "var(--nb-text-sub)" }}>Group Buy</a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden lg:block relative">
              <input
                className="nb-input h-9 pl-10 pr-4 text-sm w-56"
                placeholder="Cari produk..."
                type="text"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: "var(--nb-text-dim)" }}>🔍</span>
            </div>
            <ThemeToggle />
            <Link href="/login" className="nb-btn-ghost px-4 py-2 text-sm flex items-center gap-1.5">
              <span>🚪</span> Keluar
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">

        {/* ── Hero ───────────────────────────────────────────────── */}
        <section className="nb-hero-gradient relative py-20 md:py-28 overflow-hidden" style={{ borderBottom: "1px solid var(--nb-stroke)" }}>
          {/* Glow orbs */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[130px] opacity-15 pointer-events-none"
            style={{ background: "var(--nb-primary)" }} />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[110px] opacity-10 pointer-events-none"
            style={{ background: "var(--nb-secondary)" }} />

          <div className="nb-container relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

              {/* Left: text */}
              <div className="nb-animate-fade-up">
                <span className="nb-badge nb-badge-blue mb-5 inline-flex">● 1,200+ CAMPAIGN AKTIF</span>
                <h1 className="nb-display mb-5" style={{ color: "var(--nb-text)" }}>
                  Platform<br />
                  <span className="nb-gradient-text">Group Buy</span><br />
                  Premium
                </h1>
                <p className="text-lg mb-8 max-w-lg leading-relaxed" style={{ color: "var(--nb-text-sub)" }}>
                  Jelajahi dan ikuti group buy eksklusif untuk kolektor keyboard, artisan keycap, figure, dan aksesori hobby premium.
                </p>
                <div className="flex gap-4 flex-wrap">
                  <Link href="/dashboard" className="nb-btn-primary px-7 py-3.5 text-sm flex items-center gap-2">
                    Jelajahi Koleksi <span>→</span>
                  </Link>
                  <Link href="/login" className="nb-btn-ghost px-7 py-3.5 text-sm">Mulai Group Buy</Link>
                </div>
                <div className="flex items-center gap-8 mt-10 pt-8" style={{ borderTop: "1px solid var(--nb-stroke)" }}>
                  {[["1,200+", "Campaign Aktif"], ["48K+", "Kolektor"], ["Rp 2.4M", "Rata-rata Hemat"]].map(([v, l]) => (
                    <div key={l}>
                      <p className="text-xl font-bold nb-gradient-text" style={{ fontFamily: "var(--font-display)" }}>{v}</p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--nb-text-dim)" }}>{l}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: product preview card */}
              <div className="hidden lg:flex flex-col gap-4 nb-animate-fade-in">
                <div className="nb-glass rounded-2xl p-5">
                  <div className="aspect-video rounded-xl overflow-hidden mb-4" style={{ background: "var(--nb-surface-low)" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/images/hero-keyboard.jpg" alt="Aurora R2" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-sm" style={{ color: "var(--nb-text)" }}>Aurora R2 — Studio Kanvas</h3>
                      <p className="text-xs mt-0.5" style={{ color: "var(--nb-text-sub)" }}>65% CNC Aluminum · Gasket Mount</p>
                    </div>
                    <span className="nb-live-badge">● LIVE</span>
                  </div>
                  <div className="nb-progress-track h-2 mb-2">
                    <div className="nb-progress-fill h-2" style={{ width: "92%" }} />
                  </div>
                  <div className="flex justify-between items-center text-xs" style={{ color: "var(--nb-text-sub)" }}>
                    <span style={{ color: "var(--nb-primary)" }}>92% terpenuhi · 142 peserta</span>
                    <span className="nb-ai-chip">🤖 AI 92</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  {["🔒 Escrow Protected", "🤖 AI Predictions", "⭐ Verified Sellers"].map((t) => (
                    <span key={t} className="nb-badge nb-badge-blue text-[11px] flex-1 justify-center">{t}</span>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── Discover ───────────────────────────────────────────── */}
        <section id="discover" className="nb-section">
          <div className="nb-container">
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
              <div>
                <span className="nb-label text-xs mb-1 block" style={{ color: "var(--nb-primary)" }}>Koleksi Terkurasi</span>
                <h2 className="nb-h2" style={{ color: "var(--nb-text)" }}>Jelajahi Koleksi</h2>
                <p className="text-sm mt-1" style={{ color: "var(--nb-text-sub)" }}>Proyek terkurasi dengan keamanan yang didukung komunitas.</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {filters.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all"
                    style={{
                      background: activeFilter === cat ? "var(--nb-primary)" : "var(--nb-surface-low)",
                      color: activeFilter === cat ? "#fff" : "var(--nb-text-sub)",
                      border: "1.5px solid",
                      borderColor: activeFilter === cat ? "var(--nb-primary)" : "var(--nb-stroke)",
                    }}
                  >{cat}</button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {PRODUCTS.map((p) => (
                <Link href={`/dashboard/products/${p.detailId}`} key={p.id}>
                  <div className="nb-card overflow-hidden group cursor-pointer">
                    <div className="relative aspect-square overflow-hidden rounded-t-[14px]" style={{ background: "var(--nb-surface-low)" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img className="w-full h-full object-cover nb-hover-scale" alt={p.name} src={p.img} />
                      <div className="nb-img-overlay absolute inset-0" />
                      {p.badge && (
                        <div className="absolute top-3 left-3">
                          <span className="nb-live-badge">{p.badge}</span>
                        </div>
                      )}
                      <div className="absolute bottom-3 left-3">
                        <span className="nb-ai-chip">🤖 AI {p.aiScore}</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-sm font-semibold group-hover:text-[var(--nb-primary)] transition-colors" style={{ color: "var(--nb-text)" }}>{p.name}</h3>
                          <p className="text-xs mt-0.5" style={{ color: "var(--nb-text-sub)" }}>{p.creator}</p>
                        </div>
                        <span className="text-sm font-bold" style={{ color: "var(--nb-primary)", fontFamily: "var(--font-display)" }}>{p.price}</span>
                      </div>
                      <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1.5" style={{ color: "var(--nb-text-sub)" }}>
                          <span style={{ color: "var(--nb-primary)" }}>{p.funded}% funded</span>
                          <span>{p.daysLeft}d left</span>
                        </div>
                        <div className="nb-progress-track h-1.5">
                          <div className="nb-progress-fill h-1.5" style={{ width: `${p.progressPct}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── AI Showcase ────────────────────────────────────────── */}
        <section className="nb-section" style={{ background: "var(--nb-surface-low)", borderTop: "1px solid var(--nb-stroke)", borderBottom: "1px solid var(--nb-stroke)" }}>
          <div className="nb-container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -top-8 -left-8 w-48 h-48 rounded-full blur-[80px] opacity-20" style={{ background: "var(--nb-primary)" }} />
              <div className="nb-glass rounded-2xl p-6 relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl" style={{ background: "var(--nb-primary-soft)" }}>🤖</div>
                  <div>
                    <h3 className="nb-h3" style={{ color: "var(--nb-text)" }}>AI Score</h3>
                    <span className="nb-badge nb-badge-blue text-[10px]">Trust Protocol v2.4</span>
                  </div>
                </div>
                <div className="space-y-3">
                  {AI_ROWS.map((row) => (
                    <div key={row.label} className="flex justify-between items-center px-4 py-3 rounded-xl" style={{ background: "var(--nb-surface-high)" }}>
                      <span className="text-sm" style={{ color: "var(--nb-text-sub)" }}>{row.label}</span>
                      <span className="text-sm font-bold" style={{ color: row.color }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <span className="nb-label text-xs mb-3 block" style={{ color: "var(--nb-secondary)" }}>Teknologi AI</span>
              <h2 className="nb-h2 mb-4" style={{ color: "var(--nb-text)" }}>
                Dibangun di atas Data,{" "}
                <span className="nb-gradient-text">Digerakkan oleh Komunitas.</span>
              </h2>
              <p className="text-base mb-6 leading-relaxed" style={{ color: "var(--nb-text-sub)" }}>
                AI Score kami menganalisis data historis, kapabilitas manufaktur, dan kepercayaan sosial untuk penilaian risiko setiap group buy.
              </p>
              <ul className="space-y-3">
                {["Kontrak manufaktur terverifikasi sebelum listing.", "Perlindungan pendanaan berbasis Escrow.", "Pembaruan perakitan & pengiriman real-time."].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-lg mt-0.5" style={{ color: "var(--nb-green)" }}>✓</span>
                    <span className="text-sm" style={{ color: "var(--nb-text)" }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── How it works ───────────────────────────────────────── */}
        <section id="how" className="nb-section text-center">
          <div className="nb-container">
            <span className="nb-label text-xs mb-2 block" style={{ color: "var(--nb-primary)" }}>Cara Kerja</span>
            <h2 className="nb-h2 mb-12" style={{ color: "var(--nb-text)" }}>Perjalanan Kolektor</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 relative">
              <div className="hidden md:block absolute top-8 left-[18%] right-[18%] h-px" style={{ background: "linear-gradient(to right, transparent, var(--nb-stroke), transparent)" }} />
              {HOW_STEPS.map((s, i) => (
                <div key={s.label} className="nb-card p-6 flex flex-col items-center nb-animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-4 relative z-10" style={{ background: "var(--nb-surface-low)", border: "1.5px solid var(--nb-stroke)" }}>
                    {s.icon}
                  </div>
                  <h4 className="font-semibold mb-2" style={{ color: "var(--nb-text)", fontFamily: "var(--font-display)" }}>{s.label}</h4>
                  <p className="text-sm" style={{ color: "var(--nb-text-sub)" }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer style={{ background: "var(--nb-surface-low)", borderTop: "1px solid var(--nb-stroke)" }}>
        <div className="nb-container py-12">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                  style={{ background: "linear-gradient(135deg, var(--nb-primary), var(--nb-secondary))" }}>N</div>
                <span className="font-bold" style={{ color: "var(--nb-text)", fontFamily: "var(--font-display)" }}>NexBuy</span>
              </div>
              <p className="text-sm max-w-[240px]" style={{ color: "var(--nb-text-sub)" }}>
                Platform group buy eksklusif untuk kolektor hobby premium.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-8">
              {[
                { title: "Company",  links: ["Tentang Kami", "Karir"]           },
                { title: "Support",  links: ["Info Pengiriman", "Bantuan"]      },
                { title: "Legal",    links: ["Ketentuan", "Privasi"]            },
              ].map(({ title, links }) => (
                <div key={title}>
                  <h5 className="nb-label text-[11px] mb-3" style={{ color: "var(--nb-text)" }}>{title}</h5>
                  {links.map((l) => (
                    <a key={l} href="#" className="block text-sm mb-2 transition-colors hover:text-[var(--nb-primary)]" style={{ color: "var(--nb-text-sub)" }}>{l}</a>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="nb-divider pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs" style={{ color: "var(--nb-text-dim)" }}>© 2024 NexBuy Precision Collectibles. Hak cipta dilindungi.</p>
            <ThemeToggle />
          </div>
        </div>
      </footer>
    </div>
  )
}
