"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  ArrowLeft, CheckCircle2, Heart, Minus, Plus, ShieldCheck, Sparkles, Star, ThumbsUp, Timer,
} from "lucide-react"
import ThemeToggle from "@/components/theme-toggle"
import type { Product } from "@/types"

interface ProductDetailExperienceProps {
  product: Product
  relatedProducts: Product[]
}

const currency = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

function colorForOption(option: string) {
  const colorMap: Record<string, string> = {
    Silver: "linear-gradient(135deg, #f8fafc, #94a3b8)",
    Black: "linear-gradient(135deg, #020617, #334155)",
    "E-White": "linear-gradient(135deg, #ffffff, #dbeafe)",
    Navy: "linear-gradient(135deg, #0f172a, #1d4ed8)",
    "Blood Moon": "linear-gradient(135deg, #7f1d1d, #ef4444)",
    Smoke: "linear-gradient(135deg, #111827, #9ca3af)",
    "Bone White": "linear-gradient(135deg, #fff7ed, #d6d3d1)",
    "Raw Titanium": "linear-gradient(135deg, #e5e7eb, #64748b)",
    Stonewashed: "linear-gradient(135deg, #475569, #cbd5e1)",
    "Black PVD": "linear-gradient(135deg, #030712, #1f2937)",
  }
  return colorMap[option]
}

function getDaysLeft(deadline: string) {
  const now = new Date()
  const end = new Date(`${deadline}T23:59:59`)
  const diff = end.getTime() - now.getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

const PRODUCT_REVIEWS = [
  { initials: "JD", name: "Josh Digital",    handle: "@josh_digital",   role: "Pembeli Terverifikasi", stars: 5, date: "Mar 2024", text: "Kualitas build-nya luar biasa. AI Score benar-benar akurat soal lead time — semua sesuai estimasi. Proses escrow sangat membantu rasa aman.", helpful: 24 },
  { initials: "KL", name: "Keeb Lord",        handle: "@keeb_lord",       role: "Kontributor",           stars: 4, date: "Feb 2024", text: "Packaging premium, kondisi produk sempurna. Satu bintang dikurangi karena pengiriman terlambat 3 hari, tapi creator aktif update di thread.", helpful: 17 },
  { initials: "MR", name: "Mechanic Reaper",  handle: "@mechanic_reaper", role: "Kolektor Kelas Kakap",  stars: 5, date: "Jan 2024", text: "Sudah beli 4x GB lewat NexBuy. Sistem escrow-nya bikin tenang banget — uang tidak kemana-mana sebelum MOQ tercapai dan milestone creator divalidasi.", helpful: 31 },
  { initials: "SY", name: "Sakura Yuki",      handle: "@sakura_yuki",     role: "Pembeli Terverifikasi", stars: 5, date: "Des 2023", text: "Pertama kali ikut group buy dan pengalamannya sangat smooth. Dashboard memudahkan tracking progress MOQ secara real-time.", helpful: 12 },
]

const NAV_ITEMS = [
  { label: "Beranda",  href: "/home",      active: false },
  { label: "Koleksi",  href: "/dashboard", active: true  },
  { label: "Pesanan",  href: "#",          active: false },
  { label: "Wishlist", href: "#",          active: false },
]

export function ProductDetailExperience({ product, relatedProducts }: ProductDetailExperienceProps) {
  const gallery = product.gallery?.length ? product.gallery : [product.image]
  const variants = product.variants ?? []
  const [activeImage, setActiveImage] = useState(gallery[0])
  const [quantity, setQuantity] = useState(1)
  const [wishlisted, setWishlisted] = useState(false)
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>(() =>
    variants.reduce<Record<string, string>>((acc, variant) => {
      acc[variant.name] = variant.options[0] ?? ""
      return acc
    }, {}),
  )

  const progress = Math.min(Math.round((product.joinCount / product.moq) * 100), 100)
  const daysLeft = getDaysLeft(product.deadline)
  const subtotal = product.price * quantity
  const escrowDeposit = Math.round(subtotal * 0.2)
  const availableSlots = product.availableSlots ?? Math.max(product.moq - product.joinCount, 0)
  const riskLevel = product.riskLevel ?? "low"
  const specs = product.specifications ?? []
  const includes = product.includes ?? ["Selected product", "Creator authenticity note", "NexBuy escrow coverage"]
  const timeline = product.timeline ?? []

  const checkoutHref = useMemo(() => {
    const params = new URLSearchParams()
    params.set("qty", String(quantity))
    Object.entries(selectedVariants).forEach(([name, value]) => {
      if (value) params.set(name, value)
    })
    return `/dashboard/checkout/${product.id}?${params.toString()}`
  }, [product.id, quantity, selectedVariants])

  const riskColor = { low: "var(--nb-green)", medium: "var(--nb-amber)", high: "var(--nb-red)" }[riskLevel]

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--nb-bg)", color: "var(--nb-text)" }}>

      {/* ── Navbar ─────────────────────────────────────────────── */}
      <nav className="nb-navbar sticky top-0 z-50">
        <div className="nb-container h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2">
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
            <button
              onClick={() => setWishlisted(w => !w)}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
              style={{
                background: wishlisted ? "var(--nb-red)15" : "var(--nb-surface-low)",
                border: `1.5px solid ${wishlisted ? "var(--nb-red)" : "var(--nb-stroke)"}`,
                color: wishlisted ? "var(--nb-red)" : "var(--nb-text-sub)",
              }}>
              <Heart className={`h-4 w-4 ${wishlisted ? "fill-current" : ""}`} />
            </button>
            <ThemeToggle />
            <Link href="/login" className="nb-btn-ghost px-4 py-2 text-sm flex items-center gap-1.5">
              <span>🚪</span> Keluar
            </Link>
          </div>
        </div>
      </nav>

      <main className="nb-container py-8 flex-1">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8">
          <Link href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm transition-colors hover:text-[var(--nb-primary)]"
            style={{ color: "var(--nb-text-sub)" }}>
            <ArrowLeft className="h-4 w-4" /> Kembali ke dashboard
          </Link>
          <span style={{ color: "var(--nb-text-dim)" }}>/</span>
          <span className="text-sm font-medium" style={{ color: "var(--nb-primary)" }}>{product.category}</span>
        </div>

        {/* ── Product Section ──────────────────────────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 mb-12">

          {/* Gallery */}
          <div className="space-y-4">
            <div className="nb-card overflow-hidden">
              <div className="relative aspect-[4/3] overflow-hidden" style={{ background: "var(--nb-surface-low)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={activeImage} alt={product.name} className="h-full w-full object-cover" />
                <div className="absolute left-4 top-4 flex gap-2">
                  <span className="nb-live-badge">● LIVE GB</span>
                  <span className="nb-ai-chip">🤖 AI VERIFIED</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {gallery.map((image) => (
                <button key={image} onClick={() => setActiveImage(image)}
                  className="aspect-video rounded-xl overflow-hidden transition-all"
                  style={{
                    border: `2px solid ${activeImage === image ? "var(--nb-primary)" : "var(--nb-stroke)"}`,
                    background: "var(--nb-surface-low)",
                    boxShadow: activeImage === image ? "0 0 0 3px var(--nb-primary-glow)" : "none",
                  }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info sidebar */}
          <aside className="nb-card p-6 h-fit lg:sticky lg:top-24">
            <div className="flex items-center gap-2 mb-4">
              <span className="nb-label text-xs font-semibold" style={{ color: "var(--nb-primary)" }}>{product.creator}</span>
              <span style={{ color: "var(--nb-text-dim)" }}>/</span>
              <span className="nb-label text-xs" style={{ color: "var(--nb-text-sub)" }}>{product.category}</span>
            </div>

            <div className="flex items-start justify-between gap-4 mb-5">
              <div className="min-w-0">
                <h1 className="nb-h2 mb-2" style={{ color: "var(--nb-text)" }}>{product.name}</h1>
                <p className="text-sm leading-relaxed" style={{ color: "var(--nb-text-sub)" }}>{product.description}</p>
              </div>
              <button onClick={() => setWishlisted(w => !w)}
                className="flex-shrink-0 p-2.5 rounded-xl transition-all"
                style={{
                  border: `1.5px solid ${wishlisted ? "var(--nb-red)" : "var(--nb-stroke)"}`,
                  color: wishlisted ? "var(--nb-red)" : "var(--nb-text-sub)",
                  background: wishlisted ? "var(--nb-red)12" : "transparent",
                }}>
                <Heart className={`h-5 w-5 ${wishlisted ? "fill-current" : ""}`} />
              </button>
            </div>

            <div className="flex items-end justify-between py-4 mb-5"
              style={{ borderTop: "1px solid var(--nb-stroke)", borderBottom: "1px solid var(--nb-stroke)" }}>
              <div>
                <p className="nb-label text-xs mb-1" style={{ color: "var(--nb-text-sub)" }}>Harga per unit</p>
                <p className="nb-price" style={{ color: "var(--nb-primary)" }}>{currency.format(product.price)}</p>
              </div>
              <div className="text-right">
                <p className="nb-label text-xs mb-1" style={{ color: "var(--nb-text-sub)" }}>Slot tersisa</p>
                <p className="nb-h3" style={{ color: "var(--nb-text)" }}>{availableSlots}</p>
              </div>
            </div>

            {/* Variants */}
            <div className="space-y-5">
              {variants.map((variant) => (
                <div key={variant.name}>
                  <div className="flex justify-between mb-2">
                    <p className="nb-label text-xs" style={{ color: "var(--nb-text-sub)" }}>{variant.name}</p>
                    <p className="nb-label text-xs" style={{ color: "var(--nb-primary)" }}>{selectedVariants[variant.name]}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {variant.options.map((option) => {
                      const swatch = colorForOption(option)
                      const selected = selectedVariants[variant.name] === option
                      return (
                        <button key={option}
                          onClick={() => setSelectedVariants((c) => ({ ...c, [variant.name]: option }))}
                          className="min-h-10 px-3 py-2 rounded-xl text-xs font-medium transition-all"
                          style={{
                            border: `1.5px solid ${selected ? "var(--nb-primary)" : "var(--nb-stroke)"}`,
                            background: selected ? "var(--nb-primary-soft)" : "var(--nb-surface-low)",
                            color: selected ? "var(--nb-primary)" : "var(--nb-text-sub)",
                            boxShadow: selected ? "0 0 0 3px var(--nb-primary-glow)" : "none",
                          }}>
                          <span className="inline-flex items-center gap-2">
                            {swatch && <span className="h-4 w-4 rounded-full border border-white/20" style={{ background: swatch }} />}
                            {option}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}

              {/* Quantity */}
              <div>
                <p className="nb-label text-xs mb-2" style={{ color: "var(--nb-text-sub)" }}>Quantity</p>
                <div className="flex items-center justify-between rounded-xl overflow-hidden"
                  style={{ border: "1.5px solid var(--nb-stroke)", background: "var(--nb-surface-low)" }}>
                  <button onClick={() => setQuantity((v) => Math.max(1, v - 1))}
                    className="h-12 w-12 flex items-center justify-center transition-colors hover:bg-[var(--nb-primary-soft)] hover:text-[var(--nb-primary)]"
                    style={{ color: "var(--nb-text-sub)" }}>
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="font-bold text-lg" style={{ color: "var(--nb-text)", fontFamily: "var(--font-display)" }}>{quantity}</span>
                  <button onClick={() => setQuantity((v) => Math.min(availableSlots || 1, v + 1))}
                    className="h-12 w-12 flex items-center justify-center transition-colors hover:bg-[var(--nb-primary-soft)] hover:text-[var(--nb-primary)]"
                    style={{ color: "var(--nb-text-sub)" }}>
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="mt-6">
              <div className="flex justify-between text-xs mb-2">
                <span style={{ color: "var(--nb-primary)" }}>{product.joinCount}/{product.moq} peserta</span>
                <span style={{ color: "var(--nb-text-sub)" }}>{progress}% terpenuhi</span>
              </div>
              <div className="nb-progress-track h-2">
                <div className="nb-progress-fill h-2" style={{ width: `${progress}%` }} />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mt-5 py-5"
              style={{ borderTop: "1px solid var(--nb-stroke)", borderBottom: "1px solid var(--nb-stroke)" }}>
              <div>
                <Timer className="h-4 w-4 mb-1.5" style={{ color: "var(--nb-primary)" }} />
                <p className="nb-label text-[10px] mb-0.5" style={{ color: "var(--nb-text-sub)" }}>Deadline</p>
                <p className="font-bold text-sm" style={{ color: "var(--nb-text)" }}>{daysLeft}h</p>
              </div>
              <div>
                <Sparkles className="h-4 w-4 mb-1.5" style={{ color: "var(--nb-secondary)" }} />
                <p className="nb-label text-[10px] mb-0.5" style={{ color: "var(--nb-text-sub)" }}>AI Sukses</p>
                <p className="font-bold text-sm" style={{ color: "var(--nb-secondary)" }}>{product.aiProbability}%</p>
              </div>
              <div>
                <Star className="h-4 w-4 mb-1.5" style={{ color: "var(--nb-amber)" }} />
                <p className="nb-label text-[10px] mb-0.5" style={{ color: "var(--nb-text-sub)" }}>Trust</p>
                <p className="font-bold text-sm" style={{ color: "var(--nb-text)" }}>{product.trustScore}/5</p>
              </div>
            </div>

            {/* Checkout */}
            <div className="mt-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--nb-text-sub)" }}>Subtotal ({quantity} unit)</span>
                <span className="font-bold" style={{ color: "var(--nb-text)" }}>{currency.format(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--nb-text-sub)" }}>Escrow deposit (20%)</span>
                <span className="font-bold" style={{ color: "var(--nb-primary)" }}>{currency.format(escrowDeposit)}</span>
              </div>
              <Link href={checkoutHref} className="nb-btn-primary block text-center w-full py-3.5 text-sm font-semibold rounded-xl">
                Lanjut ke Pembayaran →
              </Link>
              <p className="text-xs text-center" style={{ color: "var(--nb-text-dim)" }}>
                Dana ditahan di escrow sampai MOQ dan milestone creator tervalidasi.
              </p>
            </div>
          </aside>
        </section>

        {/* ── Detail Section ──────────────────────────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 mb-12">
          <div className="space-y-6">
            <div className="nb-card p-6">
              <h2 className="nb-h3 mb-4" style={{ color: "var(--nb-text)" }}>Detail Produk</h2>
              <p className="text-sm leading-relaxed" style={{ color: "var(--nb-text-sub)" }}>
                {product.description} Setiap join dicatat sebagai komitmen groupbuy dengan perlindungan escrow NexBuy, sehingga kolektor bisa memantau progress tanpa update manual dari creator.
              </p>
            </div>

            {specs.length > 0 && (
              <div className="nb-card p-6">
                <h2 className="nb-h3 mb-5" style={{ color: "var(--nb-text)" }}>Spesifikasi</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  {specs.map((spec) => (
                    <div key={spec.label} className="pb-3" style={{ borderBottom: "1px solid var(--nb-stroke)" }}>
                      <p className="nb-label text-xs mb-1" style={{ color: "var(--nb-text-sub)" }}>{spec.label}</p>
                      <p className="text-sm font-medium" style={{ color: "var(--nb-text)" }}>{spec.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {timeline.length > 0 && (
              <div className="nb-card p-6">
                <h2 className="nb-h3 mb-5" style={{ color: "var(--nb-text)" }}>Timeline Produksi</h2>
                <div className="space-y-4">
                  {timeline.map((item) => (
                    <div key={`${item.label}-${item.date}`} className="flex gap-4">
                      <div className="mt-1.5 h-3 w-3 rounded-full flex-shrink-0" style={{
                        background: item.status === "completed" ? "var(--nb-green)" : item.status === "active" ? "var(--nb-primary)" : "transparent",
                        border: `2px solid ${item.status === "completed" ? "var(--nb-green)" : item.status === "active" ? "var(--nb-primary)" : "var(--nb-stroke)"}`,
                        boxShadow: item.status === "active" ? "0 0 0 3px var(--nb-primary-glow)" : "none",
                      }} />
                      <div className="flex-1 pb-4" style={{ borderBottom: "1px solid var(--nb-stroke)" }}>
                        <div className="flex justify-between gap-2">
                          <p className="text-sm font-semibold" style={{ color: "var(--nb-text)" }}>{item.label}</p>
                          <p className="nb-label text-xs" style={{ color: "var(--nb-text-sub)" }}>
                            {new Date(`${item.date}T00:00:00`).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                          </p>
                        </div>
                        <span className="nb-label text-[10px] mt-1 inline-block" style={{
                          color: item.status === "completed" ? "var(--nb-green)" : item.status === "active" ? "var(--nb-primary)" : "var(--nb-text-dim)",
                        }}>{item.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Reviews */}
            <div className="nb-card p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="nb-h3" style={{ color: "var(--nb-text)" }}>Ulasan Pembeli</h2>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" style={{ color: "var(--nb-amber)" }} />
                    ))}
                  </div>
                  <span className="text-sm font-bold" style={{ color: "var(--nb-text)" }}>4.9</span>
                  <span className="text-xs" style={{ color: "var(--nb-text-sub)" }}>({PRODUCT_REVIEWS.length} ulasan)</span>
                </div>
              </div>

              {/* Rating summary bar */}
              <div className="space-y-1.5 mb-6 p-4 rounded-xl" style={{ background: "var(--nb-surface-low)" }}>
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = PRODUCT_REVIEWS.filter(r => r.stars === star).length
                  const pct = Math.round((count / PRODUCT_REVIEWS.length) * 100)
                  return (
                    <div key={star} className="flex items-center gap-3">
                      <span className="text-xs w-4 text-right" style={{ color: "var(--nb-text-sub)" }}>{star}</span>
                      <Star className="h-3 w-3 flex-shrink-0" style={{ color: "var(--nb-amber)" }} />
                      <div className="flex-1 nb-progress-track h-1.5">
                        <div className="nb-progress-fill h-1.5 transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs w-6" style={{ color: "var(--nb-text-dim)" }}>{pct}%</span>
                    </div>
                  )
                })}
              </div>

              <div className="space-y-5">
                {PRODUCT_REVIEWS.map((r, i) => (
                  <div key={r.handle} className="pb-5" style={{ borderBottom: i < PRODUCT_REVIEWS.length - 1 ? "1px solid var(--nb-stroke)" : "none" }}>
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold"
                        style={{ background: "linear-gradient(135deg, var(--nb-primary), var(--nb-secondary))" }}>
                        {r.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div>
                            <p className="text-sm font-semibold" style={{ color: "var(--nb-text)" }}>{r.name}</p>
                            <p className="text-xs" style={{ color: "var(--nb-text-dim)" }}>{r.role} · {r.date}</p>
                          </div>
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`h-3.5 w-3.5 ${i < r.stars ? "fill-current" : ""}`}
                                style={{ color: i < r.stars ? "var(--nb-amber)" : "var(--nb-stroke)" }} />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--nb-text-sub)" }}>{r.text}</p>
                    <button className="flex items-center gap-1.5 text-xs transition-colors hover:text-[var(--nb-primary)]"
                      style={{ color: "var(--nb-text-dim)" }}>
                      <ThumbsUp className="h-3.5 w-3.5" />
                      Membantu ({r.helpful})
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="nb-card p-6">
              <div className="flex items-center gap-3 mb-5">
                <ShieldCheck className="h-5 w-5" style={{ color: "var(--nb-primary)" }} />
                <h2 className="nb-h3" style={{ color: "var(--nb-text)" }}>Escrow Guard</h2>
              </div>
              <div className="space-y-0">
                <div className="py-3" style={{ borderBottom: "1px solid var(--nb-stroke)" }}>
                  <p className="nb-label text-xs mb-1" style={{ color: "var(--nb-text-sub)" }}>AI Insight</p>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--nb-text)" }}>{product.aiInsight}</p>
                </div>
                <div className="flex justify-between items-center py-3" style={{ borderBottom: "1px solid var(--nb-stroke)" }}>
                  <span className="nb-label text-xs" style={{ color: "var(--nb-text-sub)" }}>Risk Level</span>
                  <span className="nb-label text-xs font-bold px-2.5 py-1 rounded-lg"
                    style={{ background: `${riskColor}15`, color: riskColor }}>{riskLevel.toUpperCase()}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="nb-label text-xs" style={{ color: "var(--nb-text-sub)" }}>Estimasi Kirim</span>
                  <span className="text-sm font-semibold" style={{ color: "var(--nb-primary)" }}>{product.estimatedShipping ?? "TBA"}</span>
                </div>
              </div>
            </div>

            <div className="nb-card p-6">
              <h2 className="nb-h3 mb-4" style={{ color: "var(--nb-text)" }}>Isi Paket</h2>
              <div className="space-y-3">
                {includes.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: "var(--nb-green)" }} />
                    <span className="text-sm" style={{ color: "var(--nb-text-sub)" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="nb-h3" style={{ color: "var(--nb-text)" }}>Produk Serupa</h2>
              <Link href="/dashboard" className="text-sm transition-colors hover:underline" style={{ color: "var(--nb-primary)" }}>
                Lihat semua →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedProducts.map((item) => (
                <Link href={`/dashboard/products/${item.id}`} key={item.id}>
                  <div className="nb-card overflow-hidden group cursor-pointer">
                    <div className="aspect-video overflow-hidden" style={{ background: "var(--nb-surface-low)" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover nb-hover-scale" />
                    </div>
                    <div className="p-4">
                      <p className="nb-label text-xs mb-1" style={{ color: "var(--nb-primary)" }}>{item.category}</p>
                      <h3 className="text-sm font-semibold group-hover:text-[var(--nb-primary)] transition-colors" style={{ color: "var(--nb-text)" }}>{item.name}</h3>
                      <div className="flex justify-between mt-3 text-xs">
                        <span style={{ color: "var(--nb-text-sub)" }}>🤖 AI {item.aiProbability}%</span>
                        <span className="font-bold" style={{ color: "var(--nb-primary)" }}>{currency.format(item.price)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="mt-auto" style={{ borderTop: "1px solid var(--nb-stroke)" }}>
        <div className="nb-container py-4 flex justify-between items-center">
          <p className="text-xs" style={{ color: "var(--nb-text-dim)" }}>© 2024 NexBuy Collector Portal</p>
          <span className="text-xs" style={{ color: "var(--nb-text-dim)" }}>Secure groupbuy escrow</span>
        </div>
      </footer>
    </div>
  )
}
