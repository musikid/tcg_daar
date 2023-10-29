// server/app.d.ts

/// <reference types="lucia" />
declare namespace Lucia {
    type Auth = import('./utils/auth/lucia').Auth
    interface DatabaseUserAttributes {
      username: string
    }
    interface DatabaseSessionAttributes { }
}
