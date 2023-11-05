export default defineEventHandler(async (event) => {
    const { db } = event.context
    const { id } = event.context.params!

    const set = await db.set.findFirst({ where: { id } })

    if (!set) {
        throw createError({
            status: 404,
            statusText: 'Not Found',
        })
    }

    return { name: set.name }
})