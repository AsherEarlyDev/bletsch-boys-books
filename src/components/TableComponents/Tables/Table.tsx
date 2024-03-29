import SortedFilterableColumnHeading from "../TableColumnHeadings/SortedFilterableColumnHeading";
import TableHeader from "../TableHeader";
import ColumnHeading from "../TableColumnHeadings/ColumnHeading";
import FilterableColumnHeading from "../TableColumnHeadings/FilterableColumnHeading";
import PaginationBar from "../../../pages/PaginationBar";
import { useRouter } from 'next/router'
import {FunnelIcon} from "@heroicons/react/24/outline";

interface TableProps{
    sorting:{
        setOrder:any
        setField:any
        currentOrder:string
        currentField:string
    }
    setPage:any
    setFilters?:any
    headersNotFiltered?:Array<string>
    sortableHeaders?:Array<Array<string>>
    withoutSorting?: boolean
    firstHeader:Array<string>
    staticHeaders?:Array<string>
    items: any[]
    filters?:any
    entriesPerPage:number
    pageNumber:number
    numberOfPages:number
    numberOfEntries:number
    renderRow:any
}

export default function Table(props:TableProps) {
    const numberOfItems = (props.items ? props.items.length : 0)
    const router = useRouter()
    const query = router.query

return(
    <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300 table-auto">
                        <TableHeader>
                            {props.withoutSorting ? <FilterableColumnHeading firstEntry={true} label={props.firstHeader[0]}></FilterableColumnHeading> : <SortedFilterableColumnHeading firstEntry={true} resetPage={props.setPage} setOrder={props.sorting.setOrder} currentOrder={props.sorting.currentOrder} currentField={props.sorting.currentField} sortFields={props.sorting.setField} label={props.firstHeader[0]} databaseLabel={props.firstHeader[1]}></SortedFilterableColumnHeading>}
                            {props.sortableHeaders && props.sortableHeaders.map((header => {
                            return props.withoutSorting ? <FilterableColumnHeading label={header[0]}></FilterableColumnHeading> : <SortedFilterableColumnHeading resetPage={props.setPage} setOrder={props.sorting.setOrder} currentOrder={props.sorting.currentOrder} currentField={props.sorting.currentField} sortFields={props.sorting.setField} label={header[0]} databaseLabel={header[1]}></SortedFilterableColumnHeading>
                            }))}
                            {(props.staticHeaders && props.staticHeaders.map((label => {
                                return <ColumnHeading label={label}></ColumnHeading>
                            })))}
                        </TableHeader>
                        {(props.headersNotFiltered) ?
                        <TableHeader>
                            {
                                props.headersNotFiltered.includes(props.firstHeader[1]) ? <td></td> :
                                (<td className="mt-5 items-center">
                                    <input
                                    type={"text"}
                                    className={"mt-1 p-1 block text-sm text-gray-900 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm w-full"}
                                    defaultValue={query[props.firstHeader[1]] || ""}
                                    placeholder="Filter by name..."
                                    onChange={(value) => {
                                        router.push({
                                            pathname: '/books',
                                            query: Object.assign({},
                                                query,
                                                {[props.firstHeader[1]]:value.target.value}
                                             )})
                                    props.setPage(0)}}
                                    />
                                </td>)
                            }
                         {props.sortableHeaders.map((label) => {
                                return props.headersNotFiltered.includes(label[1]) ? <td></td> : (<td className="mt-5">
                                <input
                                    type={"text"}
                                    className={"mt-1 p-1 block text-sm text-gray-900 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm w-full"}
                                    defaultValue={query[label[1]] || ""}
                                    placeholder={label[1]=="authorNames" ? "By author..." : ("By " +  label[1] + "...")}
                                    onChange={(value) => {
                                        router.push({
                                            pathname: '/books',
                                            query: Object.assign({},
                                                query,
                                                {[label[1]]:value.target.value}
                                             )})
                                    props.setPage(0)}}
                                />
                                </td>)
                            })}
                            {props.staticHeaders.map((header) => {return <td></td>})}
                        </TableHeader>: null}
                        <tbody className="divide-y divide-gray-200 bg-white">
                        {props.renderRow(props.items)}
                        </tbody>
                    </table>
                    {props.items == undefined ? 
                    <nav
                        className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-4 py-3 sm:px-6"
                        aria-label="Pagination"
                    >
                        <div className="hidden sm:block">
                        <p className="text-sm text-gray-700">
                            Loading...
                        </p>
                        </div>
                    </nav>
                    :
                    
                    <PaginationBar pageNumber={props.pageNumber} numberOfPages={props.numberOfPages} entriesPerPage={props.entriesPerPage} numberOfItems={numberOfItems} setPage={props.setPage} totalNumberOfEntries={props.numberOfEntries}></PaginationBar>}
                </div>
            </div>
        </div>
    </div>
)
}
