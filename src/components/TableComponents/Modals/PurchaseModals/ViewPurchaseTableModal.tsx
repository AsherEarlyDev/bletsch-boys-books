import TableDetails from "../../TableDetails";
import TableHeader from "../../TableHeader";
import ColumnHeading from "../../TableColumnHeadings/ColumnHeading";
import React, {useState} from "react";
import PrimaryButton from "../../../BasicComponents/PrimaryButton";
import SaleTableRow from "../../TableRows/SaleTableRow";
import {Purchase} from "../../../../types/purchaseTypes";
import PurchaseTableRow from "../../TableRows/PurchaseTableRow";

interface ViewPurchaseTableModalProps{
  purchaseOrderId: string
  purchaseDate: string
  purchaseVendorName: string
  purchases: Purchase[]
  closeOut: () => void
}

export default function ViewPurchaseTableModal(props: ViewPurchaseTableModalProps) {
  const header = props.purchaseDate + " Purchase Order"
  const hasPurchase = (props.purchases.length != 0)

  function handleSave(){
    props.closeOut
  }


  return (
      <div className="px-4 sm:px-6 lg:px-8 rounded-lg shadow-lg py-8 bg-white">
        <div className="mb-8">
          <TableDetails tableName={header} tableDescription={"Vendor: " + props.purchaseVendorName + ",  VendorID: " + props.purchaseOrderId}>
          </TableDetails>
          {hasPurchase ? (
          <div className="mt-8 flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300 table-auto">
                    <TableHeader>
                      <ColumnHeading firstEntry={true} label="Title"></ColumnHeading>
                      <ColumnHeading label="Purchase Price"></ColumnHeading>
                      <ColumnHeading label="Quantity Bought"></ColumnHeading>
                      <ColumnHeading label="Subtotal"></ColumnHeading>
                    </TableHeader>
                    <tbody className="divide-y divide-gray-200 bg-white">
                    {props.purchases.map((purchase) => (<PurchaseTableRow isView={true} isAdding={false} purchase={purchase}></PurchaseTableRow>))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          ) : <h2 className="m-10 ">Purchase Order has no purchases...</h2>}
        </div>
        <div className="px-4 py-8 sm:px-6">
          <PrimaryButton onClick={props.closeOut} buttonText="Close"></PrimaryButton>
        </div>
      </div>
  )
}