import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { ProductVariant } from "@/services/api/products"

interface VariantTableProps {
    variants: ProductVariant[]
}

const STATUS_LABELS: Record<number, string> = {
    1: 'In Stock',
    2: 'Liquidated',
    3: 'Warranty Return',
    4: 'Archived'
}

export function VariantTable({ variants }: VariantTableProps) {
    if (variants.length === 0) {
        return (
            <div className="p-8 text-center text-muted-foreground bg-muted/20 rounded-lg mx-6 mb-4">
                No variants Found for this product.
            </div>
        )
    }

    return (
        <div className="mx-6 mb-6 rounded-lg border border-border bg-muted/10 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent bg-muted/30">
                        <TableHead className="text-[10px] uppercase font-bold text-muted-foreground py-3">Variant</TableHead>
                        <TableHead className="text-[10px] uppercase font-bold text-muted-foreground py-3">Color</TableHead>
                        <TableHead className="text-[10px] uppercase font-bold text-muted-foreground py-3">Storage</TableHead>
                        <TableHead className="text-[10px] uppercase font-bold text-muted-foreground py-3">Status</TableHead>
                        <TableHead className="text-[10px] uppercase font-bold text-muted-foreground py-3 text-right">Avg Purchase Price</TableHead>
                        <TableHead className="text-[10px] uppercase font-bold text-muted-foreground py-3 text-right">Stock</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {variants.map((v, i) => (
                        <TableRow key={i} className="hover:bg-muted/50 border-border">
                            <TableCell className="py-3 font-medium text-sm">
                                {v.color} {v.storage}
                            </TableCell>
                            <TableCell className="py-3 text-sm text-muted-foreground">
                                {v.color}
                            </TableCell>
                            <TableCell className="py-3 text-sm text-muted-foreground">
                                {v.storage}
                            </TableCell>
                            <TableCell className="py-3">
                                <Badge variant="outline" className="text-[10px] uppercase font-bold bg-background">
                                    {STATUS_LABELS[v.statusId] || 'Unknown'}
                                </Badge>
                            </TableCell>
                            <TableCell className="py-3 text-right font-mono text-sm">
                                ${Number(v.avgPrice).toLocaleString()}
                            </TableCell>
                            <TableCell className="py-3 text-right">
                                <span className={`text-sm font-bold ${Number(v.stock) === 0 ? 'text-destructive' : 'text-foreground'}`}>
                                    {v.stock}
                                </span>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
