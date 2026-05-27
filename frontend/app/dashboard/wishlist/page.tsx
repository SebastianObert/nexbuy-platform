"use client"

import { useState } from "react"
import Link from "next/link"
import ThemeToggle from "@/components/theme-toggle"
import { products } from "@/lib/data/products"

const NAV_ITEMS = [
  { label: "Beranda",  href: "/home",              active: false },
  { label: "Koleksi",  href: "/dashboard",          active: false },
  { label: "Pesanan",  href: "/dashboard/pesanan",  active: false },
  { label: "Wishlist", href: "/dashboard/wishlist", active: true  },
]

const WISHLISTED_IDS = ["neo65-aluminum", "gmk-eclipse", "resin-oni-keycap", "eva-unit-01"]

export default function WishlistPage() {
  const [removed, setRemoved] = useState<string[]>([])

  const wishlistItems = products
    .filter(p => WISHLISTED_IDS.includes(p.id) && !removed.includes(p.id))

  const currency = new Intl.NumberFormat("id-ID", { style: "currency", currency: "USD", maximumFractionDigits: 0 })

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
          <h1 className="nb-h1" style={{ color: "var(--nb-text)" }}>Wishlist</h1>
          <p className="text-sm mt-1" style={{ color: "var(--nb-text-sub)" }}>
            {wishlistItems.length} item tersimpan — jangan sampai kehabisan slot!
          </p>
        </header>

        {wishlistItems.length === 0 ? (
          <div className="nb-card p-16 text-center">
            <p className="text-4xl mb-4">❤️</p>
            <p className="nb-h3 mb-2" style={{ color: "var(--nb-text)" }}>Wishlist kosong</p>
            <p className="text-sm mb-6" style={{ color: "var(--nb-text-sub)" }}>
              Simpan produk favorit agar mudah ditemukan kembali.
            </p>
            <Link href="/dashboard" className="nb-btn-primary px-6 py-2.5 text-sm inline-block">
              Jelajahi Group Buy
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {wishlistItems.map(p => {
              const progress = Math.min(Math.round((p.joinCount / p.moq) * 100), 100)
              return (
                <div key={p.id} className="nb-card overflow-hidden group flex flex-col">
                  {/* Image */}
                  <div className="relative aspect-video overflow-hidden" style={{ background: "var(--nb-surface-low)" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover nb-hover-scale" />
                    <div className="nb-img-overlay absolute inset-0" />
                    <div className="absolute top-3 right-3">
                      <span className="nb-live-badge">● LIVE GB</span>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <span className="nb-ai-chip">🤖 AI {p.aiProbability}</span>
                    </div>
                    {/* Remove button */}
                    <button
                      onClick={() => setRemoved(r => [...r, p.id])}
                      className="absolute top-3 left-3 w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all opacity-0 group-hover:opacity-100"
                      style={{ background: "var(--nb-red)cc", color: "#fff" }}
                      title="Hapus dari wishlist">
                      ✕
                    </button>
                  </div>

                  {/* Info */}
                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <div className="min-w-0 mr-2">
                        <h3 className="text-sm font-semibold truncate group-hover:text-[var(--nb-primary)] transition-colors"
                          style={{ color: "var(--nb-text)" }}>{p.name}</h3>
                        <p className="text-xs mt-0.5" style={{ color: "var(--nb-text-sub)" }}>{p.creator}</p>
                      </div>
                      <span className="text-sm font-bold flex-shrink-0" style={{ color: "var(--nb-primary)", fontFamily: "var(--font-display)" }}>
                        {currency.format(p.price)}
                      </span>
                    </div>

                    <div className="mt-3 mb-4">
                      <div className="flex justify-between text-xs mb-1.5" style={{ color: "var(--nb-text-sub)" }}>
                        <span style={{ color: "var(--nb-primary)" }}>{p.joinCount}/{p.moq} peserta</span>
                        <span>{progress}% terpenuhi</span>
                      </div>
                      <div className="nb-progress-track h-1.5">
                        <div className="nb-progress-fill h-1.5" style={{ width: `${progress}%` }} />
                      </div>
                    </div>

                    <Link href={`/dashboard/products/${p.id}`}
                      className="nb-btn-primary block text-center w-full py-2.5 rounded-xl text-xs font-semibold mt-auto">
                      Lihat & Join →
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
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
