import Link from "next/link"

export function Footer() {
  return (
    <footer className="w-full border-t border-foreground/10 mt-10">
      <div className="w-full max-w-5xl mx-auto px-5 py-8 flex flex-col gap-4 text-sm text-muted-foreground">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="ArrowPay" className="w-6 h-6" />
            <span className="bg-gradient-to-r from-pink-400 via-pink-300 to-rose-400 bg-clip-text text-transparent font-bold">
              ArrowPay
            </span>
          </div>
          <nav className="flex flex-wrap items-center gap-5">
            <Link href="/about" className="hover:text-foreground transition-colors">About &amp; FAQ</Link>
            <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
            <a href="https://github.com/nbaeti630-ui/arrowpay" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">GitHub</a>
          </nav>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-foreground/10 pt-4">
          <span>© 2026 ArrowPay. Built with USDC on Arc.</span>
          <span>Testnet demo · not for production funds.</span>
        </div>
      </div>
    </footer>
  )
}
