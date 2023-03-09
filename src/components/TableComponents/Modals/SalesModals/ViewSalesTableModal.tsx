import TableDetails from "../../TableDetails";
import { editableBook } from '../../../../types/bookTypes';
import NewBookEntryTableRow from "../../TableRows/NewBookEntryTableRow";
import TableHeader from "../../TableHeader";
import ColumnHeading from "../../TableColumnHeadings/ColumnHeading";
import React, {useState} from "react";
import SaveCardChanges from "../../../CardComponents/SaveCardChanges";
import {api} from "../../../../utils/api";
import SecondaryButton from "../../../BasicComponents/SecondaryButton";
import PrimaryButton from "../../../BasicComponents/PrimaryButton";
import {Sale} from "../../../../types/salesTypes";
import ViewSalesRecModal from "./ViewSaleModal";
import SaleTableRow from "../../TableRows/SaleTableRow";

interface ViewSalesTableModalProps{
  salesRecId: string
  salesRecDate: string
  sales: Sale[]
  closeOut: () => void
}

export default function ViewSalesTableModal(props: ViewSalesTableModalProps) {
  const header = props.salesRecDate + " Sales Reconciliation"
  const hasSales = (props.sales.length != 0)

  function handleSave(){
    props.closeOut
  }


  return (
      <div className="px-4 sm:px-6 lg:px-8 rounded-lg shadow-lg py-8 bg-white">
        <div className="mb-8">
          <TableDetails tableName={header} tableDescription={"Viewing sales reconciliation with ID: " + props.salesRecId}>
          </TableDetails>
          {hasSales ? (
          <div className="mt-8 flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300 table-auto">
                    <TableHeader>
                      <ColumnHeading firstEntry={true} label="Title"></ColumnHeading>
                      <ColumnHeading label="Sale Price"></ColumnHeading>
                      <ColumnHeading label="Quantity Sold"></ColumnHeading>
                      <ColumnHeading label="Subtotal"></ColumnHeading>
                    </TableHeader>
                    <tbody className="divide-y divide-gray-200 bg-white">
                    {props.sales.map((sale) => (<SaleTableRow isView={true} isAdding={false} sale={sale}></SaleTableRow>))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          ) : <h2 className="m-10 ">Sales reconciliation has no sales...</h2>}
        </div>
        <div className="px-4 py-8 sm:px-6">
          <PrimaryButton onClick={props.closeOut} buttonText="Close"></PrimaryButton>
        </div>
      </div>
  )
}