import { useState } from 'react';
import { api } from "../../utils/api";
import TableDetails from "../TableComponents/TableDetails";
import FilterableColumnHeading from "../TableComponents/FilterableColumnHeading";
import TableHeader from "../TableComponents/TableHeader";
import { VendorTableRow } from '../TableComponents/VendorTableRow';
import CreateSaleEntries from '../CreateEntries';
import VendorCard from './VendorCard';
import AddVendorModal from './AddVendorModal';

export default function VendorTable() {
    const vendors = api.vendor.getVendors.useQuery().data
    const [displayEdit, setDisplayEdit] = useState(false)
    const [displayDelete, setDelete] = useState(false)
    const [currVendor, setCurrVendor] = useState({id: '', name: ''})
    const newVendor = api.vendor.createVendor.useMutation()

    const handleVendorSubmit = async (name: string) => {
        if (newVendor){
            newVendor.mutate({
                name: name
            })
        }
      }


    const handleEdit = async (id:string) => {
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
            setDelete(true) 
          }
      }

    function renderEdit() {
        console.log(currVendor)
        return <>
          {(displayEdit && currVendor) ?
              <CreateSaleEntries submitText="Edit Vendor"> 
                <VendorCard vendorId={currVendor.id} cardType="edit" vendorName={currVendor.name}></VendorCard></CreateSaleEntries> : null}
      </>;
      }

    
    
    function renderDelete() {
        return <>
          {(displayDelete && currVendor) ?
              <CreateSaleEntries submitText="Delete Vendor"> 
                <VendorCard vendorId={currVendor.id} cardType="delete" vendorName={currVendor.name}></VendorCard></CreateSaleEntries> : null}
      </>;
      }
    
  

  return (
      <div className="px-4 sm:px-6 lg:px-8">
        <TableDetails tableName="Vendors"
                      tableDescription="A list of all the Vendors.">
                <AddVendorModal showVendorEdit={handleVendorSubmit} buttonText="Add New Vendor"
                submitText="Add Vendor"></AddVendorModal>
        </TableDetails>
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div
                  className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300 table-auto">
                  <TableHeader>
                    <FilterableColumnHeading label="Vendor ID"
                                             firstEntry={true}></FilterableColumnHeading>
                    <FilterableColumnHeading label="Vendor Name"></FilterableColumnHeading>
                  </TableHeader>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {vendors ? vendors.map((vendor)=>(<VendorTableRow onEdit={handleEdit} 
                    onDelete={handleDelete} vendorInfo={{id: vendor.id, name: vendor.name}} ></VendorTableRow>)): null}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div>
          {renderEdit()}
          {renderDelete()}
        </div>
      </div>

  )
}
