import { useState, useCallback, useEffect } from "react"
import { useApi } from "../useApi"
import { productsApi } from "@/services/api/products"
import type { ProductFilters } from "@/services/api/products"

export function useProducts() {
    const [filters, setFilters] = useState<ProductFilters>({
        brandId: undefined,
        categoryId: undefined,
        search: "",
        page: 1,
        limit: 10,
    })

    const { execute: fetchProducts, data: productsApiResponse, loading, error } = useApi(productsApi.getProducts)
    const { execute: fetchBrands, data: brands } = useApi(productsApi.getBrands)
    const { execute: fetchCategories, data: categories } = useApi(productsApi.getCategories)

    const refetch = useCallback(() => {
        fetchProducts(filters)
    }, [fetchProducts, filters])

    useEffect(() => {
        refetch()
    }, [refetch])

    useEffect(() => {
        fetchBrands()
        fetchCategories()
    }, [fetchBrands, fetchCategories])

    const updateFilters = useCallback((newFilters: Partial<ProductFilters>) => {
        setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }))
    }, [])

    const setPage = useCallback((page: number) => {
        setFilters((prev) => ({ ...prev, page }))
    }, [])

    return {
        products: productsApiResponse?.data || [],
        totalItems: productsApiResponse?.meta?.total || 0,
        totalPages: productsApiResponse?.meta?.lastPage || 0,
        currentPage: productsApiResponse?.meta?.page || 1,
        brands: brands || [],
        categories: categories || [],
        loading,
        error,
        filters,
        updateFilters,
        setPage,
        refetch,
    }
}
