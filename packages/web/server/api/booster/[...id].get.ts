export default defineCachedEventHandler(async (event) => {
    const { id } = event.context.params!
    const { db } = event.context

    const booster = await db.booster.findUnique({
        where: { id },
    })

    if (!booster) {
        throw createError({
            status: 404,
            statusText: 'Not Found',
        })
    }

    return booster
})
