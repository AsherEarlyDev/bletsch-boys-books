import TableEntry from "../TableEntries/TableEntry";
import React from "react";
import { SalesRec } from "../../../types/salesTypes";

interface SalesReportTableRowProp{
    salesReportInfo: {
        date: string,
        cost: number,
        revenue: number,
        profit: number
    },
  }

interface TotalTableRowProp{
    salesReportInfo: {
        cost: number,
        revenue: number,
        profit: number
    },
  }

interface TopBooksTableRowProp{
    topBooksInfo: {
        isbn: string
        title: string
        numBooks: number,
        recentCost: number,
        revenue: number,
        profit: number
    },
  }



export function SalesReportTableRow(props:SalesReportTableRowProp) {
  return (
      <tr>
        <TableEntry firstEntry={true}>{props.salesReportInfo.date}</TableEntry>
        <TableEntry>{props.salesReportInfo.cost}</TableEntry>
        <TableEntry>{props.salesReportInfo.revenue}</TableEntry>
        <TableEntry>{props.salesReportInfo.profit}</TableEntry>
      </tr>
  )
}

export function TopSellingTableRow(props:TopBooksTableRowProp) {
  return (
      <tr>
        <TableEntry firstEntry={true}>{props.topBooksInfo.isbn}</TableEntry>
        <TableEntry>{props.topBooksInfo.title}</TableEntry>
        <TableEntry>{props.topBooksInfo.numBooks}</TableEntry>
        <TableEntry>{props.topBooksInfo.revenue}</TableEntry>
        <TableEntry>{props.topBooksInfo.recentCost}</TableEntry>
        <TableEntry>{props.topBooksInfo.profit}</TableEntry>
      </tr>
  )
}

export function SalesReportTotalTableRow(props: TotalTableRowProp){
  return (
      <tr>
        <TableEntry firstEntry={true}>{}</TableEntry>
        <TableEntry>{props.salesReportInfo.cost}</TableEntry>
        <TableEntry>{props.salesReportInfo.revenue}</TableEntry>
        <TableEntry>{props.salesReportInfo.profit}</TableEntry>
      </tr>
  )
}
