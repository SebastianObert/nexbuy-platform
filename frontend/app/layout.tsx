import type { Metadata } from "next"
import { Geist, Geist_Mono, Space_Grotesk, JetBrains_Mono } from "next/font/google"
import { TooltipProvider } from "@/components/ui/tooltip"
import "./globals.css"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
})

export const metadata: Metadata = {
  title: "NexBuy — Group Buy Platform for Hobby Collectors",
  description:
    "Join exclusive group buys for mechanical keyboards, artisan keycaps, figures, and more. AI-powered predictions, escrow protection, and community-driven deals.",
}

const themeScript = `
(function() {
  try {
    var t = localStorage.getItem('nexbuy-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', t);
  } catch(e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col" style={{ backgroundColor: "var(--nb-bg)", color: "var(--nb-text)" }}>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  )
}
