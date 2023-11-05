import { CardsQuery, getBuiltGraphSDK } from '../../../.graphclient'
import { MyCardsQuery } from '../../../.graphclient'
import { z } from 'zod'

const schema = z.object({
    userOnly: z.boolean().optional(),
    set: z.string().optional(),
})

type Query = z.infer<typeof schema>

export default defineEventHandler(async (event) => {
    const sdk = getBuiltGraphSDK()

    const r = schema.safeParse(getQuery<Query>(event))
    if (!r.success) {
        throw createError({
            status: 400,
            statusText: 'Bad Request',
        })
    }

    const { data: { userOnly } } = r

    try {
        const { cards }: CardsQuery | MyCardsQuery = userOnly
            ? await sdk.MyCards({ owner: event.context.session.user.id })
            : await sdk.Cards()

        return cards
    } catch (e) {
        throw createError({
            status: 404,
            statusText: 'Not Found',
        })
    }
})