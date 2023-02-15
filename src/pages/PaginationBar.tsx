
interface PaginationBarProps{
  pageNumber:number
  numberOfPages:number
  entriesPerPage:number
  numberOfItems:number
  totalNumberOfEntries:number
  setPage: (page: number) => void
}

export default function PaginationBar(props: PaginationBarProps) {
  const prevButtonClass = (props.pageNumber===0) ? "relative ml-3 inline-flex items-center rounded-md border border-gray-50 bg-50 px-4 py-2 text-sm font-medium text-gray-50 hover:bg-gray-50" : "relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
  const nextButtonClass = (props.pageNumber===props.numberOfPages-1) ? "relative ml-3 inline-flex items-center rounded-md border border-gray-50 bg-50 px-4 py-2 text-sm font-medium text-gray-50 hover:bg-gray-50" : "relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"

  return (
      <nav
          className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-4 py-3 sm:px-6"
          aria-label="Pagination"
      >
        <div className="hidden sm:block">
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{(props.pageNumber * props.entriesPerPage) + 1}</span> to <span className="font-medium">{(props.pageNumber * props.entriesPerPage) + props.numberOfItems}</span> of{' '}
            <span className="font-medium">{props.totalNumberOfEntries}</span> results
          </p>
        </div>
        <div className="flex flex-1 justify-center">
          <div>
            <button onClick={()=>props.setPage(props.pageNumber-1)} disabled ={props.pageNumber===0} className={prevButtonClass}>Previous</button>
          </div>
          <div>
            <button onClick={()=>props.setPage(props.pageNumber+1)} disabled={props.pageNumber===props.numberOfPages-1} className={nextButtonClass}>Next</button>
          </div>
        </div>
        <div className="hidden sm:block">
          <p className="text-sm text-gray-50">
            Showing <span className="font-medium">{(props.pageNumber * props.entriesPerPage) + 1}</span> to <span className="font-medium">{(props.pageNumber * props.entriesPerPage) + props.entriesPerPage}</span> of{' '}
            <span className="font-medium">{props.numberOfItems}</span> results
          </p>
        </div>
      </nav>
  )
}
