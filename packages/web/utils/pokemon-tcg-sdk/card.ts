interface CardImage {
    small: string
    large: string
}

export class QueryBuilder {
    id?: string
    name?: string
    setId?: string

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
        this.setId = id
        return this
    }

    build(): string {
        return Object.entries(this).reduce((acc, [key, value]) => {
            if (value) {
                acc += `${key}:${value} `
            }
            return acc
        }, '')
    }
}

export class Card {
    id: string
    name: string
    images: CardImage

    static select = ['id', 'name', 'images']

    constructor(id: string, name: string, images: CardImage) {
        this.id = id
        this.name = name
        this.images = images
    }

    static async find(id: string): Promise<Card> {
        const { data } = await useFetch(`/api/tcg/provider/cards/${id}`)
        const card = data.value as Card
        return new Card(card.id, card.name, card.images)
    }

    static async search(query: string, page: number, pageSize: number): Promise<Card[]> {
        const { data } = await useFetch(`/api/tcg/provider/cards`, {
            query: {
                q: query,
                page,
                pageSize,
                select: Card.select,
            },
        })
        const cards = data.value as Card[]
        return cards.map(card => new Card(card.id, card.name, card.images))
    }
}