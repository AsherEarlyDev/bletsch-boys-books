import {TRPCError} from "@trpc/server";
import {z} from "zod";
import {createTRPCRouter, protectedProcedure, publicProcedure} from "../trpc";
import convertISBN10ToISBN13 from "../HelperFunctions/convertISBN";
import {editableBook} from "../../../types/bookTypes";

export const inventoryCorrectionRouter = createTRPCRouter({
  createInventoryCorrection: protectedProcedure
  .input(z.object({
    isbn: z.string(),
    date: z.string(),
    userName: z.string(),
    adjustment: z.number()
  }))
  .mutation(async ({ctx, input}) => {
    try {
      const isbn = convertISBN10ToISBN13(input.isbn)
      const date  = input.date.replace(/-/g, '\/')
      await ctx.prisma.inventoryCorrection.create({
        data: {
          userName: input.userName,
          date: new Date(date),
          adjustment: input.adjustment,
          bookId: isbn
        },
      })
    } catch (error) {
      throw new TRPCError({
        code: error.code,
        message: "Create Inventory Correction Failed! " + error.message
      })
    }
  }),

})