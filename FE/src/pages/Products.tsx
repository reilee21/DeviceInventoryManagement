import { useState } from "react"
import { useProducts } from "@/hooks/products/useProducts"
import { ProductTable } from "@/components/products/ProductTable"
import { ProductForm } from "@/components/products/ProductForm"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { productsApi } from "@/services/api/products"
import type { Product } from "@/services/api/products"
import { PaginationControls } from "@/components/ui/pagination"

export default function Products() {
    const {
        products,
        brands,
        categories,
        loading,
        filters,
        updateFilters,
        refetch,
        totalPages,
        currentPage,
        setPage,
    } = useProducts()

    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined)

    const { execute: createProduct, loading: isCreating } = useApi(productsApi.createProduct)
    const { execute: updateProduct, loading: isUpdating } = useApi(productsApi.updateProduct)

    const handleAddProduct = () => {
        setEditingProduct(undefined)
        setIsFormOpen(true)
    }

    const handleEditProduct = (product: Product) => {
        setEditingProduct(product)
        setIsFormOpen(true)
    }

    const handleFormSubmit = async (data: Partial<Product>) => {
        try {
            if (editingProduct) {
                await updateProduct(editingProduct.id, data)
            } else {
                await createProduct(data)
            }
            setIsFormOpen(false)
            refetch()
        } catch (error) {
            // Error is handled by useApi
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Products</h1>
                    <p className="text-muted-foreground">Manage your product catalog.</p>
                </div>
                <Button onClick={handleAddProduct} className="bg-primary text-primary-foreground hover:opacity-90 shadow-sm rounded-lg">
                    Add Product
                </Button>
            </div>

            <div className="flex flex-wrap gap-4 items-center bg-card p-6 rounded-xl border border-border shadow-sm transition-all">
                <div className="flex-1 min-w-[200px]">
                    <Input
                        placeholder="Search products..."
                        value={filters.search}
                        onChange={(e) => updateFilters({ search: e.target.value })}
                        className="bg-muted/50 border-none focus-visible:ring-2 focus-visible:ring-primary/20 h-10 rounded-lg"
                    />
                </div>
                <div className="w-[180px]">
                    <Select
                        value={filters.brandId || "all"}
                        onValueChange={(value) => updateFilters({ brandId: value === "all" ? undefined : value })}
                    >
                        <SelectTrigger className="bg-muted/50 border-none h-10 rounded-lg">
                            <SelectValue placeholder="All Brands" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border shadow-md rounded-lg">
                            <SelectItem value="all">All Brands</SelectItem>
                            {brands.map((brand) => (
                                <SelectItem key={brand.id} value={brand.id}>
                                    {brand.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="w-[180px]">
                    <Select
                        value={filters.categoryId || "all"}
                        onValueChange={(value) => updateFilters({ categoryId: value === "all" ? undefined : value })}
                    >
                        <SelectTrigger className="bg-muted/50 border-none h-10 rounded-lg">
                            <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border shadow-md rounded-lg">
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-8">Loading products...</div>
            ) : (
                <>
                    <ProductTable products={products} onEdit={handleEditProduct} />
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
                        <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
                    </DialogHeader>
                    <ProductForm
                        initialData={editingProduct}
                        brands={brands}
                        categories={categories}
                        onSubmit={handleFormSubmit}
                        onCancel={() => setIsFormOpen(false)}
                        isLoading={isCreating || isUpdating}
                    />
                </DialogContent>
            </Dialog>
        </div>
    )
}
