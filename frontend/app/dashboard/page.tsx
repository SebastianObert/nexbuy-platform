import Link from "next/link"
import { products } from "@/lib/data/products"

export default function CollectorDashboardPage() {
  return (
    <div className="bg-deep-void text-on-surface font-body-md min-h-screen flex flex-col">
      {/* ── Navbar ─────────────────────────────────────────────── */}
      <nav className="bg-deep-void/80 backdrop-blur-xl border-b border-surface-stroke sticky top-0 z-50 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
        <div className="flex justify-between items-center w-full max-w-container-max mx-auto px-margin-desktop h-20">
          <div className="font-headline-sm text-headline-sm tracking-tighter text-primary uppercase">Nexbuy</div>
          <div className="hidden md:flex items-center gap-stack-lg">
            <Link href="/home" className="font-headline-sm text-headline-sm text-on-surface-variant hover:text-primary transition-all">Beranda</Link>
            <a href="#"      className="font-headline-sm text-headline-sm text-primary font-bold border-b-2 border-primary pb-1">Koleksi</a>
            <a href="#"      className="font-headline-sm text-headline-sm text-on-surface-variant hover:text-primary transition-all">Pesanan</a>
            <a href="#"      className="font-headline-sm text-headline-sm text-on-surface-variant hover:text-primary transition-all">Wishlist</a>
          </div>
          <div className="flex items-center gap-stack-md">
            <button className="hover:bg-surface-variant/50 transition-colors p-2 rounded-lg">
              <span className="material-symbols-outlined text-primary">shopping_cart</span>
            </button>
            <Link href="/login" className="flex items-center gap-2 px-4 py-2 border border-surface-stroke hover:border-primary font-label-mono text-label-mono text-on-surface-variant hover:text-primary transition-all">
              <span className="material-symbols-outlined text-[18px]">logout</span>
              KELUAR
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-container-max mx-auto px-margin-desktop py-stack-lg w-full">
        {/* Header */}
        <header className="mb-section-gap">
          <span className="font-label-mono text-label-mono text-primary uppercase tracking-widest">COLLECTOR INTERFACE v1.0</span>
          <h1 className="font-display-lg text-headline-md md:text-display-lg text-on-surface uppercase mt-stack-sm">
            Hub Koleksi
          </h1>
        </header>

        {/* Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-gutter mb-section-gap">
          {[
            { label: "PROYEK DIIKUTI",   value: "6",    color: "text-primary" },
            { label: "ITEM WISHLIST",     value: "14",   color: "text-secondary" },
            { label: "PESANAN AKTIF",     value: "3",    color: "text-neon-cyan" },
            { label: "TOTAL DIBELANJAKAN", value: "12.8M", color: "text-success-green" },
          ].map(({ label, value, color }) => (
            <div key={label} className="glass-panel p-stack-md rounded-lg flex flex-col gap-stack-sm hover:border-primary transition-colors">
              <span className="font-label-mono text-label-mono text-on-surface-variant uppercase">{label}</span>
              <span className={`font-headline-md text-headline-md ${color}`}>{value}</span>
            </div>
          ))}
        </section>

        {/* Active Group Buys */}
        <section className="mb-section-gap">
          <div className="flex justify-between items-center mb-stack-lg">
            <h2 className="font-headline-sm text-headline-sm text-on-surface uppercase">Group Buy Aktif</h2>
            <Link href="/home" className="font-label-mono text-label-mono text-primary hover:underline uppercase">
              Jelajahi Semua →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {products.slice(0, 8).map((p) => (
              <div key={p.id} className="glass-panel rounded-xl border border-surface-stroke hover:border-primary transition-all duration-500 overflow-hidden group">
                <div className="relative aspect-video bg-surface-container-high flex items-center justify-center overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-3 right-3">
                    <span className="font-label-mono text-[10px] bg-primary text-on-primary px-3 py-1 rounded-full pulse-chip">
                      LIVE GB
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span className="font-label-mono text-label-mono bg-deep-void/80 border border-primary/30 px-3 py-1 rounded flex items-center gap-1 text-primary">
                      <span className="material-symbols-outlined text-[14px] fill-icon text-neon-cyan">verified</span>
                      AI {p.aiProbability}
                    </span>
                  </div>
                </div>
                <div className="p-stack-md">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface">{p.name}</h3>
                      <p className="font-body-md text-body-md text-on-surface-variant opacity-70">{p.creator}</p>
                    </div>
                    <span className="font-price-display text-price-display text-primary">
                      ${p.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between font-label-mono text-label-mono mb-2">
                      <span className="text-primary">{p.joinCount}/{p.moq} peserta</span>
                      <span className="text-on-surface-variant">
                        {Math.round((p.joinCount / p.moq) * 100)}% terpenuhi
                      </span>
                    </div>
                    <div className="h-1.5 w-full progress-track rounded-full overflow-hidden">
                      <div
                        className="h-full progress-fill"
                        style={{ width: `${Math.min((p.joinCount / p.moq) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  <button className="mt-stack-md w-full bg-primary/10 border border-primary/30 text-primary font-label-mono text-label-mono py-3 hover:bg-primary hover:text-on-primary transition-all">
                    JOIN GROUP BUY
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-deep-void border-t border-surface-stroke py-stack-lg mt-auto">
        <div className="max-w-container-max mx-auto px-margin-desktop flex justify-between items-center">
          <span className="font-label-mono text-label-mono text-outline">© 2024 NEXBUY COLLECTOR PORTAL</span>
          <Link href="/login" className="font-label-mono text-label-mono text-outline hover:text-primary transition-colors">
            Ganti Akun
          </Link>
        </div>
      </footer>
    </div>
  )
}
