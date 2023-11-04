export interface ReturnValue<T> {
    data: T
}

export interface PaginatedReturnValue<T> extends ReturnValue<T> {
    totalCount: number
    pageSize: number
    page: number
    count: number
}

export const API_URL: string = 'https://api.pokemontcg.io/v2'