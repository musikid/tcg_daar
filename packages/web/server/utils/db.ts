import { PrismaClient, Card  } from "@prisma/client"

export const client = new PrismaClient()

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