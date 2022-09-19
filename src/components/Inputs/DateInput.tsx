import { TouchableOpacity, View, StyleSheet } from "react-native";
import { DatePickerModal } from 'react-native-paper-dates';
import { TextInput } from 'react-native-paper';
import { faCalendar } from '@fortawesome/free-solid-svg-icons/faCalendar';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import theme from '../../theme';
import { FC, useEffect, useState } from 'react';
import { formatDate } from "../../utils/dataMassagers";



const DateInput: FC<{ label: string, date?: Date, setDate: (date: Date) => void, disabled?: boolean }> = ({ label, setDate, date, disabled }) => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(formatDate(date));
    const handleConfirmDate = (res: { date: Date }) => {
        setDate(res.date);
        setOpen(false);
    }

    useEffect(() => {
        setValue(formatDate(date));
    }
        , [date]);

    return (
        <View style={styles.dateContainer}>
            <TextInput style={styles.input} label={label} value={value} disabled />
            {!disabled && (
                <>
                    <TouchableOpacity onPress={() => setOpen(true)}>
                        <FontAwesomeIcon icon={faCalendar} size={40} color={theme.colors.primary} />
                    </TouchableOpacity>
                    <DatePickerModal
                        locale='es'
                        mode="single"

                        visible={open}
                        onDismiss={() => { setOpen(false); }}
                        // @ts-ignore
                        onConfirm={handleConfirmDate}
                    />
                </>
            )
            }
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
    input: {
        flex: 1,
        backgroundColor: theme.colors.white,
        margin: 5,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.disabled
    }
});

export default DateInput;