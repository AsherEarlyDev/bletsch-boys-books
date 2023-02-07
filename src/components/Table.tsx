import { useState } from 'react';
import { api } from "../utils/api";
import AddBookModal from "./AddBookModal";
import BookCard from './BookCard';
import TableDetails from "./TableComponents/TableDetails";
import FilterableColumnHeading from "./TableComponents/FilterableColumnHeading";
import TableHeader from "./TableComponents/TableHeader";
import CreateBookEntries from "./CreateBookEntries";
import BookTableRow from "./TableComponents/BookTableRow";
import { Dialog, Transition } from '@headlessui/react'
import HeadingPanel from './BasicComponents/HeadingPanel';
import { editableBook } from '../types/bookTypes';
import { editableBook } from '../types/bookTypes';
import { editableBook } from '../types/bookTypes';
import { Book, Genre, Author } from '@prisma/client';
export default function Table() {
  const  books = api.books.getAllInternalBooks.useQuery().data
  const [isbns, setIsbns] = useState<string[]>([])
  const bookInfo = api.books.findBooks.useQuery(isbns).data
  const [displayBookEntries, setDisplayBookEntries] = useState(false)
  const [displayBookEdit, setDisplayBookEdit] = useState(false)
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
          <CreateBookEntries submitText="Save book"> 
            
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
    return <>
      {displayBookEdit ? (bookInfo ? (
          <CreateBookEntries submitText="Edit book"> {bookInfo.internalBooks.map((book: editableBook) => (
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
                  {books ? books.map((book: Book & { genre: Genre; author: Author[]; }) => (
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
