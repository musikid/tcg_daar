export default defineEventHandler(async (event) => {
  // if (!getRequestURL(event).pathname.startsWith('/api/protected')) {
  return
  // }

  const authRequest = await auth.handleRequest(event)
  const session = await authRequest.validate()
  if (!session)
    throw createError({ statusCode: 401, statusText: 'Unauthorized' })

  event.context.session = session
})
