import { Card } from "@prisma/client"

export type ReturnedCard = Omit<Card, 'binder_id' | 'original_id'>

export function internalCardToReturnedCard(card: Card): ReturnedCard {
    return {
        id: card.id,
        set_id: card.set_id,
        name: card.name,
        description: card.description,
        image: card.image,
    }
}

export default defineCachedEventHandler(async (event): Promise<ReturnedCard> => {
    const { db } = event.context
    const card = await db.card.findUnique({
        where: { id: event.context.params!.id }
    })

    if (!card) {
        throw createError({
            status: 404,
            statusText: 'Not Found',
        })
    }

    // Return an NFT metadata object
    return internalCardToReturnedCard(card)
})