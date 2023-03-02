import { useState, useContext } from 'react';
import { api } from "../../../utils/api";
import AddBookModal from "../Modals/BookModals/AddBookModal";
import TableDetails from "../TableDetails";
import BookTableRow from "../TableRows/BookTableRow";
import { Book, Genre, Author } from '@prisma/client';
import FilterModal from '../../FilterModal';
import CreateEntries from "../../CreateEntries";
import DeleteBookModal from "../Modals/BookModals/DeleteBookModal";
import EditBookModal from "../Modals/BookModals/EditBookModal";
import ViewBookModal from "../Modals/BookModals/ViewBookModal";
import Table from './Table';
import NewBookEntryTable from "./NewBookEntryTable";
import { useRouter } from 'next/router'
import { CSVLink } from "react-csv";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function BookTable() {
  const {query} = useRouter()
  const BOOKS_PER_PAGE = 10
  const FIRST_HEADER =  ["Title", "title"]

  const SORTABLE_HEADERS = [["ISBN", "isbn"], ["Author(s)", "authorNames"], ["Genre", "genre"], ["Price", "retailPrice"], ["Inv.", "inventory"], ["30 Day Sales", "lastMonthSales"], ["Shelf Space", "shelfSpace"], ["Days of Supply", "daysOfSupply"], ["Best BB Price", "bestBuybackPrice"]]
  const CSV_HEADERS = [{label:"title", key:"title"}, {label:"authors", key:"authorNames"}, {label:"isbn_13", key:"isbn"}, {label:"publisher", key:"publisher"}, {label:"publication_year", key:"publicationYear"}, {label:"page_count", key:"pageCount"}, {label:"height", key:"length"}, {label:"width", key:"width"}, {label:"thickness", key:"height"}, {label:"retail_price", key:"retailPrice"}, {label:"genre", key:"genre"}, {label:"inventory_count", key:"inventory"}, {label:"shelf_space_inches", key:"shelfSpace"}, {label:"last_month_sales", key:"lastMonthSales"}, {label:"days_of_supply", key:"daysOfSupply"}, {label:"best_buyback_price", key:"bestBuybackPrice"}]

  const STATIC_HEADERS = ["Edit", "Delete"]
  const [currentIsbns, setCurrentIsbns] = useState<string[]>([])
  const [displayNewBookEntriesView, setDisplayNewBookEntriesView] = useState(false)
  const [displayEditBookView, setDisplayEditBookView] = useState(false)
  const [displayBookView, setDisplayBookView] = useState(false)
  const [displayDeleteBookView, setDisplayDeleteBookView] = useState(false)
  const [pageNumber, setPageNumber] = useState(0)
  const [sortField, setSortField] = useState("title")
  const [sortOrder, setSortOrder] = useState("asc")
  const [filters, setFilters] = useState({isbn:"", title:"", authorNames:"", publisher:"", genre:""})
  const filters2 ={
    isbn: query.isbn ? query.isbn.toString() : '',
    title: query.title ? query.title.toString() : '',
    authorNames: query.authorNames ? query.authorNames.toString() : '',
    publisher: query.publisher ? query.publisher.toString() : '',
    genre: query.genre ? query.genre.toString() : '',}
  const numberOfPages = Math.ceil(api.books.getNumberOfBooks.useQuery({filters:filters2}).data / BOOKS_PER_PAGE)
  const totalNumberOfEntries = api.books.getNumberOfBooks.useQuery({filters:filters2}).data
  const entryBookData = api.books.findBooks.useQuery(currentIsbns).data
  const books = api.books.getAllInternalBooks.useQuery({pageNumber:pageNumber, booksPerPage:BOOKS_PER_PAGE, sortBy:sortField, descOrAsc:sortOrder, filters:filters2}).data
  const allBooks = api.books.getAllInternalBooksNoPagination.useQuery({sortBy:sortField, descOrAsc:sortOrder, filters:filters2}).data
  const csvBooks = allBooks ? allBooks.map((book)=>({...book, authorNames:book.authorNames.replaceAll(",", " |"), genre:book.genre.name,length:book.dimensions[2], width:book.dimensions[0], height:book.dimensions[1] })) : []
  const router = useRouter()

  function forceDataRender (){
    setPageNumber(pageNumber)
  }
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
                <EditBookModal bookInfo={entryBookData.internalBooks[0]} closeOut={closeEditBookView}></EditBookModal>
              </CreateEntries> : null}
        </>
    )
  }
  function closeEditBookView(){
    setDisplayEditBookView(false)
    forceDataRender()
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
    return(books ? books.map((book) => (
      <BookTableRow onEdit={openEditBookView} onDelete={openDeleteBookView} onView={openBookView} bookInfo={book}></BookTableRow>
  )) : null)
  }

  return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <TableDetails tableName="Inventory" tableDescription="A list of all the books in inventory.">
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button type="button"
                onClick={() => router.push({pathname: '/records',})}
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            >Clear Filters</button></div>
            <FilterModal resetPageNumber={setPageNumber} filterBooks={setFilters} buttonText="Advanced Filter" submitText="Add Filters"></FilterModal>
            <AddBookModal showBookEdit={openNewBookSubmissionsView} buttonText="Add Book(s)" submitText="Add Book(s)"></AddBookModal>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <CSVLink filename={"BletschBoysBookList.csv"}  data={csvBooks} headers={CSV_HEADERS} className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto">
            Download Book List</CSVLink></div>
          </TableDetails>
          <Table sorting = {{setOrder:setSortOrder, setField:setSortField, currentOrder:sortOrder, currentField:sortField}}
                 setPage= {setPageNumber}
                 firstHeader={FIRST_HEADER}
                 sortableHeaders={SORTABLE_HEADERS}
                 staticHeaders={STATIC_HEADERS}
                 items= {books}
                 headersNotFiltered={["retailPrice", "inventory", "lastMonthSales", "shelfSpace", "daysOfSupply", "bestBuybackPrice"]}
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
            <ToastContainer/>
          </div>
        </div>
      </div>
  )
}