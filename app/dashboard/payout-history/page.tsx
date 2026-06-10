"use client"

import * as React from "react"
import { format } from "date-fns"
import { toast } from "sonner"
import { IconExternalLink, IconSearch } from "@tabler/icons-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { createClient } from "@/lib/supabase/client"
import { BLOCK_EXPLORERS } from "@/lib/constants/block-explorers"

const GATEWAY_ADDRESS = "0x0077777d7EBA4688BDeF3E311b846F25870A19B9"

type Payout = {
  id: string
  amount: number
  recipient_address: string
  blockchain: string
  status: string
  tx_hash: string | null
  created_at: string
}

function shorten(a: string) {
  if (!a) return ""
  return a.length < 10 ? a : `${a.slice(0, 6)}...${a.slice(-4)}`
}

function txUrl(blockchain: string, hash: string) {
  const base = BLOCK_EXPLORERS[blockchain]
  return base ? `${base}/tx/${hash}` : "#"
}

function statusBadge(status: string) {
  const s = (status || "").toLowerCase()
  if (s === "complete" || s === "completed" || s === "confirmed")
    return <Badge className="bg-green-100 text-green-700 border-0">Completed</Badge>
  if (s === "failed" || s === "denied")
    return <Badge className="bg-red-100 text-red-700 border-0">Failed</Badge>
  return <Badge className="bg-yellow-100 text-yellow-700 border-0">Pending</Badge>
}

export default function PayoutHistoryPage() {
  const [payouts, setPayouts] = React.useState<Payout[]>([])
  const [loading, setLoading] = React.useState(true)
  const [filter, setFilter] = React.useState("")
  const supabase = createClient()

  React.useEffect(() => {
    const run = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        const { data, error } = await supabase
          .from("transactions")
          .select("*")
          .eq("user_id", user.id)
          .eq("type", "OUTBOUND")
          .order("created_at", { ascending: false })
        if (error) throw error
        const rows = (data || []).filter(
          (t: any) => t.recipient_address?.toLowerCase() !== GATEWAY_ADDRESS.toLowerCase()
        )
        setPayouts(rows as Payout[])
      } catch (e) {
        console.error(e)
        toast.error("Failed to load payout history")
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [supabase])

  const filtered = payouts.filter((p) =>
    p.recipient_address?.toLowerCase().includes(filter.toLowerCase())
  )
  const totalPaid = filtered.reduce((s, p) => s + (Number(p.amount) || 0), 0)

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold">Payout History</h1>
        <p className="text-sm text-muted-foreground">
          Proof of every payment you have sent — recipient, amount, network, and on-chain receipt.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:max-w-md">
        <div className="rounded-lg border p-4">
          <p className="text-xs text-muted-foreground">Total paid out</p>
          <p className="text-xl font-bold">${totalPaid.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-xs text-muted-foreground">Payouts</p>
          <p className="text-xl font-bold">{filtered.length}</p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search recipient address..."
          className="pl-9"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Recipient</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Network</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Proof</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={6}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                  No payouts yet. Send your first payment from the Payouts page.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs">{shorten(p.recipient_address)}</TableCell>
                  <TableCell className="font-semibold">${Number(p.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell><Badge variant="outline">{p.blockchain}</Badge></TableCell>
                  <TableCell>{statusBadge(p.status)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{format(new Date(p.created_at), "MMM d, yyyy HH:mm")}</TableCell>
                  <TableCell>
                    {p.tx_hash ? (
                      <a
                        href={txUrl(p.blockchain, p.tx_hash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-pink-600 hover:underline text-sm"
                      >
                        View <IconExternalLink className="size-3.5" />
                      </a>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
