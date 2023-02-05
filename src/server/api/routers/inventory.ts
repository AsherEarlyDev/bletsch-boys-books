import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const inventoryRouter = createTRPCRouter({
    getBookInventory: publicProcedure
    .input(
      z.object({
        isbn: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        let booksBought = 0
        let booksSold = 0
        const bookOrder = ctx.prisma.purchase.findMany({
            where:{
                bookId: input.isbn
            }
        })
        
      } catch (error) {
        console.log(error);
      }
    }),

  });