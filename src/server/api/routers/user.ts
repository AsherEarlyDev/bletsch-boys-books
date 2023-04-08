import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import bcrypt from 'bcryptjs'
import SalesPage from "../../../pages/sales";
import {TRPCError} from "@trpc/server";

const SALT_ROUNDS = 10;

export const userRouter = createTRPCRouter({
  getAllUsers: publicProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.user.findMany();
    } catch (error) {
      console.log(error);
    }
  }),
  createNewUser: protectedProcedure.input(z.object({
    username: z.string(),
    password: z.string(),
    role: z.enum(["USER", "ADMIN", "SUPERADMIN"])
  })).mutation(async({ctx, input}) => {
    try {
      await ctx.prisma.user.create({
          data: {
            name: input.username,
            password: bcrypt.hashSync(input.password, bcrypt.genSaltSync(SALT_ROUNDS)),
            role: input.role
          },
      });
    } catch (error){
      console.log(error)
    }
  }),
  editUser: protectedProcedure.input(z.object({id: z.string(), role: z.enum(["USER", "ADMIN", "SUPERADMIN"]), password: z.string().optional()})).mutation(async({ctx, input}) => {
    try{
        if(input.password){
          await ctx.prisma.user.update({
            where:
                {
                  id: input.id
                },
            data:
                {
                  role: input.role,
                  password: bcrypt.hashSync(input.password, bcrypt.genSaltSync(SALT_ROUNDS)),
                },
          });
        }
        else{
          await ctx.prisma.user.update({
            where:
                {
                  id: input.id
                },
            data:
                {
                  role: input.role,
                },
          });
        }
  } catch(error){
    console.log(error);
  }
  }),
  getPassword: publicProcedure
  .query(async ({ ctx }) => {
      try {
        return await ctx.prisma.user.findFirst({
          where: {
            id: ctx.session.user?.id,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
  changePassword: protectedProcedure
  .input(z.object({
        password: z.string(),
      }))
  .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.user.update({
          where:
          {
            id: ctx.session.user?.id
          },
          data: {
            password: bcrypt.hashSync(input.password, bcrypt.genSaltSync(SALT_ROUNDS)),
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
  deleteUser: protectedProcedure
  .input(z.object({userId: z.string(),}))
  .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.user.delete({
          where: {
            id: input.userId
          }
        })
      } catch (error) {
        throw new TRPCError({code: error.code, message: error.message})
      }
    }),
  getNumberOfUsers: publicProcedure
  .query(async ({ ctx }) => {
    try {
      const users = await ctx.prisma.user.findMany();
      return users.length;
    } catch (error) {
      throw new TRPCError({code: error.code, message: error.message})
    }
  }),
});