import { createTRPCRouter } from "./trpc";
import { adminRouter } from "./routers/admin";
import { vendorRouter } from "./routers/vendor";

import { salesRouter } from "./routers/sales";
import { salesRecRouter } from "./routers/salesRec";
import { purchaseOrderRouter } from "./routers/purchaseOrder";
import { purchaseRouter } from "./routers/purchase";
import { salesReportRouter } from "./routers/salesReport";


/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  admin: adminRouter,
  vendor: vendorRouter,
  sales: salesRouter,
  salesRec: salesRecRouter,
  purchaseOrder: purchaseOrderRouter,
  purchase: purchaseRouter,
  salesReport: salesReportRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
