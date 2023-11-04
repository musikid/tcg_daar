import { PaginatedReturnValue, ReturnValue } from "./api"

export class CardQueryBuilder {
  id?: string
  name?: string
  ['set.id']?: string

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

  withSetId(id: string): this {
    this['set.id'] = id
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

interface CardImage {
  small: string
  large: string
}

export class TCGCard {
  id: string
  name: string
  images: CardImage

  static select = ['id', 'name', 'images']

  constructor(id: string, name: string, images: CardImage) {
    this.id = id
    this.name = name
    this.images = images
  }

  static async find(id: string): Promise<TCGCard> {
    const { data: card } = await $fetch<ReturnValue<TCGCard>>(`/cards/${id}`, { baseURL: API_URL })
    return new TCGCard(card.id, card.name, card.images)
  }

  static async search(query: string, _page: number, _pageSize: number) {
    const { data: cards, count, totalCount, page, pageSize } = await $fetch<PaginatedReturnValue<TCGCard[]>>(`/cards`, {
      baseURL: API_URL,
      query: {
        q: query,
        page: _page,
        pageSize: _pageSize,
        select: TCGCard.select.join(','),
      },
    })
    return {
      cards: cards
        .map(card => new TCGCard(card.id, card.name, card.images)),
      count,
      totalCount,
      page,
      pageSize
    }
  }
}
