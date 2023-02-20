import { useState } from 'react';
import { api } from "../../../utils/api";
import AddBookModal from "../Modals/BookModals/AddBookModal";
import BookCard from '../../BookCard';
import TableDetails from "../TableDetails";
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
  const FIRST_HEADER =  ["Title", "title"]
  const SORTABLE_HEADERS = [["ISBN", "isbn"], ["Author(s)", "authorNames"], ["Genre", "genre"], ["Price", "price"], ["Inventory", "inventory"]]
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
  const totalNumberOfEntries = api.books.getNumberOfBooks.useQuery({filters:filters}).data
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
                 firstHeader={FIRST_HEADER}
                 sortableHeaders={SORTABLE_HEADERS}
                 staticHeaders={STATIC_HEADERS}
                 items= {books}
                 filters={filters}
                 headersNotFiltered={["price", "inventory"]}
                 pageNumber={pageNumber}
                 numberOfPages={numberOfPages}
                 entriesPerPage={BOOKS_PER_PAGE}
                 numberOfEntries={totalNumberOfEntries}
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
