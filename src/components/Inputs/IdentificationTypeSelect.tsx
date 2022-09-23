import { FC } from "react";
import { cdrIdenficationTypes, InputFormHookProps } from "../../constants&Types";
import InputText from "./InputText";
import RNPicker from "./RNPicker";



const IdentificationTypeSelect: FC<InputFormHookProps & { disabled?: boolean }> = ({ value, onChange, label, disabled }) => {

    const handleSelection = (value: string) => {
        onChange(value);
    }

    if (disabled) {
        return <InputText value={value} disabled onChange={() => { }} label={label} />
    }

    return (<RNPicker
        value={value}
        placeholder={label}
        options={cdrIdenficationTypes}
        onSelection={handleSelection} />);


}

export default IdentificationTypeSelect;