import {createTRPCRouter, protectedProcedure, publicProcedure} from "../trpc";
import {number, z} from "zod"
import { TRPCError } from "@trpc/server";
export const GenreRouter = createTRPCRouter({
    getGenres:publicProcedure
    .input(z.optional(z.object({
        genrePageNumber: z.number(),
        genresPerPage: z.number(),
        genreSortBy: z.string(),
        genreDescOrAsc: z.string()
      })))
    .query(async({ctx, input}) => {
        try{
            if(input){
                return await ctx.prisma.genre.findMany({
                    take: input.genresPerPage,
                    skip: input.genrePageNumber*input.genresPerPage,
                    orderBy:[{
                        [input.genreSortBy]: input.genreDescOrAsc,
                    }]
                })
            }
            else{
                return await ctx.prisma.genre.findMany({})}
        }
        catch(error){
            throw new TRPCError({code: 'BAD_REQUEST', message: "Unable to get Genres!"})
        }
        
    }),

    changeGenreName:protectedProcedure.input(z.object({
        originalName: z.string(),
        newName: z.string()
    }))
    .mutation(async({ctx, input}) => {
        const genre = await ctx.prisma.genre.update({
            where:{
                name: input.originalName
            },
            data:{
                name:input.newName
            }
        })

    }),

    addGenre:protectedProcedure
    .input(z.string())
    .mutation(async ({ctx, input}) => {
        try{
            await ctx.prisma.genre.create({
                data:{
                    name:input
                }
            })
        }
        catch(error){
            throw new TRPCError({code: 'BAD_REQUEST', message: "Unable to add Genre!"})
        }
        
    }),

    getNumberOfGenres:publicProcedure
    .query(async ({ctx, input}) => {
        return await ctx.prisma.genre.count()
    }),

    deleteGenreByName:protectedProcedure
    .input(z.string())
    .mutation(async ({ctx, input}) => {
        try{
            await ctx.prisma.genre.delete({
                where:{
                  name:input
                }
              })
        }
        catch{
            throw new TRPCError({code: 'BAD_REQUEST', message: "Unable to delete Genre!"})
        }
    }),

    getGenreInventory:publicProcedure
    .input(z.string())
    .query(async ({ctx, input}) => {
        try{
            return await ctx.prisma.book.count({
                where:{
                    genre:{
                        name:input
                    }
                }
            })
        }
        catch{
            throw new TRPCError({code: 'BAD_REQUEST', message: "Genre Inventory can't be pulled!"})
        }
    })
})