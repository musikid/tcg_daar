import { z } from 'zod'
import type { SiweResponse } from 'siwe'
import { SiweMessage } from 'siwe'
import { LuciaError, type User } from 'lucia'

const schema = z.object({
  message: z.string(),
  signature: z.string(),
})

export default defineEventHandler(async (event) => {
  const baseURL = new URL(event.headers.get('host')!)

  const body = await readBody(event)
  const bodyParseResult = schema.safeParse(body)
  if (!bodyParseResult.success) {
    console.error(bodyParseResult.error)
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
    })
  }

  const { message, signature } = bodyParseResult.data

  const msg = new SiweMessage(message)

  let res: SiweResponse
  try {
    res = await msg.verify({
      signature,
      domain: baseURL.host,
      nonce: getCookie(event, 'nonce'),
    })

    if (!res.success) {
      console.error(res.error)
      throw createError({
        status: 403,
      })
    }
  }
  catch (e) {
    console.error(e)
    throw createError({
      status: 401,
    })
  }

  const address = res.data.address
  let user: User
  try {
    user = await auth.getUser(address)
  }
  catch (e) {
    if (e instanceof LuciaError && e.message === 'AUTH_INVALID_USER_ID') {
      user = await auth.createUser({
        userId: address,
        key: { providerId: ProviderId.siwe, providerUserId: address, password: null },
        attributes: {} as any,
      })
    }
    else {
      console.error(e)
      throw createError({
        status: 500,
      })
    }
  }

  const session = await auth.createSession({
    userId: user.id,
    attributes: {},
  })
  const authReq = auth.handleRequest(event)
  authReq.setSession(session)

  return sendRedirect(event, '/dashboard')
})
