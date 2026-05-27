"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  ArrowLeft, BadgeCheck, Banknote, CheckCircle2, CreditCard, QrCode,
  ShieldCheck, Sparkles, Timer, Truck, WalletCards,
} from "lucide-react"
import ThemeToggle from "@/components/theme-toggle"
import type { Product } from "@/types"

interface CheckoutValidationExperienceProps {
  product: Product
  quantity: number
  selectedOptions: Record<string, string>
}

type PaymentMethod = "virtual-account" | "qris" | "bank-transfer" | "card-payment"
type ValidationStatus = "editing" | "pending" | "validated"

const currency = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

const paymentMethods: Array<{
  id: PaymentMethod
  label: string
  description: string
  icon: typeof Banknote
}> = [
  { id: "virtual-account", label: "Virtual Account",  description: "Nomor VA dibuat untuk validasi escrow.", icon: Banknote   },
  { id: "qris",            label: "QRIS",             description: "Kode QR diterbitkan untuk validasi pembayaran.", icon: QrCode     },
  { id: "bank-transfer",   label: "Bank Transfer",    description: "Manual transfer dengan review admin NexBuy.", icon: WalletCards },
  { id: "card-payment",    label: "Card Payment",     description: "Pembayaran kartu dengan otorisasi escrow.", icon: CreditCard  },
]

function optionSummary(selectedOptions: Record<string, string>) {
  const entries = Object.entries(selectedOptions).filter(([, value]) => value)
  if (!entries.length) return "Default configuration"
  return entries.map(([name, value]) => `${name}: ${value}`).join(" / ")
}

const NAV_ITEMS = [
  { label: "Beranda",  href: "/home",      active: false },
  { label: "Koleksi",  href: "/dashboard", active: true  },
  { label: "Pesanan",  href: "#",          active: false },
]

export function CheckoutValidationExperience({ product, quantity, selectedOptions }: CheckoutValidationExperienceProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("virtual-account")
  const [validationStatus, setValidationStatus] = useState<ValidationStatus>("editing")
  const subtotal = product.price * quantity
  const protectionFee = Math.max(3, Math.round(subtotal * 0.035))
  const escrowHold = subtotal + protectionFee
  const depositToday = Math.round(escrowHold * 0.2)
  const balanceAfterMoq = escrowHold - depositToday
  const progress = Math.min(Math.round((product.joinCount / product.moq) * 100), 100)

  const validationCode = useMemo(
    () => `NXB-${product.id.slice(0, 4).toUpperCase()}-${String(quantity).padStart(2, "0")}81`,
    [product.id, quantity],
  )

  const selectedPayment = paymentMethods.find((m) => m.id === paymentMethod) ?? paymentMethods[0]

  function handleConfirmJoin() {
    setValidationStatus("pending")
    window.setTimeout(() => setValidationStatus("validated"), 700)
  }

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
          <Link href={`/dashboard/products/${product.id}`}
            className="inline-flex items-center gap-1.5 text-sm transition-colors hover:text-[var(--nb-primary)]"
            style={{ color: "var(--nb-text-sub)" }}>
            <ArrowLeft className="h-4 w-4" /> Kembali ke detail produk
          </Link>
          <span style={{ color: "var(--nb-text-dim)" }}>/</span>
          <span className="text-sm font-medium" style={{ color: "var(--nb-primary)" }}>Checkout</span>
        </div>

        {/* Header */}
        <header className="mb-8">
          <span className="nb-label text-xs mb-1 block" style={{ color: "var(--nb-primary)" }}>Escrow Payment Validation</span>
          <h1 className="nb-h1" style={{ color: "var(--nb-text)" }}>Validasi Join Group Buy</h1>
          <p className="text-sm mt-2 max-w-2xl" style={{ color: "var(--nb-text-sub)" }}>
            Review pilihan produk, detail pembeli, dan pembayaran sebelum dana masuk ke escrow NexBuy.
          </p>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          <div className="space-y-6">

            {/* Order summary */}
            <div className="nb-card p-6">
              <div className="flex items-start gap-4">
                <div className="h-20 w-28 rounded-xl overflow-hidden flex-shrink-0" style={{ background: "var(--nb-surface-low)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="nb-label text-xs mb-1" style={{ color: "var(--nb-primary)" }}>{product.creator}</p>
                  <h2 className="nb-h3 mb-1" style={{ color: "var(--nb-text)" }}>{product.name}</h2>
                  <p className="text-sm" style={{ color: "var(--nb-text-sub)" }}>{optionSummary(selectedOptions)}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="nb-badge nb-badge-blue">Qty {quantity}</span>
                    <span className="nb-badge nb-badge-purple">🤖 AI {product.aiProbability}%</span>
                    <span className="nb-badge" style={{ background: "var(--nb-surface-low)", color: "var(--nb-text-sub)", border: "1px solid var(--nb-stroke)" }}>
                      Trust {product.trustScore}/5
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping info */}
            <div className="nb-card p-6">
              <div className="flex items-center gap-3 mb-5">
                <Truck className="h-5 w-5" style={{ color: "var(--nb-primary)" }} />
                <h2 className="nb-h3" style={{ color: "var(--nb-text)" }}>Detail Pembeli</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className="nb-label text-xs" style={{ color: "var(--nb-text-sub)" }}>Nama Penerima</span>
                  <input defaultValue="Sebastian Obert" className="nb-input h-11 px-4 text-sm" />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="nb-label text-xs" style={{ color: "var(--nb-text-sub)" }}>Email</span>
                  <input defaultValue="collector@nexbuy.id" className="nb-input h-11 px-4 text-sm" />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="nb-label text-xs" style={{ color: "var(--nb-text-sub)" }}>Nomor HP</span>
                  <input defaultValue="+62 812 0000 2026" className="nb-input h-11 px-4 text-sm" />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="nb-label text-xs" style={{ color: "var(--nb-text-sub)" }}>Kota</span>
                  <input defaultValue="Jakarta Selatan" className="nb-input h-11 px-4 text-sm" />
                </label>
                <label className="flex flex-col gap-1.5 md:col-span-2">
                  <span className="nb-label text-xs" style={{ color: "var(--nb-text-sub)" }}>Alamat Pengiriman</span>
                  <textarea defaultValue="Jl. Prototype Groupbuy No. 16, Kebayoran Baru"
                    rows={3} className="nb-input px-4 py-3 text-sm resize-none" />
                </label>
              </div>
            </div>

            {/* Payment method */}
            <div className="nb-card p-6">
              <div className="flex items-center gap-3 mb-5">
                <ShieldCheck className="h-5 w-5" style={{ color: "var(--nb-primary)" }} />
                <h2 className="nb-h3" style={{ color: "var(--nb-text)" }}>Metode Pembayaran</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {paymentMethods.map((method) => {
                  const Icon = method.icon
                  const selected = method.id === paymentMethod
                  return (
                    <button key={method.id} onClick={() => setPaymentMethod(method.id)}
                      className="text-left rounded-xl p-4 transition-all"
                      style={{
                        border: `1.5px solid ${selected ? "var(--nb-primary)" : "var(--nb-stroke)"}`,
                        background: selected ? "var(--nb-primary-soft)" : "var(--nb-surface-low)",
                        boxShadow: selected ? "0 0 0 3px var(--nb-primary-glow)" : "none",
                      }}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <Icon className="h-4 w-4" style={{ color: selected ? "var(--nb-primary)" : "var(--nb-text-sub)" }} />
                        <span className="text-sm font-semibold" style={{ color: selected ? "var(--nb-primary)" : "var(--nb-text)" }}>
                          {method.label}
                        </span>
                      </div>
                      <p className="text-xs" style={{ color: "var(--nb-text-sub)" }}>{method.description}</p>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* AI Safety check */}
            <div className="nb-card p-6">
              <div className="flex items-center gap-3 mb-5">
                <Sparkles className="h-5 w-5" style={{ color: "var(--nb-secondary)" }} />
                <h2 className="nb-h3" style={{ color: "var(--nb-text)" }}>AI Safety Check</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="p-4 rounded-xl" style={{ background: "var(--nb-surface-low)", border: "1px solid var(--nb-stroke)" }}>
                  <p className="nb-label text-xs mb-1" style={{ color: "var(--nb-text-sub)" }}>Success probability</p>
                  <p className="text-2xl font-bold" style={{ color: "var(--nb-secondary)", fontFamily: "var(--font-display)" }}>
                    {product.aiProbability}%
                  </p>
                </div>
                <div className="p-4 rounded-xl" style={{ background: "var(--nb-surface-low)", border: "1px solid var(--nb-stroke)" }}>
                  <p className="nb-label text-xs mb-1" style={{ color: "var(--nb-text-sub)" }}>MOQ progress</p>
                  <p className="text-2xl font-bold" style={{ color: "var(--nb-primary)", fontFamily: "var(--font-display)" }}>
                    {progress}%
                  </p>
                </div>
                <div className="p-4 rounded-xl" style={{ background: "var(--nb-surface-low)", border: "1px solid var(--nb-stroke)" }}>
                  <p className="nb-label text-xs mb-1" style={{ color: "var(--nb-text-sub)" }}>Anomaly scan</p>
                  <p className="text-xl font-bold mt-1" style={{ color: "var(--nb-green)" }}>✓ Clean</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--nb-text-sub)" }}>
                {product.aiInsight ?? "AI memantau pola join, trust score creator, dan risiko refund sebelum pembayaran divalidasi."}
              </p>
            </div>
          </div>

          {/* ── Escrow Sidebar ─────────────────────────────────── */}
          <aside className="h-fit lg:sticky lg:top-24">
            <div className="nb-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <BadgeCheck className="h-5 w-5" style={{ color: "var(--nb-primary)" }} />
                <h2 className="nb-h3" style={{ color: "var(--nb-text)" }}>Ringkasan Escrow</h2>
              </div>

              <div className="space-y-3 pb-5 mb-5" style={{ borderBottom: "1px solid var(--nb-stroke)" }}>
                {[
                  ["Harga produk",       currency.format(product.price), false],
                  ["Quantity",           String(quantity),                false],
                  ["Subtotal",           currency.format(subtotal),       false],
                  ["Protection fee (3.5%)", currency.format(protectionFee), false],
                ].map(([label, value]) => (
                  <div key={label as string} className="flex justify-between text-sm">
                    <span style={{ color: "var(--nb-text-sub)" }}>{label}</span>
                    <span className="font-medium" style={{ color: "var(--nb-text)" }}>{value}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm pt-3" style={{ borderTop: "1px solid var(--nb-stroke)" }}>
                  <span className="font-semibold" style={{ color: "var(--nb-text)" }}>Dana Escrow</span>
                  <span className="font-bold" style={{ color: "var(--nb-primary)" }}>{currency.format(escrowHold)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "var(--nb-text-sub)" }}>Deposit hari ini (20%)</span>
                  <span className="font-bold" style={{ color: "var(--nb-primary)" }}>{currency.format(depositToday)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "var(--nb-text-sub)" }}>Sisa saat MOQ lolos</span>
                  <span className="font-medium" style={{ color: "var(--nb-text)" }}>{currency.format(balanceAfterMoq)}</span>
                </div>
              </div>

              <div className="space-y-4">
                {/* Active method */}
                <div className="p-4 rounded-xl" style={{ background: "var(--nb-surface-low)", border: "1px solid var(--nb-stroke)" }}>
                  <p className="nb-label text-xs mb-1" style={{ color: "var(--nb-text-sub)" }}>Metode Aktif</p>
                  <p className="font-semibold text-sm" style={{ color: "var(--nb-text)" }}>{selectedPayment.label}</p>
                  <p className="nb-label text-xs mt-1" style={{ color: "var(--nb-primary)", fontFamily: "var(--font-mono)" }}>{validationCode}</p>
                </div>

                {/* Escrow note */}
                <div className="p-4 rounded-xl" style={{ background: "var(--nb-primary-soft)", border: "1px solid var(--nb-primary)30" }}>
                  <div className="flex items-start gap-3">
                    <Timer className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: "var(--nb-primary)" }} />
                    <p className="text-xs leading-relaxed" style={{ color: "var(--nb-text-sub)" }}>
                      Escrow belum dilepas ke creator sampai MOQ, QC awal, dan milestone produksi tervalidasi.
                    </p>
                  </div>
                </div>

                {/* Validated state */}
                {validationStatus === "validated" && (
                  <div className="p-4 rounded-xl" style={{ background: "var(--nb-green)12", border: "1px solid var(--nb-green)40" }}>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: "var(--nb-green)" }} />
                      <div>
                        <p className="nb-label text-xs mb-1" style={{ color: "var(--nb-green)" }}>Join Tervalidasi ✓</p>
                        <p className="text-xs" style={{ color: "var(--nb-text-sub)" }}>
                          Komitmen pembelian masuk antrean escrow. Pesanan tampil sebagai order aktif.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Confirm button */}
                <button onClick={handleConfirmJoin} disabled={validationStatus === "pending" || validationStatus === "validated"}
                  className="nb-btn-primary w-full py-3.5 text-sm font-semibold rounded-xl disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none">
                  {validationStatus === "pending"   ? "Memvalidasi pembayaran..." :
                   validationStatus === "validated"  ? "✓ Sudah Tervalidasi" :
                   "Konfirmasi & Masuk Escrow"}
                </button>

                <Link href="/dashboard"
                  className="nb-btn-ghost block text-center w-full py-3.5 text-sm font-medium rounded-xl">
                  Kembali ke Dashboard
                </Link>
              </div>
            </div>
          </aside>
        </section>
      </main>

      <footer className="mt-auto" style={{ borderTop: "1px solid var(--nb-stroke)" }}>
        <div className="nb-container py-4 flex justify-between items-center">
          <p className="text-xs" style={{ color: "var(--nb-text-dim)" }}>© 2024 NexBuy Checkout</p>
          <span className="text-xs" style={{ color: "var(--nb-text-dim)" }}>Escrow payment validation</span>
        </div>
      </footer>
    </div>
  )
}
