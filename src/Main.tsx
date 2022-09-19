import React, { FC, useEffect } from 'react';
import { useGlobal } from "./globalContext"
import LoginScreen from './screens/LoginScreen';
import Loading from './components/Loading';
import PrincipalScreen from './screens/PrincipalScreen';
import { registerTranslation } from 'react-native-paper-dates';

const dateLabelsConfig = {
    save: 'Aceptar',
    selectSingle: 'Seleccionar fecha',
    selectMultiple: 'Seleccionar fechas',
    selectRange: 'Seleccionar periodo',
    notAccordingToDateFormat: (inputFormat: any) =>
        `El formato de la fecha debe ser ${inputFormat}`,
    mustBeHigherThan: (date: any) => `Debe ser despues de ${date}`,
    mustBeLowerThan: (date: any) => `Debe ser antes de ${date}`,
    mustBeBetween: (startDate: any, endDate: any) =>
        `Debe estar entre ${startDate} - ${endDate}`,
    dateIsDisabled: 'Fecha no valida',
    previous: 'Anterior',
    next: 'Siguiente',
    typeInDate: 'Escriba en Fecha',
    pickDateFromCalendar: 'Seleccione fecha de calendario',
    close: 'Cerrar',
};

const Main: FC = () => {
    const { checkingUser, isUserAuthenticated, loadingUserDetails } = useGlobal();
    useEffect(() => {
        registerTranslation('es', dateLabelsConfig);
    }, []);

    if (checkingUser || loadingUserDetails) return <Loading />
    if (!isUserAuthenticated) return <LoginScreen />;
    return <PrincipalScreen />;
}

export default Main;