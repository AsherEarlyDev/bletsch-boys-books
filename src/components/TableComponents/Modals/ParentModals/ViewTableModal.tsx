import TableDetails from "../../TableDetails";
import TableHeader from "../../TableHeader";
import ColumnHeading from "../../TableColumnHeadings/ColumnHeading";
import React, {useState} from "react";
import PrimaryButton from "../../../BasicComponents/PrimaryButton";
import { Vendor } from "../../../../types/vendorTypes";
import { genericItem } from "../../../../types/generalTypes";
import TableRow from "../../TableRows/Parent/TableRow";

interface ViewTableModalProps{
  type: string
  id: string
  date: string
  vendor: Vendor
  items: genericItem[]
  closeOut: () => void
}

export default function ViewTableModal(props: ViewTableModalProps) {
  const header = `${props.date} ${props.type}`
  console.log(props.items)
  const hasItem = (props.items.length != 0)
  console.log(props.vendor)
  console.log(props.id)

  const tableDescription = props.vendor ? `Vendor: ${props.vendor.name}, Order ID: ${props.id}`: `Sales Record ID: ${props.id}`

  function handleSave(){
    props.closeOut
  }


  return (
      <div className="px-4 sm:px-6 lg:px-8 rounded-lg shadow-lg py-8 bg-white">
        <div className="mb-8">
          <TableDetails tableName={header} tableDescription={tableDescription}>
          </TableDetails>
          {hasItem ? (
          <div className="mt-8 flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300 table-auto">
                    <TableHeader>
                      <ColumnHeading firstEntry={true} label="Title"></ColumnHeading>
                      <ColumnHeading label={`${props.type} Price`}></ColumnHeading>
                      <ColumnHeading label="Quantity Bought"></ColumnHeading>
                      <ColumnHeading label="Subtotal"></ColumnHeading>
                    </TableHeader>
                    <tbody className="divide-y divide-gray-200 bg-white">
                    {props.items.map((item) => (<TableRow type={props.type} vendorId={props.vendor ? props.vendor.id: null} isView={true} isAdding={false} item={item}></TableRow>))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          ) : <h2 className="m-10 ">{props.type} has no {props.type.split(" ")[0].toLowerCase()}...</h2>}
        </div>
        <div className="px-4 py-8 sm:px-6">
          <PrimaryButton onClick={props.closeOut} buttonText="Close"></PrimaryButton>
        </div>
      </div>
  )
}