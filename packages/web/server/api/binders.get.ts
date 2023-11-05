import { internalCardToReturnedCard } from "../utils/db"

export default defineEventHandler(async (event) => {
    const { db } = event.context
    const binders = await db.binder.findMany({
        where: { user_id: event.context.session.user.id },
        include: {
            cards: true,
        },
    })

    return binders.map(({ name, cards }) => ({
        name,
        cards: cards.map(c => internalCardToReturnedCard(c))
    }))
})