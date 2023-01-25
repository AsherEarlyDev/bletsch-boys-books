import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const adminRouter = createTRPCRouter({
  createAdminPassword: publicProcedure
    .input(
      z.object({
        id: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.admin.create({
          data: {
            id: input.id,
            password: input.password,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
    getPassword: publicProcedure
    .query(async ({ ctx }) => {
      try {
        return await ctx.prisma.admin.findFirst({
          where: {
            id: '1',
          },
        });
      } catch (error) {
        console.log("error", error);
      }
    }),
    changePassword: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.admin.update({
          where:
          {
            id: '1'
        },
          data: {
            id: '1',
            password: input.password,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
});