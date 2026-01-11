import { useState, useCallback, useEffect } from "react"
import { useApi } from "../useApi"
import { salesApi } from "@/services/api/sales"
import type { SaleFilters } from "@/services/api/sales"

export function useSales() {
    const [filters, setFilters] = useState<SaleFilters>({
        customerId: undefined,
        search: "",
        page: 1,
        limit: 10,
    })

    const { execute: fetchSales, data: salesApiResponse, loading, error } = useApi(salesApi.getSales)
    const { execute: createSale, loading: isCreating } = useApi(salesApi.createSale)
    const { execute: fetchCustomers, data: customers } = useApi(salesApi.getCustomers)

    const refetch = useCallback(() => {
        fetchSales(filters)
    }, [fetchSales, filters])

    useEffect(() => {
        refetch()
    }, [refetch])

    useEffect(() => {
        fetchCustomers()
    }, [fetchCustomers])

    const updateFilters = useCallback((newFilters: Partial<SaleFilters>) => {
        setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }))
    }, [])

    const setPage = useCallback((page: number) => {
        setFilters((prev) => ({ ...prev, page }))
    }, [])

    return {
        sales: salesApiResponse?.data || [],
        totalItems: salesApiResponse?.meta?.total || 0,
        totalPages: salesApiResponse?.meta?.lastPage || 0,
        currentPage: salesApiResponse?.meta?.page || 1,
        customers: customers || [],
        loading,
        error,
        isCreating,
        filters,
        updateFilters,
        setPage,
        createSale,
        refetch,
    }
}

export function useSaleDetail(id: string) {
    const { execute: fetchSale, data: sale, loading, error } = useApi(salesApi.getSale)

    useEffect(() => {
        if (id) fetchSale(id)
    }, [id, fetchSale])

    return {
        sale,
        loading,
        error,
        refetch: () => fetchSale(id),
    }
}

export function useSalePayments(saleId: string) {
    const { execute: addPaymentCall, loading: isAdding } = useApi(salesApi.addPayment)

    const addPayment = useCallback(async (data: { amount: number, notes?: string }) => {
        return await addPaymentCall(saleId, data)
    }, [saleId, addPaymentCall])

    return {
        addPayment,
        isAdding,
    }
}
