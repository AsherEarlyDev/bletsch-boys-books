import { z } from "zod"
import { editableBook } from "../../../types/bookTypes"
import { createTRPCRouter, publicProcedure } from "../trpc"


export const bookCaseRouter = createTRPCRouter({
    saveBookCase: publicProcedure
    .input(z.object({
        name: z.string(),
        width:z.number(),
        numShelves:z.number(),
        case:z.array(z.object({
            takenSpace:z.number(),
            bookList:z.array(z.object({
                bookIsbn: z.string(), 
                name:z.string(), 
                inventory: z.number(), 
                displayCount:z.number(), 
                edit:z.boolean(), 
                mode:z.object({
                    value:z.string(),
                    display:z.string(),
                }), 
                thickness:z.number(), 
                width:z.number()
            }))
        }))
    }))
    .mutation(async ({ctx, input}) => {
        try{
            await ctx.prisma.bookCaseContainer.delete({
                where:{
                    name:input.name
                }
            })
        }
        catch(error){
        }
        const data = [].concat(...(input.case.map((shelf, shelfIndex) => {
            return shelf.bookList.map((book, bookIndex) => {
                return{
                shelfNumber:shelfIndex,
                index:bookIndex,
                mode:book.mode.value,
                edit:book.edit,
                displayCount:book.displayCount,
                bookIsbn:book.bookIsbn,}
            })
        })))
        console.log(data)
        try{ await ctx.prisma.bookCaseContainer.create({
            data:{
                name:input.name,
                width:input.width,
                numShelves:input.numShelves,
                ShelfBook:{
                    createMany:{
                        data:data
                        
                    }
                }
            }

        })}
        catch(error){
            throw(error)
        }

    }),
    getAllBookCases: publicProcedure
    .input(z.optional(z.object({
        pageNumber: z.number(),
        casesPerPage: z.number(),
        sortBy: z.string(),
        descOrAsc: z.string(),})
    ))
    .query(async ({ctx, input}) => {
        const cases = await ctx.prisma.bookCaseContainer.findMany({
            take: input.casesPerPage,
            skip: input.pageNumber * input.casesPerPage,
            include: {
            ShelfBook: {
                orderBy:{
                    index:"asc"
                },
                include:{
                    Book: true
                }
            },
            },
            orderBy:[{
                [input.sortBy]: input.descOrAsc
            }]
        })
        return cases.map((bookCase)=>{
            const newCase =[]
            for(var i=0; i<bookCase.numShelves; i++){
                newCase.push([])
            }
            bookCase.ShelfBook.map((book) =>newCase[book.shelfNumber].push({
                ...book,
                name: book.Book.title,
                mode:book.mode==="cover" ? {value:book.mode, display: "Cover Out"} : {value:book.mode, display: "Spine Out"},
                inventory:book.Book.inventory,
                width:Number(book.Book.dimensions[1] ? book.Book.dimensions[0] : 5),
                thickness:Number(book.Book.dimensions[1] ? book.Book.dimensions[1] : 0.8)
            }))
            const fullCase = newCase.map((shelf) => {
                var takenSpace = 0
                for(var i = 0; i<shelf.length; i++){
                    takenSpace = takenSpace+(shelf[i].thickness)
                }
                return {
                    takenSpace:takenSpace,
                    bookList:shelf
                }
            })
            return{
                name:bookCase.name,
                width:bookCase.width,
                numShelves:bookCase.numShelves,
                case:fullCase
            }
        })
        return cases
    }),

    getNumberOfCases: publicProcedure
    .query(async ({ctx, input}) => {
        return await ctx.prisma.bookCaseContainer.count()
    }),
    deleteCase: publicProcedure
    .input(z.string())
    .mutation(async({ctx, input}) => {
        await ctx.prisma.bookCaseContainer.delete({
            where:{
                name:input
            }
        })
    })



})