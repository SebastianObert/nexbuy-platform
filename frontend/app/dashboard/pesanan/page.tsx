"use client"

import Link from "next/link"
import ThemeToggle from "@/components/theme-toggle"

const NAV_ITEMS = [
  { label: "Beranda",  href: "/home",               active: false },
  { label: "Koleksi",  href: "/dashboard",           active: false },
  { label: "Pesanan",  href: "/dashboard/pesanan",   active: true  },
  { label: "Wishlist", href: "/dashboard/wishlist",  active: false },
]

const ORDERS = [
  {
    id: "NXB-2401",
    name: "Neo65 Aluminum Keyboard Kit",
    variant: "Silver · Qty 1",
    category: "Keyboard Kits",
    price: "Rp 4.200.000",
    date: "12 Mar 2024",
    status: "Produksi",
    statusColor: "var(--nb-amber)",
    progress: [
      { label: "Pembayaran Diterima", done: true  },
      { label: "MOQ Tercapai",        done: true  },
      { label: "Produksi",            done: false, active: true },
      { label: "Quality Check",       done: false },
      { label: "Pengiriman",          done: false },
      { label: "Selesai",             done: false },
    ],
    eta: "Sept 2024",
    img: "/images/product-case.jpg",
  },
  {
    id: "NXB-2389",
    name: "GMK Eclipse Keycaps",
    variant: "Base Kit · Qty 1",
    category: "Keycaps",
    price: "Rp 850.000",
    date: "28 Feb 2024",
    status: "Pengiriman",
    statusColor: "var(--nb-cyan)",
    progress: [
      { label: "Pembayaran Diterima", done: true  },
      { label: "MOQ Tercapai",        done: true  },
      { label: "Produksi",            done: true  },
      { label: "Quality Check",       done: true  },
      { label: "Pengiriman",          done: false, active: true },
      { label: "Selesai",             done: false },
    ],
    eta: "Jun 2024",
    img: "/images/product-keycap.png",
  },
  {
    id: "NXB-2201",
    name: "Resin Oni Artisan Keycap",
    variant: "Blood Moon · Qty 1",
    category: "Artisan",
    price: "Rp 680.000",
    date: "5 Jan 2024",
    status: "Selesai",
    statusColor: "var(--nb-green)",
    progress: [
      { label: "Pembayaran Diterima", done: true },
      { label: "MOQ Tercapai",        done: true },
      { label: "Produksi",            done: true },
      { label: "Quality Check",       done: true },
      { label: "Pengiriman",          done: true },
      { label: "Selesai",             done: true },
    ],
    eta: "Selesai",
    img: "/images/product-keycap.png",
  },
]

const STATUS_BADGE: Record<string, { bg: string; text: string }> = {
  "Produksi":   { bg: "var(--nb-amber)15",   text: "var(--nb-amber)"   },
  "Pengiriman": { bg: "var(--nb-cyan)15",     text: "var(--nb-cyan)"    },
  "Selesai":    { bg: "var(--nb-green)15",    text: "var(--nb-green)"   },
  "Menunggu":   { bg: "var(--nb-primary)15",  text: "var(--nb-primary)" },
}

export default function PesananPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--nb-bg)", color: "var(--nb-text)" }}>

      {/* Navbar */}
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
        <header className="mb-8">
          <span className="nb-label text-xs mb-1 block" style={{ color: "var(--nb-primary)" }}>Collector Interface</span>
          <h1 className="nb-h1" style={{ color: "var(--nb-text)" }}>Pesanan Saya</h1>
          <p className="text-sm mt-1" style={{ color: "var(--nb-text-sub)" }}>Pantau status produksi & pengiriman group buy yang kamu ikuti.</p>
        </header>

        {/* Summary chips */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {[
            { label: "Semua",      count: ORDERS.length,                                       active: true  },
            { label: "Aktif",      count: ORDERS.filter(o => o.status !== "Selesai").length,   active: false },
            { label: "Selesai",    count: ORDERS.filter(o => o.status === "Selesai").length,   active: false },
          ].map(f => (
            <div key={f.label}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
              style={{
                background: f.active ? "var(--nb-primary)" : "var(--nb-surface-low)",
                color: f.active ? "#fff" : "var(--nb-text-sub)",
                border: `1.5px solid ${f.active ? "var(--nb-primary)" : "var(--nb-stroke)"}`,
              }}>
              {f.label}
              <span className="text-xs px-1.5 py-0.5 rounded-md font-bold"
                style={{ background: f.active ? "rgba(255,255,255,0.2)" : "var(--nb-surface-high)", color: f.active ? "#fff" : "var(--nb-text-sub)" }}>
                {f.count}
              </span>
            </div>
          ))}
        </div>

        {/* Order cards */}
        <div className="space-y-5">
          {ORDERS.map(order => {
            const badge = STATUS_BADGE[order.status] ?? STATUS_BADGE["Menunggu"]
            const doneCount = order.progress.filter(p => p.done).length
            const totalCount = order.progress.length
            const pct = Math.round((doneCount / totalCount) * 100)

            return (
              <div key={order.id} className="nb-card overflow-hidden">
                {/* Top bar */}
                <div className="flex items-center justify-between px-5 py-3"
                  style={{ borderBottom: "1px solid var(--nb-stroke)", background: "var(--nb-surface-low)" }}>
                  <div className="flex items-center gap-3">
                    <span className="nb-label text-xs" style={{ color: "var(--nb-text-dim)" }}>{order.id}</span>
                    <span className="text-xs" style={{ color: "var(--nb-text-dim)" }}>·</span>
                    <span className="text-xs" style={{ color: "var(--nb-text-dim)" }}>{order.date}</span>
                  </div>
                  <span className="nb-label text-xs px-2.5 py-1 rounded-lg font-semibold"
                    style={{ background: badge.bg, color: badge.text, border: `1px solid ${badge.text}30` }}>
                    {order.status === "Selesai" ? "✓ " : "● "}{order.status}
                  </span>
                </div>

                <div className="p-5 grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-5">
                  {/* Product image */}
                  <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0"
                    style={{ background: "var(--nb-surface-low)", border: "1px solid var(--nb-stroke)" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={order.img} alt={order.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex flex-col gap-4 min-w-0">
                    {/* Name + price */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: "var(--nb-text)" }}>{order.name}</p>
                        <p className="text-xs mt-0.5" style={{ color: "var(--nb-text-sub)" }}>{order.variant} · {order.category}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold" style={{ color: "var(--nb-primary)" }}>{order.price}</p>
                        <p className="text-xs mt-0.5" style={{ color: "var(--nb-text-dim)" }}>ETA: {order.eta}</p>
                      </div>
                    </div>

                    {/* Progress steps */}
                    <div>
                      <div className="flex justify-between text-xs mb-2">
                        <span style={{ color: "var(--nb-text-sub)" }}>Progress pengerjaan</span>
                        <span style={{ color: "var(--nb-primary)" }}>{pct}%</span>
                      </div>
                      <div className="nb-progress-track h-1.5 mb-3">
                        <div className="nb-progress-fill h-1.5 transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="flex gap-1 flex-wrap">
                        {order.progress.map((step, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-lg"
                            style={{
                              background: step.done
                                ? "var(--nb-green)15"
                                : step.active
                                ? "var(--nb-primary)15"
                                : "var(--nb-surface-low)",
                              color: step.done
                                ? "var(--nb-green)"
                                : step.active
                                ? "var(--nb-primary)"
                                : "var(--nb-text-dim)",
                              border: `1px solid ${step.done ? "var(--nb-green)30" : step.active ? "var(--nb-primary)30" : "var(--nb-stroke)"}`,
                              fontWeight: step.active ? 600 : 400,
                            }}>
                            {step.done ? "✓" : step.active ? "●" : "○"} {step.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </main>

      <footer className="mt-auto" style={{ borderTop: "1px solid var(--nb-stroke)" }}>
        <div className="nb-container py-4 flex justify-between items-center">
          <p className="text-xs" style={{ color: "var(--nb-text-dim)" }}>© 2024 NexBuy Collector Portal</p>
          <Link href="/login" className="text-xs transition-colors hover:text-[var(--nb-primary)]" style={{ color: "var(--nb-text-dim)" }}>Ganti Akun</Link>
        </div>
      </footer>
    </div>
  )
}
