export const API_URL: string = 'https://api.pokemontcg.io/v2'

interface ReturnValue<T> {
  data: T
}

interface PaginatedReturnValue<T> extends ReturnValue<T> {
  totalCount: number
  pageSize: number
  page: number
  count: number
}

export class TCGClient {
  static async get<T>(endpoint: string, params?: ConstructorParameters<typeof URLSearchParams>[0]): Promise<ReturnValue<T> & Partial<PaginatedReturnValue<T>>> {
    const { pokemonTcgSdk: { apiKey } } = useRuntimeConfig()

    const query: Record<string, string> = {}
    const _params = new URLSearchParams(params)
    for (const [key, value] of _params.entries())
      query[key] = value

    const { data, totalCount, page, pageSize, count } = await $fetch<ReturnValue<T> & Partial<PaginatedReturnValue<T>>>(endpoint, {
      headers: {
        'X-Api-Key': apiKey,
      },
      baseURL: API_URL,
      query,
    })

    return { data, totalCount, page, pageSize, count }
  }
}
