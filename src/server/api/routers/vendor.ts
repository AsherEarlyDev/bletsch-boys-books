import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";



export const vendorRouter = createTRPCRouter({
    getVendors: publicProcedure
    .input(z.object({
      pageNumber: z.number(),
      entriesPerPage: z.number(),
      sortBy: z.string(),
      descOrAsc: z.string()
    }))
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.vendor.findMany({
          take: input.entriesPerPage,
          skip: input.pageNumber*input.entriesPerPage,
          orderBy: {
            [input.sortBy]: input.descOrAsc
          }
      });
      } catch (error) {
        console.log("Unable to get list of vendors", error);
      }
    }),

    getNumVendors: publicProcedure
    .query(async ({ ctx }) => {
      try {
        const vendors = await ctx.prisma.vendor.findMany();
        return vendors.length;
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
        console.log(error);
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
          console.log("Cannot delete vendor")
        }
        else{
          await ctx.prisma.vendor.delete({
            where: {
              id: input.vendorId
            }
          })
        }
      } catch (error) {
        console.log(error);
      }
    })
});