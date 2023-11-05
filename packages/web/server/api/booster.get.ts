import { MyBoosterQuery, getBuiltGraphSDK } from '../../.graphclient'

export default defineEventHandler(async (event) => {
    const sdk = getBuiltGraphSDK()

    try {
        const { boosters }: MyBoosterQuery = await sdk.MyBooster({ owner: event.context.session.user.id })
        return { boosters }
    } catch (e) {
        throw createError({
            status: 404,
            statusText: 'Not Found',
        })
    }
})