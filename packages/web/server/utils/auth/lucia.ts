// server/utils/lucia.ts
import { lucia } from 'lucia'
import { h3 } from 'lucia/middleware'
import { PrismaClient } from '@prisma/client'
import { prisma } from '@lucia-auth/adapter-prisma'
import { unstorage } from '@lucia-auth/adapter-session-unstorage'
import { createStorage } from 'unstorage'

export enum ProviderId {
  siwe = 'siwe',
}

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
      id: data.id,
      role: data.role,
    }
  },
})

export type Auth = typeof auth
