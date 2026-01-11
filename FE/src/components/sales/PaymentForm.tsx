import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { AddPaymentData } from "@/services/api/sales"

interface PaymentFormProps {
    onSubmit: (data: AddPaymentData) => Promise<void>
    onCancel: () => void
    isLoading?: boolean
}

export function PaymentForm({
    onSubmit,
    onCancel,
    isLoading,
}: PaymentFormProps) {
    const [formData, setFormData] = useState<AddPaymentData>({
        amount: 0,
        notes: ""
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
                <Label htmlFor="amount">Payment Amount</Label>
                <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Input
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
            </div>
            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                    Record Payment
                </Button>
            </div>
        </form>
    )
}
