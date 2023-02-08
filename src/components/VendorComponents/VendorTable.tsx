import { useState } from 'react';
import { api } from "../../utils/api";
import TableDetails from "../TableComponents/TableDetails";
import FilterableColumnHeading from "../TableComponents/FilterableColumnHeading";
import TableHeader from "../TableComponents/TableHeader";
import { VendorTableRow } from './VendorTableRow';
import CreateSaleEntries from '../CreateEntries';
import DeleteVendorCard from './DeleteVendorCard';
import AddVendorModal from './AddVendorModal';
import CreateEntries from "../CreateEntries";
import EditVendorCard from "./EditVendorCard";
import SuccessAlert from "../BasicComponents/SuccessAlert";


export default function VendorTable() {
    const vendors = api.vendor.getVendors.useQuery().data
    const newVendor = api.vendor.createVendor.useMutation()
    const [displayEdit, setDisplayEdit] = useState(false)
    const [newName, setNewName] = useState("")
    const [vendorNameChangeConfirmation, setVendorNameChangeConfirmation] = useState(false)
    const [vendorDeleteConfirmation, setVendorDeleteConfirmation] = useState(false)
    const [displayDelete, setDisplayDelete] = useState(false)
    const [currVendor, setCurrVendor] = useState({id: '', name: ''})

    const handleVendorSubmit = async (name: string) => {
        if (newVendor){
            newVendor.mutate({
                name: name
            })
        }
      }


    const handleEditVendor = async (id:string) => {
        if (vendors){
          for (const ven of vendors){
            if (ven.id === id){
              setCurrVendor({
                id: ven.id, 
                name: ven.name,
              })
            }
          }
          setDisplayEdit(true) 
        }
      }
    
    const handleDelete = async (id:string) => {
        if (vendors){
            for (const ven of vendors){
              if (ven.id === id){
                setCurrVendor({
                  id: ven.id, 
                  name: ven.name,
                })
              }
            }
            setDisplayDelete(true)
        }
    }



    function closeDisplayEdit(){
      setDisplayEdit(false)
      setVendorNameChangeConfirmation(true)
    }

    function closeDisplayDelete(){
      setDisplayDelete(false)
      setVendorDeleteConfirmation(true)

    }


    function renderEditVendorView() {
      return(
          <>
            {(displayEdit && currVendor) ?
              <CreateEntries closeStateFunction={setDisplayEdit} submitText="Edit Vendor">
                <EditVendorCard newName={setNewName} closeOut={closeDisplayEdit} vendorId={currVendor.id} vendorName={currVendor.name}></EditVendorCard>
              </CreateEntries> : null}
          </>
      )
    }


    function closeEditVendorConfirmationAlert() {
      setVendorNameChangeConfirmation(false)
    }

    function renderEditVendorConfirmationAlert() {
    return <>
      {(vendorNameChangeConfirmation && currVendor) ? <SuccessAlert message="Name change success." messageDetails={("Vendor name changed to: " + newName)} closeAlert={closeEditVendorConfirmationAlert}></SuccessAlert> : null}
    </>

  }

    
    function renderDeleteVendorView() {
        return <>
          {(displayDelete && currVendor) ?
              <CreateEntries closeStateFunction={setDisplayDelete} submitText="Delete Vendor">
                <DeleteVendorCard closeOut={closeDisplayDelete} vendorId={currVendor.id} vendorName={currVendor.name}></DeleteVendorCard></CreateEntries> : null}
      </>;
      }
    
  

  return (
      <div className="px-4 sm:px-6 lg:px-8">
        {renderEditVendorConfirmationAlert()}
        <TableDetails tableName="Vendors" tableDescription="A list of all the Vendors.">
          <AddVendorModal showVendorEdit={handleVendorSubmit} buttonText="Add New Vendor" submitText="Add Vendor"></AddVendorModal>
        </TableDetails>
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div
                  className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300 table-auto">
                  <TableHeader>
                    <FilterableColumnHeading label="Vendor ID" firstEntry={true}></FilterableColumnHeading>
                    <FilterableColumnHeading label="Vendor Name"></FilterableColumnHeading>
                  </TableHeader>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {vendors ? vendors.map((vendor)=>(<VendorTableRow onEdit={handleEditVendor}
                    onDelete={handleDelete} vendorInfo={{id: vendor.id, name: vendor.name}} ></VendorTableRow>)): null}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div>
          {renderEditVendorView()}
          {renderDeleteVendorView()}
        </div>
      </div>

  )
}
