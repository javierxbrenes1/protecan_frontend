import TabLayout from './TabLayout';
import { View, StyleSheet } from 'react-native';
import theme from '../../theme';
import { useEffect, useMemo, useState } from 'react';
import { InputText, DateInput, TimeInput, Time } from '../../components/Inputs';
import { useCheckControlContext, useCheckcontrolDetailsContext } from './CheckControlContext';
import { formatTime, parseStringTimeToTime } from '../../utils/dataMassagers';
import useForm from './hooks/useForm';
import { isEmpty } from 'lodash';
import DialogMessage from '../../components/DialogMessage';
import { CheckControlFormMode } from '../../constants&Types';
import ResultSelect from '../../components/Inputs/ResultSelect';

const Revision = () => {
    const { subscribeData, mode } = useCheckControlContext();
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [timeStart, setTimeStart] = useState<Time>({ hours: undefined, minutes: undefined });
    const [timeEnd, setTimeEnd] = useState<Time>({ hours: undefined, minutes: undefined });
    const { details: { revision } } = useCheckcontrolDetailsContext();
    const { state, setState, handleOnChange } = useForm({});
    const [showDialogMessage, setShowDialogMessage] = useState(false);
    const [validationMessage, setValidationMessage] = useState('');
    useEffect(() => {
        if (!isEmpty(state)) {
            const dataToSave = { ...state };
            if (!dataToSave.endAt) delete dataToSave.endAt;
            if (!dataToSave.startAt) delete dataToSave.startAt;
            if (!dataToSave.date) delete dataToSave.date;
            subscribeData('revision', dataToSave);
        }
    }, [state]);

    useEffect(() => {
        const { startAt, endAt, date, ...theRest } = revision;
        if (date) {
            setDate(new Date(date));
        }
        setTimeStart(parseStringTimeToTime(startAt));
        setTimeEnd(parseStringTimeToTime(endAt));
        setState(theRest);
    }, [revision]);


    const showDialog = (message: string) => {
        setValidationMessage(message);
        setShowDialogMessage(true);
    }

    const handleStartAtTime = (newValue: Time) => {
        if (timeEnd.hours != null &&
            timeEnd.minutes != null &&
            newValue.hours != null &&
            newValue.minutes != null &&
            (newValue.hours > timeEnd.hours || (newValue.hours === timeEnd.hours && newValue.minutes > timeEnd.minutes))) {
            showDialog('La hora de inicio debe ser menor a la hora de conclusión');
            return;
        }
        setTimeStart(newValue);
    }

    const handleEndAtTime = (newValue: Time) => {
        if (timeStart.hours != null &&
            timeStart.minutes != null &&
            newValue.hours != null &&
            newValue.minutes != null &&
            (newValue.hours < timeStart.hours || (newValue.hours === timeEnd.hours && newValue.minutes < timeStart.minutes))) {
            showDialog('La hora de conclusión debe ser mayor a la hora de inicio');
            return;
        }
        setTimeEnd(newValue);
    }

    useEffect(() => {
        const dateAndTimeValues = {
            ...date ? { date: date.toISOString() } : {},
            ...timeStart ? { startAt: formatTime(timeStart) } : {},
            ...timeEnd ? { endAt: formatTime(timeEnd) } : {}
        };
        setState((st) => ({ ...st, ...dateAndTimeValues }));
    }, [date, timeStart, timeEnd]);

    const disableAllInputs = useMemo(() => mode === CheckControlFormMode.view, [mode]);

    return (
        <>
            <TabLayout>
                <View style={styles.dateContainer}>
                    <DateInput label="Fecha" setDate={setDate} date={date} disabled={disableAllInputs} />
                </View>
                <View style={styles.dateContainer}>
                    <TimeInput label="Hora inicio" setTime={handleStartAtTime} time={timeStart} disabled={disableAllInputs} />
                    <TimeInput label="Hora conclusión" setTime={handleEndAtTime} time={timeEnd} disabled={disableAllInputs} />
                </View>
                <InputText
                    label="Nombre guia"
                    value={state.guideName}
                    onChange={handleOnChange('guideName')}
                    style={styles.inputMargin}
                    disabled={disableAllInputs}
                />
                <InputText
                    label="Nombre del can"
                    value={state.canName}
                    onChange={handleOnChange('canName')}
                    style={styles.inputMargin}
                    disabled={disableAllInputs}
                />
                <InputText
                    label="Número de chip del can"
                    value={state.canChipNumber}
                    onChange={handleOnChange('canChipNumber')}
                    style={styles.inputMargin}
                    disabled={disableAllInputs}
                />
                <InputText
                    label="Número de marchamo de revisión"
                    value={state.revisionLabelNumber}
                    onChange={handleOnChange('revisionLabelNumber')}
                    style={styles.inputMargin}
                    disabled={disableAllInputs}
                />
                {!disableAllInputs &&
                    <View style={{ marginVertical: 5, marginBottom: 12 }}>
                        <ResultSelect
                            label="Resultado"
                            value={state.result}
                            onChange={handleOnChange('result')}
                        />
                    </View>}
                {
                    disableAllInputs && (
                        <>
                            <InputText
                                style={{ flex: 1, marginVertical: 0 }}
                                label="Resultado"
                                value={state.result}
                                onChange={handleOnChange('result')}
                                disabled={disableAllInputs}
                            />
                            <View style={{ width: 10 }} />
                        </>
                    )
                }
                <InputText
                    label="Descripción de área de hallazgo"
                    value={state.findingPlaceDescription}
                    onChange={handleOnChange('findingPlaceDescription')}
                    multiline
                    numberOfLines={5}
                    disabled={disableAllInputs}
                />
            </TabLayout>
            <DialogMessage
                title={'Verifica los valores ingresados'}
                message={validationMessage}
                show={showDialogMessage}
                onHide={function (): void {
                    setShowDialogMessage(false)
                    setValidationMessage('');
                }} />
        </>
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
    input: { flex: 1, backgroundColor: theme.colors.white, margin: 5 },
    dialog: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    }
});

export default Revision;
