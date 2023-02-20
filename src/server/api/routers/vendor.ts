import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";



export const vendorRouter = createTRPCRouter({
    getVendors: publicProcedure
    .query(async ({ ctx }) => {
      try {
        return await ctx.prisma.vendor.findMany();
      } catch (error) {
        throw new TRPCError({code: "NOT_FOUND", message: "No Vendors Found!"})
      }
    }),

    createVendor: publicProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.vendor.create({
          data: {
            name: input.name
          },
        });
      } catch (error) {
        throw new TRPCError({code: "INTERNAL_SERVER_ERROR", message: "Unable to create vendor!"});
      }
    }),

    modifyVendor: publicProcedure
    .input(
      z.object({
        vendorId: z.string(),
        newName: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.vendor.update({
          where:
          {
            id: input.vendorId
        },
          data: {
            name: input.newName,
          },
        });
      } catch (error) {
        throw new TRPCError({code: "INTERNAL_SERVER_ERROR", message: "Unable to modify vendor!"})
      }
    }),

    deleteVendor: publicProcedure
    .input(
      z.object({
        vendorId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const purchaseOrders = await ctx.prisma.purchaseOrder.findFirst(
          {
            where:
            {
              vendorId: input.vendorId
            }
          }
        );
        if (purchaseOrders){
          throw new TRPCError({code: "CONFLICT", message: "Cannot delete vendor! This vendor has Purchase Orders associated with it."})
        }
        else{
          await ctx.prisma.vendor.delete({
            where: {
              id: input.vendorId
            }
          })
        }
      } catch (error) {
        throw new TRPCError({code: error.code, message: error.message})
      }
    })
});