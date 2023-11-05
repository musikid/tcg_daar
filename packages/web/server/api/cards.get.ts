import { CardsByIdQuery, CardsQuery, getBuiltGraphSDK } from '../../.graphclient'
import { MyCardsQuery } from '../../.graphclient'
import { z } from 'zod'

const schema = z.object({
    userOnly: z.string().optional(),
    ids: z.string().optional(),
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

    const { data: { userOnly, ids } } = r

    try {
        const { cards }: CardsQuery | MyCardsQuery | CardsByIdQuery = userOnly
            ? await sdk.MyCards({ owner: event.context.session.user.id })
            : ids
                ? await sdk.CardsById({ id_in: ids.split(',').map(n => '0x' + BigInt(n).toString(16)) })
                : await sdk.Cards()
        return { cards }
    } catch (e) {
        throw createError({
            status: 404,
            statusText: 'Not Found',
        })
    }
})