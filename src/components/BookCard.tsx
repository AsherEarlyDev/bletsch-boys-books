import { PaperClipIcon } from '@heroicons/react/20/solid'

export default function BookCard() {
  return (
      <div className="overflow-hidden bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Book Information</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and application.</p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Book Title</dt>
              <dd className="mt-1 text-sm text-gray-900">Get title from API</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Book ISBN</dt>
              <dd className="mt-1 text-sm text-gray-900">Get ISBN from API</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Author(s)</dt>
              <dd className="mt-1 text-sm text-gray-900">Get authors from API</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Publisher</dt>
              <dd className="mt-1 text-sm text-gray-900">Get publisher from API</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Publication Year</dt>
              <dd className="mt-1 text-sm text-gray-900">Get publication year from API</dd>
            </div>
          </dl>
        </div>
      </div>
  )
}
