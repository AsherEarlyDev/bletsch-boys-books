import {number, z} from "zod"
import { createTRPCRouter, publicProcedure } from "../trpc";
import { rawGoogleOutput, googleBookInfo, editableBook as editableBook, completeBook, id, databaseBook } from "../../../types/bookTypes";
import { Author, Book, Genre, Prisma, PrismaClient } from "@prisma/client";
import { Session } from "next-auth/core/types";

type context = {
  session: Session | null;
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>;
}
const DEFAULT_EMPTY_STRING_FIELD_VALUE = ""
const DEFAULT_EMPTY_NUMBER_FIELD_VALUE = 0

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
  const bookInfo: editableBook = {
    isbn: isbn,
    title: input.title,
    publisher: input.publisher,
    author: input.authors,
    publicationYear: (new Date(input.publishedDate)).getFullYear(),
    dimensions: input.dimensions ? [Number(input.dimensions?.width), Number(input.dimensions?.thickness), Number(input.dimensions?.height)] : [],
    pageCount: input.pageCount,
    genre:input. mainCategory,
    retailPrice: input.saleInfo?.retailPrice.amount,
    inventory: 0,
    authorNames:input.authors.join(", ")
  }
  return bookInfo
} 

const transformDatabaseBook = (book: Book & { author: Author[]; genre: Genre; }) =>{
  const bookInfo: editableBook = {
    isbn: book.isbn,
    title: book.title,
    publisher: book.publisher,
    author: book.author.map((author)=> author.name),
    publicationYear: book.publicationYear,
    dimensions: book.dimensions,
    pageCount: book.pageCount,
    genre:book.genre.name,
    retailPrice: book.retailPrice,
    inventory: book.inventory,
    authorNames: book.authorNames
  }
  return bookInfo
}

const getBookIfExists = async (ctx:context, isbn:string) =>{
  try{
    return await ctx.prisma.book.findUnique({
      where:{
        isbn: isbn
      },
      include:{
        author:true,
        genre:true
      }
    })
  }
  catch(error){
    return null
  }
}

export const BooksRouter = createTRPCRouter({
  findBooks: publicProcedure.input(
    z.array(z.string())
  ).query(async ({ctx, input}) => {
    const absentBooks:string[] = []
    const internalBooks: any[] | PromiseLike<any[]> = []
    const externalBooks: editableBook[] = []
    for(const isbn of input){
      try{
        var book = await getBookIfExists(ctx, isbn)
        if(book) internalBooks.push(transformDatabaseBook(book))
        else{
          const externalBook = await fetchBookFromExternal(isbn)
          if(externalBook) externalBooks.push(externalBook)
        }
      }
      catch{
        absentBooks.push(isbn)
      }
    }
    return({
      internalBooks: internalBooks,
      externalBooks: externalBooks,
      absentBooks: absentBooks
    })
  }),

    findInternalBook: publicProcedure.input(
      z.object({
        isbn: z.string()
      })
    ).query(async ({ctx, input}) => {
        try{
          let book = await getBookIfExists(ctx, input.isbn)
          if(book) return transformDatabaseBook(book)
        }
        catch{
          console.log("error")
        }
    }),

  getAllInternalBooks: publicProcedure
  .input(z.optional(z.object({
    pageNumber: z.number(),
    booksPerPage: z.number(),
    sortBy: z.string(),
    descOrAsc: z.string(),
    filters: z.object({
      title: z.string(),
      isbn: z.string(),
      publisher: z.string(),
      genre: z.string(),
      authorNames: z.string()
    })
  })))
  .query(async ({ctx, input}) => {
    if(input){
      return await ctx.prisma.book.findMany({
        take: input.booksPerPage,
        skip: input.pageNumber*input.booksPerPage,
        include:{
          author:true,
          genre:true
        },
        orderBy: input.sortBy==="genre" ? {
          genre:{
            name: input.descOrAsc
          }
        } :  [
          {
            [input.sortBy]: input.descOrAsc,
          }
        ],
        where:{
          title:{
            contains: input.filters.title,
            mode: 'insensitive'
          },
          authorNames:{
            contains: input.filters.authorNames,
            mode: 'insensitive'
          },
          
          publisher:{
            contains: input.filters.publisher,
            mode: 'insensitive'
          },
          genre:{
            name:{
              contains: input.filters.genre,
              mode: 'insensitive'
            }
          },
          isbn:{
            contains: input.filters.isbn,
            mode: 'insensitive'
          }

        }
      
      })
    }
    else{
      return await ctx.prisma.book.findMany({
        include:{
          author:true,
          genre:true
        }
      })
    }
  }),

  getAllInternalBooksNoPagination: publicProcedure
  .input(z.optional(z.object({
    sortBy: z.string(),
    descOrAsc: z.string(),
    filters: z.object({
      title: z.string(),
      isbn: z.string(),
      publisher: z.string(),
      genre: z.string(),
      authorNames: z.string()
    })
  })))
  .query(async ({ctx, input}) => {
    if(input){
      return await ctx.prisma.book.findMany({
        include:{
          author:true,
          genre:true
        },
        orderBy: input.sortBy==="genre" ? {
          genre:{
            name: input.descOrAsc
          }
        } :  [
          {
            [input.sortBy]: input.descOrAsc,
          }
        ],
        where:{
          title:{
            contains: input.filters.title,
            mode: 'insensitive'
          },
          authorNames:{
            contains: input.filters.authorNames,
            mode: 'insensitive'
          },
          
          publisher:{
            contains: input.filters.publisher,
            mode: 'insensitive'
          },
          genre:{
            name:{
              contains: input.filters.genre,
              mode: 'insensitive'
            }
          },
          isbn:{
            contains: input.filters.isbn,
            mode: 'insensitive'
          }
        }
      })
    }
    else{
      return await ctx.prisma.book.findMany({
        include:{
          author:true,
          genre:true
        }
      })
    }
  }),

  getNumberOfBooks:publicProcedure
  .input(z.object({
    filters: z.object({
      title: z.string(),
      isbn: z.string(),
      publisher: z.string(),
      genre: z.string(),
      authorNames: z.string()
    })
  }))
  .query(async ({ctx, input}) => {
    return await ctx.prisma.book.count({
      where:{
        title:{
          contains: input.filters.title,
          mode: 'insensitive'
        },
        authorNames:{
          contains: input.filters.authorNames,
          mode: 'insensitive'
        },
        
        publisher:{
          contains: input.filters.publisher,
          mode: 'insensitive'
        },
        genre:{
          name:{
            contains: input.filters.genre,
            mode: 'insensitive'
          }
        },
        isbn:{
          contains: input.filters.isbn,
          mode: 'insensitive'
        }

      }
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
            isbn: data.isbn,
            title: data.title ?? DEFAULT_EMPTY_STRING_FIELD_VALUE,
            publisher: data.publisher ?? DEFAULT_EMPTY_STRING_FIELD_VALUE,
            publicationYear: data.publicationYear ?? DEFAULT_EMPTY_NUMBER_FIELD_VALUE,
            dimensions: data.dimensions,
            pageCount: data.pageCount,
            retailPrice: data.retailPrice,
            authorNames: data.author.join(", "),
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

const prepData = async (ctx: context, input: any) => {
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

