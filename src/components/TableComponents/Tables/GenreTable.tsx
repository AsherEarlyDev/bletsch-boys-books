import { useState } from 'react';
import { api } from "../../../utils/api";
import { Genre } from '@prisma/client';
import GenreTableRow from '../TableRows/GenreTableRow';
import Table from './Table';
import AddGenreModal from '../Modals/GenreModals/AddGenreModal';
import TableDetails from '../TableDetails';

export default function GenreTable() {
  const GENRES_PER_PAGE = 5
  const STATIC_HEADERS = ["Edit", "Delete"]
  const FIRST_HEADER = ["Name", "name"]
  const SORTABLE_HEADERS = [["Inventory", "inventory"]]
  const [genreSortOrder, setGenreSortOrder] = useState("asc")
  const [genrePageNumber, setGenrePageNumber] = useState(0)
  const [genreSortField, setGenreSortField] = useState("name")
  const numberOfGenrePages = Math.ceil(api.genre.getNumberOfGenres.useQuery().data / GENRES_PER_PAGE)
  const  genres = api.genre.getGenres.useQuery({genrePageNumber:genrePageNumber, genresPerPage:GENRES_PER_PAGE, genreSortBy:genreSortField, genreDescOrAsc:genreSortOrder}).data

  function setGenreFilter(genre: string){
  //   setFilters({isbn:"", title:"", author:"", publisher:"", genre:genre})
  //   setPageNumber(0)
  }

  function renderGenreRow(items:any[]){
    return(genres ? genres.map((genre: Genre) => (
      <GenreTableRow setGenreFilter={setGenreFilter} genre={genre}></GenreTableRow>
  )) : null)
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="my-8">
        <TableDetails tableName="Genres" tableDescription="A list of all the genres.">
          <AddGenreModal buttonText="Add Genre" submitText="Add Genre"></AddGenreModal>
        </TableDetails>
        <Table sorting = {{setOrder:setGenreSortOrder, setField:setGenreSortField, currentOrder:genreSortOrder, currentField:genreSortField}} 
        setPage= {setGenrePageNumber}
        firstHeader={FIRST_HEADER}
        staticHeaders={STATIC_HEADERS}
        sortableHeaders={SORTABLE_HEADERS}
        items= {genres}
        pageNumber={genrePageNumber}
        numberOfPages={numberOfGenrePages}
        entriesPerPage={GENRES_PER_PAGE}
        renderRow={renderGenreRow}></Table>   
      </div>
    </div>
    )
}