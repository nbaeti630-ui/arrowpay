"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

type Status = "idle" | "sending" | "success" | "failed"

type Recipient = {
  id: string
  name: string
  address: string
  amount: string
  status: Status
  message?: string
}

const CHAINS = [
  { value: "arcTestnet", label: "Arc Testnet" },
  { value: "baseSepolia", label: "Base Sepolia" },
  { value: "ethSepolia", label: "Ethereum Sepolia" },
  { value: "avalancheFuji", label: "Avalanche Fuji" },
]

function shorten(a: string) {
  if (!a) return ""
  return a.length < 12 ? a : `${a.slice(0, 6)}...${a.slice(-4)}`
}

export default function PayoutsPage() {
  const [recipients, setRecipients] = useState<Recipient[]>([
    { id: "r1", name: "", address: "", amount: "", status: "idle" },
  ])
  const [chain, setChain] = useState("arcTestnet")
  const [isPaying, setIsPaying] = useState(false)
  const nextId = useRef(2)

  const addRow = () =>
    setRecipients((prev) => [
      ...prev,
      { id: `r${nextId.current++}`, name: "", address: "", amount: "", status: "idle" },
    ])

  const removeRow = (id: string) =>
    setRecipients((prev) => (prev.length > 1 ? prev.filter((r) => r.id !== id) : prev))

  const update = (id: string, field: "name" | "address" | "amount", value: string) =>
    setRecipients((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)))

  const total = recipients.reduce((s, r) => s + (parseFloat(r.amount) || 0), 0)
  const validCount = recipients.filter((r) => r.address.trim() && parseFloat(r.amount) > 0).length
  const successCount = recipients.filter((r) => r.status === "success").length

  const payAll = async () => {
    const valid = recipients.filter((r) => r.address.trim() && parseFloat(r.amount) > 0)
    if (valid.length === 0) {
      toast.error("Enter at least 1 recipient with a valid address & amount")
      return
    }
    setIsPaying(true)
    for (const r of valid) {
      setRecipients((prev) => prev.map((x) => (x.id === r.id ? { ...x, status: "sending", message: undefined } : x)))
      try {
        const res = await fetch("/api/payout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recipientAddress: r.address.trim(),
            amount: r.amount,
            destinationChain: chain,
            sourceType: "auto",
          }),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data.userMessage || data.error || "Payment failed")
        setRecipients((prev) => prev.map((x) => (x.id === r.id ? { ...x, status: "success" } : x)))
        toast.success(`Sent to ${r.name || shorten(r.address)}`)
      } catch (e: any) {
        setRecipients((prev) =>
          prev.map((x) => (x.id === r.id ? { ...x, status: "failed", message: e?.message || "Failed" } : x))
        )
        toast.error(`Failed to ${r.name || shorten(r.address)}`)
      }
    }
    setIsPaying(false)
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Freelancer Payouts</h1>
        <p className="text-sm text-muted-foreground">
          Pay multiple freelancers & remote workers at once with USDC. Add recipients, then send them in one click.
        </p>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <label className="text-sm font-medium">Network:</label>
        <select
          value={chain}
          onChange={(e) => setChain(e.target.value)}
          disabled={isPaying}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          {CHAINS.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        {recipients.map((r, i) => (
          <div key={r.id} className="rounded-lg border border-border bg-card p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">Recipient #{i + 1}</span>
              <div className="flex items-center gap-2">
                {r.status === "sending" && <span className="text-xs text-muted-foreground">Sending…</span>}
                {r.status === "success" && <span className="text-xs font-medium text-green-600">✅ Sent</span>}
                {r.status === "failed" && <span className="text-xs font-medium text-red-600">❌ Failed</span>}
                <button
                  onClick={() => removeRow(r.id)}
                  disabled={isPaying || recipients.length === 1}
                  className="text-xs text-muted-foreground hover:text-red-600 disabled:opacity-40"
                >
                  Remove
                </button>
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              <input
                placeholder="Name (optional)"
                value={r.name}
                onChange={(e) => update(r.id, "name", e.target.value)}
                disabled={isPaying}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
              <input
                placeholder="Wallet address (0x...)"
                value={r.address}
                onChange={(e) => update(r.id, "address", e.target.value)}
                disabled={isPaying}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
              <input
                placeholder="USDC"
                inputMode="decimal"
                value={r.amount}
                onChange={(e) => update(r.id, "amount", e.target.value)}
                disabled={isPaying}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            {r.message && <p className="mt-2 text-xs text-red-600">{r.message}</p>}
          </div>
        ))}
      </div>

      <button
        onClick={addRow}
        disabled={isPaying}
        className="mt-3 text-sm font-medium text-primary hover:underline disabled:opacity-40"
      >
        + Add recipient
      </button>

      <div className="mt-6 flex items-center justify-between rounded-lg border border-border bg-muted/40 p-4">
        <div>
          <div className="text-sm text-muted-foreground">
            {validCount} valid recipients · {successCount} sent
          </div>
          <div className="text-lg font-semibold">Total: {total.toFixed(2)} USDC</div>
        </div>
        <Button onClick={payAll} disabled={isPaying || validCount === 0}>
          {isPaying ? "Sending…" : `Pay All (${validCount})`}
        </Button>
      </div>
    </div>
  )
}
