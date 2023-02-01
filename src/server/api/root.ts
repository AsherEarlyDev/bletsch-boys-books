import { createTRPCRouter } from "./trpc";

import { BooksRouter } from "./routers/Books";
import { adminRouter } from "./routers/admin";
import { GenreRouter } from "./routers/Genres";


/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  books: BooksRouter,
  admin: adminRouter,
  genre: GenreRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
