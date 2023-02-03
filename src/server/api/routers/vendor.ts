import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";



export const vendorRouter = createTRPCRouter({
    getVendors: publicProcedure
    .query(async ({ ctx }) => {
      try {
        return await ctx.prisma.vendor.findMany();
      } catch (error) {
        console.log("Unable to get list of vendors", error);
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
        console.log(error);
      }
    }),

    modifyVendor: publicProcedure
    .input(
      z.object({
        originalName: z.string(),
        newName: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const vendorId = await ctx.prisma.vendor.findFirst({
          where:
          {
            name: input.originalName
          }
        })
        if (vendorId){
          await ctx.prisma.vendor.update({
            where:
            {
              id: vendorId.id
          },
            data: {
              name: input.newName,
            },
          });
        }
      } catch (error) {
        console.log(error);
      }
    }),

    deleteVendor: publicProcedure
    .input(
      z.object({
        vendorName: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const vendorId = await ctx.prisma.vendor.findFirst({
          where: {
            name: input.vendorName,
          },
        })
        if (vendorId){
          const purchaseOrders = await ctx.prisma.purchaseOrder.findFirst(
            {
              where:
              {
                vendorId: vendorId.id
              }
            }
          );
          if (purchaseOrders){
            console.log("Cannot delete vendor")
          }
          else{
            await ctx.prisma.vendor.delete({
              where: {
                id: vendorId.id
              }
            })
          }
        }
      } catch (error) {
        console.log(error);
      }
    })
});