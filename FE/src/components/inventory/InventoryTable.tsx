import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { InventoryItem } from "@/services/api/inventory"

interface InventoryTableProps {
    items: InventoryItem[]
}

const statusColors: Record<string, string> = {
    "Available": "bg-green-500 hover:bg-green-600",
    "Sold": "bg-slate-500 hover:bg-slate-600",
    "Reserved": "bg-amber-500 hover:bg-amber-600",
}

export function InventoryTable({ items }: InventoryTableProps) {
    return (
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden text-card-foreground">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent border-b border-border">
                        <TableHead className="text-muted-foreground font-semibold py-4">Product</TableHead>
                        <TableHead className="text-muted-foreground font-semibold py-4">Serial Number</TableHead>
                        <TableHead className="text-muted-foreground font-semibold py-4">Condition</TableHead>
                        <TableHead className="text-muted-foreground font-semibold py-4">Status</TableHead>
                        <TableHead className="text-muted-foreground font-semibold py-4">Location</TableHead>
                        <TableHead className="text-muted-foreground font-semibold py-4 text-right">Purchase</TableHead>
                        <TableHead className="text-muted-foreground font-semibold py-4 text-right">Selling</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                No inventory items found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        items.map((item) => (
                            <TableRow key={item.id} className="border-b border-border last:border-0 hover:bg-muted transition-colors">
                                <TableCell className="font-medium py-4">{item.product?.name || "N/A"}</TableCell>
                                <TableCell className="py-4 font-mono text-xs">{item.serialNumber}</TableCell>
                                <TableCell className="py-4">
                                    <span className="px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-[10px] font-bold uppercase tracking-wider">
                                        {item.condition?.name || "N/A"}
                                    </span>
                                </TableCell>
                                <TableCell className="py-4">
                                    <Badge className={cn(
                                        "shadow-none border-none",
                                        statusColors[item.status?.name || ""] || "bg-muted text-muted-foreground"
                                    )}>
                                        {item.status?.name || "Unknown"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="py-4">{item.location?.name || "N/A"}</TableCell>
                                <TableCell className="py-4 text-right font-semibold">
                                    ${(item.purchasePrice ?? 0).toLocaleString()}
                                </TableCell>
                                <TableCell className="py-4 text-right font-semibold text-primary">
                                    ${(item.sellingPrice ?? 0).toLocaleString()}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
