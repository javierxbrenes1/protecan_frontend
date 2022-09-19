import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { TimePickerModal } from 'react-native-paper-dates';
import { TextInput } from 'react-native-paper';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import theme from '../../theme';
import { FC, useEffect, useState } from 'react';
import { formatTime } from '../../utils/dataMassagers';
import DialogMessage from '../DialogMessage';



export type Time = {
    hours?: number,
    minutes?: number
};

const TimeInput: FC<{ label: string, setTime: (time: Time) => void, time: Time, disabled?: boolean }> = ({ label, setTime, time, disabled }) => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('');
    const handleConfirmDate = (res: Time) => {
        setTime(res);
        setOpen(false);
    };

    useEffect(() => {
        if (time.hours != null && time.minutes != null) {
            setValue(formatTime(time, true));
        }
    }, [time]);

    return (
        <View style={styles.dateContainer}>
            <TextInput style={styles.input} label={label} value={value} disabled />
            {!disabled && (
                <>
                    <TouchableOpacity onPress={() => setOpen(true)}>
                        <FontAwesomeIcon icon={faClock} size={40} color={theme.colors.primary} />
                    </TouchableOpacity>
                    <TimePickerModal
                        locale='es'
                        label="Seleccione la hora"
                        cancelLabel='Cancelar'
                        confirmLabel='Aceptar'
                        visible={open}
                        hours={time.hours}
                        minutes={time.minutes}
                        onDismiss={() => { setOpen(false); }}
                        // @ts-ignore
                        onConfirm={handleConfirmDate}
                    />
                </>)}
        </View>
    );
}

const styles = StyleSheet.create({
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginVertical: 10
    },
    inputMargin: {
        marginVertical: 15
    },
    // TODO: refactor this
    input: {
        flex: 1,
        backgroundColor: theme.colors.white,
        margin: 5,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.disabled
    }
});

export default TimeInput;