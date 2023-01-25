import {z} from "zod"
import { createTRPCRouter, publicProcedure } from "../trpc";
import { rawGoogleOutput, googleBookInfo, book } from "../../../types/bookTypes";

const fetchBook = async (isbn: string) => {
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
  const bookInfo: book = {
    isbn: isbn,
    title: input.title,
    publisher: input.publisher,
    author: input.authors,
    publicationYear: input.publishedDate,
    dimensions: input.dimensions,
    pageCount: input.pageCount,
    genre:input. mainCategory,
    retailPrice: input.saleInfo?.retailPrice.amount
  }
  return bookInfo
} 

export const googleBooksRouter = createTRPCRouter({
  getBookFromISBN: publicProcedure.input(
    z.string()
  )
  .query(async ({ctx,input}) => {
      try {
        return(fetchBook(input))
      }catch(error){
        console.log("ISBN Error", error);
      }
  })
})