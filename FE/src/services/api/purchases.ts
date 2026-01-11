import http from "./http"
import type { ApiResponse, PaginationParams } from "./types"
import type { InventoryItem } from "./inventory"

export interface Purchase {
    id: number
    code: string
    customerId?: number
    customer?: {
        id: number
        name: string
    }
    staffId: number
    staff?: {
        id: number
        name: string
    }
    totalAmount: number
    statusId: number
    items: PurchaseItem[]
    createdAt: string
}

export interface PurchaseItem {
    id: number
    purchaseId: number
    itemId: number
    item?: InventoryItem
    purchasePrice: number
    notes?: string
    product?: { name: string } // Helper for UI if needed or flattened
}

export interface SourceType {
    id: string
    name: string
}

export interface PurchaseFilters extends PaginationParams {
    sourceTypeId?: string
    search?: string
}

export interface CreatePurchaseData {
    sourceTypeId: string
    customerId?: number
    sourceName?: string // Used for internal form or simple tracking
    locationId: string
    items: CreatePurchaseItem[]
}

export interface CreatePurchaseItem {
    productId: string
    conditionId: string
    serialNumber: string
    purchasePrice: number
    notes?: string
}

export const purchasesApi = {
    getPurchases: async (params: PurchaseFilters = {}) => {
        const { data } = await http.get<ApiResponse<Purchase[]>>("/purchases", { params })
        return data
    },
    getPurchase: async (id: string) => {
        const { data } = await http.get<ApiResponse<Purchase>>(`/purchases/${id}`)
        return data.data
    },
    createPurchase: async (purchaseData: CreatePurchaseData) => {
        const { data } = await http.post<ApiResponse<Purchase>>("/purchases", purchaseData)
        return data.data
    },
    getSourceTypes: async () => {
        const { data } = await http.get<ApiResponse<SourceType[]>>("/catalog/source-types")
        return data.data || []
    },
}
