import { useParams, useNavigate } from "react-router-dom"
import { usePurchaseDetail } from "@/hooks/purchases/usePurchases"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export default function PurchaseDetail() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { purchase, loading } = usePurchaseDetail(id || "")

    if (loading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading purchase details...</div>
    if (!purchase) return <div className="p-8 text-center text-destructive">Purchase not found.</div>

    return (
        <div className="space-y-6">
            <Button
                variant="ghost"
                className="pl-0"
                onClick={() => navigate("/purchases")}
            >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Purchases
            </Button>

            <div className="bg-card p-8 rounded-xl border border-border shadow-sm space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-1">
                        <Label className="text-muted-foreground uppercase tracking-widest text-[10px] font-bold">Source Information</Label>
                        <p className="text-2xl font-bold tracking-tight text-foreground">{purchase.customer?.name || "Anonymous Supplier"}</p>
                        <p className="text-sm text-muted-foreground font-medium uppercase">Code: {purchase.code}</p>
                    </div>
                    <div className="space-y-1 md:text-right">
                        <Label className="text-muted-foreground uppercase tracking-widest text-[10px] font-bold">Financial Summary</Label>
                        <p className="text-2xl font-bold tracking-tight text-primary">
                            ${Number(purchase.totalAmount ?? 0).toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {new Date(purchase.createdAt).toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>

            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-b border-border bg-muted/20">
                            <TableHead className="text-muted-foreground font-semibold py-4">Product</TableHead>
                            <TableHead className="text-muted-foreground font-semibold py-4">Condition</TableHead>
                            <TableHead className="text-muted-foreground font-semibold py-4">Serial Number</TableHead>
                            <TableHead className="text-muted-foreground font-semibold py-4 text-right">Purchase Price</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {purchase.items?.map((item) => (
                            <TableRow key={item.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                                <TableCell className="font-medium py-4">{item.item?.product?.name || "N/A"}</TableCell>
                                <TableCell className="py-4">
                                    <span className="px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-[10px] font-bold">
                                        {item.item?.condition?.name || "N/A"}
                                    </span>
                                </TableCell>
                                <TableCell className="py-4 font-mono text-xs text-muted-foreground">{item.item?.imeiOrSerial || "N/A"}</TableCell>
                                <TableCell className="text-right py-4 font-bold">
                                    ${Number(item.purchasePrice ?? 0).toLocaleString()}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

function Label({ children, className }: { children: React.ReactNode, className?: string }) {
    return <span className={`text-xs font-medium uppercase tracking-wider ${className}`}>{children}</span>
}
