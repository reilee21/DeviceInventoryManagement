import http from "./http"
import type { ApiResponse, PaginationParams } from "./types"

export interface Product {
    id: number
    name: string
    brandId: number
    brand?: {
        id: number
        name: string
    }
    categoryId: number
    category?: {
        id: number
        name: string
    }
    specs?: any
    status: string
    totalStock?: number
}

export interface ProductVariant {
    color: string
    storage: string
    statusId: number
    avgPrice: string | number
    stock: string | number
}

export interface Brand {
    id: string
    name: string
}

export interface Category {
    id: string
    name: string
}

export interface ProductFilters extends PaginationParams {
    brandId?: string
    categoryId?: string
    search?: string
}

export const productsApi = {
    getProducts: async (params: ProductFilters = {}) => {
        const { data } = await http.get<ApiResponse<Product[]>>("/products", { params })
        return data
    },
    createProduct: async (productData: Partial<Product>) => {
        const { data } = await http.post<ApiResponse<Product>>("/products", productData)
        return data.data
    },
    updateProduct: async (id: number, productData: Partial<Product>) => {
        const { data } = await http.patch<ApiResponse<Product>>(`/products/${id}`, productData)
        return data.data
    },
    getVariants: async (id: number) => {
        const { data } = await http.get<ApiResponse<ProductVariant[]>>(`/products/${id}/variants`)
        return data.data || []
    },
    getBrands: async () => {
        const { data } = await http.get<ApiResponse<Brand[]>>("/catalog/brands")
        return data.data || []
    },
    getCategories: async () => {
        const { data } = await http.get<ApiResponse<Category[]>>("/catalog/categories")
        return data.data || []
    },
}
