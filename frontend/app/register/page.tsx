"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import ThemeToggle from "@/components/theme-toggle"

type Role = "Kolektor" | "Kreator" | "Admin"

const ROLES: { role: Role; label: string; desc: string; icon: string; color: string }[] = [
  {
    role: "Kolektor",
    label: "Kolektor",
    desc: "Jelajahi dan ikuti group buy produk hobby eksklusif",
    icon: "🛍️",
    color: "var(--nb-primary)",
  },
  {
    role: "Kreator",
    label: "Kreator",
    desc: "Buat dan kelola campaign group buy produkmu",
    icon: "🎨",
    color: "var(--nb-secondary)",
  },
  {
    role: "Admin",
    label: "Admin",
    desc: "Pantau platform, pengguna, dan transaksi",
    icon: "⚙️",
    color: "var(--nb-cyan)",
  },
]

const STATS = [
  { value: "48K+",   label: "Kolektor Bergabung" },
  { value: "1,200+", label: "Campaign Aktif"      },
  { value: "Free",   label: "Daftar Gratis"       },
]

export default function RegisterPage() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [name, setName]         = useState("")
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm]   = useState("")
  const [showPass, setShowPass] = useState(false)
  const [agree, setAgree]       = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedRole || !agree) return
    router.push("/login")
  }

  const canSubmit = selectedRole && agree && name && email && password && confirm && password === confirm

  return (
    <div className="min-h-screen flex" style={{ background: "var(--nb-bg)" }}>

      {/* ── LEFT PANEL ─────────────────────────────────────────── */}
      <div
        className="hidden lg:flex flex-col flex-1 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, var(--nb-surface-low) 0%, var(--nb-surface) 50%, var(--nb-surface-high) 100%)",
          borderRight: "1px solid var(--nb-stroke)",
        }}
      >
        {/* Ambient blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute w-[500px] h-[500px] rounded-full blur-[120px] opacity-20"
            style={{ background: "var(--nb-secondary)", top: "-10%", right: "-10%" }} />
          <div className="absolute w-[400px] h-[400px] rounded-full blur-[100px] opacity-15"
            style={{ background: "var(--nb-primary)", bottom: "0%", left: "-5%" }} />
        </div>

        {/* Center branding */}
        <div className="flex-1 flex flex-col items-center justify-center px-12 relative z-10">
          <div className="text-center nb-animate-fade-up">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 text-white font-bold text-2xl"
              style={{ background: "linear-gradient(135deg, var(--nb-primary), var(--nb-secondary))" }}
            >N</div>
            <h1 className="nb-h1 mb-3" style={{ color: "var(--nb-text)" }}>Bergabung NexBuy</h1>
            <p className="text-base max-w-xs mx-auto" style={{ color: "var(--nb-text-sub)" }}>
              Komunitas group buy premium untuk kolektor & kreator hobby terbaik Indonesia
            </p>

            <div className="grid grid-cols-3 gap-6 mt-10">
              {STATS.map((s) => (
                <div key={s.label} className="nb-glass rounded-2xl p-5 text-center">
                  <p className="nb-h3 nb-gradient-text mb-1">{s.value}</p>
                  <p className="text-xs" style={{ color: "var(--nb-text-dim)" }}>{s.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 space-y-3 text-left max-w-xs mx-auto">
              {[
                { icon: "🔒", text: "Dana aman dengan sistem escrow terverifikasi" },
                { icon: "🤖", text: "AI Score prediksi keberhasilan setiap campaign" },
                { icon: "⭐", text: "Hanya kreator terverifikasi yang bisa listing" },
              ].map((item) => (
                <div key={item.text} className="flex items-start gap-3">
                  <span className="text-lg">{item.icon}</span>
                  <p className="text-sm" style={{ color: "var(--nb-text-sub)" }}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom trust badges */}
        <div className="px-12 pb-10 flex items-center justify-center gap-4 relative z-10">
          {["🔒 Escrow Protected", "🤖 AI Predictions", "⭐ Verified Sellers"].map((t) => (
            <span key={t} className="nb-badge nb-badge-blue text-[11px]">{t}</span>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL — form ──────────────────────────────────── */}
      <div className="flex flex-col w-full lg:w-[480px] xl:w-[540px] min-h-screen overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-7 pb-4">
          <Link href="/home" className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ background: "linear-gradient(135deg, var(--nb-primary), var(--nb-secondary))" }}
            >N</div>
            <span className="font-bold text-base" style={{ color: "var(--nb-text)" }}>NexBuy</span>
          </Link>
          <ThemeToggle />
        </div>

        {/* Form */}
        <div className="flex-1 flex flex-col justify-center px-8 py-6">
          <div className="max-w-sm w-full mx-auto nb-animate-scale-in">

            <div className="mb-7">
              <h2 className="nb-h2 mb-1" style={{ color: "var(--nb-text)" }}>Buat akun baru</h2>
              <p className="text-sm" style={{ color: "var(--nb-text-sub)" }}>
                Daftar gratis dan mulai perjalanan koleksimu
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Full name */}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--nb-text-sub)" }}>
                  Nama Lengkap
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--nb-text-dim)" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama kamu"
                    className="nb-input w-full h-11 pl-10 pr-4 text-sm"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--nb-text-sub)" }}>
                  Email
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--nb-text-dim)" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="nb-input w-full h-11 pl-10 pr-4 text-sm"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--nb-text-sub)" }}>
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--nb-text-dim)" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </div>
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 8 karakter"
                    className="nb-input w-full h-11 pl-10 pr-11 text-sm"
                    required
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: "var(--nb-text-dim)" }}>
                    {showPass ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm password */}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--nb-text-sub)" }}>
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--nb-text-dim)" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4"/><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </div>
                  <input
                    type={showPass ? "text" : "password"}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Ulangi password"
                    className="nb-input w-full h-11 pl-10 pr-4 text-sm"
                    required
                  />
                </div>
                {confirm && password !== confirm && (
                  <p className="text-xs mt-1" style={{ color: "var(--nb-red)" }}>Password tidak cocok</p>
                )}
              </div>

              {/* Role Selector */}
              <div>
                <p className="text-xs font-semibold mb-2.5" style={{ color: "var(--nb-text-sub)" }}>
                  Daftar sebagai
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {ROLES.map(({ role, label, desc, icon, color }) => {
                    const active = selectedRole === role
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setSelectedRole(role)}
                        className="flex flex-col items-center gap-1.5 p-3 rounded-xl text-center transition-all duration-200"
                        style={{
                          background: active ? `${color}12` : "var(--nb-surface-low)",
                          border: `1.5px solid ${active ? color : "var(--nb-stroke)"}`,
                          boxShadow: active ? `0 0 0 3px ${color}18` : "none",
                        }}
                      >
                        <span className="text-xl">{icon}</span>
                        <span className="text-xs font-semibold" style={{ color: active ? color : "var(--nb-text)" }}>
                          {label}
                        </span>
                        <span className="text-[10px] leading-tight hidden sm:block" style={{ color: "var(--nb-text-dim)" }}>
                          {desc}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Terms agree */}
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded accent-[var(--nb-primary)]"
                />
                <span className="text-xs leading-relaxed" style={{ color: "var(--nb-text-sub)" }}>
                  Saya menyetujui{" "}
                  <a href="#" className="font-semibold hover:underline" style={{ color: "var(--nb-primary)" }}>Syarat & Ketentuan</a>
                  {" "}dan{" "}
                  <a href="#" className="font-semibold hover:underline" style={{ color: "var(--nb-primary)" }}>Kebijakan Privasi</a>{" "}
                  NexBuy
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={!canSubmit}
                className="nb-btn-primary w-full h-11 text-sm font-semibold mt-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {selectedRole ? `Daftar sebagai ${selectedRole}` : "Pilih role terlebih dahulu"}
              </button>

              {/* Login link */}
              <p className="text-center text-sm" style={{ color: "var(--nb-text-sub)" }}>
                Sudah punya akun?{" "}
                <Link href="/login" className="font-semibold transition-colors hover:underline" style={{ color: "var(--nb-primary)" }}>
                  Masuk sekarang
                </Link>
              </p>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 pb-7 text-center">
          <p className="text-xs" style={{ color: "var(--nb-text-dim)" }}>
            © 2024 NexBuy · <a href="#" className="hover:underline">Privacy</a> · <a href="#" className="hover:underline">Terms</a>
          </p>
        </div>
      </div>
    </div>
  )
}
