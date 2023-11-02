interface CardImage {
  small: string
  large: string
}

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
    const { data } = await useFetch(`/api/protected/tcg/provider/cards/${id}`)
    const card = data.value!.data as TCGCard
    return new TCGCard(card.id, card.name, card.images)
  }

  static async search(query: string, page: number, pageSize: number) {
    const { data } = await useFetch(`/api/protected/tcg/provider/cards`, {
      query: {
        q: query,
        page,
        pageSize,
        select: TCGCard.select.join(','),
      },
    })
    const { data: cards, count, totalCount } = data.value!
    return { cards: (cards as TCGCard[]).map(card => new TCGCard(card.id, card.name, card.images)), count, totalCount, page, pageSize }
  }
}
