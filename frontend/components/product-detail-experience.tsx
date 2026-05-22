"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  CheckCircle2,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  Sparkles,
  Star,
  Timer,
} from "lucide-react"
import type { Product } from "@/types"

interface ProductDetailExperienceProps {
  product: Product
  relatedProducts: Product[]
}

const currency = new Intl.NumberFormat("en-US", {
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

export function ProductDetailExperience({ product, relatedProducts }: ProductDetailExperienceProps) {
  const gallery = product.gallery?.length ? product.gallery : [product.image]
  const variants = product.variants ?? []
  const [activeImage, setActiveImage] = useState(gallery[0])
  const [quantity, setQuantity] = useState(1)
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
      if (value) {
        params.set(name, value)
      }
    })

    return `/dashboard/checkout/${product.id}?${params.toString()}`
  }, [product.id, quantity, selectedVariants])

  const riskTone = {
    low: "text-success-green",
    medium: "text-warning",
    high: "text-error",
  }[riskLevel]

  return (
    <div className="bg-deep-void text-on-surface font-body-md min-h-screen flex flex-col">
      <nav className="bg-deep-void/80 backdrop-blur-xl border-b border-surface-stroke sticky top-0 z-50 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
        <div className="flex justify-between items-center w-full max-w-container-max mx-auto px-5 md:px-margin-desktop h-20">
          <Link href="/dashboard" className="font-headline-sm text-headline-sm text-primary uppercase">
            Nexbuy
          </Link>
          <div className="hidden md:flex items-center gap-stack-lg">
            <Link href="/home" className="font-headline-sm text-headline-sm text-on-surface-variant hover:text-primary transition-all">
              Beranda
            </Link>
            <Link href="/dashboard" className="font-headline-sm text-headline-sm text-primary font-bold border-b-2 border-primary pb-1">
              Koleksi
            </Link>
            <a href="#" className="font-headline-sm text-headline-sm text-on-surface-variant hover:text-primary transition-all">
              Pesanan
            </a>
            <a href="#" className="font-headline-sm text-headline-sm text-on-surface-variant hover:text-primary transition-all">
              Wishlist
            </a>
          </div>
          <div className="flex items-center gap-stack-md">
            <button className="hover:bg-surface-variant/50 transition-colors p-2 rounded-lg" aria-label="Wishlist">
              <Heart className="h-5 w-5 text-primary" />
            </button>
            <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-2 border border-surface-stroke hover:border-primary font-label-mono text-label-mono text-on-surface-variant hover:text-primary transition-all"
            >
              KELUAR
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-container-max mx-auto px-5 md:px-margin-desktop py-stack-lg w-full">
        <div className="flex flex-wrap items-center gap-3 mb-stack-lg">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 font-label-mono text-label-mono text-on-surface-variant hover:text-primary transition-colors uppercase"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke dashboard
          </Link>
          <span className="font-label-mono text-label-mono text-outline">/</span>
          <span className="font-label-mono text-label-mono text-primary uppercase">{product.category}</span>
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] gap-gutter mb-section-gap">
          <div className="space-y-4">
            <div className="glass-panel rounded-xl overflow-hidden">
              <div className="relative aspect-[4/3] bg-surface-container-high">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={activeImage} alt={product.name} className="h-full w-full object-cover" />
                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                  <span className="font-label-mono text-[10px] bg-primary text-on-primary px-3 py-1 rounded-full">
                    LIVE GROUP BUY
                  </span>
                  <span className="font-label-mono text-[10px] bg-deep-void/80 border border-secondary/40 text-secondary px-3 py-1 rounded-full">
                    AI VERIFIED
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {gallery.map((image) => (
                <button
                  key={image}
                  onClick={() => setActiveImage(image)}
                  className={`aspect-video rounded-lg border overflow-hidden bg-surface-container-high transition-all ${
                    activeImage === image ? "border-primary active-glow" : "border-surface-stroke hover:border-primary/60"
                  }`}
                  aria-label={`Preview ${product.name}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <aside className="glass-panel rounded-xl p-stack-lg h-fit lg:sticky lg:top-28">
            <div className="flex flex-wrap items-center gap-2 mb-stack-md">
              <span className="font-label-mono text-label-mono text-primary uppercase">{product.creator}</span>
              <span className="font-label-mono text-label-mono text-outline">/</span>
              <span className="font-label-mono text-label-mono text-on-surface-variant uppercase">{product.category}</span>
            </div>

            <div className="flex items-start justify-between gap-4 mb-stack-md">
              <div>
                <h1 className="font-headline-md text-headline-md text-on-surface">{product.name}</h1>
                <p className="text-body-md text-on-surface-variant mt-2">{product.description}</p>
              </div>
              <button className="shrink-0 p-3 rounded-lg border border-surface-stroke hover:border-primary hover:text-primary transition-colors" aria-label="Tambah ke wishlist">
                <Heart className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-wrap items-end justify-between gap-3 border-y border-surface-stroke py-stack-md mb-stack-md">
              <div>
                <p className="font-label-mono text-label-mono text-on-surface-variant uppercase">Harga per unit</p>
                <p className="font-price-display text-[32px] leading-10 text-primary font-bold">{currency.format(product.price)}</p>
              </div>
              <div className="text-right">
                <p className="font-label-mono text-label-mono text-on-surface-variant uppercase">Slot tersisa</p>
                <p className="font-headline-sm text-headline-sm text-on-surface">{availableSlots}</p>
              </div>
            </div>

            <div className="space-y-5">
              {variants.map((variant) => (
                <div key={variant.name}>
                  <div className="flex justify-between mb-2">
                    <p className="font-label-mono text-label-mono text-on-surface-variant uppercase">{variant.name}</p>
                    <p className="font-label-mono text-label-mono text-primary">{selectedVariants[variant.name]}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {variant.options.map((option) => {
                      const swatch = colorForOption(option)
                      const selected = selectedVariants[variant.name] === option

                      return (
                        <button
                          key={option}
                          onClick={() => setSelectedVariants((current) => ({ ...current, [variant.name]: option }))}
                          className={`min-h-10 px-3 py-2 rounded-lg border font-label-mono text-label-mono transition-all ${
                            selected
                              ? "border-primary bg-primary/10 text-primary active-glow"
                              : "border-surface-stroke bg-surface-container-low text-on-surface-variant hover:border-primary/70 hover:text-on-surface"
                          }`}
                        >
                          <span className="inline-flex items-center gap-2">
                            {swatch ? (
                              <span className="h-4 w-4 rounded-full border border-white/20" style={{ background: swatch }} />
                            ) : null}
                            {option}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}

              <div>
                <p className="font-label-mono text-label-mono text-on-surface-variant uppercase mb-2">Quantity</p>
                <div className="flex items-center justify-between border border-surface-stroke rounded-lg overflow-hidden bg-surface-container-low">
                  <button
                    onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                    className="h-12 w-12 flex items-center justify-center hover:bg-surface-variant transition-colors"
                    aria-label="Kurangi quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="font-headline-sm text-headline-sm text-on-surface">{quantity}</span>
                  <button
                    onClick={() => setQuantity((value) => Math.min(availableSlots || 1, value + 1))}
                    className="h-12 w-12 flex items-center justify-center hover:bg-surface-variant transition-colors"
                    aria-label="Tambah quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-stack-lg">
              <div className="flex justify-between font-label-mono text-label-mono mb-2">
                <span className="text-primary">
                  {product.joinCount}/{product.moq} peserta
                </span>
                <span className="text-on-surface-variant">{progress}% terpenuhi</span>
              </div>
              <div className="h-2 w-full progress-track rounded-full overflow-hidden">
                <div className="h-full progress-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-stack-md border-b border-surface-stroke pb-stack-lg">
              <div>
                <Timer className="h-5 w-5 text-primary mb-2" />
                <p className="font-label-mono text-label-mono text-on-surface-variant uppercase">Deadline</p>
                <p className="font-headline-sm text-headline-sm text-on-surface">{daysLeft} hari</p>
              </div>
              <div>
                <Sparkles className="h-5 w-5 text-secondary mb-2" />
                <p className="font-label-mono text-label-mono text-on-surface-variant uppercase">AI sukses</p>
                <p className="font-headline-sm text-headline-sm text-secondary">{product.aiProbability}%</p>
              </div>
              <div>
                <Star className="h-5 w-5 text-warning mb-2" />
                <p className="font-label-mono text-label-mono text-on-surface-variant uppercase">Trust</p>
                <p className="font-headline-sm text-headline-sm text-on-surface">{product.trustScore}/5</p>
              </div>
            </div>

            <div className="mt-stack-lg space-y-3">
              <div className="flex justify-between text-body-md">
                <span className="text-on-surface-variant">Subtotal</span>
                <span className="font-bold text-on-surface">{currency.format(subtotal)}</span>
              </div>
              <div className="flex justify-between text-body-md">
                <span className="text-on-surface-variant">Escrow deposit</span>
                <span className="font-bold text-primary">{currency.format(escrowDeposit)}</span>
              </div>
              <Link
                href={checkoutHref}
                className="block text-center w-full bg-primary text-on-primary font-label-mono text-label-mono py-4 rounded-lg hover:bg-primary-fixed transition-all primary-glow uppercase"
              >
                Lanjut ke validasi pembayaran
              </Link>
              <p className="text-body-md text-on-surface-variant">
                Dana ditahan di escrow sampai MOQ, QC, dan milestone creator tervalidasi.
              </p>
            </div>
          </aside>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-gutter mb-section-gap">
          <div className="space-y-6">
            <div className="glass-panel rounded-xl p-stack-lg">
              <h2 className="font-headline-sm text-headline-sm text-on-surface uppercase mb-stack-md">Detail Produk</h2>
              <p className="text-body-md text-on-surface-variant">
                {product.description} Setiap join dicatat sebagai komitmen groupbuy dengan perlindungan escrow NexBuy, sehingga kolektor bisa memantau progress tanpa menunggu update manual dari creator.
              </p>
            </div>

            <div className="glass-panel rounded-xl p-stack-lg">
              <h2 className="font-headline-sm text-headline-sm text-on-surface uppercase mb-stack-md">Spesifikasi</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {specs.map((spec) => (
                  <div key={spec.label} className="border-b border-surface-stroke pb-3">
                    <p className="font-label-mono text-label-mono text-on-surface-variant uppercase">{spec.label}</p>
                    <p className="text-body-md text-on-surface mt-1">{spec.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel rounded-xl p-stack-lg">
              <h2 className="font-headline-sm text-headline-sm text-on-surface uppercase mb-stack-md">Timeline Produksi</h2>
              <div className="space-y-4">
                {timeline.map((item) => (
                  <div key={`${item.label}-${item.date}`} className="flex gap-4">
                    <div
                      className={`mt-1 h-3 w-3 rounded-full border ${
                        item.status === "completed"
                          ? "bg-success-green border-success-green"
                          : item.status === "active"
                            ? "bg-primary border-primary active-glow"
                            : "bg-transparent border-outline"
                      }`}
                    />
                    <div className="flex-1 border-b border-surface-stroke pb-4">
                      <div className="flex flex-wrap justify-between gap-2">
                        <p className="text-body-md text-on-surface font-bold">{item.label}</p>
                        <p className="font-label-mono text-label-mono text-on-surface-variant">
                          {new Date(`${item.date}T00:00:00`).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <p className="font-label-mono text-label-mono text-primary uppercase mt-1">{item.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-panel rounded-xl p-stack-lg">
              <div className="flex items-center gap-3 mb-stack-md">
                <ShieldCheck className="h-6 w-6 text-primary" />
                <h2 className="font-headline-sm text-headline-sm text-on-surface uppercase">Escrow Guard</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="font-label-mono text-label-mono text-on-surface-variant uppercase">AI Insight</p>
                  <p className="text-body-md text-on-surface mt-1">{product.aiInsight}</p>
                </div>
                <div className="flex justify-between border-t border-surface-stroke pt-4">
                  <span className="font-label-mono text-label-mono text-on-surface-variant uppercase">Risk level</span>
                  <span className={`font-label-mono text-label-mono uppercase ${riskTone}`}>{riskLevel}</span>
                </div>
                <div className="flex justify-between border-t border-surface-stroke pt-4">
                  <span className="font-label-mono text-label-mono text-on-surface-variant uppercase">Estimasi kirim</span>
                  <span className="font-label-mono text-label-mono text-primary">{product.estimatedShipping ?? "TBA"}</span>
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-xl p-stack-lg">
              <h2 className="font-headline-sm text-headline-sm text-on-surface uppercase mb-stack-md">Isi Paket</h2>
              <div className="space-y-3">
                {includes.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-success-green shrink-0 mt-0.5" />
                    <span className="text-body-md text-on-surface-variant">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {relatedProducts.length ? (
          <section className="mb-section-gap">
            <div className="flex justify-between items-center mb-stack-lg">
              <h2 className="font-headline-sm text-headline-sm text-on-surface uppercase">Produk Serupa</h2>
              <Link href="/dashboard" className="font-label-mono text-label-mono text-primary hover:underline uppercase">
                Lihat dashboard
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              {relatedProducts.map((item) => (
                <Link
                  href={`/dashboard/products/${item.id}`}
                  key={item.id}
                  className="glass-panel rounded-xl overflow-hidden hover:border-primary transition-all group"
                >
                  <div className="aspect-video bg-surface-container-high overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-stack-md">
                    <p className="font-label-mono text-label-mono text-primary uppercase">{item.category}</p>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface mt-1">{item.name}</h3>
                    <div className="flex justify-between mt-stack-md font-label-mono text-label-mono text-on-surface-variant">
                      <span>{item.aiProbability}% AI</span>
                      <span>{currency.format(item.price)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </main>

      <footer className="bg-deep-void border-t border-surface-stroke py-stack-lg mt-auto">
        <div className="max-w-container-max mx-auto px-5 md:px-margin-desktop flex flex-wrap gap-3 justify-between items-center">
          <span className="font-label-mono text-label-mono text-outline">(c) 2026 NEXBUY COLLECTOR PORTAL</span>
          <span className="font-label-mono text-label-mono text-outline">Secure groupbuy escrow</span>
        </div>
      </footer>
    </div>
  )
}
