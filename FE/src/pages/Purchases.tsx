import { useState } from "react"
import { usePurchases } from "@/hooks/purchases/usePurchases"
import { PurchaseTable } from "@/components/purchases/PurchaseTable"
import { PurchaseForm } from "@/components/purchases/PurchaseForm"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useInventory } from "@/hooks/inventory/useInventory"
import type { CreatePurchaseData } from "@/services/api/purchases"
import { PaginationControls } from "@/components/ui/pagination"

export default function Purchases() {
    const {
        purchases,
        sourceTypes,
        loading,
        createPurchase,
        isCreating,
        totalPages,
        currentPage,
        setPage,
    } = usePurchases()

    const { products, conditions, locations } = useInventory()
    const [isFormOpen, setIsFormOpen] = useState(false)

    const handleFormSubmit = async (data: CreatePurchaseData) => {
        try {
            await createPurchase(data)
            setIsFormOpen(false)
        } catch (error) {
            // Error handled by useApi
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Purchases</h1>
                    <p className="text-muted-foreground">Record and track inbound stock transactions.</p>
                </div>
                <Button onClick={() => setIsFormOpen(true)} className="bg-primary text-primary-foreground hover:opacity-90 shadow-sm rounded-lg">
                    New Purchase
                </Button>
            </div>

            {loading ? (
                <div className="flex justify-center py-8">Loading purchases...</div>
            ) : (
                <>
                    <PurchaseTable purchases={purchases} />
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
                        <DialogTitle>Record New Purchase</DialogTitle>
                    </DialogHeader>
                    <PurchaseForm
                        sourceTypes={sourceTypes}
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
