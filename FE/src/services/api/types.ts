export interface ApiResponse<T = any> {
    success: boolean;
    code: string;
    message: string;
    data: T | null;
    meta: PaginationMetadata | null;
    errors: any[] | null;
}

export interface PaginationMetadata {
    total: number;
    page: number;
    limit: number;
    lastPage: number;
    [key: string]: any;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    lastPage: number;
}

export interface PaginationParams {
    page?: number;
    limit?: number;
    [key: string]: any;
}
