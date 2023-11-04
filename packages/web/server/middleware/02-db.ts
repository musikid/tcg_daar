import { PrismaClient } from "@prisma/client"

declare module 'h3' {
    interface H3EventContext {
        db: PrismaClient
    }
}

const client = new PrismaClient()

export default defineEventHandler(async (event) => {
    event.context.db = client
})