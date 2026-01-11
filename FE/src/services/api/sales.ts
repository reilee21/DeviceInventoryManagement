import http from "./http"
import type { ApiResponse, PaginationParams } from "./types"
import type { InventoryItem } from "./inventory"

export interface Customer {
    id: string
    name: string
    phone?: string
    address?: string
}

export interface Sale {
    id: string
    customerId: string
    totalAmount: number
    paidAmount: number
    outstandingAmount: number
    status: string
    saleDate: string
    customer?: Customer
    saleItems?: InventoryItem[]
}

export interface CreateSaleData {
    customerId: string
    itemIds: string[]
    installments?: number
    downPayment?: number
    notes?: string
}

export interface SaleFilters extends PaginationParams {
    customerId?: string
    search?: string
}

export const salesApi = {
    getSales: async (params: SaleFilters = {}) => {
        const { data } = await http.get<ApiResponse<Sale[]>>("/sales", { params })
        return data
    },
    getSale: async (id: string) => {
        const { data } = await http.get<ApiResponse<Sale>>(`/sales/${id}`)
        return data.data
    },
    createSale: async (saleData: CreateSaleData) => {
        const { data } = await http.post<ApiResponse<Sale>>("/sales", saleData)
        return data.data
    },
    addPayment: async (saleId: string, paymentData: { amount: number; notes?: string }) => {
        const { data } = await http.post<ApiResponse<any>>(`/sales/${saleId}/payments`, paymentData)
        return data.data
    },
    getCustomers: async () => {
        const { data } = await http.get<ApiResponse<Customer[]>>("/customers")
        return data.data || []
    },
}
