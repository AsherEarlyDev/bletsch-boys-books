// import ImmutableCardProp from "../../../CardComponents/ImmutableCardProp";
// import MutableCardProp from "../../../CardComponents/MutableCardProp";
// import CardTitle from "../../../CardComponents/CardTitle";
// import CardGrid from "../../../CardComponents/CardGrid";
// import SaveCardChanges from "../../../CardComponents/SaveCardChanges";
// import { useState } from 'react';
// import { api } from '../../../../utils/api';
// import SecondaryButton from "../../../BasicComponents/SecondaryButton";
// import PrimaryButton from "../../../BasicComponents/PrimaryButton";
// import {toast} from "react-toastify";


// interface DeleteBuybackOrderModalProp{
//   buybackId:  string,
//   closeOut: () => void
// }


// export default function DeleteBuybackOrderModal(props:DeleteBuybackOrderModalProp) {
//   const [open, setOpen] = useState(true)
//   const deleteBuyback = api.buybackOrder.deleteBuybackOrder.useMutation({
//     onError: (error)=>{
//       toast.error(error.message)
//     },
//     onSuccess: ()=>{
//       window.location.reload()
//     }})
//   const message = ("Are you sure you want to delete this Buyback order from the database? This action cannot be undone. All associated Buybacks will be deleted")

//   function closeModal(){
//     setOpen(false)
//     props.closeOut()
//   }

//   function handleDeleteBuybackOrder(){
//     if(props.buybackId){
//       deleteBuyback.mutate({
//         id: props.buybackId
//       })
//       closeModal()
//     }
//     else{
//       toast.error("No buyback found!")
//     }
//   }

//   return (
//       ((open && props.buybackId) ?
//       <div className="overflow-auto m-8 border border-gray-300 bg-white shadow rounded-lg">
//         <CardTitle heading="Delete buyback Order..." subheading={message}></CardTitle>
//         <div className="gap-5 flex flex-row justify-around px-4 py-4 sm:px-6">
//           <SecondaryButton onClick={props.closeOut} buttonText="Cancel"></SecondaryButton>
//           <PrimaryButton onClick={handleDeleteBuybackOrder} buttonText="Delete Buyback Order"></PrimaryButton>
//         </div>
//       </div>
//       : null)
//   )
// }
