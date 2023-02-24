import AppShell from "../components/AppShell";
import React from 'react';
import { CldImage, CldUploadButton, CldUploadWidget } from 'next-cloudinary';
import ErrorAlert from "../components/BasicComponents/ErrorAlert";
import SuccessAlert from "../components/BasicComponents/SuccessAlert";

export default function DashboardPage() {

    return (
        <>
         <AppShell activePage="Dashboard"></AppShell>
          <CldUploadButton
              uploadPreset="book-image-preset"
              className="inline-flex w-1/3 justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
              onUpload={(result, widget) => {
                console.log(result.info.public_id)
              }}

          />
          <CldImage
              width="600"
              height="600"
              src="https://res.cloudinary.com/dyyevpzdz/image/upload/v1677264732/book-covers/lisphiz2ltw9oew0urvp.png"
              alt="My Image"
          />
        </>
    )
}