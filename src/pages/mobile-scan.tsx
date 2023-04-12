import {Book, Genre, Author} from '@prisma/client';
import React, {Fragment, useEffect, useState} from 'react'
import { useHtml5QrCodeScanner, useAvailableDevices } from 'react-html5-qrcode-reader';
import { Dialog, Transition } from '@headlessui/react'
import { useRouter } from 'next/router';

import AppShell from '../components/AppShell';
import dynamic from "next/dynamic";
import { api } from '../utils/api';
import Link from 'next/link';
const BarcodeScanner = dynamic(
  () => {
    return import("../components/BasicComponents/BarcodeScanner");
  },
  { ssr: false }
);

export default function BookScanModal(props) {
  const [foundBook, setFoundBook] = useState("")
  const books = (api.books.findBooks.useQuery([foundBook]).data)
  const book = books?.internalBooks[0]
  const bookDoesNotExist = books?.absentBooks.length >0 || books?.externalBooks.length >0
    
  return (
      (<>
        <AppShell activePage="Book Scan"></AppShell>
        <div className=" border border-gray-300 bg-white shadow rounded-lg justify-center items-center">
        {foundBook==="" ? <BarcodeScanner setBook={setFoundBook}></BarcodeScanner> : 
        <>
            <h5>Current ISBN: {foundBook}</h5>
            <h5>{books ? (bookDoesNotExist ? "Book  does not exist in internal database." :  book.title) : "Loading..."}</h5>
            {book ? <Link href={{pathname:'/books', query:{openView:"true",viewId: foundBook}}}>
            <button
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            >View Book</button></Link>: null }
            <button
            onClick = {() => {
                window.location.reload()
        }}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            >Scan Another Book</button></>
        
        }
        </div>
        
        </>
              )
  )
}
const html5QrCodeScannerFile = 'html5-qrcode.min.js'; // <-- this file is in /public.

