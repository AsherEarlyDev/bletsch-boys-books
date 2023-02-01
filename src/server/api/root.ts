import { createTRPCRouter } from "./trpc";
import { adminRouter } from "./routers/admin";
import { vendorRouter } from "./routers/vendor";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  admin: adminRouter,
  vendor: vendorRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
