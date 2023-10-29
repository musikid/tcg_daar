import { z } from 'zod'
import { Address, isAddress } from 'viem'
import { SiweMessage } from 'siwe'
import type { User } from 'lucia'
import { LuciaError } from 'lucia'

const schema = z.object({
  message: z.object({
    /** RFC 4501 dns authority that is requesting the signing. */
    domain: z.string(),
    /**
     * Ethereum address performing the signing conformant to capitalization
     * encoded checksum specified in EIP-55 where applicable.
     */
    address: z.string(),
    /**
     * Human-readable ASCII assertion that the user will sign, and it must not
     * contain `\n`.
     */
    statement: z.string().optional(),
    /**
     * RFC 3986 URI referring to the resource that is the subject of the signing
     *  (as in the __subject__ of a claim).
     */
    uri: z.string().url(),
    /** Current version of the message. */
    version: z.string(),
    /**
     * EIP-155 Chain ID to which the session is bound, and the network where
     * Contract Accounts must be resolved.
     */
    chainId: z.string().transform(Number),
    /**
     * Randomized token used to prevent replay attacks, at least 8 alphanumeric
     * characters.
     */
    nonce: z.string().min(8),
    /** ISO 8601 datetime string of the current time. */
    issuedAt: z.string().datetime().optional(),
    /**
     * ISO 8601 datetime string that, if present, indicates when the signed
     * authentication message is no longer valid.
     */
    expirationTime: z.string().datetime().optional(),
    /**
     * ISO 8601 datetime string that, if present, indicates when the signed
     * authentication message will become valid.
     */
    notBefore: z.string().datetime().optional(),
    /**
     * System-specific identifier that may be used to uniquely refer to the
     * sign-in request.
     */
    requestId: z.string().optional(),
    /**
     * List of information or references to information the user wishes to have
     * resolved as part of authentication by the relying party. They are
     * expressed as RFC 3986 URIs separated by `\n- `.
     */
    resources: z.string().transform(value => value.split('\n- ')).optional(),
  }),
  signature: z.string(),
})

export default defineEventHandler(async (event) => {
  const csrfToken = event.headers.get('csrf-token')!

  const { app: { baseURL } } = useRuntimeConfig(event)

  const bodyParseResult = schema.safeParse(readBody(event))
  if (!bodyParseResult.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
    })
  }

  const { message, signature } = bodyParseResult.data

  const msg = new SiweMessage(message)

  const res = await msg.verify({
    signature,
    domain: baseURL,
    nonce: csrfToken,
  })

  if (!res.success) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  let user: User
  user = await auth.getUser(message.address)
  if (user === null) {
    user = await auth.createUser({
      userId: message.address,
      key: { providerId: ProviderId.siwe, providerUserId: message.address, password: null },
      attributes: {},
    })
  }

  const session = await auth.createSession({
    userId: user.id,
    attributes: { csrfToken },
  })
  const authReq = auth.handleRequest(event)
  authReq.setSession(session)

  return sendRedirect(event, '/dashboard')
})
