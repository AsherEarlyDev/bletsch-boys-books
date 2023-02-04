import { createTRPCRouter } from "./trpc";

import { BooksRouter } from "./routers/Books";
import { adminRouter } from "./routers/admin";
import { GenreRouter } from "./routers/Genres";
import { vendorRouter } from "./routers/vendor";
import { salesRouter } from "./routers/sales";
import { salesRecRouter } from "./routers/salesRec";
import { purchaseOrderRouter } from "./routers/purchaseOrder";
import { purchaseRouter } from "./routers/purchase";



/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  books: BooksRouter,
  admin: adminRouter,
  genre: GenreRouter
  vendor: vendorRouter,
  sales: salesRouter,
  salesRec: salesRecRouter,
  purchaseOrder: purchaseOrderRouter,
  purchase: purchaseRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
