import { createTRPCRouter } from "./trpc";

import { booksRouter } from "./routers/books";
import { userRouter } from "./routers/user";
import { GenreRouter } from "./routers/Genres";
import { vendorRouter } from "./routers/vendor";
import { salesRouter } from "./routers/sales";
import { salesRecRouter } from "./routers/salesRec";
import { purchaseOrderRouter } from "./routers/purchaseOrder";
import { purchaseRouter } from "./routers/purchase";
import { salesReportRouter } from "./routers/salesReport";
import { buybackRouter } from "./routers/buyback";
import { buybackOrderRouter } from "./routers/bookBuybackOrder";


/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  books: booksRouter,
  user: userRouter,
  genre: GenreRouter,
  vendor: vendorRouter,
  sales: salesRouter,
  salesRec: salesRecRouter,
  purchaseOrder: purchaseOrderRouter,
  purchase: purchaseRouter,
  salesReport: salesReportRouter,
  buyback: buybackRouter,
  buybackOrder: buybackOrderRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
