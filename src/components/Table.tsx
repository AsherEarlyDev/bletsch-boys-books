import { useState } from 'react';
import { api } from "../utils/api";
import AddBookModal from "./AddBookModal";
import AddGenreModal from "./AddGenreModal";
import BookCard from './BookCard';
import TableDetails from "./TableComponents/TableDetails";
import SortedFilterableColumnHeading from "./TableComponents/SortedFilterableColumnHeading";
import TableHeader from "./TableComponents/TableHeader";
import CreateBookEntries from "./CreateBookEntries";
import BookTableRow from "./TableComponents/BookTableRow";
import { Dialog } from '@headlessui/react'
import HeadingPanel from './BasicComponents/HeadingPanel';
import { editableBook } from '../types/bookTypes';
import { Book, Genre, Author } from '@prisma/client';
import GenreTableRow from './TableComponents/GenreTableRow';

export default function Table() {
  const BOOKS_PER_PAGE = 5
  const GENRES_PER_PAGE = 5
  const [isbns, setIsbns] = useState<string[]>([])
  const bookInfo = api.books.findBooks.useQuery(isbns).data
  console.log("BookInfo: "+bookInfo)
  const [displayBookEntries, setDisplayBookEntries] = useState(false)
  const [displayBookEdit, setDisplayBookEdit] = useState(false)
  const [pageNumber, setPageNumber] = useState(0)
  const [sortField, setSortField] = useState("title")
  const numberOfPages = Math.ceil(api.books.getNumberOfBooks.useQuery().data / BOOKS_PER_PAGE)
  const  books = api.books.getAllInternalBooks.useQuery({pageNumber:pageNumber, booksPerPage:BOOKS_PER_PAGE, sortBy:sortField, descOrAsc:"asc"}).data

  const [genrePageNumber, setGenrePageNumber] = useState(0)
  const [genreSortField, setGenreSortField] = useState("name")
  const numberOfGenrePages = Math.ceil(api.genre.getNumberOfGenres.useQuery().data / BOOKS_PER_PAGE)
  const  genres = api.genre.getGenres.useQuery({genrePageNumber:genrePageNumber, genresPerPage:GENRES_PER_PAGE, genreSortBy:genreSortField, genreDescOrAsc:"asc"}).data
  
  const handleISBNSubmit = async (isbns:string[]) => {
    setIsbns(isbns)
    if (bookInfo) {
      setDisplayBookEntries(true);
    }
  }

  const handleBookEdit = async (isbn:string) => {
    setIsbns([isbn])
    if(bookInfo){
      setDisplayBookEdit(true)
    }
  }

  function renderBookEntries() {
    return <>
      <div>
        {displayBookEntries ? (bookInfo ? (
          <CreateBookEntries submitText="Save book" closeStateFunction={setDisplayBookEdit}> 
            {bookInfo.externalBooks.length > 0 ? 
            <div><HeadingPanel displayText="New Books"></HeadingPanel>
             {bookInfo.externalBooks.map((book: editableBook) => (
              <BookCard cardType="entry" bookInfo={book}></BookCard>))}</div>: null}
            {bookInfo.internalBooks.length > 0 ? 
            <div><HeadingPanel displayText="Existing Books"></HeadingPanel>
             {bookInfo.internalBooks.map((book: editableBook) => (
              <BookCard cardType="edit" bookInfo={book}></BookCard>))}</div>: null}
            {(bookInfo.absentBooks.length > 0 ? 
            <center><Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div className="text-center">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  The following books could not be found: {bookInfo.absentBooks.join(", ")}
                </Dialog.Title>
              </div>
            </Dialog.Panel></center> : null)}
          </CreateBookEntries>) : null ): null}
      </div>
    </>;
  }

  function renderBookEdit() {
    console.log(bookInfo)
    return <>
      {displayBookEdit ? (bookInfo ? (
          <CreateBookEntries submitText="Edit book" closeStateFunction={setDisplayBookEdit}> {bookInfo.internalBooks.map((book: editableBook) => (
              <BookCard cardType="edit" bookInfo={book}></BookCard>))}</CreateBookEntries>) : null) : null}
    </>;
  }

  return (
      <div className="px-4 sm:px-6 lg:px-8">
        <TableDetails tableName="Inventory"
                      tableDescription="A list of all the books in inventory.">
          <AddBookModal showBookEdit={handleISBNSubmit} buttonText="Add Book"
                        submitText="Add Book(s)"></AddBookModal>
        </TableDetails>
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div
                  className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300 table-auto">
                  <TableHeader>
                    <SortedFilterableColumnHeading sortFields={setSortField} label="Title"
                                             firstEntry={true} databaseLabel="title"></SortedFilterableColumnHeading>
                    <SortedFilterableColumnHeading sortFields={setSortField} label="ISBN" databaseLabel="isbn"></SortedFilterableColumnHeading>
                    <SortedFilterableColumnHeading sortFields={setSortField} label="Author(s)" databaseLabel="author"></SortedFilterableColumnHeading>
                    <SortedFilterableColumnHeading sortFields={setSortField} label="Price" databaseLabel="retailPrice"></SortedFilterableColumnHeading>
                    <SortedFilterableColumnHeading sortFields={setSortField} label="Genre" databaseLabel="genre"></SortedFilterableColumnHeading>
                    <SortedFilterableColumnHeading sortFields={setSortField} label="Inventory" databaseLabel="inventory"></SortedFilterableColumnHeading>
                  </TableHeader>
                  <tbody className="divide-y divide-gray-200 bg-white">
                  {books ? books.map((book: Book & { genre: Genre; author: Author[]; }) => (
                      <BookTableRow onEdit={handleBookEdit} bookInfo={book}></BookTableRow>
                  )) : null}
                  </tbody>
                </table>
                <center><button style={{padding:"10px"}} onClick={()=>setPageNumber(pageNumber-1)} disabled ={pageNumber===0} className="text-indigo-600 hover:text-indigo-900">
                  Previous     
                </button>
                <button style={{padding:"10px"}} onClick={()=>setPageNumber(pageNumber+1)} disabled={pageNumber===numberOfPages-1} className="text-indigo-600 hover:text-indigo-900">
                  Next
                </button></center>
              </div>
            </div>
          </div>
        </div>
        <div>
          {renderBookEntries()}
          {renderBookEdit()}
        </div>
        <div className="px-4 sm:px-6 lg:px-8">
        <TableDetails tableName="Genres"
                      tableDescription="A list of all the genres.">
          <AddGenreModal buttonText="Add Genre"
                        submitText="Add Genre"></AddGenreModal>
        </TableDetails>
        </div>
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div
                  className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300 table-auto">
                  <TableHeader>
                    <SortedFilterableColumnHeading sortFields={setGenreSortField} label="Name"
                                             firstEntry={true} databaseLabel="name"></SortedFilterableColumnHeading>
                  </TableHeader>
                  <tbody className="divide-y divide-gray-200 bg-white">
                  {genres ? genres.map((genre: Genre) => (
                       <GenreTableRow onEdit={handleBookEdit} genre={genre}></GenreTableRow>
                  )) : null}
                  </tbody>
                </table>
                <center><button style={{padding:"10px"}} onClick={()=>setGenrePageNumber(genrePageNumber-1)} disabled ={genrePageNumber===0} className="text-indigo-600 hover:text-indigo-900">
                  Previous     
                </button>
                <button style={{padding:"10px"}} onClick={()=>setGenrePageNumber(genrePageNumber+1)} disabled={genrePageNumber===numberOfGenrePages-1} className="text-indigo-600 hover:text-indigo-900">
                  Next
                </button></center>
              </div>
            </div>
          </div>
        </div>
      </div>

  )
}
