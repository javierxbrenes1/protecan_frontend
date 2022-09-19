import { Picker as ReactNativePicker } from '@react-native-picker/picker';
import React, { FC, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import theme from '../../theme';

type PickerProps = {
    options: { value: string, label: string }[],
    placeholder: string,
    value: string,
    height?: number,
    noVerticalMargin?: boolean
    onSelection: (newVal: string, label: string) => void,
    disabled?: boolean
}

const Picker: FC<PickerProps> = ({ options, placeholder, value, onSelection, height, noVerticalMargin }) => {

    const manOptions = useMemo(() => {
        if (placeholder) {
            return [{ value: '', label: placeholder }, ...options];
        }
        return options;
    }, [options, placeholder])

    const handleSelection = (value: string, index: number) => {
        const { label } = manOptions[index];
        onSelection(value, label);
    }

    return (
        <View style={[styles.container, noVerticalMargin ? { marginVertical: 0 } : {}]}>
            <ReactNativePicker
                style={[styles.picker, height ? { height: height } : {}]}
                selectedValue={value}
                onValueChange={handleSelection}
            >
                {manOptions.map((opt) => {
                    const isValidItem = !!opt.value;
                    return (
                        <ReactNativePicker.Item
                            color={isValidItem ? theme.colors.onSurface : theme.colors.primary}
                            label={opt.label}
                            value={opt.value}
                            key={opt.value} />
                    )
                })}
            </ReactNativePicker>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        borderBottomColor: theme.colors.disabled,
        borderBottomWidth: 1,
        marginVertical: 10
    },
    placeholder: {
        fontWeight: 'bold'
    },
    picker: {
        backgroundColor: theme.colors.white,
        height: 64,
        color: theme.colors.backdrop
    }
});

export default Picker;