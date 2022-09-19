import { FC } from "react";
import { cdrResult, InputFormHookProps } from "../../constants&Types";
import InputText from "./InputText";
import Picker from "./Picker";



const ResultSelect: FC<InputFormHookProps & { disabled?: boolean }> = ({ value, onChange, label, disabled }) => {

    const handleSelection = (value: string, _label: string) => {
        onChange(value);
    }

    if (disabled) {
        return <InputText value={value} disabled onChange={() => { }} label={label} />
    }

    return (<Picker
        value={value}
        placeholder={label}
        options={cdrResult}
        noVerticalMargin
        onSelection={handleSelection} />);


}

export default ResultSelect;