
interface MutableDimensionsCardPropProps{
  defaultLength: number
  defaultWidth: number
  defaultHeight: number
  saveLength: any
  saveWidth: any
  saveHeight: any
}

export default function MutableDimensionsCardProp(props: MutableDimensionsCardPropProps) {
  const dimensions = ((props.length > 0 ? props.length + "cm " : "N/A ") + "x "  + (props.width > 0 ? props.width + "cm " : "N/A ") + "x " + (props.height > 0 ? props.height + "cm " : "N/A "))
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
        <dd className="mt-1 text-sm text-gray-900 flex gap-1 flex-row">
          <input
              placeholder={props.defaultLength}
              type="number"
              name="dimensions"
              id="dimensions"
              required={false}
              onChange={handleChangeLength}
              min="0"
              className="mt-1 p-1 block w-14 text-sm text-gray-900 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          <div className="pt-2 text-sm font-small text-gray-500">
            X
          </div>
          <input
              placeholder={props.defaultWidth}
              type="number"
              name="dimensions"
              id="dimensions"
              required={false}
              onChange={handleChangeWidth}
              min="0"
              className="mt-1 p-1 block w-14 text-sm text-gray-900 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          <div className="pt-2 text-sm font-small text-gray-500">
            X
          </div>
          <input
              placeholder={props.defaultHeight}
              type="number"
              name="dimensions"
              id="dimensions"
              required={false}
              onChange={handleChangeHeight}
              min="0"
              className="mt-1 p-1 block w-14 text-sm text-gray-900 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </dd>
      </div>
  )
}
