import { FC } from 'react';
import Picker from 'react-native-picker-select';
import { StyleSheet, ViewStyle } from 'react-native';
import theme from '../../theme';

const RNPicker: FC<{ 
    onSelection: (val: string) => void, 
    options: { value: string, label: string }[],
    placeholder: string,
    value: string,
    disabled?:boolean,
    style?: ViewStyle
}> =
 ({onSelection, options, value, placeholder, disabled, style}) => {
    return <Picker
    value={value} 
    style={{
        viewContainer: {...styles.viewContainer, ...style || {}},
        placeholder: styles.placeholder
    }}
    onValueChange={onSelection} 
    items={options.map((p) => { return {...p, key: p.value} })} 
    placeholder={{value: '', label: placeholder}} 
    disabled={disabled}
    />
}

const styles = StyleSheet.create({
    viewContainer: {
        height: 64,
        backgroundColor: theme.colors.white,
        display: 'flex',
        justifyContent: 'center',
        borderBottomColor: theme.colors.backdrop,
        borderBottomWidth: .7,
        paddingHorizontal:10
    },
    placeholder: {
        color: theme.colors.backdrop
    },
});

export default RNPicker;