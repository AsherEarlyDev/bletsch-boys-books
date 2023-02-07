import AppShell from "../components/AppShell";
import {Dialog} from "@headlessui/react";

export default function DocumentationPage() {

    function handleSubmit(e: React.FormEvent){
        e.preventDefault()
        alert("ciao")
    }


  return (
      <>
        <AppShell activePage="Documentation"></AppShell>
          <form method="post" onSubmit={handleSubmit}>
              <div>
                  <div className="text-center">
                      <h1 as="h3" className="text-lg font-medium leading-6 text-gray-900">
                          Add book ISBNs
                      </h1>
                      <p className="font-small leading-6 text-gray-900">
                          Seperate values by commas or spaces.
                      </p>
                  </div>
                  <div className="mt-5">
                        <textarea
                            rows={6}
                            name="book-isbns"
                            id="book-isbns"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            defaultValue=""
                            minLength={10}
                        />
                  </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                      type="submit"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                  >
                      Submit
                  </button>
                  <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                  >
                      Cancel
                  </button>
              </div>
          </form>
      </>
  )
}