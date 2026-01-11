import { useState, useCallback, useEffect } from "react"
import { useApi } from "../useApi"
import { inventoryApi } from "@/services/api/inventory"
import type { InventoryFilters } from "@/services/api/inventory"
import { productsApi } from "@/services/api/products"

export function useInventory() {
    const [filters, setFilters] = useState<InventoryFilters>({
        productId: undefined,
        conditionId: undefined,
        statusId: undefined,
        locationId: undefined,
        page: 1,
        limit: 10,
    })

    const { execute: fetchItems, data: itemsApiResponse, loading, error } = useApi(inventoryApi.getInventoryItems)
    const { execute: fetchProducts, data: productsApiResponse } = useApi(productsApi.getProducts)
    const { execute: fetchConditions, data: conditions } = useApi(inventoryApi.getConditions)
    const { execute: fetchStatuses, data: statuses } = useApi(inventoryApi.getItemStatuses)
    const { execute: fetchLocations, data: locations } = useApi(inventoryApi.getLocations)

    const refetch = useCallback(() => {
        fetchItems(filters)
    }, [fetchItems, filters])

    useEffect(() => {
        refetch()
    }, [refetch])

    useEffect(() => {
        // Fetch products for the dropdown with a higher limit if possible or just rely on searches
        fetchProducts({ limit: 100 })
        fetchConditions()
        fetchStatuses()
        fetchLocations()
    }, [fetchProducts, fetchConditions, fetchStatuses, fetchLocations])

    const updateFilters = useCallback((newFilters: Partial<InventoryFilters>) => {
        setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }))
    }, [])

    const setPage = useCallback((page: number) => {
        setFilters((prev) => ({ ...prev, page }))
    }, [])

    return {
        items: itemsApiResponse?.data || [],
        totalItems: itemsApiResponse?.meta?.total || 0,
        totalPages: itemsApiResponse?.meta?.lastPage || 0,
        currentPage: itemsApiResponse?.meta?.page || 1,
        products: productsApiResponse?.data || [],
        conditions: conditions || [],
        statuses: statuses || [],
        locations: locations || [],
        loading,
        error,
        filters,
        updateFilters,
        setPage,
        refetch,
    }
}
