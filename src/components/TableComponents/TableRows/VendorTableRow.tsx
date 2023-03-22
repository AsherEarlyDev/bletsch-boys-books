import TableEntry from "../TableEntries/TableEntry";
import React from "react";
import EditRowEntry from "../TableEntries/EditRowEntry";
import DeleteRowEntry from "../TableEntries/DeleteRowEntry";
import ViewTableEntry from "../TableEntries/ViewTableEntry";
import {useSession} from "next-auth/react";
import DeleteEntryModal from "../Modals/MasterModals/DeleteEntryModal";
import {api} from "../../../utils/api";


interface VendorRowProps{
    vendorInfo: {
        id: string
        name: string
        buybackRate: number
    },
    onEdit: (id:string) => void,
    onView: (id: string) => void
  }


export function VendorTableRow(props: VendorRowProps){
    const { data: session} = useSession()
    function handleEdit(){
      props.onEdit(props.vendorInfo.id)
    }
    function handleView(){
      props.onView(props.vendorInfo.id)
    }
  return (
      <tr>
        <ViewTableEntry onView={handleView}>{props.vendorInfo.name}</ViewTableEntry>
        <TableEntry>{(props.vendorInfo.buybackRate === null) || (props.vendorInfo.buybackRate === 0)? "" : 
        (props.vendorInfo.buybackRate * 100)+"%"}</TableEntry>
        <EditRowEntry onEdit={handleEdit}></EditRowEntry>
        <DeleteEntryModal id={props.vendorInfo.id} item={"Vendor"} router={api.vendor.deleteVendor}></DeleteEntryModal>
      </tr>
      
  )
}
