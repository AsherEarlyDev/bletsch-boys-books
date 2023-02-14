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
import Table from './Table';
import NewBookEntryTable from "./NewBookEntryTable";
export default function BookTable() {
  const BOOKS_PER_PAGE = 20
  const SORTABLE_HEADERS = [ ["Title", "title"], ["ISBN", "isbn"], ["Author(s)", "authorNames"], ["Genre", "genre"], ["Price", "price"], ["Inventory", "inventory"]]
  const STATIC_HEADERS = ["Edit", "Delete"]
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
  const entryBookData = api.books.findBooks.useQuery(currentIsbns).data
  const books = api.books.getAllInternalBooks.useQuery({pageNumber:pageNumber, booksPerPage:BOOKS_PER_PAGE, sortBy:sortField, descOrAsc:sortOrder, filters:filters}).data

  async function openNewBookSubmissionsView(isbns:string[]){
    setCurrentIsbns(isbns)
    if (entryBookData) {
      setDisplayNewBookEntriesView(true);
    }
  }
  function renderNewBookEntriesView(){
    return(
        <>
          {(displayNewBookEntriesView && entryBookData) ?
              <CreateEntries closeStateFunction={setDisplayEditBookView} submitText="Save Books">
                <NewBookEntryTable closeOut={closeNewBookEntriesView} newBookEntries={entryBookData}></NewBookEntryTable>
              </CreateEntries> : null}
        </>
    )
  }
  function closeNewBookEntriesView(){
    setDisplayNewBookEntriesView(false)
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
          {(displayEditBookView && entryBookData) ?
              <CreateEntries closeStateFunction={setDisplayEditBookView} submitText="Edit Book">
                <EditBookModal cardType="edit" bookInfo={entryBookData.internalBooks[0]} closeOut={closeEditBookView}></EditBookModal>
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
          {(displayDeleteBookView && entryBookData) ?
              <CreateEntries closeStateFunction={setDisplayDeleteBookView} submitText="Delete Book">
                <DeleteBookModal bookInfo={entryBookData.internalBooks[0]} closeOut={closeDeleteBookView}></DeleteBookModal>
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
          {(displayBookView && entryBookData) ?
              <CreateEntries closeStateFunction={setDisplayBookView} submitText="Edit Book">
                <ViewBookModal bookInfo={entryBookData.internalBooks[0]} closeOut={closeBookView} openEdit={openEditBookView}></ViewBookModal>
              </CreateEntries> : null}
        </>
    )
  }
  function closeBookView(){
    setDisplayBookView(false)
  }

  function renderBookRow(items:any[]){
    return(books ? books.map((book: Book & { genre: Genre; author: Author[]; }) => (
      <BookTableRow onEdit={openEditBookView} onDelete={openDeleteBookView} onView={openBookView} bookInfo={book}></BookTableRow>
  )) : null)
  }

  function renderBookEntries() {
    return <>
      <div>
        {displayNewBookEntriesView ? (entryBookData ? (
          <CreateBookEntries submitText="Save book" closeStateFunction={setDisplayNewBookEntriesView}>
            {entryBookData.externalBooks.length > 0 ?
            <div><HeadingPanel displayText="New Books"></HeadingPanel>
             {entryBookData.externalBooks.map((book: editableBook) => (
              <BookCard cardType="entry" bookInfo={book}></BookCard>))}</div>: null}
            {entryBookData.internalBooks.length > 0 ?
            <div><HeadingPanel displayText="Existing Books"></HeadingPanel>
             {entryBookData.internalBooks.map((book: editableBook) => (
              <BookCard cardType="edit" bookInfo={book}></BookCard>))}</div>: null}
            {(entryBookData.absentBooks.length > 0 ?
            <center><Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div className="text-center">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  The following books could not be found: {entryBookData.absentBooks.join(", ")}
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
          <TableDetails tableName="Inventory" tableDescription="A list of all the books in inventory.">
            <FilterModal resetPageNumber={setPageNumber} filterBooks={setFilters} buttonText="Filter" submitText="Add Filters"></FilterModal>
            <AddBookModal showBookEdit={openNewBookSubmissionsView} buttonText="Add Book(s)" submitText="Add Book(s)"></AddBookModal>
          </TableDetails>
          <Table sorting = {{setOrder:setSortOrder, setField:setSortField, currentOrder:sortOrder, currentField:sortField}}
                 setPage= {setPageNumber}
                 setFilters= {setFilters}
                 sortableHeaders={SORTABLE_HEADERS}
                 staticHeaders={STATIC_HEADERS}
                 items= {books}
                 filters={filters}
                 headersNotFiltered={["price", "inventory"]}
                 pageNumber={pageNumber}
                 numberOfPages={numberOfPages}
                 renderRow={renderBookRow}></Table>
          <div>
            {renderNewBookEntriesView()}
            {renderEditBookView()}
            {renderDeleteBookView()}
            {renderBookView()}
          </div>
        </div>
      </div>
  )
}
