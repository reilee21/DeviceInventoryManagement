import { useState } from "react"
import { useSales } from "@/hooks/sales/useSales"
import { useInventory } from "@/hooks/inventory/useInventory"
import { SaleTable } from "@/components/sales/SaleTable"
import { SaleForm } from "@/components/sales/SaleForm"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import type { CreateSaleData } from "@/services/api/sales"
import { PaginationControls } from "@/components/ui/pagination"

export default function Sales() {
    const {
        sales,
        customers,
        loading,
        createSale,
        isCreating,
        refetch,
        totalPages,
        currentPage,
        setPage,
    } = useSales()

    const { items: inventoryItems } = useInventory()
    const availableItems = inventoryItems.filter(item => item.status?.name === "Available")

    const [isFormOpen, setIsFormOpen] = useState(false)

    const handleFormSubmit = async (data: CreateSaleData) => {
        try {
            await createSale(data)
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
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Sales</h1>
                    <p className="text-muted-foreground">Manage device sales and installments.</p>
                </div>
                <Button onClick={() => setIsFormOpen(true)} className="bg-primary text-primary-foreground hover:opacity-90 shadow-sm rounded-lg">
                    New Sale
                </Button>
            </div>

            {loading ? (
                <div className="flex justify-center py-8">Loading sales...</div>
            ) : (
                <>
                    <SaleTable sales={sales} />
                    <PaginationControls
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setPage}
                        isLoading={loading}
                    />
                </>
            )}

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-[700px]">
                    <DialogHeader>
                        <DialogTitle>New Sale Transaction</DialogTitle>
                    </DialogHeader>
                    <SaleForm
                        customers={customers}
                        availableItems={availableItems}
                        onSubmit={handleFormSubmit}
                        onCancel={() => setIsFormOpen(false)}
                        isLoading={isCreating}
                    />
                </DialogContent>
            </Dialog>
        </div>
    )
}
