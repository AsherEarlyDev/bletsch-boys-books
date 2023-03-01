import { PaperClipIcon } from '@heroicons/react/20/solid'
import { Dispatch, SetStateAction } from 'react';
import BuybackBookSelect from './BuybackBookSelect';

export default function BuybackCardProp(props:{saveFunction: any | undefined, defaultValue?:any, vendorId: string}) {
  return (
      <div className="sm:col-span-1">
        <td className="whitespace-nowrap px-2 py-4 text-sm text-gray-500">
          <BuybackBookSelect saveFunction = {props.saveFunction} defaultValue={props.defaultValue} vendorId={props.vendorId}></BuybackBookSelect>
        </td>
      </div>
  )
}
