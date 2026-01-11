import { useParams, useNavigate } from "react-router-dom"
import { useSaleDetail, useSalePayments } from "@/hooks/sales/useSales"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ArrowLeft, Plus } from "lucide-react"
import { useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { PaymentForm } from "@/components/sales/PaymentForm"
import type { AddPaymentData } from "@/services/api/sales"

export default function SaleDetail() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { sale, loading, refetch } = useSaleDetail(id || "")
    const { addPayment, isAdding } = useSalePayments(id || "")

    const [isPaymentOpen, setIsPaymentOpen] = useState(false)

    if (loading) return <div>Loading details...</div>
    if (!sale) return <div>Sale not found.</div>

    const handleAddPayment = async (data: AddPaymentData) => {
        try {
            await addPayment(data)
            setIsPaymentOpen(false)
            refetch()
        } catch (error) {
            // Error handled by useApi
        }
    }

    return (
        <div className="space-y-6">
            <Button
                variant="ghost"
                className="pl-0 hover:bg-transparent hover:text-primary transition-colors"
                onClick={() => navigate("/sales")}
            >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Sales
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-card p-8 rounded-xl border border-border shadow-sm lg:col-span-2 space-y-8 transition-all">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div className="space-y-1">
                            <Label className="text-muted-foreground uppercase tracking-widest text-[10px] font-bold">Customer Details</Label>
                            <p className="text-2xl font-bold tracking-tight text-foreground">{sale.customer?.name || "N/A"}</p>
                            <p className="text-sm text-muted-foreground font-medium">{sale.customer?.phone || "No phone provided"}</p>
                        </div>
                        <div className="md:text-right space-y-1">
                            <Label className="text-muted-foreground uppercase tracking-widest text-[10px] font-bold">Transaction Timeline</Label>
                            <p className="text-sm font-medium text-foreground">{new Date(sale.createdAt).toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-8 border-y border-border/50 bg-muted/5 -mx-8 px-8">
                        <div className="space-y-1">
                            <Label className="text-muted-foreground">Total Sale</Label>
                            <p className="text-2xl font-bold tracking-tight text-foreground">${(sale.totalAmount ?? 0).toLocaleString()}</p>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-muted-foreground">Paid Amount</Label>
                            <p className="text-2xl font-bold tracking-tight text-primary">${(sale.paidAmount ?? 0).toLocaleString()}</p>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-muted-foreground">Outstanding</Label>
                            <p className={cn(
                                "text-2xl font-bold tracking-tight",
                                (sale.outstandingAmount ?? 0) > 0 ? "text-destructive" : "text-muted-foreground"
                            )}>
                                ${(sale.outstandingAmount ?? 0).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-1 h-4 bg-primary rounded-full" />
                            <h3 className="font-bold text-lg tracking-tight">Sold Items</h3>
                        </div>
                        <div className="rounded-xl border border-border bg-card shadow-inner overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent border-b border-border bg-muted/10">
                                        <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground py-4">Product</TableHead>
                                        <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground py-4">Serial Number</TableHead>
                                        <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground py-4 text-right">Selling Price</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sale.items?.map((item) => (
                                        <TableRow key={item.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                                            <TableCell className="font-medium py-4 text-foreground">{item.product?.name || "N/A"}</TableCell>
                                            <TableCell className="text-xs font-mono text-muted-foreground py-4">{item.serialNumber}</TableCell>
                                            <TableCell className="text-right font-bold text-foreground py-4">
                                                ${(item.sellingPrice ?? 0).toLocaleString()}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex flex-col h-full transition-all">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-4 bg-primary rounded-full" />
                                <h3 className="font-bold text-lg tracking-tight">Payments</h3>
                            </div>
                            <Button
                                size="sm"
                                disabled={(sale.outstandingAmount ?? 0) <= 0}
                                onClick={() => setIsPaymentOpen(true)}
                                className="bg-primary text-primary-foreground hover:opacity-90 shadow-sm rounded-lg h-8"
                            >
                                <Plus className="h-4 w-4 mr-1" /> Pay
                            </Button>
                        </div>

                        <div className="space-y-4 flex-1">
                            {sale.payments && sale.payments.length > 0 ? (
                                sale.payments.map((p) => (
                                    <div key={p.id} className="group relative p-4 rounded-xl border border-border bg-muted/5 hover:bg-muted/10 transition-all">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-bold text-primary">${(p.amount ?? 0).toLocaleString()}</span>
                                            <span className="text-[10px] font-bold uppercase text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                                {new Date(p.paymentDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                        {p.notes && <p className="text-xs text-muted-foreground italic leading-relaxed">{p.notes}</p>}
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center space-y-2 opacity-50 grayscale">
                                    <p className="text-sm font-medium text-muted-foreground tracking-tight">No payments recorded yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Record Payment</DialogTitle>
                    </DialogHeader>
                    <PaymentForm
                        onSubmit={handleAddPayment}
                        onCancel={() => setIsPaymentOpen(false)}
                        isLoading={isAdding}
                    />
                </DialogContent>
            </Dialog>
        </div>
    )
}

function Label({ children, className }: { children: React.ReactNode, className?: string }) {
    return <span className={`text-[10px] font-bold uppercase tracking-wider text-muted-foreground ${className}`}>{children}</span>
}
