import type { Session } from "lucia"

declare module 'h3' {
    interface H3EventContext {
        session: Session
    }
}


export default defineEventHandler(async (event) => {
  // if (getRequestURL(event).pathname.startsWith('/api/auth')) {
  return
  // }

  const authRequest = auth.handleRequest(event)
  const session = await authRequest.validate()
  if (!session)
    throw createError({ statusCode: 401, statusText: 'Unauthorized' })

  event.context.session = session
})
