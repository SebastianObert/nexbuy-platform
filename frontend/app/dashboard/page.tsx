"use client"

import Link from "next/link"
import ThemeToggle from "@/components/theme-toggle"
import { products } from "@/lib/data/products"

const STATS = [
  { label: "Proyek Diikuti",    value: "6",     icon: "🛍️", color: "var(--nb-primary)"   },
  { label: "Item Wishlist",     value: "14",    icon: "❤️", color: "var(--nb-secondary)" },
  { label: "Pesanan Aktif",     value: "3",     icon: "📦", color: "var(--nb-cyan)"      },
  { label: "Total Dibelanjakan",value: "12.8M", icon: "💰", color: "var(--nb-green)"     },
]

const NAV_ITEMS = [
  { label: "Beranda",  href: "/home",                  active: false },
  { label: "Koleksi",  href: "/dashboard",             active: true  },
  { label: "Pesanan",  href: "/dashboard/pesanan",     active: false },
  { label: "Wishlist", href: "/dashboard/wishlist",    active: false },
]

export default function CollectorDashboardPage() {
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
          <span className="nb-label text-xs mb-1 block" style={{ color: "var(--nb-primary)" }}>Collector Interface</span>
          <h1 className="nb-h1" style={{ color: "var(--nb-text)" }}>Hub Koleksi</h1>
        </header>

        {/* Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {STATS.map(s => (
            <div key={s.label} className="nb-stat-card flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: `${s.color}15` }}>{s.icon}</div>
              <div className="min-w-0">
                <p className="nb-h3 text-xl font-bold" style={{ color: s.color }}>{s.value}</p>
                <p className="text-xs truncate" style={{ color: "var(--nb-text-sub)" }}>{s.label}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Group Buy Grid */}
        <section>
          <div className="flex justify-between items-center mb-5">
            <h2 className="nb-h3" style={{ color: "var(--nb-text)" }}>Group Buy Aktif</h2>
            <Link href="/home" className="text-sm font-medium transition-colors hover:underline" style={{ color: "var(--nb-primary)" }}>
              Jelajahi Semua →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.slice(0, 8).map((p) => (
              <div key={p.id} className="nb-card overflow-hidden group">
                <div className="relative aspect-video overflow-hidden rounded-t-[14px]" style={{ background: "var(--nb-surface-low)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover nb-hover-scale" />
                  <div className="nb-img-overlay absolute inset-0" />
                  <div className="absolute top-3 right-3">
                    <span className="nb-live-badge">● LIVE GB</span>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span className="nb-ai-chip">🤖 AI {p.aiProbability}</span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="min-w-0 mr-2">
                      <h3 className="text-sm font-semibold truncate group-hover:text-[var(--nb-primary)] transition-colors"
                        style={{ color: "var(--nb-text)" }}>{p.name}</h3>
                      <p className="text-xs mt-0.5" style={{ color: "var(--nb-text-sub)" }}>{p.creator}</p>
                    </div>
                    <span className="text-sm font-bold flex-shrink-0" style={{ color: "var(--nb-primary)", fontFamily: "var(--font-display)" }}>
                      ${p.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1.5" style={{ color: "var(--nb-text-sub)" }}>
                      <span style={{ color: "var(--nb-primary)" }}>{p.joinCount}/{p.moq} peserta</span>
                      <span>{Math.round((p.joinCount / p.moq) * 100)}% terpenuhi</span>
                    </div>
                    <div className="nb-progress-track h-1.5">
                      <div className="nb-progress-fill h-1.5" style={{ width: `${Math.min((p.joinCount / p.moq) * 100, 100)}%` }} />
                    </div>
                  </div>
                  <Link href={`/dashboard/products/${p.id}`}
                    className="nb-btn-primary block text-center mt-4 w-full py-2.5 rounded-xl text-xs font-semibold">
                    Join Group Buy
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="mt-auto" style={{ borderTop: "1px solid var(--nb-stroke)" }}>
        <div className="nb-container py-4 flex justify-between items-center">
          <p className="text-xs" style={{ color: "var(--nb-text-dim)" }}>© 2024 NexBuy Collector Portal</p>
          <Link href="/login" className="text-xs transition-colors hover:text-[var(--nb-primary)]" style={{ color: "var(--nb-text-dim)" }}>
            Ganti Akun
          </Link>
        </div>
      </footer>
    </div>
  )
}
