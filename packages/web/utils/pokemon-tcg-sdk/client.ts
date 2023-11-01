
export const API_URL: string = 'https://api.pokemontcg.io/v2';

export class Client {
  static get<T>(endpoint: string, params?: ConstructorParameters<typeof URLSearchParams>[0]): Promise<T> {
    const { pokemonTcgSdk: { apiKey } } = useRuntimeConfig()

    return $fetch(endpoint, {
      headers: {
        'X-Api-Key': apiKey,
      },
      baseURL: API_URL,
      query: new URLSearchParams(params),
    })
  }
}
