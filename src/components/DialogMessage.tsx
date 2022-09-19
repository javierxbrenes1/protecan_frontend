import React, { FC, ReactNode } from "react";
import { Dimensions } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Dialog, Button, Text } from 'react-native-paper';
import theme from "../theme";

type Props = {
    title: string,
    message: string,
    show: boolean,
    onHide: () => void,
    mode?: 'message' | 'confirmation',
    onConfirm?: () => void,
    cancelText?: string,
    confirmText?: string,
    children?: ReactNode,
    disableConfirmButton?: boolean
}

const DialogMessage: FC<Props> = ({
    children,
    show,
    onHide,
    title,
    message,
    mode = 'message',
    onConfirm,
    confirmText,
    cancelText,
    disableConfirmButton = false
}) => {
    return (
        <Dialog visible={show} dismissable={false}>
            <Dialog.Title>{title}</Dialog.Title>
            <Dialog.ScrollArea style={{ maxHeight: Dimensions.get('screen').height / 2, borderColor: theme.colors.white }}>
                <ScrollView>
                    <Text>{message}</Text>
                    {children}
                </ScrollView>
            </Dialog.ScrollArea>
            <Dialog.Actions>
                <Button onPress={onHide}>{cancelText || 'Cerrar'}</Button>
                {mode == 'confirmation' && <Button disabled={disableConfirmButton} onPress={onConfirm}>{confirmText || 'Aceptar'}</Button>}
            </Dialog.Actions>
        </Dialog>
    );
}

export default DialogMessage;