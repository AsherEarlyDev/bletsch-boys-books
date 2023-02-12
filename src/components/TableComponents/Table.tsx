import { Book, Genre, Author } from "@prisma/client"
import BookTableRow from "./BookTableRow"
import SortedFilterableColumnHeading from "./SortedFilterableColumnHeading"
import TableHeader from "./TableHeader"

interface TableProps{
    sorting:{
        setOrder:any
        setField:any
        currentOrder:string
        currentField:string
    }
    setPage:any
    setFilters:any
    filterLabels:Array<string>
    headers:Array<Array<string>>
    items: Book[]
    handleBookEdit:any
    filters:any
    pageNumber:number
    numberOfPages:number
}

export default function Table(props:TableProps) {

return(
    <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300 table-auto">
                        <TableHeader>
                            {props.headers.map((header => {
                            return <SortedFilterableColumnHeading resetPage={props.setPage} setOrder={props.sorting.setOrder} currentOrder={props.sorting.currentOrder} currentField={props.sorting.currentField} sortFields={props.sorting.setField} label={header[0]} databaseLabel={header[1]}></SortedFilterableColumnHeading>
                            }))}
                        </TableHeader>
                        <TableHeader>
                        {props.filterLabels.map((label) => {
                                return label==="publisher" ? <td></td> : (<td className="mt-5">
                                <textarea
                                    rows={1}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    defaultValue=""
                                    onChange={(value) => {
                                    props.setFilters({...props.filters, [label]:value.target.value})
                                    props.setPage(0)}}
                                />
                                </td>)
                            })}
                        </TableHeader>
                        <tbody className="divide-y divide-gray-200 bg-white">
                        {props.items ? props.items.map((book: Book & { genre: Genre; author: Author[]; }) => (
                            <BookTableRow onEdit={props.handleBookEdit} bookInfo={book}></BookTableRow>
                        )) : null}
                        </tbody>
                    </table>
                    <center><button style={{padding:"10px"}} onClick={()=>props.setPage(props.pageNumber-1)} disabled ={props.pageNumber===0} className="text-indigo-600 hover:text-indigo-900">
                    Previous
                  </button>
                    <button style={{padding:"10px"}} onClick={()=>props.setPage(props.pageNumber+1)} disabled={props.pageNumber===props.numberOfPages-1} className="text-indigo-600 hover:text-indigo-900">
                      Next
                    </button></center>
                </div>
            </div>
        </div>
    </div>
)
}