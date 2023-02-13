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
import FilterModal from './FilterModal';
import GenreTableRow from './TableComponents/GenreTableRow';
import FilterableColumnHeading from './TableComponents/FilterableColumnHeading';
import Table from "./TableComponents/Table"

export default function Records() {
  const BOOKS_PER_PAGE = 5
  const GENRES_PER_PAGE = 5
  const [isbns, setIsbns] = useState<string[]>([])
  const bookInfo = api.books.findBooks.useQuery(isbns).data
  const [displayBookEntries, setDisplayBookEntries] = useState(false)
  const [displayBookEdit, setDisplayBookEdit] = useState(false)
  const [pageNumber, setPageNumber] = useState(0)
  const [sortField, setSortField] = useState("title")
  const labels = [ "title", "isbn", "author", "publisher", "genre"]
  const [headers, setHeaders] = useState([ ["Title", "title"], ["ISBN", "isbn"], ["Author(s)", "author"], ["Price", "price"], ["Genre", "genre"]])


  const [sortOrder, setSortOrder] = useState("asc")
  const [filters, setFilters] = useState({isbn:"", title:"", author:"", publisher:"", genre:""})
  const numberOfPages = Math.ceil(api.books.getNumberOfBooks.useQuery({filters:filters}).data / BOOKS_PER_PAGE)
  const  books = api.books.getAllInternalBooks.useQuery({pageNumber:pageNumber, booksPerPage:BOOKS_PER_PAGE, sortBy:sortField, descOrAsc:sortOrder, filters:filters}).data

  const [genreHeaders, setGenreHeaders] = useState([ ["Name", "name"], ["Inventory", "name"]])
  const [genreSortOrder, setGenreSortOrder] = useState("asc")
  const [genrePageNumber, setGenrePageNumber] = useState(0)
  const [genreSortField, setGenreSortField] = useState("name")
  const numberOfGenrePages = Math.ceil(api.genre.getNumberOfGenres.useQuery().data / GENRES_PER_PAGE)
  const  genres:Genre[] = api.genre.getGenres.useQuery({genrePageNumber:genrePageNumber, genresPerPage:GENRES_PER_PAGE, genreSortBy:genreSortField, genreDescOrAsc:genreSortOrder}).data
  
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
  function setGenreFilter(genre: string){
    setFilters({isbn:"", title:"", author:"", publisher:"", genre:genre})
    setPageNumber(0)
  }

  function renderBookRow(items:any[]){
    return(items ? items.map((book: Book & { genre: Genre; author: Author[]; }) => (
       <BookTableRow onEdit={handleBookEdit} bookInfo={book}></BookTableRow>
  )) : null)
  }

  function renderGenreRow(items:any[]){
    return (genres ? genres.map((genre: Genre) => (
      <GenreTableRow setGenreFilter={setGenreFilter} genre={genre}></GenreTableRow>
  )) : null)
  }

  function renderBookEntries() {
    return <>
      <div>
        {displayBookEntries ? (bookInfo ? (
          <CreateBookEntries submitText="Save book" closeStateFunction={setDisplayBookEntries}> 
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
        <div className="mb-8">
          <TableDetails tableName="Inventory"
                        tableDescription="A list of all the books in inventory.">
            <FilterModal resetPageNumber={setPageNumber} filterBooks={setFilters} buttonText="Filter/Search" submitText="Add Filters"></FilterModal>
            <AddBookModal showBookEdit={handleISBNSubmit} buttonText="Add Book"
                          submitText="Add Book(s)"></AddBookModal>
          </TableDetails>
          <Table sorting = {{setOrder:setSortOrder, setField:setSortField, currentOrder:sortOrder, currentField:sortField}} 
            setPage= {setPageNumber} 
            setFilters= {setFilters}
            headers={headers}
            items= {books}
            filters={filters}
            headersNotFiltered={["price"]}
            pageNumber={pageNumber}
            numberOfPages={numberOfPages}
            renderRow={renderBookRow}
        ></Table>
          <div>
            {renderBookEntries()}
            {renderBookEdit()}
          </div>
        </div>
        <div className="my-8">
          <TableDetails tableName="Genres" tableDescription="A list of all the genres.">
            <AddGenreModal buttonText="Add Genre" submitText="Add Genre"></AddGenreModal>
          </TableDetails>
          <Table sorting = {{setOrder:setGenreSortOrder, setField:setGenreSortField, currentOrder:genreSortOrder, currentField:genreSortField}} 
            setPage= {setGenrePageNumber} 
            headers={genreHeaders}
            items= {genres}
            pageNumber={genrePageNumber}
            numberOfPages={numberOfGenrePages}
            renderRow={renderGenreRow}></Table>   
        </div>
      </div>

  )
}
