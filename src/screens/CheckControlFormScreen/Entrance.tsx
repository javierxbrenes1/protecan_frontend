import TabLayout from './TabLayout';
import { InputText, IdentificationTypeSelect } from '../../components/Inputs';
import React, { FC, useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import useForm from './hooks/useForm';
import { useCheckControlContext, useCheckcontrolDetailsContext } from './CheckControlContext';
import { isEmpty } from 'lodash';
import { CheckControlFormMode } from '../../constants&Types';


const Entrance: FC = () => {
    const { subscribeData, mode } = useCheckControlContext();
    const { state, setState, handleOnChange } = useForm({});
    const { details: { entrance } } = useCheckcontrolDetailsContext();

    useEffect(() => {
        if (!isEmpty(state)) {
            subscribeData('entrance', state);
        }
    }, [state]);

    useEffect(() => {
        setState(entrance);
    }, [entrance]);

    const disableAllInputs = useMemo(() => mode === CheckControlFormMode.view, [mode]);

    return (
        <TabLayout description="Vehículo que remolca el contenedor o furgón">
            <InputText label="Nombre del conductor"
                value={state.driver}
                onChange={handleOnChange('driver')}
                disabled={disableAllInputs}
            />
            <View style={styles.identification}>
                {!disableAllInputs && <View style={{ flex: 1, marginRight: 10, height: 20 }}>
                    <IdentificationTypeSelect
                        label="Tipo Identificación"
                        value={state.identificationType}
                        onChange={handleOnChange('identificationType')}
                        disabled={disableAllInputs}
                    />
                </View>}
                {
                    disableAllInputs && (
                        <>
                            <InputText
                                style={{ flex: 1, marginVertical: 0 }}
                                label="Tipo Identificación"
                                value={state.identificationType}
                                onChange={handleOnChange('identificationType')}
                                disabled={disableAllInputs}
                            />
                            <View style={{ width: 10 }} />
                        </>
                    )
                }
                <InputText
                    style={{ flex: 1, marginVertical: 0 }}
                    label="Identificación"
                    value={state.identification}
                    onChange={handleOnChange('identification')}
                    disabled={disableAllInputs}
                />
            </View>
            <InputText
                label="Transportista"
                value={state.transporter}
                onChange={handleOnChange('transporter')}
                disabled={disableAllInputs}
            />
            <InputText
                label="Placa del cabezal"
                value={state.truckPlate}
                onChange={handleOnChange('truckPlate')}
                disabled={disableAllInputs}
            />
            <InputText
                label="País del cabezal"
                value={state.truckCountry}
                onChange={handleOnChange('truckCountry')}
                disabled={disableAllInputs}
            />
            <InputText
                label="Número de contenedor o furgón"
                value={state.containerNumber}
                onChange={handleOnChange('containerNumber')}
                disabled={disableAllInputs}
            />
            <InputText
                label="Tipo de Vehiculo"
                value={state.vehicleType}
                onChange={handleOnChange('vehicleType')}
                disabled={disableAllInputs}
            />
            <InputText
                label="Tipo de Edificación"
                value={state.buildingType}
                onChange={handleOnChange('buildingType')}
                disabled={disableAllInputs}
            />
            <InputText
                label="Lugar"
                value={state.place}
                onChange={handleOnChange('place')}
                disabled={disableAllInputs}
            />
            <InputText
                label="Observaciones"
                value={state.observations}
                onChange={handleOnChange('observations')}
                multiline numberOfLines={5}
                disabled={disableAllInputs}
            />
        </TabLayout>
    );
}


const styles = StyleSheet.create({
    identification: {
        flexDirection: 'row',
        marginVertical: 5
    }
});


export default Entrance;