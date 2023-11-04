import { PaginatedReturnValue, ReturnValue } from './api'

export class SetQueryBuilder {
  id?: string
  name?: string

  constructor() {
  }

  withId(id: string): this {
    this.id = id
    return this
  }

  withName(name: string): this {
    this.name = name
    return this
  }

  build(): string {
    return Object.entries(this).reduce((acc, [key, value]) => {
      if (value)
        acc += `${key}:${value} `

      return acc
    }, '')
  }
}

export interface SetImage {
  symbol: string
  logo: string
}

export class TCGSet {
  id: string
  name: string
  images: SetImage
  total: number

  static select = ['id', 'name', 'images', 'total']

  constructor(id: string, name: string, images: SetImage, total: number) {
    this.id = id
    this.name = name
    this.images = images
    this.total = total
  }

  static async find(id: string): Promise<TCGSet> {
    const { data: set } = await $fetch<ReturnValue<TCGSet>>(`/sets/${id}`, { baseURL: API_URL })
    return new TCGSet(set.id, set.name, set.images, set.total)
  }

  static async search(query: string, _page: number, _pageSize: number) {
    const { data: sets, count, totalCount, page, pageSize } = await $fetch<PaginatedReturnValue<TCGSet[]>>(`/sets`, {
      baseURL: API_URL,
      query: {
        q: query,
        page: _page,
        pageSize: _pageSize,
        select: TCGSet.select.join(','),
      },
    })
    return {
      sets: sets
        .map((set) => new TCGSet(set.id, set.name, set.images, set.total)),
      count,
      totalCount,
      page,
      pageSize
    }
  }
}
