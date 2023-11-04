export default defineEventHandler(async (event) => {
    const { db } = event.context
    const card = await db.card.findUnique({
        where: { id: event.context.params!.id }
    })

    // Return an NFT metadata object
    return { ...card, id: undefined, set_id: undefined }
})