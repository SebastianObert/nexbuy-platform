import Link from "next/link"

const PRODUCTS = [
  {
    id: "aurora-r2",
    name: "Aurora R2",
    creator: "Studio Kanvas",
    price: "Rp 4.2M",
    funded: 142,
    daysLeft: 12,
    aiScore: 92,
    badge: "LIVE GB",
    badgeColor: "bg-primary text-on-primary",
    aiColor: "text-primary border-primary/30",
    progressWidth: "w-full",
    img: "/images/product-case.jpg",
    fundedColor: "text-primary",
    hoverBorder: "hover:border-primary",
  },
  {
    id: "oceanus-set",
    name: "Oceanus Set",
    creator: "Resin Lab",
    price: "Rp 850K",
    funded: 68,
    daysLeft: 21,
    aiScore: 78,
    badge: null,
    badgeColor: "",
    aiColor: "text-on-surface-variant",
    progressWidth: "w-[68%]",
    img: "/images/product-keycap.png",
    fundedColor: "text-on-surface",
    hoverBorder: "hover:border-secondary",
  },
  {
    id: "specter-v3",
    name: "Specter v3",
    creator: "Mono Toys",
    price: "Rp 1.4M",
    funded: 95,
    daysLeft: 7,
    aiScore: 88,
    badge: "LIVE GB",
    badgeColor: "bg-secondary-container text-on-secondary-container",
    aiColor: "text-primary border-primary/30",
    progressWidth: "w-[95%]",
    img: "/images/product-figure.png",
    fundedColor: "text-primary",
    hoverBorder: "hover:border-primary",
  },
  {
    id: "teal75",
    name: "Teal75 Alum",
    creator: "Forge & Co",
    price: "Rp 6.8M",
    funded: 53,
    daysLeft: 28,
    aiScore: 71,
    badge: null,
    badgeColor: "",
    aiColor: "text-on-surface-variant",
    progressWidth: "w-[53%]",
    img: "/images/product-case.jpg",
    fundedColor: "text-on-surface",
    hoverBorder: "hover:border-primary",
  },
]

const REVIEWS = [
  { initials: "JD", handle: "@josh_digital",    role: "PEMBELI TERVERIFIKASI", stars: 5, text: '"The Aurora R1 was already a masterpiece, but R2 through NexBuy was flawless. The AI Score was spot on regarding the lead times."' },
  { initials: "KL", handle: "@keeb_lord",        role: "KONTRIBUTOR",           stars: 4, text: '"NexBuy has the best UI in the mechanical peripheral space. Tracking my artisan caps has never been so aesthetic."' },
  { initials: "MR", handle: "@mechanic_reaper",  role: "KOLEKTOR KELAS KAKAP",  stars: 5, text: '"Security was always my concern with small makers. The escrow system here makes me feel safe dropping 5M on a case."' },
]

export default function HomePage() {
  return (
    <div className="bg-deep-void text-on-surface font-body-md min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-deep-void/80 backdrop-blur-xl border-b border-surface-stroke sticky top-0 z-50 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
        <div className="flex justify-between items-center w-full max-w-container-max mx-auto px-margin-desktop h-20">
          <div className="flex items-center gap-stack-lg">
            <Link href="/home" className="font-headline-sm text-headline-sm tracking-tighter text-primary uppercase">NEXBUY</Link>
            <div className="hidden md:flex gap-stack-md">
              <Link href="/home" className="font-headline-sm text-headline-sm text-primary font-bold border-b-2 border-primary pb-1">Beranda</Link>
              <a href="#discover" className="font-headline-sm text-headline-sm text-on-surface-variant hover:text-primary transition-all">Produk</a>
              <a href="#how"      className="font-headline-sm text-headline-sm text-on-surface-variant hover:text-primary transition-all">Group Buy</a>
            </div>
          </div>
          <div className="flex items-center gap-stack-md">
            <div className="relative hidden lg:block">
              <input className="bg-deep-void border border-surface-stroke px-4 py-2 rounded-lg text-body-md focus:border-primary outline-none w-64 transition-all" placeholder="Cari perlengkapan presisi..." type="text" />
            </div>
            <button className="hover:bg-surface-variant/50 p-2 rounded-lg transition-colors">
              <span className="material-symbols-outlined text-primary">shopping_cart</span>
            </button>
            <Link href="/login" className="flex items-center gap-2 px-4 py-2 border border-surface-stroke hover:border-primary font-label-mono text-label-mono text-on-surface-variant hover:text-primary transition-all">
              <span className="material-symbols-outlined text-[18px]">account_circle</span>
              AKUN
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero */}
        <section className="relative h-[80vh] flex items-center overflow-hidden border-b border-surface-stroke">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-deep-void via-deep-void/60 to-transparent z-10" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="Aurora R2 Keyboard" className="w-full h-full object-cover grayscale-[0.2] contrast-[1.1]" src="/images/hero-keyboard.jpg" />
          </div>
          <div className="relative z-20 max-w-container-max mx-auto px-margin-desktop w-full">
            <div className="max-w-2xl">
              <span className="font-label-mono text-label-mono text-primary mb-stack-sm block tracking-[0.2em] uppercase">STATUS: GROUP BUY SEDANG BERLANGSUNG</span>
              <h1 className="font-display-lg text-display-lg text-on-surface mb-stack-md leading-none">
                AURORA R2 <br /><span className="text-primary-container">PRECISION SERIES</span>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-stack-lg max-w-lg">
                Dirancang untuk kaum elit. Aurora R2 menggabungkan gasket-mounted acoustics dengan sasis monolitik CNC-machined.
              </p>
              <div className="flex gap-stack-md">
                <Link href="/login" className="bg-primary hover:bg-primary-container text-on-primary font-headline-sm text-headline-sm px-8 py-4 rounded-lg transition-all flex items-center gap-2">
                  <span>Join Group Buy</span><span className="material-symbols-outlined">bolt</span>
                </Link>
                <button className="border border-surface-stroke hover:bg-surface-variant/30 text-on-surface font-headline-sm text-headline-sm px-8 py-4 rounded-lg transition-all">Spek Teknis</button>
              </div>
            </div>
          </div>
        </section>

        {/* Discover */}
        <section id="discover" className="py-section-gap max-w-container-max mx-auto px-margin-desktop">
          <div className="flex flex-col md:flex-row justify-between items-end mb-section-gap gap-stack-lg">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-stack-sm">Jelajahi Koleksi</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">Proyek terkurasi dengan keamanan yang didukung komunitas.</p>
            </div>
            <div className="flex gap-stack-sm overflow-x-auto pb-2">
              {["Semua", "Keyboard", "Keycaps", "Figure", "Audio"].map((cat, i) => (
                <button key={cat} className={`px-6 py-2 font-label-mono text-label-mono rounded-full transition-colors ${i === 0 ? "bg-primary text-on-primary" : "glass-panel hover:border-primary text-on-surface"}`}>{cat}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {PRODUCTS.map((p) => (
              <Link href="/login" key={p.id} className={`group relative bg-surface-container rounded-xl border border-surface-stroke overflow-hidden ${p.hoverBorder} transition-all duration-500 primary-glow`}>
                <div className="relative aspect-square overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={p.name} src={p.img} />
                  {p.badge && <div className="absolute top-4 right-4 z-10"><span className={`font-label-mono text-[10px] px-3 py-1 rounded-full pulse-chip ${p.badgeColor}`}>{p.badge}</span></div>}
                  <div className="absolute bottom-4 left-4 z-10">
                    <span className={`font-label-mono text-label-mono bg-deep-void/80 backdrop-blur-md border px-3 py-1 rounded flex items-center gap-1 ${p.aiColor}`}>
                      <span className="material-symbols-outlined text-[14px] fill-icon text-neon-cyan">verified</span>AI {p.aiScore}
                    </span>
                  </div>
                </div>
                <div className="p-stack-md">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface">{p.name}</h3>
                      <p className="font-body-md text-body-md text-on-surface-variant opacity-70">{p.creator}</p>
                    </div>
                    <span className="font-price-display text-price-display text-primary">{p.price}</span>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between font-label-mono text-label-mono mb-2">
                      <span className={p.fundedColor}>{p.funded}% funded</span>
                      <span className="text-on-surface-variant">{p.daysLeft}d left</span>
                    </div>
                    <div className="h-1.5 w-full progress-track rounded-full overflow-hidden">
                      <div className={`h-full progress-fill ${p.progressWidth}`} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* AI Showcase */}
        <section className="py-section-gap bg-surface-container-low border-y border-surface-stroke">
          <div className="max-w-container-max mx-auto px-margin-desktop grid grid-cols-1 lg:grid-cols-2 gap-section-gap items-center">
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-[80px]" />
              <div className="glass-panel p-stack-lg rounded-xl relative z-10 border-primary/20">
                <div className="flex items-center gap-stack-md mb-stack-lg">
                  <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/40">
                    <span className="material-symbols-outlined text-primary text-[32px]">psychology</span>
                  </div>
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface">AI Score</h3>
                    <p className="font-label-mono text-label-mono text-primary">TRUST PROTOCOL v2.4</p>
                  </div>
                </div>
                <div className="space-y-stack-md">
                  {[{ label: "Designer History", value: "ELITE", color: "text-success-green" }, { label: "Timeline Integrity", value: "98%", color: "text-primary" }, { label: "Social Sentiment", value: "POSITIVE", color: "text-neon-cyan" }].map((row) => (
                    <div key={row.label} className="flex justify-between items-center p-4 rounded bg-deep-void border border-surface-stroke">
                      <span className="font-body-md text-body-md text-on-surface-variant">{row.label}</span>
                      <span className={`font-label-mono text-label-mono ${row.color}`}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-stack-md">Dibangun di atas Data, <br /><span className="text-primary">Digerakkan oleh Komunitas.</span></h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-stack-lg">AI Score kami menganalisis data historis, kapabilitas manufaktur, dan kepercayaan sosial untuk penilaian risiko kuantitatif setiap group buy.</p>
              <ul className="space-y-4">
                {["Kontrak manufaktur terverifikasi sebelum listing.", "Perlindungan pendanaan berbasis Escrow.", "Pembaruan perakitan & pengiriman real-time."].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-success-green">check_circle</span>
                    <span className="font-body-md text-body-md text-on-surface">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="py-section-gap max-w-container-max mx-auto px-margin-desktop text-center">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-section-gap">Perjalanan Kolektor</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter relative">
            <div className="hidden md:block absolute top-1/4 left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-transparent via-surface-stroke to-transparent" />
            {[{ icon: "search", label: "Temukan", desc: "Jelajahi proyek artisan yang terkurasi." }, { icon: "group", label: "Gabung", desc: "Berikan dukungan Anda selama jendela group buy." }, { icon: "payments", label: "Danai", desc: "Kekuatan kolektif menurunkan biaya manufaktur." }, { icon: "package_2", label: "Terima", desc: "Mahakarya Anda dirakit dan dikirimkan.", filled: true }].map(({ icon, label, desc, filled }) => (
              <div key={label} className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full glass-panel border border-surface-stroke flex items-center justify-center mb-stack-md relative z-10">
                  <span className={`material-symbols-outlined ${filled ? "text-primary fill-icon" : "text-on-surface"}`}>{icon}</span>
                </div>
                <h4 className="font-headline-sm text-[18px] mb-2">{label}</h4>
                <p className="font-body-md text-body-md text-on-surface-variant text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Reviews */}
        <section className="py-section-gap max-w-container-max mx-auto px-margin-desktop overflow-hidden">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-stack-lg text-center">Transmisi Komunitas</h2>
          <div className="flex gap-gutter overflow-x-auto pb-8">
            {REVIEWS.map((r) => (
              <div key={r.handle} className="min-w-[320px] md:min-w-[400px] glass-panel p-stack-lg rounded-xl border border-surface-stroke flex-shrink-0">
                <div className="flex gap-1 text-primary mb-stack-md">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={`material-symbols-outlined text-[20px] ${i < r.stars ? "fill-icon" : ""}`}>star</span>
                  ))}
                </div>
                <p className="font-body-md text-body-md text-on-surface mb-stack-lg italic leading-relaxed">{r.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-container-high border border-primary/30 flex items-center justify-center font-label-mono text-primary">{r.initials}</div>
                  <div>
                    <p className="font-label-mono text-label-mono text-on-surface">{r.handle}</p>
                    <p className="text-[10px] text-on-surface-variant uppercase">{r.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-deep-void border-t border-surface-stroke py-section-gap">
        <div className="max-w-container-max mx-auto px-margin-desktop flex flex-col md:flex-row justify-between items-start gap-stack-lg">
          <div className="flex flex-col gap-stack-md">
            <span className="font-headline-sm text-headline-sm text-primary uppercase">NEXBUY</span>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">Mengurasi koleksi teknis dan karya seni mekanik paling presisi di dunia.</p>
          </div>
          <div className="grid grid-cols-3 gap-stack-lg">
            {[{ title: "Company", links: ["Tentang Kami", "Karir"] }, { title: "Support", links: ["Info Pengiriman", "Bantuan"] }, { title: "Legal", links: ["Ketentuan Layanan", "Kebijakan Privasi"] }].map(({ title, links }) => (
              <div key={title} className="flex flex-col gap-2">
                <h5 className="font-label-mono text-label-mono text-on-surface uppercase mb-2">{title}</h5>
                {links.map((l) => <a key={l} href="#" className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors">{l}</a>)}
              </div>
            ))}
          </div>
        </div>
        <div className="max-w-container-max mx-auto px-margin-desktop mt-stack-lg pt-stack-lg border-t border-surface-stroke">
          <p className="font-label-mono text-label-mono text-outline text-center">© 2024 NEXBUY PRECISION COLLECTIBLES. HAK CIPTA DILINDUNGI UNDANG-UNDANG.</p>
        </div>
      </footer>
    </div>
  )
}
