import { createTRPCRouter, publicProcedure } from "../trpc";
import {number, z} from "zod"
export const GenreRouter = createTRPCRouter({
    getGenres:publicProcedure
    .input(z.object({
        genrePageNumber: z.number(),
        genresPerPage: z.number(),
        genreSortBy: z.string(),
        genreDescOrAsc: z.string()
      }))
    .query(async({ctx, input}) => {
        return await ctx.prisma.genre.findMany({
            take: input.genresPerPage,
            skip: input.genrePageNumber*input.genresPerPage,
            orderBy:[{
                [input.genreSortBy]: input.genreDescOrAsc,
              }]
        })
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
    })
})