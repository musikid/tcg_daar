// server/utils/lucia.ts
import { lucia } from 'lucia'
import { h3 } from 'lucia/middleware'
import { PrismaClient } from '@prisma/client/edge'
import { prisma } from '@lucia-auth/adapter-prisma'
import { unstorage } from '@lucia-auth/adapter-session-unstorage'
import { createStorage } from 'unstorage'

const client = new PrismaClient()
const sessionClient = createStorage()

export const auth = lucia({
  adapter: {
    user: prisma(client, {
      user: 'user',
      key: 'key',
      session: null,
    }),
    session: unstorage(sessionClient),
  },
  // eslint-disable-next-line node/prefer-global/process
  env: process.dev ? 'DEV' : 'PROD',
  middleware: h3(),

  getUserAttributes: (data) => {
    return {
      username: data.username,
    }
  },
})

export type Auth = typeof auth
