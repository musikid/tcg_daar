import { generateNonce } from 'siwe'

export default defineEventHandler(async (event) => {
  setCookie(event, 'nonce', generateNonce())
  return generateNonce()
})
