import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import bcrypt from 'bcryptjs'
import SalesPage from "../../../pages/sales";

const SALT_ROUNDS = 10;

export const adminRouter = createTRPCRouter({
  createAdminPassword: publicProcedure
    .input(
      z.object({
        password: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.admin.create({
          data: {
            password: bcrypt.hashSync(input.password, bcrypt.genSaltSync(SALT_ROUNDS)),
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
            id: 1,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
    changePassword: publicProcedure
    .input(
      z.object({
        password: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.admin.update({
          where:
          {
            id: 1
        },
          data: {
            password: bcrypt.hashSync(input.password, bcrypt.genSaltSync(SALT_ROUNDS)),
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
});