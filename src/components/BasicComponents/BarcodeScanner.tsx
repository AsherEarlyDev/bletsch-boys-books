import Link from "next/link";
import { useEffect, useState } from "react";
import { useHtml5QrCodeScanner } from "react-html5-qrcode-reader";
import { api } from "../../utils/api";

export default function BarcodeScanner(props) {
    const {Html5QrcodeScanner}  = useHtml5QrCodeScanner('html5-qrcode.min.js')
    var [currentISBN, setCurrentIsbn] = useState()
    var html5QrcodeScanner
    
    
        if (Html5QrcodeScanner) {
            console.log("banana")
            // Creates a new instance of `HtmlQrcodeScanner` and renders the block.
            html5QrcodeScanner = new Html5QrcodeScanner(
                "reader",
                { fps: 10, qrbox: {width: 250, height: 250} },
                /* verbose= */ false);
            console.log("here")
            html5QrcodeScanner.render(
                (data: any) => {
                    props.setBook(data)                                             
                } , 
                (err: any) => console.log('err ->', err)
            );
        }
    
    
    // useEffect(() => {
    //     console.log("tomato")
    //     if (Html5QrcodeScanner) {
    //         console.log("banana")
    //         // Creates a new instance of `HtmlQrcodeScanner` and renders the block.
    //         html5QrcodeScanner = new Html5QrcodeScanner(
    //             "reader",
    //             { fps: 10, qrbox: {width: 250, height: 250} },
    //             /* verbose= */ false);
    //         console.log("here")
    //         html5QrcodeScanner.render(
    //             (data: any) => {
    //                 if(currentISBN !== data) setCurrentIsbn(data)                                 
    //             } , 
    //             (err: any) => console.log('err ->', err)
    //         );
    //     }
    // }, [Html5QrcodeScanner])
        
    return (
        (<>
        {<div className=" overflow-auto m-8 border border-gray-300 bg-white shadow rounded-lg justify-center items-center">
            {<div id='reader' ></div> }
        </div>}

        
        </>
                )
    )
}