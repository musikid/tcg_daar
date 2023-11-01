export default defineEventHandler(async (event) => {
    const authRequest = await auth.handleRequest(event)
    const session = await authRequest.validate()
    if (!session) {
        throw createError({ statusCode: 401, statusText: 'Unauthorized' })
    }
    event.context.session = session
})