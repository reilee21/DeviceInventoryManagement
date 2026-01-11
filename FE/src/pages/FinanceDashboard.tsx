import { useFinanceDashboard } from "@/hooks/finance/useFinanceDashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    CreditCard,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react"

export default function FinanceDashboard() {
    const { data, loading, error } = useFinanceDashboard()

    if (loading) return <div className="flex justify-center py-12">Calculating financial data...</div>
    if (error) return <div className="text-destructive text-center py-12">Failed to load financial overview.</div>
    if (!data) return null

    const { profit, debt } = data

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Finance</h1>
                <p className="text-muted-foreground">Overview of profit, debt, and cashflow.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Revenue"
                    value={`$${profit.totalRevenue.toLocaleString()}`}
                    icon={<DollarSign className="h-4 w-4 text-primary" />}
                />
                <StatCard
                    title="Total Cost"
                    value={`$${profit.totalCost.toLocaleString()}`}
                    icon={<TrendingDown className="h-4 w-4 text-destructive/80" />}
                />
                <StatCard
                    title="Gross Profit"
                    value={`$${profit.grossProfit.toLocaleString()}`}
                    subtitle={`${profit.profitMargin}% margin`}
                    icon={<TrendingUp className="h-4 w-4 text-primary" />}
                    trend={profit.grossProfit > 0 ? "up" : "down"}
                />
                <StatCard
                    title="Outstanding Debt"
                    value={`$${debt.totalDebt.toLocaleString()}`}
                    subtitle={`From ${debt.debtorCount} customers`}
                    icon={<CreditCard className="h-4 w-4 text-destructive" />}
                    variant="destructive"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 rounded-xl border-border shadow-sm bg-card overflow-hidden">
                    <CardHeader className="border-b border-border/50 bg-muted/20">
                        <CardTitle className="text-sm font-medium text-foreground">Cashflow (Payments Received)</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="h-[200px] w-full flex items-end gap-2">
                            {data.cashflow.map((point, i) => {
                                const max = Math.max(...data.cashflow.map(p => p.amount)) || 1
                                const height = (point.amount / max) * 100
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                        <div
                                            className="w-full bg-primary/20 hover:bg-primary transition-all duration-300 rounded-t-lg"
                                            style={{ height: `${height}%` }}
                                            title={`$${point.amount.toLocaleString()}`}
                                        />
                                        <span className="text-[10px] text-muted-foreground whitespace-nowrap mt-2">{point.date}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-xl border-border shadow-sm bg-card overflow-hidden">
                    <CardHeader className="border-b border-border/50 bg-muted/20">
                        <CardTitle className="text-sm font-medium text-foreground">Priority Collections</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-b border-border/50 bg-muted/5">
                                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Customer</TableHead>
                                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">Balance</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {debt.topDebtors.map((debtor) => (
                                    <TableRow key={debtor.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                                        <TableCell className="text-sm font-medium py-3 text-foreground">{debtor.name}</TableCell>
                                        <TableCell className="text-sm text-right py-3 text-destructive font-bold">
                                            ${debtor.debtAmount.toLocaleString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

interface StatCardProps {
    title: string
    value: string
    subtitle?: string
    icon: React.ReactNode
    trend?: "up" | "down"
    variant?: "default" | "destructive"
}

function StatCard({ title, value, subtitle, icon, trend, variant }: StatCardProps) {
    return (
        <Card className="rounded-xl border-border shadow-sm bg-card transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-bold uppercase text-muted-foreground tracking-widest">{title}</CardTitle>
                <div className="p-2 rounded-lg bg-muted/50">
                    {icon}
                </div>
            </CardHeader>
            <CardContent>
                <div className={`text-2xl font-bold tracking-tight ${variant === "destructive" ? "text-destructive" : "text-foreground"}`}>{value}</div>
                {subtitle && (
                    <div className="flex items-center gap-1 mt-1">
                        <p className="text-[10px] text-muted-foreground font-medium">{subtitle}</p>
                        {trend === "up" && <ArrowUpRight className="h-3 w-3 text-primary animate-pulse" />}
                        {trend === "down" && <ArrowDownRight className="h-3 w-3 text-destructive animate-pulse" />}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
