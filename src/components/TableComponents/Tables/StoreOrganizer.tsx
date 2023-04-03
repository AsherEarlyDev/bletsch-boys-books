import { useState } from 'react';
import { api } from "../../../utils/api";
import { Genre } from '@prisma/client';
import GenreTableRow from '../TableRows/GenreTableRow';
import Table from './Table';
import AddGenreModal from '../Modals/GenreModals/AddGenreModal';
import TableDetails from '../TableDetails';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ShelfCalculatorModal from '../Modals/OrganizerModals/ShelfCalculatorModal';
import CardGrid from '../../CardComponents/CardGrid';
import CardTitle from '../../CardComponents/CardTitle';
import MutableCardProp from '../../CardComponents/MutableCardProp';
import CaseDisplay from '../../BasicComponents/CaseDisplay';
import BookCaseTableRow from '../TableRows/BookCaseTableRow';
import CreateEntries from '../../CreateEntries';
import DeleteBookModal from '../Modals/BookModals/DeleteBookModal';
import DeleteCaseModal from '../Modals/OrganizerModals/DeleteCaseModal';
import PlanogramModal from '../Modals/PlanogramModal';
import { drawPlanogram } from '../../StoreOrganizerComponents/Planogram';

export default function StoreOrganizer() {
    const DEFAULT_WIDTH = 60
    const DEFAULT_SHELF_NUMBER = 7
    const CASES_PER_PAGE = 5
    const totalNumberOfEntries = api.bookCase.getNumberOfCases.useQuery().data
    const numberOfPages = Math.ceil(totalNumberOfEntries / CASES_PER_PAGE)
    const [newWidth, setNewWidth] = useState(DEFAULT_WIDTH)
    const [newName, setNewName] = useState("Enter Case Title")
    const [newNumShelves, setNewNumShelves] = useState(DEFAULT_SHELF_NUMBER)
    const [viewCase, setViewCase] = useState(false)
    const [diagramCaseName, setDiagramCaseName] = useState("")
    const [displayDeleteView, setDisplayDeleteView] = useState(false)
    const [caseList, setCaseList] = useState([]) 
    const [currentCase, setCurrentCase] = useState({})
    const [pageNumber, setPageNumber] = useState(0)
    const [sortField, setSortField] = useState("name")
    const [sortOrder, setSortOrder] = useState("asc")
    const FIRST_HEADER =  ["Name", "name"]
    const STATIC_HEADERS = ["Edit/View","Delete"]
    const SORTABLE_HEADERS = [["Width", "width"], ["Number Of Shelves", "numShelves"], ["User", "userName"], ["Date Last Edited", "date"]]
    const cases = api.bookCase.getAllBookCases.useQuery({pageNumber:pageNumber, casesPerPage:CASES_PER_PAGE, sortBy:sortField, descOrAsc:sortOrder}).data
    const diagramCase = api.bookCase.getCaseByName.useQuery({name:diagramCaseName}).data
    

    function openDeleteView(bookCase){
        setCurrentCase(bookCase)
        setDisplayDeleteView(true)
    }
    function closeDeleteView(){
        setDisplayDeleteView(false)
      }
    function openCase(bookCase){
        setCurrentCase(bookCase)
        console.log(currentCase)
        setViewCase(true)
    }
    function renderCase (){
        return(
            <>
            {viewCase ? 
            <CaseDisplay case={currentCase} saveCase={setCurrentCase}></CaseDisplay> : null}
            </>
        )
    }
    function renderDeleteBookCaseView() {
        return(
            <>
              {(displayDeleteView && currentCase) ?
                  <CreateEntries closeStateFunction={setDisplayDeleteView} submitText="Delete Book">
                    <DeleteCaseModal bookCase={currentCase} closeOut={closeDeleteView}></DeleteCaseModal>
                  </CreateEntries> : null}
            </>
        )
      }


    
      function renderCaseRow(items:any[]){
        return(cases ? cases.map((bookCase) => (
          <BookCaseTableRow  onDelete={openDeleteView} onView={(currentBookCase)=>openCase(currentBookCase)} bookCaseInfo={bookCase}></BookCaseTableRow>
      )) : null)
      }

      function generateDiagram(){
        drawPlanogram(diagramCase.bookCase, diagramCase.books, diagramCase.numBooks)
      }
      


    return (
        <>
        <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
        
        <TableDetails tableName="Load BookCase" tableDescription="Load a existing bookcase to view or edit">
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                <ShelfCalculatorModal isStandAlone={true} buttonText="Shelf Calulator" submitText="Close"></ShelfCalculatorModal>
            </div>
            <div>
            <PlanogramModal bookCases={cases} selectedCase={setDiagramCaseName} generateDiagram={generateDiagram} buttonText={'Download Book Case'} submitText={'Create Planogram'}></PlanogramModal>
            </div>
        </TableDetails>
        <Table  sorting = {{setOrder:setSortOrder, setField:setSortField, currentOrder:sortOrder, currentField:sortField}}
                setPage= {setPageNumber}
                firstHeader={FIRST_HEADER}
                sortableHeaders={SORTABLE_HEADERS}
                staticHeaders={STATIC_HEADERS}
                items= {cases}
                pageNumber={pageNumber}
                numberOfPages={numberOfPages}
                entriesPerPage={CASES_PER_PAGE}
                numberOfEntries={totalNumberOfEntries}
                renderRow={renderCaseRow}></Table>
        <div className="overflow-auto m-8 border border-gray-300 bg-white shadow rounded-lg">
            <div className="flex flex-row gap-10 pt-4 justify-left">
            <CardTitle heading="Create A New Book Case" subheading="Create a custum bookcase or load one of the following"></CardTitle>
            <CardGrid>
                
                <MutableCardProp saveValue={setNewName} heading="Case Name" dataType="string" defaultValue="Enter Case Title"></MutableCardProp>
                <MutableCardProp saveValue={setNewWidth} heading="Width" dataType="number" defaultValue={DEFAULT_WIDTH}></MutableCardProp>
                <MutableCardProp saveValue={setNewNumShelves} heading="Number of Shelves" dataType="number" defaultValue={DEFAULT_SHELF_NUMBER}></MutableCardProp>
                
                <button 
                className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                onClick = {() => {
                    const emptyCase = []
                    for (var i =0; i<newNumShelves; i++){
                        emptyCase.push({availableSpace:newWidth, takenSpace:0, bookList:[]})
                    }
                    openCase({case:emptyCase, name:newName, width:newWidth, numShelves:newNumShelves})
                }}>
                    Create New Case
                </button>
                
            </CardGrid></div>
        </div>
        {renderCase()}
        {renderDeleteBookCaseView()}
        </div>
        </div>
        </>
    )
}
