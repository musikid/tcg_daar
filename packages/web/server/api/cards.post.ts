import { joinURL } from 'ufo'

interface Body {
    setId: string
}

export default defineEventHandler(async (event) => {
    const { app: { baseURL } } = useRuntimeConfig()

    const { setId } = await readBody<Body>(event)
    let page = 1
    let total = 0
    let setCards = []
    do {
        const { cards: newCards, totalCount } = await TCGCard.search(new CardQueryBuilder().withSetId(setId).build(), page++, 255)
        setCards.push(...newCards)
        total = totalCount
    } while (setCards.length < total)
    const set = await TCGSet.find(setId)
    const { db } = event.context

    // TODO: This is a bit of a mess, but it works. I'm not sure how to do this better.
    // Create the sets and its cards in parallel.
    await Promise.all(
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
    )

    const cards = await db.card.findMany({
        where: {
            set_id: {
                equals: set.id
            }
        }
    })

    return {
        cards: cards.map(card => ({ id: card.id, url: joinURL(baseURL, `/api/cards/${card.id}`).toString() }))
    }
})