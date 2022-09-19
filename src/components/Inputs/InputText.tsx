import { FC, ReactNode } from "react";
import { TextInput } from "react-native-paper";
import theme from "../../theme";
import { StyleSheet } from "react-native";
import { InputFormHookProps } from '../../constants&Types';


const InputText: FC<InputFormHookProps & { multiline?: boolean, numberOfLines?: number, right?: ReactNode, disabled?: boolean }> =
    ({ label, value, onChange, style, ...props }) => {

        return <TextInput
            mode="flat"
            label={label}
            onChangeText={onChange}
            value={value}
            style={[styles.input, style || {}]}
            {...props}
        />;
    };

const styles = StyleSheet.create({
    input: { backgroundColor: theme.colors.white, marginVertical: 5 }
});

export default InputText;

