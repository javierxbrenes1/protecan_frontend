import { ViewStyle } from "react-native";

export const USER_JWT: string = 'USER_JWT';

export enum CDR_STATUS {
    'pending' = 'pending',
    'draft' = 'draft',
    'complete' = 'complete'
}

export const cdrStatesOptions = [
    { value: 'pending', label: 'Pendientes' },
    { value: 'draft', label: 'En Borrador' },
    { value: 'complete', label: 'Completos' }
]

export const cdrResult = [
    { value: 'Negativo', label: 'Negativo' },
    { value: 'Positivo', label: 'Positivo' }
]

export const cdrIdenficationTypes = [
    { value: 'cedula', label: 'Cedula' },
    { value: 'pasaporte', label: 'Pasaporte' }
]

export enum CheckControlFormMode {
    'add' = 'add',
    'edit' = 'edit',
    'view' = 'view'
}

export interface InputFormHookProps {
    label: string,
    value: any,
    onChange: (val: any) => void,
    style?: ViewStyle | ViewStyle[]
}

export type SelectionInputValue = {
    selectedList: {
        _id: string,
        value: string
    }[],
    text: string
}
