import { CheckIcon } from "@heroicons/react/20/solid"

interface MutableDimensionsCardPropProps{
  defaultLength: number
  defaultWidth: number
  defaultHeight: number
  saveLength: any
  saveWidth: any
  saveHeight: any
  length:number
  width:number
  height:number
  subLength:number
  subWidth:number
  subHeight:number
}

export default function MutableStateDimensionsCardProp(props: MutableDimensionsCardPropProps) {
  function handleChangeLength(event: { target: { value: any; }; }){
    props.saveLength(event.target.value)
  };
  function handleChangeWidth(event: { target: { value: any; }; }){
    props.saveWidth(event.target.value)
  };
  function handleChangeHeight(event: { target: { value: any; }; }){
    props.saveHeight(event.target.value)
  };
  return (
      <div className="sm:col-span-1">
        <dt className="text-md font-medium text-gray-500">
          <label htmlFor="dimensions">
            Dimensions (L x W x H)
          </label>
        </dt>
        <dd className="mt-1 text-sm text-gray-900 flex gap-1 flex-row justify-center">
          <input
              placeholder={props.defaultLength ? props.defaultLength.toString() : null}
              type="number"
              name="dimensions"
              id="dimensions"
              required={false}
              onChange={handleChangeLength}
              min="0"
              value={props.length}
              className="mt-1 p-1 block w-14 text-sm text-gray-900 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          <div className="pt-2 text-sm font-small text-gray-500">
            X
          </div>
          <input
              placeholder={props.defaultWidth ? props.defaultWidth.toString() : null}
              type="number"
              name="dimensions"
              id="dimensions"
              required={false}
              onChange={handleChangeWidth}
              min="0"
              value={props.width}
              className="mt-1 p-1 block w-14 text-sm text-gray-900 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          <div className="pt-2 text-sm font-small text-gray-500">
            X
          </div>
          <input
              placeholder={props.defaultHeight ? props.defaultHeight.toString() : null}
              type="number"
              name="dimensions"
              id="dimensions"
              required={false}
              onChange={handleChangeHeight}
              min="0"
              value={props.height}
              className="mt-1 p-1 block w-14 text-sm text-gray-900 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </dd>
        <dd className="whitespace-nowrap text-red-900 px-2 py-4 pl-4 pr-3 text-sm justify-left">
          Subsidiary: {props.subLength}" X {props.subWidth}" X {props.subHeight}"
          <button onClick={()=>{
            props.saveLength(props.subLength)
            props.saveHeight(props.subHeight)
            props.saveWidth(props.subWidth)
            }} className="text-green-600 hover:text-green-900">
            <CheckIcon className="h-5 w-5"/>
          </button>
        </dd>
      </div>
  )
}
