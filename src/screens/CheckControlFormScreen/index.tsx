import React, { FC, useState, useCallback, useRef, useEffect } from 'react';
import { CDR_STATUS, CheckControlFormMode } from '../../constants&Types';
import { useRoute } from '@react-navigation/native';
import CheckControl from './CheckControl';
import { CheckControlFormContext } from './CheckControlContext';
import { Button } from 'react-native-paper';
import { View, StyleSheet, Keyboard, ViewStyle, StyleProp } from 'react-native';
import FormsNavigation from './FormsNavigation';
import { showMessage } from 'react-native-flash-message';
import globalStyles from '../../globalStyles';
import { CdrEntry } from '../../types';
import { CREATE_CDR, SEND_CRD, UPDATE_CDR } from '../../mutations/checkControlMutations';
import { ApolloError, useMutation } from '@apollo/react-hooks';
import { CreateCdrResponse, SendCdrResponse, UpdateCdrResponse } from '../../graphqlTypes/responses';
import { logGraphqlErrors } from '../../utils/errorHandler';
import { useGlobal } from '../../globalContext';
import { handleUpdateToCdrCache } from './cdrCacheHandler';
import DialogMessage from '../../components/DialogMessage';
import theme from '../../theme';
import { parseCdrCollectionToCdrEntry } from '../../utils/dataMassagers';
import { cdr } from '../../queries';

const getClientDetailsFromItem = (item?: CdrEntry): { id: string, name: string } | null => {
    if (!item) return null;
    return {
        id: item.client.id,
        name: item.client.name
    }
}

const notifyToUser = (args: {
    type: 'success' | 'danger' | 'info',
    message: string,
    backgroundColor?: string,
    autoHide?: boolean,
    duration?: number
}) => {
    const { autoHide, backgroundColor, ...rest } = args;
    showMessage({
        ...rest,
        icon: 'auto',
        autoHide: autoHide == null ? true : args.autoHide,
        style: {
            borderBottomEndRadius: 10,
            borderBottomStartRadius: 10,
            ...backgroundColor ? { backgroundColor } : {},

        }
    });
}


const CheckcontrolFormScreen: FC = () => {
    const { params: { mode, item } } = useRoute() as { params: { mode: CheckControlFormMode, item?: CdrEntry } };
    const [newCdrClient, setNewCdrClient] = useState('');
    const [cdrItem, setCdrItem] = useState(item);
    const [cdrCreated, setCdrCreated] = useState(mode !== CheckControlFormMode.add);
    const [dataSavedOnServer, setDataSavedOnServer] = useState(false);
    const [mutationData, setMutationData] = useState<Record<string, Record<string, any>>>({});
    const [enableSendProcess, setEnableSendProcess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showErrorDialog, setShowErrorDialog] = useState(false);
    const timeoutRef = useRef(0);
    const { setShowLoading, userDetails } = useGlobal();

    const handleMutationCompleted = () => {
        setMutationData({});
        setDataSavedOnServer(true);
        notifyToUser({
            type: 'success',
            message: 'Información almacenada',
            backgroundColor: theme.colors.sucess
        });
        timeoutRef.current = setTimeout(() => {
            setDataSavedOnServer(false);
        }, 200);
    }

    const handleMutationWithError = (error: ApolloError) => {
        const errorDetails = logGraphqlErrors(error);
        const message = `${errorDetails.join('\n\n')}\n\n\n\n\n\n\n\nVerifica que tienes internet y los datos que has ingresado y vuelve a intentarlo.`;
        setErrorMessage(message);
        setShowErrorDialog(true);
        setShowLoading(false);
    }

    const [createCdr] = useMutation<CreateCdrResponse>(CREATE_CDR, {
        onCompleted(data) {
            setShowLoading(false);
            setCdrCreated(true);
            setCdrItem(parseCdrCollectionToCdrEntry(data.createCdr.data));
            handleMutationCompleted();
        },
        update(cache, { data }) {
            handleUpdateToCdrCache(cache, data, userDetails?.id, newCdrClient);
        },
        onError(error) {
            handleMutationWithError(error);
        }
    });

    const [updateCdr, { loading: updateCdrLoading }] = useMutation<UpdateCdrResponse>(UPDATE_CDR, {
        onCompleted() {
            handleMutationCompleted();
        },
        onError(error) {
            handleMutationWithError(error);
        }
    });

    const [sendCdr] = useMutation<SendCdrResponse>(SEND_CRD, {
        onCompleted(data) {
            setShowLoading(false);
            setCdrItem(parseCdrCollectionToCdrEntry(data.sendCdrToClient.data));
            notifyToUser(
                {
                    type: 'success',
                    message: 'El reporte ha sido creado, y se ha intentado enviar a los contactos.\n(Presiona este mensaje para hacerlo desaparecer).',
                    backgroundColor: theme.colors.sucess,
                    autoHide: false
                }
            );
        },
        onError(error) {
            handleMutationWithError(error)
        }
    })

    const subscribeData = (entry: 'cdr' | 'entrance' | 'revision', details: Record<string, any>) => {
        setMutationData(prev => ({
            ...prev,
            ...entry === 'cdr' ? details : { [entry]: details }
        }));
    }

    const handleSave = useCallback(() => {
        const funcToUse = cdrItem?.id ? updateCdr : createCdr;
        const idDetails = cdrItem?.id ? { id: cdrItem?.id } : {};
        funcToUse({
            variables: {
                data: mutationData,
                ...idDetails
            }
        });
    }, [cdrItem?.id, mutationData]);

    const handleSendCdr = () => {
        setShowLoading(true);
        sendCdr({
            variables: {
                cdrId: cdrItem?.id,
                clientId: cdrItem?.client.id
            }
        })
    }

    const handleCdrInitialization = () => {
        setShowLoading(true);
        handleSave();
    };

    return (
        <CheckControlFormContext.Provider value={{
            cdrCreated,
            cdrItem,
            dataSavedOnServer,
            handleCdrInitialization,
            mode,
            itemStatus: cdrItem?.status as CDR_STATUS,
            subscribeData,
            enableSendProccess: setEnableSendProcess
        }}>
            <CheckControl clientDetails={getClientDetailsFromItem(cdrItem)} onClientSelection={setNewCdrClient} />
            {cdrCreated && !!cdrItem?.id && (
                <>
                    <View style={styles.buttonsContainer}>
                        <Button
                            style={globalStyles.button}
                            contentStyle={globalStyles.buttonContent}
                            mode="contained" icon="send-check"
                            onPress={handleSendCdr}
                            disabled={!enableSendProcess}>
                            Enviar
                        </Button>
                        <View style={{ flex: .1 }} />
                        {cdrItem?.status === CDR_STATUS.draft && <Button
                            style={globalStyles.button}
                            contentStyle={globalStyles.buttonContent}
                            mode="contained" icon="content-save"
                            loading={updateCdrLoading}
                            onPress={() => {
                                Keyboard.dismiss();
                                handleSave();
                            }}
                        >
                            Guardar
                        </Button>}

                    </View>
                </>)
            }
            {cdrCreated && <FormsNavigation />}
            <DialogMessage
                title="Hubo un error al almacenar la información, errores: "
                message={errorMessage}
                show={showErrorDialog}
                onHide={() => {
                    setShowErrorDialog(false);
                    setErrorMessage('');
                }}
            />
        </CheckControlFormContext.Provider>
    );
}

const styles = StyleSheet.create({
    buttonsContainer: {
        flexDirection: "row",
        paddingHorizontal: 20,
        marginBottom: 20
    },
    buttons: {
        flex: 1
    },
    button: {
        flex: 1,
        borderRadius: 50,
        height: 50,
        maxWidth: 200,
        justifyContent: 'center',
        alignItems: 'center'
    },
    divider: {
        marginTop: 15,
        height: 3
    }
});

export default CheckcontrolFormScreen;