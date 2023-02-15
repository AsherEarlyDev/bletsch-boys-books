import SortedFilterableColumnHeading from "../TableColumnHeadings/SortedFilterableColumnHeading";
import TableHeader from "../TableHeader";
import ColumnHeading from "../TableColumnHeadings/ColumnHeading";
import PaginationBar from "../../../pages/PaginationBar";

interface TableProps{
    sorting?:{
        setOrder:any
        setField:any
        currentOrder:string
        currentField:string
    }
    setPage:any
    setFilters?:any
    headersNotFiltered?:Array<string>
    sortableHeaders:Array<Array<string>>
    firstHeader:Array<string>
    staticHeaders?:Array<string>
    items: any[]
    filters?:any
    entriesPerPage?:number
    pageNumber:number
    numberOfPages:number
    numberOfEntries:number
    renderRow:any
}

export default function Table(props:TableProps) {
    const numberOfItems = (props.items ? props.items.length : 0)

return(
    <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300 table-auto">
                        <TableHeader>
                            {props.firstHeader && <SortedFilterableColumnHeading firstEntry={true} resetPage={props.setPage} setOrder={props.sorting.setOrder} currentOrder={props.sorting.currentOrder} currentField={props.sorting.currentField} sortFields={props.sorting.setField} label={props.firstHeader[0]} databaseLabel={props.firstHeader[1]}></SortedFilterableColumnHeading>}
                            {props.sortableHeaders.map((header => {
                            return <SortedFilterableColumnHeading resetPage={props.setPage} setOrder={props.sorting.setOrder} currentOrder={props.sorting.currentOrder} currentField={props.sorting.currentField} sortFields={props.sorting.setField} label={header[0]} databaseLabel={header[1]}></SortedFilterableColumnHeading>
                            }))}
                            {(props.staticHeaders && props.staticHeaders.map((label => {
                                return <ColumnHeading label={label}></ColumnHeading>
                            })))}
                        </TableHeader>
                        {(props.filters && props.setFilters) ?
                        <TableHeader>
                         {props.sortableHeaders.map((label) => {
                                return props.headersNotFiltered.includes(label[1]) ? <td></td> : (<td className="mt-5">
                                <textarea
                                    rows={1}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    defaultValue=""
                                    onChange={(value) => {
                                    props.setFilters({...props.filters, [label[1]]:value.target.value})
                                    props.setPage(0)}}
                                />
                                </td>)
                            }) }
                        </TableHeader>: null}
                        <tbody className="divide-y divide-gray-200 bg-white">
                        {props.renderRow(props.items)}
                        </tbody>
                    </table>
                    <PaginationBar pageNumber={props.pageNumber} numberOfPages={props.numberOfPages} entriesPerPage={props.entriesPerPage} numberOfItems={numberOfItems} setPage={props.setPage} totalNumberOfEntries={props.numberOfEntries}></PaginationBar>
                </div>
            </div>
        </div>
    </div>
)
}
