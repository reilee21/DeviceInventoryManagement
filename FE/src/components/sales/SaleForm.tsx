import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserPlus } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { Customer, CreateSaleData } from "@/services/api/sales"
import type { InventoryItem } from "@/services/api/inventory"

interface SaleFormProps {
    customers: Customer[]
    availableItems: InventoryItem[]
    onSubmit: (data: CreateSaleData) => Promise<void>
    onCancel: () => void
    isLoading?: boolean
}

export function SaleForm({
    customers,
    availableItems,
    onSubmit,
    onCancel,
    isLoading,
}: SaleFormProps) {
    const [step, setStep] = useState<number>(1)
    const [selectedCustomerId, setSelectedCustomerId] = useState<string>("")
    const [selectedItemIds, setSelectedItemIds] = useState<string[]>([])

    const [paymentPlan, setPaymentPlan] = useState({
        downPayment: 0,
        installmentsCount: 1,
        installmentAmount: 0
    })

    const totalAmount = availableItems
        .filter(item => selectedItemIds.includes(item.id))
        .reduce((sum, item) => sum + item.sellingPrice, 0)

    const handleItemToggle = (itemId: string) => {
        setSelectedItemIds((prev: string[]) =>
            prev.includes(itemId)
                ? prev.filter((id: string) => id !== itemId)
                : [...prev, itemId]
        )
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit({
            customerId: selectedCustomerId,
            itemIds: selectedItemIds,
            ...paymentPlan
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
            {step === 1 && (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Select Customer</Label>
                        <Select
                            value={selectedCustomerId}
                            onValueChange={setSelectedCustomerId}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select customer" />
                            </SelectTrigger>
                            <SelectContent>
                                {customers.map((c) => (
                                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button type="button" variant="outline" className="w-full">
                        <UserPlus className="h-4 w-4 mr-2" /> New Customer
                    </Button>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                        <Button
                            type="button"
                            onClick={() => setStep(2)}
                            disabled={!selectedCustomerId}
                        >
                            Next: Select Items
                        </Button>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-4">
                    <div className="max-h-[40vh] overflow-y-auto border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]"></TableHead>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Serial</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {availableItems.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-4">
                                            No available items in inventory.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    availableItems.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedItemIds.includes(item.id)}
                                                    onCheckedChange={() => handleItemToggle(item.id)}
                                                />
                                            </TableCell>
                                            <TableCell>{item.product?.name}</TableCell>
                                            <TableCell className="text-xs">{item.serialNumber}</TableCell>
                                            <TableCell className="text-right">${item.sellingPrice.toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="bg-muted p-4 rounded-md flex justify-between items-center">
                        <span className="font-medium">Total selected: {selectedItemIds.length} items</span>
                        <span className="text-lg font-bold">Total: ${totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between pt-4">
                        <Button type="button" variant="ghost" onClick={() => setStep(1)}>Back</Button>
                        <div className="flex gap-2">
                            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                            <Button
                                type="button"
                                onClick={() => {
                                    setPaymentPlan((prev: typeof paymentPlan) => ({
                                        ...prev,
                                        installmentAmount: totalAmount - prev.downPayment
                                    }))
                                    setStep(3)
                                }}
                                disabled={selectedItemIds.length === 0}
                            >
                                Next: Payment Plan
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="space-y-4">
                    <div className="bg-accent/50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-muted-foreground uppercase">Sale Summary</p>
                        <p className="text-2xl font-bold">${totalAmount.toLocaleString()}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Down Payment</Label>
                            <Input
                                type="number"
                                value={paymentPlan.downPayment}
                                onChange={(e) => setPaymentPlan({ ...paymentPlan, downPayment: parseFloat(e.target.value) })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Installments Count</Label>
                            <Input
                                type="number"
                                value={paymentPlan.installmentsCount}
                                onChange={(e) => setPaymentPlan({ ...paymentPlan, installmentsCount: parseInt(e.target.value) })}
                                min={1}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Installment Amount (per period)</Label>
                        <Input
                            type="number"
                            value={paymentPlan.installmentAmount}
                            onChange={(e) => setPaymentPlan({ ...paymentPlan, installmentAmount: parseFloat(e.target.value) })}
                        />
                    </div>
                    <div className="flex justify-between pt-4">
                        <Button type="button" variant="ghost" onClick={() => setStep(2)}>Back</Button>
                        <div className="flex gap-2">
                            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                            <Button type="submit" disabled={isLoading}>Complete Sale</Button>
                        </div>
                    </div>
                </div>
            )}
        </form>
    )
}
