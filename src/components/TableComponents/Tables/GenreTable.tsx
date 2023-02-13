import { useState } from 'react';
import { api } from "../../../utils/api";
import AddBookModal from "../Modals/BookModals/AddBookModal";
import AddGenreModal from "../../AddGenreModal";
import BookCard from '../../BookCard';
import TableDetails from "../TableDetails";
import SortedFilterableColumnHeading from "../SortedFilterableColumnHeading";
import TableHeader from "../TableHeader";
import CreateBookEntries from "../../CreateBookEntries";
import BookTableRow from "../TableRows/BookTableRow";
import { Dialog } from '@headlessui/react'
import HeadingPanel from '../../BasicComponents/HeadingPanel';
import { editableBook } from '../../../types/bookTypes';
import { Book, Genre, Author } from '@prisma/client';
import FilterModal from '../../FilterModal';
import GenreTableRow from '../TableRows/GenreTableRow';
import FilterableColumnHeading from '../FilterableColumnHeading';

export default function GenreTable() {
  const BOOKS_PER_PAGE = 5
  const GENRES_PER_PAGE = 5
  const [isbns, setIsbns] = useState<string[]>([])
  const bookInfo = api.books.findBooks.useQuery(isbns).data
  const [displayBookEntries, setDisplayBookEntries] = useState(false)
  const [displayBookEdit, setDisplayBookEdit] = useState(false)
  const [pageNumber, setPageNumber] = useState(0)
  const [sortField, setSortField] = useState("title")

  const [sortOrder, setSortOrder] = useState("asc")
  const [filters, setFilters] = useState({isbn:"", title:"", author:"", publisher:"", genre:""})
  const numberOfPages = Math.ceil(api.books.getNumberOfBooks.useQuery({filters:filters}).data / BOOKS_PER_PAGE)
  const  books = api.books.getAllInternalBooks.useQuery({pageNumber:pageNumber, booksPerPage:BOOKS_PER_PAGE, sortBy:sortField, descOrAsc:sortOrder, filters:filters}).data

  const [genreSortOrder, setGenreSortOrder] = useState("asc")
  const [genrePageNumber, setGenrePageNumber] = useState(0)
  const [genreSortField, setGenreSortField] = useState("name")
  const numberOfGenrePages = Math.ceil(api.genre.getNumberOfGenres.useQuery().data / GENRES_PER_PAGE)
  const  genres = api.genre.getGenres.useQuery({genrePageNumber:genrePageNumber, genresPerPage:GENRES_PER_PAGE, genreSortBy:genreSortField, genreDescOrAsc:genreSortOrder}).data

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
  return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="my-8">
          <TableDetails tableName="Genres" tableDescription="A list of all the genres.">
            <AddGenreModal buttonText="Add Genre" submitText="Add Genre"></AddGenreModal>
          </TableDetails>
          <div className="mt-8 flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div
                    className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300 table-auto">
                    <TableHeader>
                      <SortedFilterableColumnHeading resetPage={setGenrePageNumber} setOrder={setGenreSortOrder} currentOrder={genreSortOrder} currentField={genreSortField} sortFields={setGenreSortField} label="Name"
                                                     firstEntry={true} databaseLabel="name"></SortedFilterableColumnHeading>
                      <FilterableColumnHeading label="Inventory"></FilterableColumnHeading>
                    </TableHeader>
                    <tbody className="divide-y divide-gray-200 bg-white">
                    {genres ? genres.map((genre: Genre) => (
                        <GenreTableRow setGenreFilter={setGenreFilter} onEdit={handleBookEdit} genre={genre}></GenreTableRow>
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
      </div>

  )
}
