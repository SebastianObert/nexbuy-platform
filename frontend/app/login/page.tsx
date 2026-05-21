"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

type Role = "Kolektor" | "Kreator" | "Admin"

interface RoleCard {
  role: Role
  icon: string
  label: string
  description: string
  colorClass: string
  hoverBorder: string
  hoverGradient: string
  textColor: string
  glowText: string
  cardClass: string
}

const ROLES: RoleCard[] = [
  {
    role: "Kolektor",
    icon: "token",
    label: "Kolektor",
    description: "Akses inventori digital dan manajemen aset taktis.",
    colorClass: "text-neon-cyan",
    hoverBorder: "hover:border-neon-cyan",
    hoverGradient: "from-neon-cyan/5",
    textColor: "text-neon-cyan",
    glowText: "group-hover:shadow-[0_0_15px_rgba(34,211,238,0.3)]",
    cardClass: "role-card-cyan",
  },
  {
    role: "Kreator",
    icon: "edit_note",
    label: "Kreator",
    description: "Rancang dan modifikasi antarmuka visual kustom.",
    colorClass: "text-secondary",
    hoverBorder: "hover:border-secondary",
    hoverGradient: "from-secondary/5",
    textColor: "text-secondary",
    glowText: "group-hover:shadow-[0_0_15px_rgba(208,188,255,0.3)]",
    cardClass: "role-card-secondary",
  },
  {
    role: "Admin",
    icon: "admin_panel_settings",
    label: "Admin",
    description: "Manajemen inti sistem dan protokol keamanan tinggi.",
    colorClass: "text-error",
    hoverBorder: "hover:border-error",
    hoverGradient: "from-error/5",
    textColor: "text-error",
    glowText: "group-hover:shadow-[0_0_15px_rgba(255,180,171,0.3)]",
    cardClass: "role-card-error",
  },
]

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRole) return
    localStorage.setItem("nexbuy_role", selectedRole)
    if (selectedRole === "Kolektor") router.push("/dashboard")
    else if (selectedRole === "Kreator") router.push("/dashboard/creator")
    else router.push("/dashboard/admin")
  }

  return (
    <div className="bg-deep-void text-on-surface font-body-md selection:bg-neon-cyan selection:text-deep-void min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-deep-void/80 backdrop-blur-md fixed top-0 w-full z-50 border-b border-surface-stroke shadow-[0_0_15px_rgba(34,211,238,0.1)]">
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop h-20 max-w-container-max mx-auto">
          <Link href="/" className="font-headline-md text-headline-md font-bold text-neon-cyan tracking-tighter">
            NEXBUY
          </Link>
          <div className="flex items-center gap-stack-md">
            <span className="material-symbols-outlined text-on-surface-variant hover:text-neon-cyan transition-colors cursor-pointer">
              account_circle
            </span>
            <span className="material-symbols-outlined text-on-surface-variant hover:text-neon-cyan transition-colors cursor-pointer">
              settings
            </span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-grow pt-24 pb-stack-lg cyber-grid relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface-container-lowest/50 to-deep-void pointer-events-none" />
        <div className="scanline" />

        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col items-center">
          {/* Login Card */}
          <section className="w-full max-w-md mt-12 mb-section-gap relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan/20 to-secondary/20 blur-xl opacity-50" />
            <div className="bg-surface-container-lowest border border-surface-stroke p-stack-lg relative z-10">
              {/* Branding */}
              <div className="mb-stack-lg text-center">
                <div className="inline-block px-3 py-1 bg-secondary-container/20 border border-secondary-container/40 mb-stack-sm">
                  <span className="font-label-mono text-label-mono text-secondary uppercase tracking-widest">
                    Secure Handshake Protocol
                  </span>
                </div>
                <h1 className="font-headline-md text-headline-md text-on-surface">Masuk ke Sistem</h1>
                <p className="font-body-md text-outline mt-2">Otentikasi diperlukan untuk akses terminal.</p>
              </div>

              {/* Form */}
              <form className="space-y-stack-md" onSubmit={handleSubmit}>
                {/* ID Akses */}
                <div className="space-y-2 group">
                  <label className="font-label-mono text-label-mono text-outline-variant group-focus-within:text-neon-cyan transition-colors block">
                    ID Akses
                  </label>
                  <div className="relative neon-border-glow transition-all duration-300">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant">
                      fingerprint
                    </span>
                    <input
                      className="w-full bg-deep-void border border-surface-stroke py-4 pl-12 pr-4 text-on-surface placeholder:text-surface-variant font-body-md focus:outline-none focus:border-neon-cyan transition-colors"
                      placeholder="Masukkan ID Unit"
                      type="text"
                    />
                  </div>
                </div>

                {/* Kata Sandi */}
                <div className="space-y-2 group">
                  <label className="font-label-mono text-label-mono text-outline-variant group-focus-within:text-neon-cyan transition-colors block">
                    Kata Sandi
                  </label>
                  <div className="relative neon-border-glow transition-all duration-300">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant">
                      key
                    </span>
                    <input
                      className="w-full bg-deep-void border border-surface-stroke py-4 pl-12 pr-4 text-on-surface placeholder:text-surface-variant font-body-md focus:outline-none focus:border-neon-cyan transition-colors"
                      placeholder="••••••••"
                      type="password"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      className="w-4 h-4 bg-deep-void border-surface-stroke text-neon-cyan focus:ring-0"
                      type="checkbox"
                    />
                    <span className="font-label-mono text-label-mono text-outline hover:text-on-surface transition-colors">
                      Ingat Terminal Ini
                    </span>
                  </label>
                  <a
                    href="#"
                    className="font-label-mono text-label-mono text-secondary hover:text-on-secondary-container transition-colors underline decoration-secondary/30 underline-offset-4"
                  >
                    Reset Protokol
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={!selectedRole}
                  className={`w-full font-headline-sm text-headline-sm py-4 mt-stack-md flex items-center justify-center gap-3 transition-all duration-300 active:scale-[0.98] ${
                    selectedRole
                      ? "bg-primary-container text-on-primary-container hover:bg-neon-cyan shadow-[0_0_20px_rgba(34,211,238,0.25)] cursor-pointer"
                      : "bg-primary-container/50 text-on-primary-container/50 cursor-not-allowed"
                  }`}
                >
                  <span>{selectedRole ? `Masuk sebagai ${selectedRole}` : "Pilih Akses Terlebih Dahulu"}</span>
                  <span className="material-symbols-outlined">login</span>
                </button>
              </form>

              {/* Corner decorations */}
              <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-neon-cyan opacity-40" />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-neon-cyan opacity-40" />
            </div>
          </section>

          {/* Role Cards */}
          <section className="w-full">
            <div className="flex items-center gap-4 mb-stack-lg overflow-hidden">
              <h2 className="font-label-mono text-label-mono text-outline whitespace-nowrap">
                Terminal Akses Sistem
              </h2>
              <div className="h-px bg-surface-stroke w-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              {ROLES.map(({ role, icon, label, description, colorClass, hoverBorder, hoverGradient, textColor, glowText, cardClass }) => (
                <div
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`group cursor-pointer bg-surface-container-low border border-surface-stroke p-stack-lg ${hoverBorder} transition-all duration-500 relative overflow-hidden ${cardClass} ${selectedRole === role ? "selected" : ""}`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${hoverGradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                  <div className="flex flex-col items-center text-center relative z-10">
                    <div className={`w-16 h-16 bg-surface-container-highest flex items-center justify-center mb-stack-md ${glowText} transition-all`}>
                      <span className={`material-symbols-outlined text-4xl ${colorClass} fill-icon`}>
                        {icon}
                      </span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">{label}</h3>
                    <p className="font-body-md text-outline text-sm">{description}</p>
                    <div className={`mt-stack-md font-label-mono text-label-mono ${textColor} opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all`}>
                      INISIASI TERMINAL &gt;
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-deep-void border-t border-surface-stroke w-full py-stack-lg">
        <div className="flex flex-col md:flex-row justify-between items-center px-margin-desktop max-w-container-max mx-auto gap-stack-md">
          <div className="font-label-mono text-label-mono text-outline">
            © 2024 NEXBUY TACTICAL INTERFACE. ALL RIGHTS RESERVED.
          </div>
          <div className="flex gap-stack-md">
            <a href="#" className="font-label-mono text-label-mono text-outline hover:text-neon-cyan transition-colors">Terms of Service</a>
            <a href="#" className="font-label-mono text-label-mono text-outline hover:text-neon-cyan transition-colors">System Status</a>
            <a href="#" className="font-label-mono text-label-mono text-outline hover:text-neon-cyan transition-colors">Security Protocol</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
