import { useState } from "react"
import  TableDetails  from "../TableComponents/TableDetails"
import  TableHeader  from "../TableComponents/TableHeader"
import EditShelfCalculatorModal from "../TableComponents/Modals/OrganizerModals/EditShelfCalculatorModal"
import ColumnHeading from "../TableComponents/TableColumnHeadings/ColumnHeading"
import DeleteRowEntry from "../TableComponents/TableEntries/DeleteRowEntry"
import EditRowEntry from "../TableComponents/TableEntries/EditRowEntry"
import TableEntry from "../TableComponents/TableEntries/TableEntry"
import { api } from "../../utils/api"
import { CldImage } from "next-cloudinary"
import { toast } from "react-toastify"
import CardGrid from "../CardComponents/CardGrid"
import CardTitle from "../CardComponents/CardTitle"
import MutableCardProp from "../CardComponents/MutableCardProp"
import { ReactSortable } from "react-sortablejs"

export default function CaseDisplay(props:any){
    const [viewCalc, setViewCalc] = useState(false)
    const [tempName, setTempName] = useState ("")
    const [tempWidth, setTempWidth] = useState (0)
    const saveBook = api.bookCase.saveBookCase.useMutation({
        onSuccess: ()=>{
          window.location.reload()
          toast.error("BookCase Saved")
        },
        onError: (error)=>{
          toast.error("Unable to save bookcase!")
        }
      })
    function openCalculator (idx){
        setViewCalc(true)
    }

    function saveShelves(shelves){
        props.saveCase({...props.case, case:shelves})
    }

    
    return(
        <>
        <div>                     
            <div className="px-4 sm:px-6 lg:px-8 rounded-lg shadow-lg py-8 bg-white">
                <div className="mb-8">
                    <TableDetails tableName={props.case.name} tableDescription={"View and edit case below. \n Shelves can be dragged to rearrange order"}>
                    
                        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-2">
                            <MutableCardProp saveValue={setTempName} heading="Update BookCase Name" dataType="string" defaultValue="Enter Book Case New Title"></MutableCardProp>
                            <MutableCardProp saveValue={setTempWidth} heading="Update BookCase Width" dataType="number" defaultValue={props.case.width}></MutableCardProp>
                            <button 
                            className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                            onClick = {() => {
                                props.saveCase({
                                    ...props.case,
                                    name: tempName,
                                    width: tempWidth,
                                })
                            }}>
                                Update Bookcase Details
                            </button>
                        </dl>
                    
                    </TableDetails>
                    <div className="mt-8 flex flex-col">
                        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                                <div className="overflow-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-300 table-auto">
                                        <TableHeader>
                                            <ColumnHeading label="Books" firstEntry={true}></ColumnHeading>
                                            <ColumnHeading label="Available Spcae"></ColumnHeading>
                                            <ColumnHeading label="Taken Space"></ColumnHeading>
                                            <ColumnHeading label ="Edit"></ColumnHeading>
                                            <ColumnHeading label="Delete"></ColumnHeading>
                                        </TableHeader>
                                        <ReactSortable
                                          filter=".addImageButtonContainer"
                                          className="divide-y divide-gray-200 bg-white"
                                          tag="tbody"
                                          dragClass="sortableDrag"
                                          list={props.case.case}
                                          setList={saveShelves}
                                          animation={200}
                                          easing="ease-out">
                                            {props.case.case.map((shelf, idx)=>{
                                                console.log(props.case.width)
                                                return(
                                                <tr>
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 w-[18rem] inline-flex group  items-center">{shelf.bookList.map((book)=>{
                                                        return <CldImage
                                                                className="rounded-lg mr-4"
                                                                crop="thumb"
                                                                width="50"
                                                                height="50"
                                                                src={book.Book.imageLink}
                                                                alt={"Image"}>
                                                                </CldImage>
                                                            })}</td>
                                                    
                                                    <TableEntry>{+(props.case.width-shelf.takenSpace).toFixed(2)} inches</TableEntry>
                                                    <TableEntry>{+((shelf.takenSpace).toFixed(2))} inches</TableEntry>
                                                    <EditShelfCalculatorModal isStandAlone={false} buttonText="Edit" submitText="Save" bookList={shelf.bookList} width={props.case.width} saveCase={props.saveCase} index={idx} case={props.case}></EditShelfCalculatorModal>
                                                    <DeleteRowEntry onDelete={() => {
                                                                const temp = {...props.case};
                                                                (temp.case).splice(idx, 1)
                                                                temp.numShelves = temp.numShelves-1
                                                                props.saveCase(temp)
                                                            }}></DeleteRowEntry>
                                                </tr>)
                                            })}

                                        </ReactSortable>
                                        
                                    </table>

                                    <div className="sm:flex sm:items-center">
                                    <div className="sm:flex-auto">
                                        <span className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none justify-right">
                                            <button 
                                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                                            onClick = {() => {
                                                const temp = {...props.case};
                                                temp.numShelves = (Number(temp.numShelves)+1);
                                                (temp.case).push({availableSpace:props.case.width, takenSpace:0, bookList:[]})
                                                props.saveCase(temp)
                                            }}>
                                                Add Shelf to Bottom
                                            </button>
                                        </span>
                                        <span className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none justify-right">
                                            <button 
                                            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                                            onClick = {() => {
                                                saveBook.mutate(props.case)
                                            }}>
                                                Save Case
                                            </button>
                                        </span>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}