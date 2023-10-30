import { generateNonce } from 'siwe'

type SignInResult = { type: 'require_auth' } | { type: 'user'; data: { userId: string } }

export default defineEventHandler(async (event): Promise<SignInResult> => {
  const authReq = auth.handleRequest(event)
  const session = await authReq.validate()
  if (session === null) {
    setCookie(event, 'nonce', generateNonce())
    return { type: 'require_auth' }
  }
  else {
    return { type: 'user', data: { userId: session.userId } }
  }
})
