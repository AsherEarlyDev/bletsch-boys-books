import {number, z} from "zod"
import {createTRPCRouter, publicProcedure, protectedProcedure} from "../trpc";
import {
  rawGoogleOutput,
  googleBookInfo,
  editableBook as editableBook,
  completeBook,
  id,
  databaseBook
} from "../../../types/bookTypes";
import {Author, Book, Genre, Prisma, PrismaClient} from "@prisma/client";
import {Session} from "next-auth/core/types";
import {TRPCError} from "@trpc/server";
import cloudinary from "cloudinary"
import convertISBN10ToISBN13 from "../HelperFunctions/convertISBN";

type context = {
  session: Session | null;
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>;
}
const DEFAULT_EMPTY_STRING_FIELD_VALUE = ""
const DEFAULT_EMPTY_NUMBER_FIELD_VALUE = 0
export const DEFAULT_THICKNESS_IN_CENTIMETERS = .8

const zBook = z.object({
  isbn: z.string(),
  isbn10:z.optional(z.string()),
  title: z.string(),
  publisher: z.string(),
  author: z.array(z.string()),
  publicationYear: z.number(),
  dimensions: z.array(z.number()),
  pageCount: z.optional(z.number()),
  genre: z.string(),
  retailPrice: z.number(),
  shelfSpace: z.number(),
  inventory: z.number(),
  imageLink: z.optional(z.string())
})

const fetchBookFromExternal = async (isbn: string, ctx:context) => {
    const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${process.env.SECRET_KEY_GOOGLE_API}`);
    const data:rawGoogleOutput = await res.json();
    const book: googleBookInfo | undefined = data.items[0]?.volumeInfo
    if (book != undefined){
      return await transformRawBook(book, isbn, ctx);
    }
    else{
      throw console.error("Book Not Found");
    } 
}

const transformRawBook = async (input:googleBookInfo, isbn:string, ctx:context) =>{
  const googleImageUrl = input.imageLinks.thumbnail
  const relatedBooks = await findRelatedBooks(input.title, isbn, ctx)
  const bookInfo = (cloudinary.v2.uploader.unsigned_upload(googleImageUrl, "book-image-preset").then(result=> {
    if (result) {
      const bookInfo: editableBook = {
        isbn: convertISBN10ToISBN13(isbn),
        isbn10:(input.industryIdentifiers.filter((data) =>data.type==="ISBN_10"))[0].identifier ?? null,
        title: input.title,
        publisher: input.publisher,
        author: input.authors,
        publicationYear: (new Date(input.publishedDate)).getFullYear(),
        dimensions: input.dimensions ? [Number(input.dimensions?.width), Number(input.dimensions?.thickness), Number(input.dimensions?.height)] : [],
        pageCount: input.pageCount,
        genre: input.mainCategory,
        retailPrice: input.saleInfo?.retailPrice.amount,
        inventory: 0,
        authorNames: input.authors.join(", "),
        imageLink: result.secure_url,
        lastMonthSales:0,
        shelfSpace:0,
        daysOfSupply:Infinity,
        bestBuybackPrice:0,
        numberRelatedBooks: relatedBooks.length,
        relatedBooks: relatedBooks
      }
      return bookInfo
    } else {
      const bookInfo: editableBook = {
        isbn: isbn,
        isbn10:(input.industryIdentifiers.filter((data) =>data.type==="ISBN_10"))[0].identifier ?? null,
        title: input.title,
        publisher: input.publisher,
        author: input.authors,
        publicationYear: (new Date(input.publishedDate)).getFullYear(),
        dimensions: input.dimensions ? [Number(input.dimensions?.width), Number(input.dimensions?.thickness), Number(input.dimensions?.height)] : [],
        pageCount: input.pageCount,
        genre: input.mainCategory,
        retailPrice: input.saleInfo?.retailPrice.amount,
        inventory: 0,
        authorNames: input.authors.join(", "),
        imageLink: "",
        lastMonthSales:0,
        shelfSpace:0,
        daysOfSupply:Infinity,
        bestBuybackPrice:0,
        numberRelatedBooks: relatedBooks.length,
        relatedBooks: relatedBooks
      }
      return bookInfo
    }
  }))
  return bookInfo
}

const transformDatabaseBook = async (book: Book & { author: Author[]; genre: Genre; }, ctx: context) => {
  const lastMonthSales = await getLastMonthSales(book.isbn, ctx)
  const relatedBooks = (await findRelatedBooks(book.title, book.isbn, ctx))
  const bookInfo: editableBook = {
    isbn: book.isbn,
    isbn10: book.isbn10 ?? undefined,
    title: book.title,
    publisher: book.publisher,
    author: book.author.map((author) => author.name),
    publicationYear: book.publicationYear,
    dimensions: book.dimensions,
    pageCount: book.pageCount,
    genre: book.genre.name,
    retailPrice: book.retailPrice,
    inventory: book.inventory,
    authorNames: book.authorNames,
    lastMonthSales: lastMonthSales,
    shelfSpace: book.shelfSpace,
    daysOfSupply: lastMonthSales == 0 ? Infinity : book.inventory / (await getLastMonthSales(book.isbn, ctx)) * 30,
    bestBuybackPrice: await getBestBuybackRate(book.isbn, ctx),
    imageLink: book.imageLink,
    numberRelatedBooks: relatedBooks.length,
    relatedBooks: relatedBooks

  }
  return bookInfo
}

const getBookIfExists = async (ctx: context, isbn: string) => {
  try {
    return await ctx.prisma.book.findUnique({
      where: {
        isbn: isbn
      },
      include: {
        author: true,
        genre: true
      }
    })
  } catch (error) {
    return null
  }
}

export const booksRouter = createTRPCRouter({
  findBooks: publicProcedure
  .input(z.array(z.string()))
  .query(async ({ctx, input}) => {
    const user = ctx.session.user
    const absentBooks: string[] = []
    const internalBooks: any[] | PromiseLike<any[]> = []
    const externalBooks: editableBook[] = []
    for (const isbn of input) {
      try {
        var book = await getBookIfExists(ctx, isbn)
        if(book) internalBooks.push(await transformDatabaseBook(book, ctx))
        else{
          const externalBook = await fetchBookFromExternal(isbn, ctx)
          if(externalBook) externalBooks.push(externalBook)
        }
      } catch {
        absentBooks.push(isbn)
      }
    }
    return ({
      internalBooks: internalBooks,
      externalBooks: externalBooks,
      absentBooks: absentBooks
    })
  }),

  findInternalBook: publicProcedure
  .input(z.object({
    isbn: z.string()
  }))
  .query(async ({ctx, input}) => {
    try {
      let book = await getBookIfExists(ctx, input.isbn)
      if (book) return await transformDatabaseBook(book, ctx)
    } catch {
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
      if(input.sortBy === "lastMonthSales" || input.sortBy === "daysOfSupply" || input.sortBy === "bestBuybackPrice" || input.sortBy === "numberRelatedBooks" || input.sortBy === "shelfSpace") {
        return externalSort(input, ctx, true)
      }
      const books = await ctx.prisma.book.findMany({
        take: input.booksPerPage,
        skip: input.pageNumber * input.booksPerPage,
        include: {
          author: true,
          genre: true
        },
        orderBy: (input.sortBy === "genre" ? {
          genre: {
            name: input.descOrAsc
          }
        } : [
          {
            [input.sortBy]: input.descOrAsc,
          }
        ]),
        where: {
          title: {
            contains: input.filters.title,
            mode: 'insensitive'
          },
          authorNames: {
            contains: input.filters.authorNames,
            mode: 'insensitive'
          },

          publisher: {
            contains: input.filters.publisher,
            mode: 'insensitive'
          },
          genre: {
            name: {
              contains: input.filters.genre,
              mode: 'insensitive'
            }
          },
          isbn: {
            contains: input.filters.isbn,
            mode: 'insensitive'
          }
        }

      })
      const editedBooks = await addExtraBookFields(books, ctx)

      return editedBooks
    } else {
      return await ctx.prisma.book.findMany({
        include: {
          author: true,
          genre: true
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
      if(input.sortBy === "lastMonthSales" || input.sortBy === "daysOfSupply" || input.sortBy === "bestBuybackPrice" || input.sortBy === "numberRelatedBooks" || input.sortBy === "shelfSpace") {
        return externalSort(input, ctx, false)
      }
      const books = await ctx.prisma.book.findMany({
        include: {
          author: true,
          genre: true
        },
        orderBy: input.sortBy === "genre" ? {
          genre: {
            name: input.descOrAsc
          }
        } : [
          {
            [input.sortBy]: input.descOrAsc,
          }
        ],
        where: {
          title: {
            contains: input.filters.title,
            mode: 'insensitive'
          },
          authorNames: {
            contains: input.filters.authorNames,
            mode: 'insensitive'
          },

          publisher: {
            contains: input.filters.publisher,
            mode: 'insensitive'
          },
          genre: {
            name: {
              contains: input.filters.genre,
              mode: 'insensitive'
            }
          },
          isbn: {
            contains: input.filters.isbn,
            mode: 'insensitive'
          }
        }
      })
      const editedBooks = await addExtraBookFields(books, ctx)
      return editedBooks
    } else {
      return addExtraBookFields(await ctx.prisma.book.findMany({
        include: {
          author: true,
          genre: true
        }
      }), ctx)
    }
  }),

  getNumberOfBooks: publicProcedure
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
      where: {
        title: {
          contains: input.filters.title,
          mode: 'insensitive'
        },
        authorNames: {
          contains: input.filters.authorNames,
          mode: 'insensitive'
        },

        publisher: {
          contains: input.filters.publisher,
          mode: 'insensitive'
        },
        genre: {
          name: {
            contains: input.filters.genre,
            mode: 'insensitive'
          }
        },
        isbn: {
          contains: input.filters.isbn,
          mode: 'insensitive'
        }

      }
    })
  }),

  saveBook: protectedProcedure.input(zBook)
  .mutation(async ({ctx, input}) => {
    try {
      const entry = await prepData(ctx, input)
      if (entry) {
        const {genreID, authorIDs, ...data} = entry
        await ctx.prisma.book.create({
          data: {
            isbn: data.isbn,
            isbn10: data.isbn10 ?? undefined,
            title: data.title ?? DEFAULT_EMPTY_STRING_FIELD_VALUE,
            publisher: data.publisher ?? DEFAULT_EMPTY_STRING_FIELD_VALUE,
            publicationYear: data.publicationYear ?? DEFAULT_EMPTY_NUMBER_FIELD_VALUE,
            dimensions: data.dimensions,
            pageCount: data.pageCount,
            imageLink: data.imageLink,
            retailPrice: data.retailPrice,
            authorNames: data.author.join(", "),
            shelfSpace: data.inventory * (data.dimensions[1] ?? DEFAULT_THICKNESS_IN_CENTIMETERS),
            author: {
              connect: authorIDs
            },
            genre: {
              connect: {id: genreID}
            }
          }
        })
      }
    } catch (error) {
      throw("Book cannot be created")
    }
  }),

  editBook: protectedProcedure.input(zBook)
  .mutation(async ({ctx, input}) => {
    try {
      const entry = await prepData(ctx, input)
      if (entry) {
        const {genreID, authorIDs, ...data} = entry
        await ctx.prisma.book.update({
          where: {
            isbn: entry.isbn
          },
          data: {
            ...data,
            shelfSpace: data.inventory * (data.dimensions[1] ?? DEFAULT_THICKNESS_IN_CENTIMETERS),
            author: {
              set: authorIDs
            },
            genre: {
              connect: {id: genreID}
            }
          }
        })
      }
    } catch (error) {
      throw("Book cannot be modified")
    }
  }),

  findRelatedBooks:publicProcedure
  .input(z.object({
    title:z.string(),
    isbn:z.string(),
  }))
  .query(async({ctx, input}) => {
    return await findRelatedBooks(input.title, input.isbn, ctx)
  }),

  getBookTransactionDetails: publicProcedure.input(
      z.string()
  ).query(async({ctx, input}) => {
    try{
      const sales = await getSales(ctx, input)
      const purchases = await getPurchases(ctx, input)
      const buybacks = await getBookBuyback(ctx, input)
      const corrections = await getCorrections(ctx, input)
      return unifyTransactions(sales, purchases, buybacks, corrections)
    }
    catch(error){
      throw("Cannot get book transaction details")
    }
  }),

  deleteBookByISBN: protectedProcedure
  .input(z.string())
  .mutation(async ({ctx, input}) => {
    try {
      await deleteBook(ctx, input)
    } catch (error) {
      throw("Cannot delete book")
    }
  }),

  getBooksByVendorId: publicProcedure
  .input(z.object({
        vendorId: z.string()
      }))
  .query(async ({ctx, input}) => {
    try {
      const books = []
      const purchaseOrders = await ctx.prisma.purchaseOrder.findMany({
        where: {
          vendorId: input.vendorId
        }
      })
      for (const purchaseOrder of purchaseOrders) {
        const purchases = await ctx.prisma.purchase.findMany({
          where: {
            purchaseOrderId: purchaseOrder.id
          }
        })
        for (const purch of purchases) {
          const book = await ctx.prisma.book.findFirst({
            where: {
              isbn: purch.bookId
            }
          })
          books.push(book)
        }
      }
      return books
    } catch (error) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: error.message
      })
    }
  })})

const deleteBook = async (ctx: context, isbn: string) => {
  await ctx.prisma.book.delete({
    where: {
      isbn: isbn
    }
  })
}
const prepData = async (ctx: context, input: any) => {
  const ids = await getAuthorIDs(ctx, input.author)
  const entry = await convertGenreFieldToID(ctx, input)

  if (entry) return {...entry, authorIDs: ids}
}
const findIndividualAuthor = async (ctx: context, author: string) => {
  return await ctx.prisma.author.findFirst({
    where: {
      name: author
    }
  });
}
const createAuthor = async (ctx: context, author: string) => {
  await ctx.prisma.author.create({
    data: {
      name: author
    }
  })
}
const getAuthorIDs = async (ctx: context, authors: string[]) => {
  const authorIDs: id[] = []
  for (const individualAuthor of authors) {
    try {
      const auth = await findIndividualAuthor(ctx, individualAuthor)
      if (auth) {
        authorIDs.push({id: auth.id})
      } else {
        await createAuthor(ctx, individualAuthor)
        const newAuth = await findIndividualAuthor(ctx, individualAuthor)
        if (newAuth) {
          authorIDs.push({id: newAuth.id})
        }
      }
    } catch (error) {
      throw("author is not valid")
    }
  }
  return authorIDs
}
const externalSort = async (input, ctx: context, paginate?: boolean) => {
  const books = await ctx.prisma.book.findMany({
    include: {
      author: true,
      genre: true
    },
    where: {
      title: {
        contains: input.filters.title,
        mode: 'insensitive'
      },
      authorNames: {
        contains: input.filters.authorNames,
        mode: 'insensitive'
      },

      publisher: {
        contains: input.filters.publisher,
        mode: 'insensitive'
      },
      genre: {
        name: {
          contains: input.filters.genre,
          mode: 'insensitive'
        }
      },
      isbn: {
        contains: input.filters.isbn,
        mode: 'insensitive'
      }
    }
  })

  const editedBooks = await addExtraBookFields(books, ctx)
  const sorted = editedBooks.sort((a, b) => {
    if (input.descOrAsc === "asc") return a[input.sortBy] - b[input.sortBy]
    return b[input.sortBy] - a[input.sortBy]
  })
  return paginate ? sorted.slice((input.pageNumber * input.booksPerPage), (input.pageNumber * input.booksPerPage) + input.booksPerPage) : sorted

}
const convertGenreFieldToID = async (ctx: context, input: completeBook) => {
  const {genre, ...data} = input
  try {
    if (genre) {
      const genreObj = await ctx.prisma.genre.findFirst({
        where: {
          name: genre
        }
      });
      if (genreObj) {
        const id = genreObj.id
        const book: databaseBook = {...data, genreID: id}
        return book
      }
    }
  } catch (error) {
    throw("genre Error")
  }
}
const getLastMonthSales = async (isbn: string, ctx: context) => {

  const currentDate = new Date()
  var lastMonth = new Date()
  lastMonth.setDate(lastMonth.getDate() - 30)
  const salesRecs = await ctx.prisma.sale.findMany({
    where: {
      saleReconciliation: {
        date: {
          lte: currentDate,
          gte: lastMonth
        }
      },
      bookId: {
        contains: isbn
      }
    },
    select: {
      quantity: true,
      id: true

    }
  })
  var sum = 0
  for (const sale of salesRecs) {
    sum = sum + sale.quantity
  }
  return sum
}
async function getBestBuybackRate(isbn: string, ctx: context) {
  const purchases = await ctx.prisma.purchase.findMany({
    where: {
      bookId: isbn,
      purchaseOrder: {
        vendor: {
          bookBuybackPercentage: {
            gte: 0
          }
        }
      }
    },
    include: {
      purchaseOrder: {
        include: {
          vendor: true
        }
      }
    }
  })
  var highestBuyBack = 0
  for (const purchase of purchases) {
    const price = purchase.price * (purchase.purchaseOrder.vendor.bookBuybackPercentage)
    if (price > highestBuyBack) highestBuyBack = price
  }
  return highestBuyBack
}
async function addExtraBookFields(books: Book[], ctx: { session: Session; prisma: PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation>; }) {
  return await Promise.all(books.map(async (book) => {
    const lastMonthSales = await getLastMonthSales(book.isbn, ctx);
    const relatedBooks = await findRelatedBooks(book.title, book.isbn, ctx)
    return (
      {
        ...book,
        lastMonthSales: lastMonthSales,
        shelfSpace:book.inventory*(book.dimensions[1]? book.dimensions[1] : .8),
        daysOfSupply: lastMonthSales == 0 ? Infinity : book.inventory / (await getLastMonthSales(book.isbn, ctx)) * 30,
        bestBuybackPrice: await getBestBuybackRate(book.isbn, ctx),
        numberRelatedBooks: relatedBooks.length,
        relatedBooks: relatedBooks
      });
  })
  );
}
async function getPurchases(ctx: context, isbn: string) {
  const purchases = await ctx.prisma.purchase.findMany({
    where: {
      bookId: isbn
    },
    select: {
      id: true,
      quantity: true,
      price: true,
      purchaseOrder: {
        select:{
          date:true,
          vendor:true,
          userName:true,
          id:true
        }
      }
    }
  })
  return purchases.map((purchase) => ({
    ...purchase,
    type:"Purchase",
    inventory:0,
    userName: purchase.purchaseOrder.userName,
    date:(purchase.purchaseOrder.date.getMonth()+1)+"-"+(purchase.purchaseOrder.date.getDate())+"-"+purchase.purchaseOrder.date.getFullYear(),
  }))
}

async function getSales(ctx: context, isbn: string) {
  const sales = await ctx.prisma.sale.findMany({
    where: {
      bookId: isbn
    },
    select: {
      id: true,
      quantity: true,
      price: true,
      saleReconciliation: {
        select:{
          date:true,
          id:true
        }
      }
    }
  })
  return sales.map((sale) => ({
    ...sale,
    type:"Sale",
    inventory:0,
    quantity: (sale.quantity * -1),
    date:(sale.saleReconciliation.date.getMonth()+1)+"-"+(sale.saleReconciliation.date.getDate())+"-"+sale.saleReconciliation.date.getFullYear(),
  }))
}

async function getCorrections(ctx: context, isbn: string) {
  const corrections = await ctx.prisma.inventoryCorrection.findMany({
    where: {
      bookId: isbn
    },
    select: {
      id: true,
      date: true,
      adjustment: true,
      userName: true,
    }
  })
  return corrections.map((correction) => ({
    ...correction,
    quantity: correction.adjustment,
    date:(correction.date.getMonth()+1)+"-"+(correction.date.getDate())+"-"+correction.date.getFullYear(),
    type:"Correction",
    }))
}

async function getBookBuyback(ctx: context, isbn: string) {
  const bookBuybacks = await ctx.prisma.buyback.findMany({
    where: {
      bookId: isbn
    },
    select: {
      id: true,
      quantity: true,
      buybackPrice: true,
      BookBuybackOrder: {
        select:{
          date:true,
          vendor:true,
          userName:true,
          id:true
        }
      }
    }
  })
  return bookBuybacks.map((buyback) => ({
    ...buyback,
    type:"Buyback",
    quantity: (buyback.quantity * -1),
    userName: buyback.BookBuybackOrder.userName,
    inventory:0,
    date:(buyback.BookBuybackOrder.date.getMonth()+1)+"-"+(buyback.BookBuybackOrder.date.getDate())+"-"+buyback.BookBuybackOrder.date.getFullYear(),
  }))
}

function unifyTransactions(sales, purchases, buybacks, corrections){
  const rawList = [].concat(sales, purchases, buybacks, corrections)
  const sortedList = rawList.sort((a, b) => {
    return (new Date(a.date)< new Date(b.date)) ? 1 : -1
 })
 var runningTotal = 0;
 for (let i = sortedList.length-1; i >=0; i--){
  runningTotal+=sortedList[i].quantity
  sortedList[i].inventory=runningTotal
 }
 return sortedList
}

async function findRelatedBooks(input: string,isbn:string, ctx: { session: Session; prisma: PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation>; }) {
  const words = (input.split(' ')).join(" & ");
  const relatedBooks = await ctx.prisma.book.findMany({
    where: {
      title: {
        search: words
      }
    }
  });
  return relatedBooks.filter((relatedBook)=> relatedBook.isbn !== isbn);
}



function generateLastMonthDatesArray(){
  var dateArray=[]
  const lastMonth = new Date()
  lastMonth.setDate(lastMonth.getDate() - 30)
  for (var i = 0; i < 31; i++) {
    var date = new Date()
    date.setDate(lastMonth.getDate() + i)
    dateArray.push(date)
  }
  return dateArray
}
