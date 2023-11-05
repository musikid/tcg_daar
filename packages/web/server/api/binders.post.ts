import { z } from 'zod'
import { internalCardToReturnedCard } from '../utils/db'

const schema = z.object({
    name: z.string(),
    cardsIds: z.array(z.string()),
})

export type Body = z.infer<typeof schema>

export default defineEventHandler(async (event) => {
    const body = await readBody<Body>(event)

    const res = schema.safeParse(body)
    if (!res.success) {
        throw createError({
            status: 400,
            statusText: 'Bad Request',
        })
    }

    const { db } = event.context
    const { name, cardsIds } = res.data

    const binder = await db.binder.create({
        data: {
            name,
            user_id: event.context.session.user.id,
            cards: {
                connect: cardsIds.map(id => ({ id })),
            },
        },
        include: {
            cards: true,
        }
    })

    return {
        name: binder.name,
        cards: binder.cards.map(c => internalCardToReturnedCard(c))
    }
})