interface Body {
    setIds: string[]
}

export default defineEventHandler(async (event) => {
    const { setIds } = await readBody<Body>(event)
    const setCards = await Promise.all(setIds.map(async setId => {
        let page = 1
        let total = 0
        let cards = []
        do {
            const { cards: newCards, totalCount } = await TCGCard.search(new CardQueryBuilder().withSetId(setId).build(), page++, 255)
            cards.push(...newCards)
            total = totalCount
        } while (cards.length < total)

        return { setId, cards }
    }))
    const { db } = event.context
    await Promise.all(
        setCards.map(({ cards: setCards, setId }) =>
            db.card.createMany({
                data: setCards.map(card => ({
                    id: card.id,
                    name: card.name,
                    description: card.name,
                    image: card.images.large,
                    original_id: card.id,
                    set_id: setId,
                }))
            })
        ))
    const cards = await db.card.findMany({
        where: {
            set_id: {
                in: setIds
            }
        }
    })

    const cardsBySetId = cards.reduce((acc, card) => {
        if (!acc[card.set_id]) {
            acc[card.set_id] = []
        }
        acc[card.set_id].push(card.id)
        return acc
    }, {} as Record<string, string[]>)

    return { cards: cardsBySetId }
})