import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { useState } from 'react';
import { externalBook } from '../types/bookTypes';
import { api } from "../utils/api";
import AddBookModal from "./AddBookModal";
import BookCard from './BookCard';
import TableDetails from "./TableComponents/TableDetails";
import FilterableColumnHeading from "./TableComponents/FilterableColumnHeading";
import TableHeader from "./TableComponents/TableHeader";
import TableEntry from "./TableComponents/TableEntry";
import CreateBookEntries from "./CreateBookEntries";

const book = [
  { title: 'Book 1', isbn: '13478392489', author: 'John Snow', price: 100, genre: 'comedy', inventory: 5},
  // More people...
]
;


export default function Table() {
  const  books = api.books.getAllInternalBooks.useQuery().data
  const [isbns, setIsbns] = useState<string[]>([])
  const bookInfo = api.books.findBooks.useQuery(isbns).data
  const [displayEdit, setDisplayEdit] = useState(false)
  
  const handleSubmit = async (isbns:string[]) => {
    setIsbns(isbns)
    if(bookInfo){
      setDisplayEdit(true)
    }
  }

  return (
      <div className="px-4 sm:px-6 lg:px-8">
        <TableDetails tableName="Inventory" tableDescription="A list of all the books in inventory.">
          <AddBookModal showBookEdit={handleSubmit} buttonText="Add Book" submitText="Add Book(s)"></AddBookModal>
        </TableDetails>
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300 table-auto">
                  <TableHeader>
                    <FilterableColumnHeading label="Title" firstEntry={true}></FilterableColumnHeading>
                    <FilterableColumnHeading label="ISBN"></FilterableColumnHeading>
                    <FilterableColumnHeading label="Author(s)"></FilterableColumnHeading>
                    <FilterableColumnHeading label="Price"></FilterableColumnHeading>
                    <FilterableColumnHeading label="Genre"></FilterableColumnHeading>
                    <FilterableColumnHeading label="Inventory"></FilterableColumnHeading>
                  </TableHeader>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {books ?  books.map((book) => (
                      <tr>
                        <TableEntry firstEntry={true}>{book.title}</TableEntry>
                        <TableEntry>{book.isbn}</TableEntry>
                        <TableEntry>{book.author.map((author) => author.name).join(", ")}</TableEntry>
                        <TableEntry>{book.retailPrice}</TableEntry>
                        <TableEntry>{book.genre.name}</TableEntry>
                        <TableEntry>Add in Later</TableEntry>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <a href="#" className="text-indigo-600 hover:text-indigo-900">
                            Edit<span className="sr-only">, {book.title}</span>
                          </a>
                        </td>
                      </tr>
                    )) : null}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div>
          {displayEdit ? (bookInfo ? (<CreateBookEntries submitText="Save book"> {bookInfo.externalBooks.map((book) => (<BookCard bookInfo={book}></BookCard>))}</CreateBookEntries>) : null) : null}
        </div>
      </div>

  )
}
