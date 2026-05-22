"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  BadgeCheck,
  Banknote,
  CheckCircle2,
  CreditCard,
  QrCode,
  ShieldCheck,
  Sparkles,
  Timer,
  Truck,
  WalletCards,
} from "lucide-react"
import type { Product } from "@/types"

interface CheckoutValidationExperienceProps {
  product: Product
  quantity: number
  selectedOptions: Record<string, string>
}

type PaymentMethod = "virtual-account" | "qris" | "bank-transfer" | "card-payment"
type ValidationStatus = "editing" | "pending" | "validated"

const currency = new Intl.NumberFormat("en-US", {
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
  {
    id: "virtual-account",
    label: "Virtual Account",
    description: "Nomor VA dibuat untuk validasi escrow.",
    icon: Banknote,
  },
  {
    id: "qris",
    label: "QRIS",
    description: "Kode QR diterbitkan untuk validasi pembayaran.",
    icon: QrCode,
  },
  {
    id: "bank-transfer",
    label: "Bank Transfer",
    description: "Manual transfer dengan review admin NexBuy.",
    icon: WalletCards,
  },
  {
    id: "card-payment",
    label: "Card Payment",
    description: "Pembayaran kartu dengan otorisasi escrow.",
    icon: CreditCard,
  },
]

function optionSummary(selectedOptions: Record<string, string>) {
  const entries = Object.entries(selectedOptions).filter(([, value]) => value)

  if (!entries.length) {
    return "Default configuration"
  }

  return entries.map(([name, value]) => `${name}: ${value}`).join(" / ")
}

export function CheckoutValidationExperience({
  product,
  quantity,
  selectedOptions,
}: CheckoutValidationExperienceProps) {
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

  const selectedPayment = paymentMethods.find((method) => method.id === paymentMethod) ?? paymentMethods[0]

  function handleConfirmJoin() {
    setValidationStatus("pending")
    window.setTimeout(() => {
      setValidationStatus("validated")
    }, 700)
  }

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
          <Link
            href="/login"
            className="px-4 py-2 border border-surface-stroke hover:border-primary font-label-mono text-label-mono text-on-surface-variant hover:text-primary transition-all"
          >
            KELUAR
          </Link>
        </div>
      </nav>

      <main className="max-w-container-max mx-auto px-5 md:px-margin-desktop py-stack-lg w-full">
        <div className="flex flex-wrap items-center gap-3 mb-stack-lg">
          <Link
            href={`/dashboard/products/${product.id}`}
            className="inline-flex items-center gap-2 font-label-mono text-label-mono text-on-surface-variant hover:text-primary transition-colors uppercase"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke detail produk
          </Link>
          <span className="font-label-mono text-label-mono text-outline">/</span>
          <span className="font-label-mono text-label-mono text-primary uppercase">Validasi pembayaran</span>
        </div>

        <header className="mb-section-gap">
          <span className="font-label-mono text-label-mono text-primary uppercase tracking-widest">
            ESCROW PAYMENT VALIDATION
          </span>
          <h1 className="font-display-lg text-headline-md md:text-display-lg text-on-surface uppercase mt-stack-sm">
            Validasi Join Group Buy
          </h1>
          <p className="max-w-3xl text-body-lg text-on-surface-variant mt-stack-md">
            Review pilihan produk, detail pembeli, dan pembayaran sebelum dana masuk ke escrow NexBuy.
          </p>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_390px] gap-gutter mb-section-gap">
          <div className="space-y-6">
            <div className="glass-panel rounded-xl p-stack-lg">
              <div className="flex items-start gap-4">
                <div className="h-24 w-32 rounded-lg overflow-hidden bg-surface-container-high shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="font-label-mono text-label-mono text-primary uppercase">{product.creator}</p>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface mt-1">{product.name}</h2>
                  <p className="text-body-md text-on-surface-variant mt-2">{optionSummary(selectedOptions)}</p>
                  <div className="flex flex-wrap gap-2 mt-stack-md">
                    <span className="font-label-mono text-label-mono bg-primary/10 border border-primary/30 text-primary px-3 py-1 rounded-full">
                      Qty {quantity}
                    </span>
                    <span className="font-label-mono text-label-mono bg-secondary/10 border border-secondary/30 text-secondary px-3 py-1 rounded-full">
                      AI {product.aiProbability}%
                    </span>
                    <span className="font-label-mono text-label-mono bg-surface-container-high border border-surface-stroke text-on-surface-variant px-3 py-1 rounded-full">
                      Trust {product.trustScore}/5
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-xl p-stack-lg">
              <div className="flex items-center gap-3 mb-stack-md">
                <Truck className="h-6 w-6 text-primary" />
                <h2 className="font-headline-sm text-headline-sm text-on-surface uppercase">Detail Pembeli</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="space-y-2">
                  <span className="font-label-mono text-label-mono text-on-surface-variant uppercase">Nama penerima</span>
                  <input
                    defaultValue="Sebastian Obert"
                    className="w-full rounded-lg border border-surface-stroke bg-surface-container-low px-4 py-3 text-on-surface outline-none focus:border-primary"
                  />
                </label>
                <label className="space-y-2">
                  <span className="font-label-mono text-label-mono text-on-surface-variant uppercase">Email</span>
                  <input
                    defaultValue="collector@nexbuy.id"
                    className="w-full rounded-lg border border-surface-stroke bg-surface-container-low px-4 py-3 text-on-surface outline-none focus:border-primary"
                  />
                </label>
                <label className="space-y-2">
                  <span className="font-label-mono text-label-mono text-on-surface-variant uppercase">Nomor HP</span>
                  <input
                    defaultValue="+62 812 0000 2026"
                    className="w-full rounded-lg border border-surface-stroke bg-surface-container-low px-4 py-3 text-on-surface outline-none focus:border-primary"
                  />
                </label>
                <label className="space-y-2">
                  <span className="font-label-mono text-label-mono text-on-surface-variant uppercase">Kota</span>
                  <input
                    defaultValue="Jakarta Selatan"
                    className="w-full rounded-lg border border-surface-stroke bg-surface-container-low px-4 py-3 text-on-surface outline-none focus:border-primary"
                  />
                </label>
                <label className="space-y-2 md:col-span-2">
                  <span className="font-label-mono text-label-mono text-on-surface-variant uppercase">Alamat pengiriman</span>
                  <textarea
                    defaultValue="Jl. Prototype Groupbuy No. 16, Kebayoran Baru"
                    rows={3}
                    className="w-full rounded-lg border border-surface-stroke bg-surface-container-low px-4 py-3 text-on-surface outline-none focus:border-primary resize-none"
                  />
                </label>
              </div>
            </div>

            <div className="glass-panel rounded-xl p-stack-lg">
              <div className="flex items-center gap-3 mb-stack-md">
                <ShieldCheck className="h-6 w-6 text-primary" />
                <h2 className="font-headline-sm text-headline-sm text-on-surface uppercase">Metode Pembayaran</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paymentMethods.map((method) => {
                  const Icon = method.icon
                  const selected = method.id === paymentMethod

                  return (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`text-left rounded-xl border p-stack-md transition-all ${
                        selected
                          ? "border-primary bg-primary/10 active-glow"
                          : "border-surface-stroke bg-surface-container-low hover:border-primary/60"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className={`h-5 w-5 ${selected ? "text-primary" : "text-on-surface-variant"}`} />
                        <span className="font-label-mono text-label-mono text-on-surface uppercase">{method.label}</span>
                      </div>
                      <p className="text-body-md text-on-surface-variant">{method.description}</p>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="glass-panel rounded-xl p-stack-lg">
              <div className="flex items-center gap-3 mb-stack-md">
                <Sparkles className="h-6 w-6 text-secondary" />
                <h2 className="font-headline-sm text-headline-sm text-on-surface uppercase">AI Safety Check</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-lg border border-surface-stroke bg-surface-container-low p-stack-md">
                  <p className="font-label-mono text-label-mono text-on-surface-variant uppercase">Success probability</p>
                  <p className="font-headline-md text-headline-md text-secondary mt-1">{product.aiProbability}%</p>
                </div>
                <div className="rounded-lg border border-surface-stroke bg-surface-container-low p-stack-md">
                  <p className="font-label-mono text-label-mono text-on-surface-variant uppercase">MOQ progress</p>
                  <p className="font-headline-md text-headline-md text-primary mt-1">{progress}%</p>
                </div>
                <div className="rounded-lg border border-surface-stroke bg-surface-container-low p-stack-md">
                  <p className="font-label-mono text-label-mono text-on-surface-variant uppercase">Anomaly scan</p>
                  <p className="font-headline-sm text-headline-sm text-success-green mt-2">Clean</p>
                </div>
              </div>
              <p className="text-body-md text-on-surface-variant mt-stack-md">
                {product.aiInsight ?? "AI memantau pola join, trust score creator, dan risiko refund sebelum pembayaran divalidasi."}
              </p>
            </div>
          </div>

          <aside className="glass-panel rounded-xl p-stack-lg h-fit lg:sticky lg:top-28">
            <div className="flex items-center gap-3 mb-stack-md">
              <BadgeCheck className="h-6 w-6 text-primary" />
              <h2 className="font-headline-sm text-headline-sm text-on-surface uppercase">Ringkasan Escrow</h2>
            </div>

            <div className="space-y-4 border-b border-surface-stroke pb-stack-lg">
              <div className="flex justify-between gap-4">
                <span className="text-on-surface-variant">Harga produk</span>
                <span className="font-bold text-on-surface">{currency.format(product.price)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-on-surface-variant">Quantity</span>
                <span className="font-bold text-on-surface">{quantity}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-on-surface-variant">Subtotal</span>
                <span className="font-bold text-on-surface">{currency.format(subtotal)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-on-surface-variant">Protection fee</span>
                <span className="font-bold text-on-surface">{currency.format(protectionFee)}</span>
              </div>
              <div className="flex justify-between gap-4 pt-4 border-t border-surface-stroke">
                <span className="text-on-surface-variant">Dana escrow</span>
                <span className="font-bold text-primary">{currency.format(escrowHold)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-on-surface-variant">Deposit hari ini</span>
                <span className="font-bold text-primary">{currency.format(depositToday)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-on-surface-variant">Sisa saat MOQ lolos</span>
                <span className="font-bold text-on-surface">{currency.format(balanceAfterMoq)}</span>
              </div>
            </div>

            <div className="space-y-4 mt-stack-lg">
              <div className="rounded-lg border border-surface-stroke bg-surface-container-low p-stack-md">
                <p className="font-label-mono text-label-mono text-on-surface-variant uppercase">Metode aktif</p>
                <p className="font-headline-sm text-headline-sm text-on-surface mt-1">{selectedPayment.label}</p>
                <p className="font-label-mono text-label-mono text-primary mt-2">{validationCode}</p>
              </div>

              <div className="rounded-lg border border-primary/30 bg-primary/10 p-stack-md">
                <div className="flex items-start gap-3">
                  <Timer className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-body-md text-on-surface-variant">
                    Escrow belum dilepas ke creator sampai MOQ, QC awal, dan milestone produksi tervalidasi.
                  </p>
                </div>
              </div>

              {validationStatus === "validated" ? (
                <div className="rounded-lg border border-success-green/40 bg-success-green/10 p-stack-md">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-success-green shrink-0 mt-0.5" />
                    <div>
                      <p className="font-label-mono text-label-mono text-success-green uppercase">Join tervalidasi</p>
                      <p className="text-body-md text-on-surface-variant mt-1">
                        Komitmen pembelian masuk antrean escrow. Pesanan akan tampil sebagai order aktif.
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}

              <button
                onClick={handleConfirmJoin}
                disabled={validationStatus === "pending"}
                className="w-full bg-primary text-on-primary font-label-mono text-label-mono py-4 rounded-lg hover:bg-primary-fixed transition-all primary-glow uppercase disabled:opacity-70"
              >
                {validationStatus === "pending" ? "Memvalidasi pembayaran..." : "Confirm join escrow"}
              </button>

              <Link
                href="/dashboard"
                className="block text-center w-full border border-surface-stroke text-on-surface-variant font-label-mono text-label-mono py-4 rounded-lg hover:border-primary hover:text-primary transition-all uppercase"
              >
                Kembali ke dashboard
              </Link>
            </div>
          </aside>
        </section>
      </main>

      <footer className="bg-deep-void border-t border-surface-stroke py-stack-lg mt-auto">
        <div className="max-w-container-max mx-auto px-5 md:px-margin-desktop flex flex-wrap gap-3 justify-between items-center">
          <span className="font-label-mono text-label-mono text-outline">(c) 2026 NEXBUY CHECKOUT</span>
          <span className="font-label-mono text-label-mono text-outline">Escrow payment validation</span>
        </div>
      </footer>
    </div>
  )
}
