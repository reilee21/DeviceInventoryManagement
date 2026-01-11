import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import type { Product, Brand, Category } from "@/services/api/products"

interface ProductFormProps {
    initialData?: Partial<Product>
    brands: Brand[]
    categories: Category[]
    onSubmit: (data: Partial<Product>) => Promise<void>
    onCancel: () => void
    isLoading?: boolean
}

export function ProductForm({
    initialData,
    brands,
    categories,
    onSubmit,
    onCancel,
    isLoading,
}: ProductFormProps) {
    const [formData, setFormData] = useState<Partial<Product>>({
        name: "",
        brandId: "",
        categoryId: "",
        specs: "",
        ...initialData,
    })

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                specs: typeof initialData.specs === "object" ? JSON.stringify(initialData.specs, null, 2) : initialData.specs,
            })
        }
    }, [initialData])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const submissionData = {
            ...formData,
            specs: formData.specs ? JSON.parse(formData.specs as string) : undefined,
        }
        onSubmit(submissionData)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Select
                        value={formData.brandId}
                        onValueChange={(value) => setFormData({ ...formData, brandId: value })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select brand" />
                        </SelectTrigger>
                        <SelectContent>
                            {brands.map((brand) => (
                                <SelectItem key={brand.id} value={brand.id}>
                                    {brand.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                        value={formData.categoryId}
                        onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="specs">Specifications (JSON)</Label>
                <Textarea
                    id="specs"
                    value={formData.specs as string}
                    onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
                    placeholder='{"color": "silver", "ram": "8GB"}'
                    rows={5}
                />
            </div>
            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {initialData?.id ? "Update Product" : "Create Product"}
                </Button>
            </div>
        </form>
    )
}
