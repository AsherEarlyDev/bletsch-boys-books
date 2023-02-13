import { useState } from 'react';
import { api } from "../../../utils/api";
import AddBookModal from "../Modals/BookModals/AddBookModal";
import BookCard from '../../BookCard';
import TableDetails from "../TableDetails";
import SortedFilterableColumnHeading from "../TableColumnHeadings/SortedFilterableColumnHeading";
import TableHeader from "../TableHeader";
import CreateBookEntries from "../../CreateBookEntries";
import BookTableRow from "../TableRows/BookTableRow";
import { Dialog } from '@headlessui/react'
import HeadingPanel from '../../BasicComponents/HeadingPanel';
import { editableBook } from '../../../types/bookTypes';
import { Book, Genre, Author } from '@prisma/client';
import FilterModal from '../../FilterModal';
import CreateEntries from "../../CreateEntries";
import DeleteBookModal from "../Modals/BookModals/DeleteBookModal";
import EditBookModal from "../Modals/BookModals/EditBookModal";
import ViewBookModal from "../Modals/BookModals/ViewBookModal";
import ColumnHeading from "../TableColumnHeadings/ColumnHeading";
export default function BookTable() {
  const BOOKS_PER_PAGE = 5
  const [currentIsbns, setCurrentIsbns] = useState<string[]>([])
  const [displayNewBookEntriesView, setDisplayNewBookEntriesView] = useState(false)
  const [displayEditBookView, setDisplayEditBookView] = useState(false)
  const [displayBookView, setDisplayBookView] = useState(false)
  const [displayDeleteBookView, setDisplayDeleteBookView] = useState(false)
  const [pageNumber, setPageNumber] = useState(0)
  const [sortField, setSortField] = useState("title")
  const [sortOrder, setSortOrder] = useState("asc")
  const [filters, setFilters] = useState({isbn:"", title:"", author:"", publisher:"", genre:""})
  const numberOfPages = Math.ceil(api.books.getNumberOfBooks.useQuery({filters:filters}).data / BOOKS_PER_PAGE)
  const bookInfo = api.books.findBooks.useQuery(currentIsbns).data
  const books = api.books.getAllInternalBooks.useQuery({pageNumber:pageNumber, booksPerPage:BOOKS_PER_PAGE, sortBy:sortField, descOrAsc:sortOrder, filters:filters}).data
  const handleNewBookSubmission = async (isbns:string[]) => {
    setCurrentIsbns(isbns)
    if (bookInfo) {
      setDisplayNewBookEntriesView(true);
    }
  }

  async function openEditBookView(isbn: string){
    if (books){
      for (const book of books){
        if (book.isbn === isbn){
          setCurrentIsbns([isbn])
        }
      }
      setDisplayEditBookView(true)
    }
  }
  function renderEditBookView() {
    return(
        <>
          {(displayEditBookView && bookInfo) ?
              <CreateEntries closeStateFunction={setDisplayEditBookView} submitText="Edit Book">
                <EditBookModal cardType="edit" bookInfo={bookInfo.internalBooks[0]} closeOut={closeEditBookView}></EditBookModal>
              </CreateEntries> : null}
        </>
    )
  }
  function closeEditBookView(){
    setDisplayEditBookView(false)
  }

  async function openDeleteBookView(isbn: string){
    if (books){
      for (const book of books){
        if (book.isbn === isbn){
          setCurrentIsbns([isbn])
        }
      }
      setDisplayDeleteBookView(true)
    }
  }
  function renderDeleteBookView() {
    return(
        <>
          {(displayDeleteBookView && bookInfo) ?
              <CreateEntries closeStateFunction={setDisplayDeleteBookView} submitText="Delete Book">
                <DeleteBookModal bookInfo={bookInfo.internalBooks[0]} closeOut={closeDeleteBookView}></DeleteBookModal>
              </CreateEntries> : null}
        </>
    )
  }
  function closeDeleteBookView(){
    setDisplayDeleteBookView(false)
  }

  async function openBookView(isbn: string){
    if (books){
      for (const book of books){
        if (book.isbn === isbn){
          setCurrentIsbns([isbn])
        }
      }
      setDisplayBookView(true)
    }
  }
  function renderBookView() {
    return(
        <>
          {(displayBookView && bookInfo) ?
              <CreateEntries closeStateFunction={setDisplayBookView} submitText="Edit Book">
                <ViewBookModal bookInfo={bookInfo.internalBooks[0]} closeOut={closeBookView} openEdit={openEditBookView}></ViewBookModal>
              </CreateEntries> : null}
        </>
    )
  }
  function closeBookView(){
    setDisplayBookView(false)
  }

  function renderBookEntries() {
    return <>
      <div>
        {displayNewBookEntriesView ? (bookInfo ? (
          <CreateBookEntries submitText="Save book" closeStateFunction={setDisplayNewBookEntriesView}>
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

  return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <TableDetails tableName="Inventory"
                        tableDescription="A list of all the books in inventory.">
            <FilterModal resetPageNumber={setPageNumber} filterBooks={setFilters} buttonText="Filter" submitText="Add Filters"></FilterModal>
            <AddBookModal showBookEdit={handleNewBookSubmission} buttonText="Add Book" submitText="Add Book(s)"></AddBookModal>
          </TableDetails>
          <div className="mt-8 flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div
                    className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300 table-auto">
                    <TableHeader>
                      <SortedFilterableColumnHeading resetPage={setPageNumber} setOrder={setSortOrder} currentOrder={sortOrder} currentField={sortField} sortFields={setSortField} label="Title" firstEntry={true} databaseLabel="title"></SortedFilterableColumnHeading>
                      <SortedFilterableColumnHeading resetPage={setPageNumber} setOrder={setSortOrder} currentOrder={sortOrder} currentField={sortField} sortFields={setSortField} label="ISBN" databaseLabel="isbn"></SortedFilterableColumnHeading>
                      <SortedFilterableColumnHeading resetPage={setPageNumber} setOrder={setSortOrder} currentOrder={sortOrder} currentField={sortField} sortFields={setSortField} label="Author(s)" databaseLabel="authorNames"></SortedFilterableColumnHeading>
                      <SortedFilterableColumnHeading resetPage={setPageNumber} setOrder={setSortOrder} currentOrder={sortOrder} currentField={sortField} sortFields={setSortField} label="Price" databaseLabel="retailPrice"></SortedFilterableColumnHeading>
                      <SortedFilterableColumnHeading resetPage={setPageNumber} setOrder={setSortOrder} currentOrder={sortOrder} currentField={sortField} sortFields={setSortField} label="Genre" databaseLabel="genre"></SortedFilterableColumnHeading>
                      <SortedFilterableColumnHeading resetPage={setPageNumber} setOrder={setSortOrder} currentOrder={sortOrder} currentField={sortField} sortFields={setSortField} label="Inventory" databaseLabel="inventory"></SortedFilterableColumnHeading>
                      <ColumnHeading label="Edit"></ColumnHeading>
                      <ColumnHeading label="Delete"></ColumnHeading>
                    </TableHeader>
                    <tbody className="divide-y divide-gray-200 bg-white">
                    {books ? books.map((book: Book & { genre: Genre; author: Author[]; }) => (
                        <BookTableRow onEdit={openEditBookView} onDelete={openDeleteBookView} onView={openBookView} bookInfo={book}></BookTableRow>
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
            {/*{renderBookEntries()}*/}
            {renderEditBookView()}
            {renderDeleteBookView()}
            {renderBookView()}
          </div>
        </div>
      </div>

  )
}
