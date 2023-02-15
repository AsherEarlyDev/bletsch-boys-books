import { useState } from 'react';
import { api } from "../../../utils/api";
import TableDetails from "../TableDetails";
import FilterableColumnHeading from "../FilterableColumnHeading";
import TableHeader from "../TableHeader";
import { VendorTableRow } from '../TableRows/VendorTableRow';
import DeleteVendorModal from '../Modals/VendorModals/DeleteVendorModal';
import AddVendorModal from '../Modals/VendorModals/AddVendorModal';
import CreateEntries from "../../CreateEntries";
import EditVendorModal from "../Modals/VendorModals/EditVendorModal";
import ViewVendorModal from "../Modals/VendorModals/ViewVendorModal";


export default function VendorTable() {
    const blah = api.vendor.getVendors.useQuery()
    console.log("vendors")
    console.log(blah.error)
    const vendors = api.vendor.getVendors.useQuery().data
    const newVendor = api.vendor.createVendor.useMutation()
    const [displayEditVendorView, setDisplayEditVendorView] = useState(false)
    const [displayDeleteVendorView, setDisplayDeleteVendorView] = useState(false)
    const [displayVendorView, setDisplayVendorView] = useState(false)
    const [currentVendor, setCurrentVendor] = useState({id: '', name: ''})

    const handleNewVendorSubmission = async (name: string) => {
        if (newVendor){
            newVendor.mutate({
                name: name
            })
        }
      }

    async function openEditVendorView(id: string){
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

    async function openDeleteVendorView(id: string){
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

    async function openVendorView(id: string){
      if (vendors){
        for (const ven of vendors){
          if (ven.id === id){
            setCurrentVendor({
              id: ven.id,
              name: ven.name,
            })
          }
        }
        setDisplayVendorView(true)
      }
    }
    function renderVendorView() {
      return <>
        {(displayVendorView && currentVendor) ?
            <CreateEntries closeStateFunction={setDisplayVendorView} submitText="Edit Vendor">
              <ViewVendorModal closeOut={closeVendorView} vendorId={currentVendor.id} vendorName={currentVendor.name} openEdit={openEditVendorView}></ViewVendorModal></CreateEntries> : null}
      </>;
    }
    function closeVendorView(){
      setDisplayVendorView(false)
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
                    {vendors ? vendors.map((vendor)=>(<VendorTableRow onView={openVendorView} onEdit={openEditVendorView}
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
          {renderVendorView()}
        </div>
      </div>

  )
}
