/// <reference types="lucia" />

declare namespace Lucia {
  type Auth = import('./utils/auth/lucia').Auth
  type DatabaseUserAttributes = Omit<import('@prisma/client').Prisma.UserFieldRefs, 'id'>
  interface DatabaseSessionAttributes { }
}
