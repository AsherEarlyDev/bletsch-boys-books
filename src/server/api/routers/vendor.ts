import { TRPCError } from "@trpc/server";
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

    getAllVendors: publicProcedure
    .query(async ({ ctx }) => {
      try {
        return await ctx.prisma.vendor.findMany();
      } catch (error) {
        throw new TRPCError({code: error.code, message: error.message})
      }
    }),

    getNumVendors: publicProcedure
    .query(async ({ ctx }) => {
      try {
        const vendors = await ctx.prisma.vendor.findMany();
        return vendors.length;
      } catch (error) {
        throw new TRPCError({code: error.code, message: error.message})
      }
    }),

    getVendorsWithBuyback: publicProcedure
    .query(async ({ ctx }) => {
      try {
        const vendors = await ctx.prisma.vendor.findMany({
          where: {
            NOT:{
              bookBuybackPercentage: 0
            }
          }
        });
        if (vendors.length === 0){
          console.log("No vendors with buyback policy!")
        }
        return vendors
      } catch (error) {
        throw new TRPCError({code: error.code, message: error.message})
      }
    }),

    createVendor: publicProcedure
    .input(
      z.object({
        name: z.string(),
        buybackRate: z.number()
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        if (input.buybackRate < 0 || input.buybackRate > 1){
          throw new TRPCError({code: "INTERNAL_SERVER_ERROR", message: "Buyback Rate must be between 0 and 1!"})
        }
        await ctx.prisma.vendor.create({
          data: {
            name: input.name,
            bookBuybackPercentage: input.buybackRate
          },
        });
      } catch (error) {
        throw new TRPCError({code: "INTERNAL_SERVER_ERROR", message: "Unable to create vendor! " + error.message});
      }
    }),

    modifyVendor: publicProcedure
    .input(
      z.object({
        vendorId: z.string(),
        newName: z.string(),
        buybackRate: z.number()
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        if (input.buybackRate < 0 || input.buybackRate > 1){
          throw new TRPCError({code: "INTERNAL_SERVER_ERROR", message: "Buyback rate must be between 0 and 1!"})
        }
        await ctx.prisma.vendor.update({
          where:
          {
            id: input.vendorId
        },
          data: {
            name: input.newName,
            bookBuybackPercentage: input.buybackRate
          },
        });
      } catch (error) {
        throw new TRPCError({code: "INTERNAL_SERVER_ERROR", message: "Unable to modify vendor! "+error.message})
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
        const buybacks = await ctx.prisma.buybackOrder.findFirst(
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
        else if (buybacks){
          throw new TRPCError({code: "CONFLICT", message: "Cannot delete vendor! This vendor has Book Buybacks associated with it."})
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
    }),

    getVendorById: publicProcedure
    .input(z.object({
      vendorId: z.string()
    }))
    .query(async ({ ctx, input }) => {

      try {
        console.log("IM HERE")      
        console.log(input.vendorId)
        return await ctx.prisma.vendor.findFirst({
          where:{
            id: input.vendorId
          }
        });
      } catch (error) {
        throw new TRPCError({code: "NOT_FOUND", message: "Unable to find vendor!"}) 
      }
    }),
});