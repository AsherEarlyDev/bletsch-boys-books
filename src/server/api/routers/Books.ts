import {z} from "zod"
import { createTRPCRouter, publicProcedure } from "../trpc";
import { rawGoogleOutput, googleBookInfo, externalBook, completeBook, id, databaseBook } from "../../../types/bookTypes";
import { Prisma, PrismaClient } from "@prisma/client";
import { Session } from "next-auth/core/types";

type context = {
  session: Session | null;
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>;
}

const zBook = z.object({
  isbn: z.string(),
  title: z.string(),
  publisher: z.string(),
  author: z.array(z.string()),
  publicationYear: z.number(),
  dimensions: z.array(z.number()),
  pageCount: z.optional(z.number()),
  genre: z.string(),
  retailPrice: z.number()
})

const fetchBookFromExternal = async (isbn: string) => {
    const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${process.env.SECRET_KEY_GOOGLE_API}`);
    const data:rawGoogleOutput = await res.json();
    const book: googleBookInfo | undefined = data.items[0]?.volumeInfo
    if (book != undefined){
      return transformRawBook(book, isbn);
    }
    else{
      throw console.error("Book Not Found");
    } 
}

const transformRawBook = (input:googleBookInfo, isbn:string) =>{
  const bookInfo: externalBook = {
    isbn: isbn,
    title: input.title,
    publisher: input.publisher,
    author: input.authors,
    publicationYear: (new Date(input.publishedDate)).getFullYear(),
    dimensions: input.dimensions,
    pageCount: input.pageCount,
    genre:input. mainCategory,
    retailPrice: input.saleInfo?.retailPrice.amount
  }
  return bookInfo
} 

const getBookIfExists = async (ctx:context, isbn:string) =>{
  try{
    return await ctx.prisma.book.findUnique({
      where:{
        isbn: isbn
      }
    })
  }
  catch(error){
    return null
  }
}

export const BooksRouter = createTRPCRouter({
  getBooks: publicProcedure.input(
    z.array(z.string())
  ).query(async ({ctx, input}) => {
    const internalBooks: any[] | PromiseLike<any[]> = []
    const externalBooks: externalBook[] = []
    for(const isbn of input){
      var book = await getBookIfExists(ctx, isbn)
      if(book) internalBooks.push(book)
      else{
        const externalBook = await fetchBookFromExternal(isbn)
        if(externalBook) externalBooks.push(externalBook)
      }
    }
    return({
      internalBooks: internalBooks,
      externalBooks: externalBooks
    })
  }),

  saveBook:publicProcedure.input(zBook)
  .mutation(async ({ctx,input}) => {
    try{
      const entry = await prepData(ctx, input)
      if(entry){
        const {genreID, authorIDs, ...data} = entry
        await ctx.prisma.book.create({
          data: {
            ...data,
            author:{
              connect:authorIDs
            },
            genre:{
              connect: {id: genreID}
            }
          }
        })
      }
    }
    catch(error){
      throw("Book cannot be created")
    }
  }),

  editBook: publicProcedure.input(zBook)
  .mutation(async ({ctx, input}) => {
    try{
      const entry = await prepData(ctx, input)
      if(entry){
        const {genreID, authorIDs, ...data} = entry
        await ctx.prisma.book.update({
          where: {
            isbn:entry.isbn
          },
          data:{
            ...data,
            author:{
              set:authorIDs
            },
            genre:{
              connect:{id: genreID}
            }
          }
        })
      }
    }
    catch(error){
      throw("Book cannot be modified")
    }
  }),
  
  deleteBookByISBN: publicProcedure.input(
    z.string()
  )
  .mutation(async ({ctx, input}) => {
    try{
      await deleteBook(ctx, input)
    }
    catch(error){
      throw("Cannot delete book")
    }
  })

})

const deleteBook = async (ctx: context, isbn:string) =>{
  await ctx.prisma.book.delete({
    where:{
      isbn:isbn
    }
  })
}

const prepData = async (ctx: context, input: completeBook) => {
  const ids = await getAuthorIDs(ctx, input.author)
  const entry = await convertGenreFieldToID(ctx, input)
  
  if(entry) return {...entry, authorIDs: ids}
}
const findIndividualAuthor = async(ctx: context, author: string) =>{
  return await ctx.prisma.author.findFirst({
    where:{
      name:author 
    }
  });
}

const createAuthor = async(ctx: context, author: string) =>{
  await ctx.prisma.author.create({
    data:{
      name: author
    }
  })
}

const getAuthorIDs = async (ctx: context, authors:string[]) => {
  const authorIDs: id[] = [] 
  for (const individualAuthor of authors){
    try{
      const auth = await findIndividualAuthor(ctx, individualAuthor)
      if(auth){        
        authorIDs.push({id:auth.id})
      }
      else{
        await createAuthor(ctx, individualAuthor)
        const newAuth = await findIndividualAuthor(ctx, individualAuthor)
        if(newAuth){
          authorIDs.push({id:newAuth.id})
        } 
      }
    }
    catch(error){
      throw("author is not valid")
    }
  }
  return authorIDs
}


const convertGenreFieldToID = async (ctx: context, input: completeBook) =>{
  const {genre, ...data}= input
  try{
    if(genre){
      const genreObj = await ctx.prisma.genre.findFirst({
        where:{
          name:genre 
        }
      });
      if(genreObj){
        const id = genreObj.id
        const book: databaseBook = {...data, genreID: id}
        return book
      }
    }
  }
  catch(error){
    throw("genre Error")
  }
}

