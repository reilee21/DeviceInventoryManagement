import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2 } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import type { CreatePurchaseData, CreatePurchaseItem, SourceType } from "@/services/api/purchases"
import type { Product } from "@/services/api/products"
import type { Condition, Location } from "@/services/api/inventory"

interface PurchaseFormProps {
    sourceTypes: SourceType[]
    products: Product[]
    conditions: Condition[]
    locations: Location[]
    onSubmit: (data: CreatePurchaseData) => Promise<void>
    onCancel: () => void
    isLoading?: boolean
}

export function PurchaseForm({
    sourceTypes,
    products,
    conditions,
    locations,
    onSubmit,
    onCancel,
    isLoading,
}: PurchaseFormProps) {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState<Omit<CreatePurchaseData, 'items'>>({
        sourceTypeId: "",
        sourceName: "",
        locationId: "",
        customerId: undefined,
    })

    const [items, setItems] = useState<CreatePurchaseItem[]>([
        { productId: "", conditionId: "", serialNumber: "", purchasePrice: 0, notes: "" }
    ])

    const addItem = () => {
        setItems([...items, { productId: "", conditionId: "", serialNumber: "", purchasePrice: 0, notes: "" }])
    }

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index))
    }

    const updateItem = (index: number, field: keyof CreatePurchaseItem, value: any) => {
        const newItems = [...items]
        newItems[index] = { ...newItems[index], [field]: value }
        setItems(newItems)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit({ ...formData, items })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
            {step === 1 && (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Source Type</Label>
                            <Select
                                value={formData.sourceTypeId}
                                onValueChange={(v) => setFormData({ ...formData, sourceTypeId: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {sourceTypes.map((t) => (
                                        <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Location</Label>
                            <Select
                                value={formData.locationId}
                                onValueChange={(v) => setFormData({ ...formData, locationId: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select location" />
                                </SelectTrigger>
                                <SelectContent>
                                    {locations.map((l) => (
                                        <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Source Name</Label>
                        <Input
                            value={formData.sourceName}
                            onChange={(e) => setFormData({ ...formData, sourceName: e.target.value })}
                            placeholder="Supplier name or private seller"
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                        <Button type="button" onClick={() => setStep(2)} disabled={!formData.sourceTypeId || !formData.sourceName || !formData.locationId}>
                            Next: Add Items
                        </Button>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    {items.map((item, index) => (
                        <div key={index} className="p-4 border rounded-lg space-y-4 relative bg-accent/50">
                            {items.length > 1 && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-2 top-2 text-destructive"
                                    onClick={() => removeItem(index)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label className="text-xs">Product</Label>
                                    <Select
                                        value={item.productId}
                                        onValueChange={(v) => updateItem(index, 'productId', v)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select product" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {products.map((p) => (
                                                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">Condition</Label>
                                    <Select
                                        value={item.conditionId}
                                        onValueChange={(v) => updateItem(index, 'conditionId', v)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select condition" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {conditions.map((c) => (
                                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label className="text-xs">Serial Number</Label>
                                    <Input
                                        value={item.serialNumber}
                                        onChange={(e) => updateItem(index, 'serialNumber', e.target.value)}
                                        placeholder="SN..."
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">Purchase Price</Label>
                                    <Input
                                        type="number"
                                        value={item.purchasePrice}
                                        onChange={(e) => updateItem(index, 'purchasePrice', parseFloat(e.target.value))}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                    <Button type="button" variant="outline" className="w-full border-dashed" onClick={addItem}>
                        <Plus className="h-4 w-4 mr-2" /> Add Another Item
                    </Button>
                    <div className="flex justify-between pt-4">
                        <Button type="button" variant="ghost" onClick={() => setStep(1)}>Back</Button>
                        <div className="flex gap-2">
                            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                            <Button type="submit" disabled={isLoading}>Complete Purchase</Button>
                        </div>
                    </div>
                </div>
            )}
        </form>
    )
}
