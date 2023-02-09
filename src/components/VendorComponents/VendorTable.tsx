import { useState } from 'react';
import { api } from "../../utils/api";
import TableDetails from "../TableComponents/TableDetails";
import FilterableColumnHeading from "../TableComponents/FilterableColumnHeading";
import TableHeader from "../TableComponents/TableHeader";
import { VendorTableRow } from './VendorTableRow';
import CreateSaleEntries from '../CreateEntries';
import DeleteVendorModal from './VendorModals/DeleteVendorModal';
import AddVendorModal from './VendorModals/AddVendorModal';
import CreateEntries from "../CreateEntries";
import EditVendorModal from "./VendorModals/EditVendorModal";
import SuccessAlert from "../BasicComponents/SuccessAlert";


export default function VendorTable() {
    const vendors = api.vendor.getVendors.useQuery().data
    const newVendor = api.vendor.createVendor.useMutation()
    const [displayEditVendorView, setDisplayEditVendorView] = useState(false)
    const [displayDeleteVendorView, setDisplayDeleteVendorView] = useState(false)
    const [currentVendor, setCurrentVendor] = useState({id: '', name: ''})

    const handleNewVendorSubmission = async (name: string) => {
        if (newVendor){
            newVendor.mutate({
                name: name
            })
        }
      }

    const openEditVendorView = async (id:string) => {
        if (vendors){
          for (const ven of vendors){
            if (ven.id === id){
              setCurrentVendor({
                id: ven.id, 
                name: ven.name,
              })
            }
          }
          setDisplayEditVendorView(true)
        }
      }
    function renderEditVendorView() {
      return(
          <>
            {(displayEditVendorView && currentVendor) ?
              <CreateEntries closeStateFunction={setDisplayEditVendorView} submitText="Edit Vendor">
                <EditVendorModal closeOut={closeEditVendorView} vendorId={currentVendor.id} vendorName={currentVendor.name}></EditVendorModal>
              </CreateEntries> : null}
          </>
      )
    }
    function closeEditVendorView(){
      setDisplayEditVendorView(false)
    }

    const openDeleteVendorView = async (id:string) => {
      if (vendors){
        for (const ven of vendors){
          if (ven.id === id){
            setCurrentVendor({
              id: ven.id,
              name: ven.name,
            })
          }
        }
        setDisplayDeleteVendorView(true)
      }
    }
    function renderDeleteVendorView() {
      return <>
        {(displayDeleteVendorView && currentVendor) ?
            <CreateEntries closeStateFunction={setDisplayDeleteVendorView} submitText="Delete Vendor">
              <DeleteVendorModal closeOut={closeDeleteVendorView} vendorId={currentVendor.id} vendorName={currentVendor.name}></DeleteVendorModal></CreateEntries> : null}
      </>;
    }
    function closeDeleteVendorView(){
      setDisplayDeleteVendorView(false)
    }


  return (
      <div className="px-4 sm:px-6 lg:px-8">
        <TableDetails tableName="Vendors" tableDescription="A list of all the Vendors.">
          <AddVendorModal showVendorEdit={handleNewVendorSubmission} buttonText="Add New Vendor" submitText="Add Vendor"></AddVendorModal>
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
                    {vendors ? vendors.map((vendor)=>(<VendorTableRow onEdit={openEditVendorView}
                    onDelete={openDeleteVendorView} vendorInfo={{id: vendor.id, name: vendor.name}} ></VendorTableRow>)): null}
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
