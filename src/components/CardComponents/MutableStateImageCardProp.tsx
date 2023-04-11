import { CheckIcon } from "@heroicons/react/20/solid";
import { CldImage } from "next-cloudinary";

export default function MutableStateImageCardProp(props:any) {
  const handleChange = (event: { target: { value: any; }; }) => {
    props.saveValue(event.target.value)
  };

  const preventMinus = (e) => {
    if (e.code === 'Minus') {
      e.preventDefault();
    }
  };
  const classWidth = (props.shrink ? " w-20" : " w-44")

  return (
      <div className="sm:col-span-1">
        <dt className="text-md font-medium text-gray-500">
          <label htmlFor={props.heading}>
            {props.heading}
          </label>
        </dt>
        <dd className="flex mt-1 text-sm text-gray-900 justify-center">
        <img
              width="100"
              height="100"
              src={props.imageUrl}
              alt={"Image"}>
          </img>
          <button onClick={()=>props.saveValue(props.subsidiaryImage)} className="text-green-600 hover:text-green-900">
            <CheckIcon className="h-5 w-5"/>
          </button>
        </dd>
      </div>
  )
}
