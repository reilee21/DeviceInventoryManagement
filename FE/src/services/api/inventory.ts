import http from "./http"
import type { ApiResponse, PaginationParams } from "./types"
import type { Product } from "./products"

export interface InventoryItem {
    id: string
    productId: string
    conditionId: string
    statusId: string
    locationId: string
    serialNumber?: string
    imeiOrSerial?: string
    purchasePrice?: number
    sellingPrice?: number
    purchaseDate?: string
    purchaseId?: string
    product?: Product
    condition?: {
        id: string
        name: string
    }
    status?: {
        id: string
        name: string
    }
    location?: {
        id: string
        name: string
    }
}

export interface Condition {
    id: string
    name: string
}

export interface Location {
    id: string
    name: string
}

export interface InventoryFilters extends PaginationParams {
    productId?: string
    conditionId?: string
    statusId?: string
    locationId?: string
}

export const inventoryApi = {
    getInventoryItems: async (params: InventoryFilters = {}) => {
        const { data } = await http.get<ApiResponse<InventoryItem[]>>("/inventory/items", { params })
        return data
    },
    getInventoryItem: async (id: string) => {
        const { data } = await http.get<ApiResponse<InventoryItem>>(`/inventory/items/${id}`)
        return data.data
    },
    createInventoryItem: async (itemData: Partial<InventoryItem>) => {
        const { data } = await http.post<ApiResponse<InventoryItem>>("/inventory/items", itemData)
        return data.data
    },
    getConditions: async () => {
        const { data } = await http.get<ApiResponse<Condition[]>>("/catalog/conditions")
        return data.data || []
    },
    getItemStatuses: async () => {
        const { data } = await http.get<ApiResponse<any[]>>("/catalog/item-statuses")
        return data.data || []
    },
    getLocations: async () => {
        const { data } = await http.get<ApiResponse<any[]>>("/catalog/locations")
        return data.data || []
    },
}
