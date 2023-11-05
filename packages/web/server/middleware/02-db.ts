import { PrismaClient } from "@prisma/client"
import { client } from "../utils/db"

declare module 'h3' {
    interface H3EventContext {
        db: PrismaClient
    }
}


export default defineEventHandler(async (event) => {
    event.context.db = client
})