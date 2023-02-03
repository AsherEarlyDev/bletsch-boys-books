import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const GenreRouter = createTRPCRouter({
    getGenres:publicProcedure
    .query(async({ctx, input}) => {
        return await ctx.prisma.genre.findMany()
    }),
    changeGenreName:publicProcedure.input(z.object({
        originalName: z.string(),
        newName: z.string()
    }))
    .mutation(async({ctx, input}) => {
        const genre = ctx.prisma.genre.update({
            where:{
                name: input.originalName
            },
            data:{
                name:input.newName
            }
        })

    })
})