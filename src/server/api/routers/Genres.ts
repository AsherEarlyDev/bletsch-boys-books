import { createTRPCRouter, publicProcedure } from "../trpc";

export const GenreRouter = createTRPCRouter({
    getGenres:publicProcedure
    .query(async({ctx, input}) => {
        return await ctx.prisma.genre.findMany()
    })
})