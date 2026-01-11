import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useNavigate } from "react-router-dom"
import type { Sale } from "@/services/api/sales"

interface SaleTableProps {
    sales: Sale[]
}

export function SaleTable({ sales }: SaleTableProps) {
    const navigate = useNavigate()

    return (
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden text-card-foreground">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent border-b border-border">
                        <TableHead className="text-muted-foreground font-semibold py-4">Customer</TableHead>
                        <TableHead className="text-muted-foreground font-semibold py-4 text-right">Total</TableHead>
                        <TableHead className="text-muted-foreground font-semibold py-4 text-right">Paid</TableHead>
                        <TableHead className="text-muted-foreground font-semibold py-4 text-right">Outstanding</TableHead>
                        <TableHead className="text-muted-foreground font-semibold py-4">Created At</TableHead>
                        <TableHead className="text-muted-foreground font-semibold py-4 text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sales.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                No sales found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        sales.map((sale) => (
                            <TableRow key={sale.id} className="border-b border-border last:border-0 hover:bg-muted transition-colors">
                                <TableCell className="py-4 font-medium">{sale.customer?.name || "N/A"}</TableCell>
                                <TableCell className="py-4 text-right font-bold text-foreground">
                                    ${(sale.totalAmount ?? 0).toLocaleString()}
                                </TableCell>
                                <TableCell className="py-4 text-right font-bold text-primary">
                                    ${(sale.paidAmount ?? 0).toLocaleString()}
                                </TableCell>
                                <TableCell className={cn(
                                    "py-4 text-right font-bold",
                                    (sale.outstandingAmount ?? 0) > 0 ? "text-destructive" : "text-muted-foreground font-normal"
                                )}>
                                    ${(sale.outstandingAmount ?? 0).toLocaleString()}
                                </TableCell>
                                <TableCell className="py-4 text-muted-foreground text-sm">
                                    {new Date(sale.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="py-4 text-right">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => navigate(`/sales/${sale.id}`)}
                                        className="hover:bg-primary hover:text-primary-foreground transition-colors"
                                    >
                                        View Detail
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
