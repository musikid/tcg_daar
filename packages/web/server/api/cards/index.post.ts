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
        const set = await TCGSet.find(setId)
        return { set, cards }
    }))
    const { db } = event.context

    // TODO: This is a bit of a mess, but it works. I'm not sure how to do this better.
    // Create the sets and its cards in parallel.
    await Promise.all(
        setCards.flatMap(({ cards: setCards, set }) =>
            [
                db.set.create({
                    data: { id: set.id, name: set.name, original_id: set.id },
                }),
                db.card.createMany({
                    data: setCards.map(card => ({
                        id: card.id,
                        name: card.name,
                        description: card.name,
                        image: card.images.large,
                        original_id: card.id,
                        set_id: set.id,
                    }))
                })
            ]
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