import { createTRPCRouter, publicProcedure } from "../trpc";
import {number, z} from "zod"
export const GenreRouter = createTRPCRouter({
    getGenres:publicProcedure
    .input(z.optional(z.object({
        genrePageNumber: z.number(),
        genresPerPage: z.number(),
        genreSortBy: z.string(),
        genreDescOrAsc: z.string()
      })))
    .query(async({ctx, input}) => {
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
    }),

    changeGenreName:publicProcedure.input(z.object({
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

    addGenre:publicProcedure
    .input(z.string())
    .mutation(async ({ctx, input}) => {
        await ctx.prisma.genre.create({
            data:{
                name:input
            }
        })
    }),

    getNumberOfGenres:publicProcedure
    .query(async ({ctx, input}) => {
        return await ctx.prisma.genre.count()
    }),

    deleteGenreByName:publicProcedure
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
            throw("Can't delete genre")
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
            throw("Genre Inventory can't be pulled")
        }
    })
})