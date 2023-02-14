import TableDetails from "../TableDetails";
import { editableBook } from '../../../types/bookTypes';
import BookCard from "../../BookCard";
import {Dialog} from "@headlessui/react";
import NewBookTableRow from "../TableRows/NewBookTableRow";
import AddVendorModal from "../Modals/VendorModals/AddVendorModal";
import TableHeader from "../TableHeader";
import FilterableColumnHeading from "../TableColumnHeadings/FilterableColumnHeading";
import {VendorTableRow} from "../TableRows/VendorTableRow";
import ColumnHeading from "../TableColumnHeadings/ColumnHeading";
import TableEntry from "../TableEntries/TableEntry";
import GenreSelect from "../../CardComponents/GenreSelect";
import MutableTableEntry from "../TableEntries/MutableTableEntry";
import MutableDimensionsTableEntry from "../TableEntries/MutableDimensionsTableEntry";
import React from "react";

interface NewBookEntryTableProps{
  newBookEntries: {internalBooks: any[], externalBooks: editableBook[], absentBooks: string[]}
}
export default function NewBookEntryTable(props: NewBookEntryTableProps) {
  return (
      <div className="px-4 sm:px-6 lg:px-8 rounded-lg shadow-lg p-2 bg-white">
        <div className="mb-8">
          <TableDetails tableName="New Book Entries" tableDescription="Confirm new book information to add to database.">
          </TableDetails>
          <div className="mt-8 flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300 table-auto">
                    <TableHeader>
                      <ColumnHeading label="Title"></ColumnHeading>
                      <ColumnHeading label="Isbn"></ColumnHeading>
                      <ColumnHeading label="Author(s)"></ColumnHeading>
                      <ColumnHeading label="Publisher"></ColumnHeading>
                      <ColumnHeading label="Publishing Year"></ColumnHeading>
                      <ColumnHeading label="Inventory"></ColumnHeading>
                      <ColumnHeading label="Genre"></ColumnHeading>
                      <ColumnHeading label="Retail Price"></ColumnHeading>
                      <ColumnHeading label="Page Count"></ColumnHeading>
                      <ColumnHeading label="Dimensions"></ColumnHeading>
                    </TableHeader>
                    <tbody className="divide-y divide-gray-200 bg-white">
                    {props.newBookEntries.externalBooks.map((book: editableBook) => (<NewBookTableRow bookInfo={book}></NewBookTableRow>))}
          {/*          /!*{props.newBookEntries.internalBooks.map((book: editableBook) => (<BookCard cardType="edit" bookInfo={book}></BookCard>))}*!/*/}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}
