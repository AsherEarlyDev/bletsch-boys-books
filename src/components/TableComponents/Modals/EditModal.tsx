import { PlusIcon } from "@heroicons/react/24/outline";
import MutableCardProp from "../../CardComponents/MutableCardProp";
import SaveCardChanges from "../../CardComponents/SaveCardChanges";
import VendorSelect from "../../CardComponents/VendorSelect";
import ColumnHeading from "../TableColumnHeadings/ColumnHeading";
import TableDetails from "../TableDetails";
import TableHeader from "../TableHeader";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Vendor } from "../../../types/vendorTypes";
import { useState } from "react";
import Papa from "papaparse";
import BuybackTableRow from "../TableRows/BuybackTableRow";


interface EditModalProps{
    header: string
    type: string
    id: string
    vendor?: Vendor
    date: string
    tableHeadings: string[]
    items: any[]
    setDate: (date: string)=> void
    saveVendor?: (vendor: Vendor)=>void
    closeOut: ()=>void
    openRow: ()=>void
    openConfirmation: ()=>void
    handleCSV: (e: React.FormEvent<HTMLInputElement>)=>void
    confirmationView: any
    renderCSV: any
    renderAdd: any

}


export default function EditModal(props: EditModalProps){


    return (
        <div className="px-4 sm:px-6 lg:px-8 rounded-lg shadow-lg py-8 bg-white">
          <div className="mb-8">
            <TableDetails tableName={props.header} tableDescription={"Viewing "+props.type+" with ID: " + props.id}>
            </TableDetails>
            <div className="flex flex-row gap-10 pt-4 justify-center">
              <MutableCardProp saveValue={props.setDate} heading="Change Date" required="True" dataType="date" defaultValue={props.date}></MutableCardProp>
              <div className="mt-1">
                {(props.vendor && props.saveVendor)? <VendorSelect saveFunction={props.saveVendor} defaultValue={props.vendor?.name}></VendorSelect>: null}
              </div>
            </div>
            <div className="mt-8 flex flex-col">
              <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                  <div className="overflow-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300 table-auto">
                      <TableHeader>
                        <ColumnHeading firstEntry={true} label={props.tableHeadings[0]}></ColumnHeading>
                        {props.tableHeadings.slice(1).map((head)=>(<ColumnHeading label={head}></ColumnHeading>))}
                      </TableHeader>
                      <tbody className="divide-y divide-gray-200 bg-white">
  
                      {props.items?.map((buyback) => (<BuybackTableRow vendorId={props.vendor?.id} isView={false} isAdding={false} buyback={buyback}></BuybackTableRow>))}
                      {props.renderCSV()}
                      {props.renderAdd()}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex flex-row mt-5">
                    <button
                        type="button"
                        className=" inline-flex w-1/4 justify-center gap-2 rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                        onClick={props.openRow}>
                      {"Add "+props.type} <PlusIcon className="h-5 w-5"></PlusIcon>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <form method="post" onSubmit={props.handleCSV}>
            <div>
              <label>Import with a CSV: </label>
              <input type="file" id="buybackCSV" name="buybackCSV" accept=".csv"></input>
              <div>
                <button
                type="submit"
                className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm">
                  Upload CSV
                </button>
              </div>
            </div>
          </form>
          <div className="px-4 py-2 sm:px-6">
            <SaveCardChanges saveModal={props.openConfirmation} closeModal={props.closeOut}></SaveCardChanges>
          </div>
          {props.confirmationView()}
          <ToastContainer/>
  
        </div>
    )
}