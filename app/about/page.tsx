import Link from "next/link"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "About & FAQ - ArrowPay",
  description:
    "Learn how ArrowPay helps you pay freelancers and remote teams in USDC across multiple chains.",
}

const faqs = [
  {
    q: "What is ArrowPay?",
    a: "ArrowPay is a payout tool for paying freelancers and remote teams in USDC. Send to many recipients at once, across multiple chains, with on-chain proof for every payment.",
  },
  {
    q: "Which networks are supported?",
    a: "Arc Testnet, Base Sepolia, Ethereum Sepolia, and Avalanche Fuji. USDC is sent natively on the network you pick.",
  },
  {
    q: "How do payouts work?",
    a: "Add recipients (name, wallet address, amount), choose a network, and send them all in one click. Each payout is tracked with its status and transaction hash.",
  },
  {
    q: "Is this real money?",
    a: "No. ArrowPay currently runs on testnets, so all USDC is test funds with no real value. It is a demo / portfolio project.",
  },
  {
    q: "Where can I see proof of a payment?",
    a: "Open Payout History. Once a transaction is confirmed, its hash links to the block explorer for that network.",
  },
  {
    q: "What is it built with?",
    a: "Next.js, Supabase, and Circle developer-controlled wallets — sending USDC on Arc.",
  },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <Link href="/" className="flex items-center gap-2">
              <img src="/logo.svg" alt="ArrowPay" className="w-8 h-8" />
              <span className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 arrow-shimmer bg-clip-text text-transparent font-bold text-xl">
                ArrowPay
              </span>
            </Link>
            <Link href="/dashboard" className="font-semibold hover:opacity-80">
              Open app
            </Link>
          </div>
        </nav>

        <section className="w-full max-w-3xl px-5 py-16 flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <h1 className="text-4xl font-bold">
              About{" "}
              <span className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 bg-clip-text text-transparent">
                ArrowPay
              </span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Pay freelancers &amp; remote teams, fast as an arrow. ArrowPay lets you send
              USDC to many people at once across multiple chains — with on-chain proof for
              every payout.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-foreground/10 p-4">
              <p className="text-xl font-bold">Multi-chain</p>
              <p className="text-sm text-muted-foreground">Arc, Base, Ethereum &amp; Avalanche testnets.</p>
            </div>
            <div className="rounded-xl border border-foreground/10 p-4">
              <p className="text-xl font-bold">Batch payouts</p>
              <p className="text-sm text-muted-foreground">Pay many recipients in one click.</p>
            </div>
            <div className="rounded-xl border border-foreground/10 p-4">
              <p className="text-xl font-bold">On-chain proof</p>
              <p className="text-sm text-muted-foreground">Every payment is verifiable.</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold">Frequently asked questions</h2>
            <div className="flex flex-col gap-3">
              {faqs.map((f) => (
                <details key={f.q} className="rounded-xl border border-foreground/10 p-4">
                  <summary className="cursor-pointer font-semibold">{f.q}</summary>
                  <p className="text-sm text-muted-foreground mt-3">{f.a}</p>
                </details>
              ))}
            </div>
          </div>

          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center rounded-lg bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 px-5 py-3 font-semibold text-white hover:opacity-90"
            >
              Try ArrowPay →
            </Link>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  )
}
