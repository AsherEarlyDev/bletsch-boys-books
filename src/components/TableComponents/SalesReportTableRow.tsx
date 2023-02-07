import TableEntry from "./TableEntry";
import React from "react";
import { SalesRec } from "../../types/salesTypes";

interface SalesReportTableRowProp{
    salesReportInfo: {
        date: string,
        cost: number,
        revenue: number
    },
  }


export default function SalesReportTableRow(props:SalesReportTableRowProp) {
  return (
      <tr>
        <TableEntry firstEntry={true}>{props.salesReportInfo.date}</TableEntry>
        <TableEntry>{props.salesReportInfo.cost}</TableEntry>
        <TableEntry>{props.salesReportInfo.revenue}</TableEntry>
        <TableEntry>{props.salesReportInfo.revenue - props.salesReportInfo.cost}</TableEntry>
      </tr>
  )
}
