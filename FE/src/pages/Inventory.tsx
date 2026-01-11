import { useState } from "react"
import { useInventory } from "@/hooks/inventory/useInventory"
import { InventoryTable } from "@/components/inventory/InventoryTable"
import { InventoryForm } from "@/components/inventory/InventoryForm"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useApi } from "@/hooks/useApi"
import { inventoryApi } from "@/services/api/inventory"
import type { InventoryItem } from "@/services/api/inventory"
import { PaginationControls } from "@/components/ui/pagination"

export default function Inventory() {
    const {
        items,
        products,
        conditions,
        statuses,
        locations,
        loading,
        filters,
        updateFilters,
        refetch,
        totalPages,
        currentPage,
        setPage,
    } = useInventory()

    const [isFormOpen, setIsFormOpen] = useState(false)
    const { execute: createItem, loading: isCreating } = useApi(inventoryApi.createInventoryItem)

    const handleFormSubmit = async (data: Partial<InventoryItem>) => {
        try {
            await createItem(data)
            setIsFormOpen(false)
            refetch()
        } catch (error) {
            // Error handled by useApi
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Inventory</h1>
                    <p className="text-muted-foreground">Track individual device instances.</p>
                </div>
                <Button onClick={() => setIsFormOpen(true)} className="bg-primary text-primary-foreground hover:opacity-90 shadow-sm rounded-lg">
                    Register Items
                </Button>
            </div>

            <div className="flex flex-wrap gap-4 items-center bg-card p-6 rounded-xl border border-border shadow-sm transition-all">
                <div className="w-[180px]">
                    <Select
                        value={filters.productId || "all"}
                        onValueChange={(value) => updateFilters({ productId: value === "all" ? undefined : value })}
                    >
                        <SelectTrigger className="bg-muted/50 border-none h-10 rounded-lg">
                            <SelectValue placeholder="All Products" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border shadow-md rounded-lg">
                            <SelectItem value="all">All Products</SelectItem>
                            {products.map((p) => (
                                <SelectItem key={p.id} value={p.id}>
                                    {p.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="w-[180px]">
                    <Select
                        value={filters.conditionId || "all"}
                        onValueChange={(value) => updateFilters({ conditionId: value === "all" ? undefined : value })}
                    >
                        <SelectTrigger className="bg-muted/50 border-none h-10 rounded-lg">
                            <SelectValue placeholder="Condition" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border shadow-md rounded-lg">
                            <SelectItem value="all">All Conditions</SelectItem>
                            {conditions.map((c) => (
                                <SelectItem key={c.id} value={c.id}>
                                    {c.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="w-[180px]">
                    <Select
                        value={filters.statusId || "all"}
                        onValueChange={(value) => updateFilters({ statusId: value === "all" ? undefined : value })}
                    >
                        <SelectTrigger className="bg-muted/50 border-none h-10 rounded-lg">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border shadow-md rounded-lg">
                            <SelectItem value="all">All Statuses</SelectItem>
                            {statuses.map((s) => (
                                <SelectItem key={s.id} value={s.id}>
                                    {s.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="w-[180px]">
                    <Select
                        value={filters.locationId || "all"}
                        onValueChange={(value) => updateFilters({ locationId: value === "all" ? undefined : value })}
                    >
                        <SelectTrigger className="bg-muted/50 border-none h-10 rounded-lg">
                            <SelectValue placeholder="Location" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border shadow-md rounded-lg">
                            <SelectItem value="all">All Locations</SelectItem>
                            {locations.map((l) => (
                                <SelectItem key={l.id} value={l.id}>
                                    {l.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-8">Loading inventory...</div>
            ) : (
                <>
                    <InventoryTable items={items} />
                    <PaginationControls
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setPage}
                        isLoading={loading}
                    />
                </>
            )}

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Register New Inventory Item</DialogTitle>
                    </DialogHeader>
                    <InventoryForm
                        products={products}
                        conditions={conditions}
                        locations={locations}
                        onSubmit={handleFormSubmit}
                        onCancel={() => setIsFormOpen(false)}
                        isLoading={isCreating}
                    />
                </DialogContent>
            </Dialog>
        </div>
    )
}
