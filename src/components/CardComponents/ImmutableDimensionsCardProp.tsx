
interface ImmutableDimensionsCardPropProps{
  length: number
  width: number
  height: number
}

export default function ImmutableDimensionsCardProp(props: ImmutableDimensionsCardPropProps) {
  const dimensions = ((props.length > 0 ? props.length + "cm " : "N/A ") + "x "  + (props.width > 0 ? props.width + "cm " : "N/A ") + "x " + (props.height > 0 ? props.height + "cm " : "N/A "))
  return (
      <div className="sm:col-span-1">
        <dt className="text-md font-medium text-gray-500">Dimensions (L x W x H)</dt>
        <dd className="mt-2 text-sm text-gray-900">{dimensions}</dd>
      </div>
  )
}
