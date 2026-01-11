import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import type { Purchase } from "@/services/api/purchases"

interface PurchaseTableProps {
    purchases: Purchase[]
}

export function PurchaseTable({ purchases }: PurchaseTableProps) {
    const navigate = useNavigate()

    return (
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden text-card-foreground">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent border-b border-border">
                        <TableHead className="text-muted-foreground font-semibold py-4">Source Type</TableHead>
                        <TableHead className="text-muted-foreground font-semibold py-4">Source Name</TableHead>
                        <TableHead className="text-muted-foreground font-semibold py-4 text-right">Total Amount</TableHead>
                        <TableHead className="text-muted-foreground font-semibold py-4">Created At</TableHead>
                        <TableHead className="text-muted-foreground font-semibold py-4 text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {purchases.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                No purchases found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        purchases.map((purchase) => (
                            <TableRow key={purchase.id} className="border-b border-border last:border-0 hover:bg-muted transition-colors">
                                <TableCell className="py-4 font-medium uppercase text-[10px] tracking-wider text-muted-foreground">
                                    {purchase.code}
                                </TableCell>
                                <TableCell className="py-4 font-medium">{purchase.customer?.name || "Anonymous Supplier"}</TableCell>
                                <TableCell className="py-4 text-right font-bold text-primary">
                                    ${(purchase.totalAmount ?? 0).toLocaleString()}
                                </TableCell>
                                <TableCell className="py-4 text-muted-foreground text-sm">
                                    {new Date(purchase.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="py-4 text-right">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => navigate(`/purchases/${purchase.id}`)}
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
