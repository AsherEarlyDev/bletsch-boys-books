import React from "react";

export default function Checkbox(props: { checked: boolean, onChange: () => void }) {
  return <div className="p-3 flex h-5 items-center">
    <input
        type="checkbox"
        checked={props.checked}
        onChange={props.onChange}
        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
    />
  </div>;
}