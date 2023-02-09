import PrimaryButton from "../BasicComponents/PrimaryButton";
import SecondaryButton from "../BasicComponents/SecondaryButton";


export default function SaveCardChanges(props: { saveModal: ()=> void; closeModal: ()=> void}) {
  return (
      <div className="gap-5 flex flex-row justify-around px-4 py-8 sm:px-6">
        <SecondaryButton onClick={props.closeModal} buttonText="Cancel Changes"></SecondaryButton>
        <PrimaryButton onClick={props.saveModal} buttonText="Save Changes"></PrimaryButton>
      </div>
  )
}
