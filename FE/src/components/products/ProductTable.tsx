import React, { useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, ChevronDown, Loader2 } from "lucide-react"
import { productsApi } from "@/services/api/products"
import type { Product, ProductVariant } from "@/services/api/products"
import { VariantTable } from "./VariantTable"

interface ProductTableProps {
    products: Product[]
    onEdit: (product: Product) => void
}

export function ProductTable({ products, onEdit }: ProductTableProps) {
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())
    const [cachedVariants, setCachedVariants] = useState<Record<number, ProductVariant[]>>({})
    const [loadingRows, setLoadingRows] = useState<Set<number>>(new Set())

    const toggleRow = async (productId: number) => {
        const nextExpanded = new Set(expandedRows)
        if (nextExpanded.has(productId)) {
            nextExpanded.delete(productId)
            setExpandedRows(nextExpanded)
        } else {
            nextExpanded.add(productId)
            setExpandedRows(nextExpanded)

            // Fetch if not cached
            if (!cachedVariants[productId]) {
                setLoadingRows(prev => new Set(prev).add(productId))
                try {
                    const variants = await productsApi.getVariants(productId)
                    setCachedVariants(prev => ({ ...prev, [productId]: variants }))
                } catch (error) {
                    console.error("Failed to fetch variants", error)
                } finally {
                    setLoadingRows(prev => {
                        const next = new Set(prev)
                        next.delete(productId)
                        return next
                    })
                }
            }
        }
    }

    return (
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden text-card-foreground">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent border-b border-border bg-muted/20">
                        <TableHead className="w-10 py-4"></TableHead>
                        <TableHead className="text-muted-foreground font-semibold py-4">Name</TableHead>
                        <TableHead className="text-muted-foreground font-semibold py-4">Brand</TableHead>
                        <TableHead className="text-muted-foreground font-semibold py-4">Category</TableHead>
                        <TableHead className="text-muted-foreground font-semibold py-4 text-center">Total Stock</TableHead>
                        <TableHead className="text-muted-foreground font-semibold py-4 text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                No products found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        products.map((product) => (
                            <React.Fragment key={product.id}>
                                <TableRow
                                    className={`border-b border-border transition-colors hover:bg-muted/50 ${expandedRows.has(product.id) ? 'bg-muted/30' : ''}`}
                                >
                                    <TableCell className="py-4 text-center">
                                        {(product.totalStock ?? 0) > 0 && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 rounded-md"
                                                onClick={() => toggleRow(product.id)}
                                            >
                                                {expandedRows.has(product.id) ? (
                                                    <ChevronDown className="h-4 w-4 text-primary" />
                                                ) : (
                                                    <ChevronRight className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                                                )}
                                            </Button>
                                        )}
                                    </TableCell>
                                    <TableCell className="font-bold py-4 text-foreground text-sm tracking-tight">{product.name}</TableCell>
                                    <TableCell className="py-4 text-sm text-muted-foreground">{product.brand?.name || "N/A"}</TableCell>
                                    <TableCell className="py-4 text-sm text-muted-foreground">{product.category?.name || "N/A"}</TableCell>
                                    <TableCell className="py-4 text-center">
                                        {(product.totalStock ?? 0) === 0 ? (
                                            <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20 text-[10px] uppercase font-bold py-0.5">
                                                Out of Stock
                                            </Badge>
                                        ) : (
                                            <span className="text-sm font-medium text-foreground">
                                                {product.totalStock}
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right py-4">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onEdit(product)}
                                            className="h-8 rounded-lg hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                                        >
                                            Edit
                                        </Button>
                                    </TableCell>
                                </TableRow>
                                {expandedRows.has(product.id) && (
                                    <TableRow className="hover:bg-transparent border-none">
                                        <TableCell colSpan={6} className="p-0 border-none">
                                            {loadingRows.has(product.id) ? (
                                                <div className="flex items-center justify-center p-8 text-sm text-muted-foreground animate-pulse">
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin text-primary" />
                                                    Fetching variants...
                                                </div>
                                            ) : (
                                                <VariantTable variants={cachedVariants[product.id] || []} />
                                            )}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </React.Fragment>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
