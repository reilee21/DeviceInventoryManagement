import { useState, useCallback, useEffect } from "react"
import { useApi } from "../useApi"
import { purchasesApi } from "@/services/api/purchases"
import type { PurchaseFilters } from "@/services/api/purchases"

export function usePurchases() {
    const [filters, setFilters] = useState<PurchaseFilters>({
        sourceTypeId: undefined,
        search: "",
        page: 1,
        limit: 10,
    })

    const { execute: fetchPurchases, data: purchasesApiResponse, loading, error } = useApi(purchasesApi.getPurchases)
    const { execute: fetchSourceTypes, data: sourceTypes } = useApi(purchasesApi.getSourceTypes)

    const refetch = useCallback(() => {
        fetchPurchases(filters)
    }, [fetchPurchases, filters])

    useEffect(() => {
        refetch()
    }, [refetch])

    useEffect(() => {
        fetchSourceTypes()
    }, [fetchSourceTypes])

    const updateFilters = useCallback((newFilters: Partial<PurchaseFilters>) => {
        setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }))
    }, [])

    const setPage = useCallback((page: number) => {
        setFilters((prev) => ({ ...prev, page }))
    }, [])

    return {
        purchases: purchasesApiResponse?.data || [],
        totalItems: purchasesApiResponse?.meta?.total || 0,
        totalPages: purchasesApiResponse?.meta?.lastPage || 0,
        currentPage: purchasesApiResponse?.meta?.page || 1,
        sourceTypes: sourceTypes || [],
        loading,
        error,
        filters,
        updateFilters,
        setPage,
        refetch,
    }
}

export function usePurchaseDetail(id: string) {
    const { execute: fetchPurchase, data: purchase, loading, error } = useApi(purchasesApi.getPurchase)

    useEffect(() => {
        if (id) {
            fetchPurchase(id)
        }
    }, [id, fetchPurchase])

    return {
        purchase,
        loading,
        error,
        refetch: () => id && fetchPurchase(id),
    }
}
