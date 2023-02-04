import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { useState } from 'react';
import { editableBook } from '../types/bookTypes';
import { api } from "../utils/api";
import AddBookModal from "./AddBookModal";
import BookCard from './BookCard';
import TableDetails from "./TableComponents/TableDetails";
import FilterableColumnHeading from "./TableComponents/FilterableColumnHeading";
import TableHeader from "./TableComponents/TableHeader";
import CreateBookEntries from "./CreateBookEntries";
import BookTableRow from "./TableComponents/BookTableRow";

const book = [
  { title: 'Book 1', isbn: '13478392489', author: 'John Snow', price: 100, genre: 'comedy', inventory: 5},
  // More people...
]
;


export default function Table() {
  const  books = api.books.getAllInternalBooks.useQuery().data
  const [isbns, setIsbns] = useState<string[]>([])
  const bookInfo = api.books.findBooks.useQuery(isbns).data
  const [displayBookEntries, setDisplayBookEntries] = useState(false)
  const [displayBookEdit, setDisplayBookEdit] = useState(false)
  const handleISBNSubmit = async (isbns:string[]) => {
    setIsbns(isbns)
    if(bookInfo){
      setDisplayBookEntries(true)
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
      {displayBookEntries ? (bookInfo ? (
          <CreateBookEntries submitText="Save book"> {bookInfo.externalBooks.map((book) => (
              <BookCard cardType="entry" bookInfo={book}></BookCard>))}</CreateBookEntries>) : null) : null}
    </>;
  }

  function renderBookEdit() {
    return <>
      {displayBookEdit ? (bookInfo ? (
          <CreateBookEntries submitText="Edit book"> {bookInfo.internalBooks.map((book) => (
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
                    <FilterableColumnHeading label="Title"
                                             firstEntry={true}></FilterableColumnHeading>
                    <FilterableColumnHeading label="ISBN"></FilterableColumnHeading>
                    <FilterableColumnHeading label="Author(s)"></FilterableColumnHeading>
                    <FilterableColumnHeading label="Price"></FilterableColumnHeading>
                    <FilterableColumnHeading label="Genre"></FilterableColumnHeading>
                    <FilterableColumnHeading label="Inventory"></FilterableColumnHeading>
                  </TableHeader>
                  <tbody className="divide-y divide-gray-200 bg-white">
                  {books ? books.map((book) => (
                      <BookTableRow onEdit={handleBookEdit} bookInfo={book}></BookTableRow>
                  )) : null}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div>
          {renderBookEntries()}
          {renderBookEdit()}
        </div>
      </div>

  )
}
