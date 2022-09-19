import { TouchableOpacity, View, StyleSheet } from "react-native";
import { DatePickerModal } from 'react-native-paper-dates';
import { TextInput } from 'react-native-paper';
import { faCalendar } from '@fortawesome/free-solid-svg-icons/faCalendar';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import theme from '../../theme';
import { FC, useState } from 'react';


export type DateType = { day: number | null, month: number | null, year: number | null };

const CheckingDateInput: FC<{ date: DateType, setDate: (date: DateType) => void, disabled?: boolean }> = ({ setDate, date, disabled }) => {
    const [open, setOpen] = useState(false);

    const handleConfirmDate = (res: { date: Date }) => {
        setDate({
            day: res.date.getDate(),
            month: (res.date.getMonth() + 1),
            year: res.date.getFullYear()
        });
        setOpen(false);
    }

    return (
        <View style={styles.dateContainer}>
            <TextInput style={styles.input} label="Dia" value={date.day?.toString() || ''} disabled />
            <TextInput style={styles.input} label="Mes" disabled value={date.month?.toString() || ''} />
            <TextInput style={styles.input} label="Año" disabled value={date.year?.toString() || ''} />
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

export default CheckingDateInput;