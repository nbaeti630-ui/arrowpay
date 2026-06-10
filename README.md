# ArrowPay

**Pay Freelancers & Remote Teams, Fast as an Arrow.**

ArrowPay lets you send USDC payments to anyone, anywhere — fast, low-cost, and fully transparent. Built for teams that work with freelancers and remote workers across borders, ArrowPay turns multi-chain stablecoin payouts into a single click.

## Features

- **Payout Freelancer (Bulk Payouts)** — Add multiple recipients (name, wallet address, amount) and pay them all at once with a single click, with per-recipient status tracking.
- **Multi-chain Wallets** — Create and manage USDC wallets across Arc Testnet, Base Sepolia, Ethereum Sepolia, and Avalanche Fuji.
- **Programmable USDC** — Send stablecoin payments with predictable, low fees.
- **Activity & Compliance** — Track every transaction in a clear activity log.

## Tech Stack

- Next.js (App Router)
- Supabase (auth, database, realtime)
- Circle Developer Controlled Wallets
- Tailwind CSS + shadcn/ui

## Prerequisites

- Node.js v22+
- A Supabase project
- Circle Developer Controlled Wallets API key and Entity Secret

## Getting Started

**1. Install dependencies**

    npm install

**2. Configure environment** — create .env.local and fill in the values (see Environment Variables below).

**3. Push the database schema to your Supabase project**

    npx supabase link --project-ref <your-project-ref>
    npx supabase db push

**4. Register your Circle Entity Secret (one-time)**

    node --env-file=.env.local register-entity-secret.mjs

**5. Start the dev server**

    npm run dev

The app runs at http://localhost:3000

## Environment Variables

Create .env.local with the following values:

    # Supabase
    NEXT_PUBLIC_SUPABASE_URL=your-project-url
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-or-anon-key
    SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

    # Circle
    CIRCLE_API_KEY=your-circle-api-key
    CIRCLE_ENTITY_SECRET=your-circle-entity-secret

## Usage

1. Sign up with any email and password.
2. Create a wallet on Arc Testnet (or another supported testnet).
3. Fund it with test USDC from the Circle Faucet at https://faucet.circle.com
4. Open Payouts, add your recipients, and hit "Bayar Semua" to send.

## Security & Usage Notes

- Testnet only. Not intended for production without further hardening.
- Secrets are handled via environment variables and never committed.
- Keep your Circle recovery file safe — losing it means losing access to your wallets.

---

Built with love using USDC on Arc.
