import React, { FC, useState, useEffect } from 'react';
import { Button, Divider, Title } from 'react-native-paper';
import { View, StyleSheet, } from 'react-native';
import { ClientsSelectInput } from '../../components/Inputs';
import StateBadge from '../../components/StateBadge';
import { CDR_STATUS, CheckControlFormMode } from '../../constants&Types';
import { useCheckControlContext } from './CheckControlContext';
import { useGlobal } from '../../globalContext';
import { getCdrRelatedId } from '../../utils/dataMassagers';
import globalStyles from '../../globalStyles';


const CheckControl: FC<{
    clientDetails: { id: string, name: string } | null,
    onClientSelection: (clientId: string) => void
}> = ({ clientDetails, onClientSelection }) => {
    const { userDetails } = useGlobal();
    const [client, setClient] = useState<{ id: string, name: string } | null>(clientDetails);
    const { mode, cdrCreated, cdrItem, handleCdrInitialization, subscribeData, itemStatus } = useCheckControlContext();

    const handleClientSelectChange = (value: string, label: string) => {
        setClient({ id: value, name: label });
        subscribeData('cdr', {
            status: CDR_STATUS.draft,
            createDate: (new Date()).toISOString(),
            user: userDetails?.id,
            client: value
        });
        onClientSelection(value);
    }

    const isAddingMode = mode === CheckControlFormMode.add;
    return (
        <>
            <View style={styles.cdr}>
                <View style={{ flex: 1 }}>
                    {isAddingMode && !cdrCreated
                        ? <ClientsSelectInput label='Selecciona el Cliente' value={client?.id || ''} onChange={handleClientSelectChange} />
                        : <Title>{client?.name} - CDR #{cdrItem?.composedId}</Title>}
                </View>
                <StateBadge state={itemStatus || CDR_STATUS.draft} />
            </View>
            {!cdrCreated && isAddingMode && (
                <View>
                    <View style={styles.buttonsContainer}>
                        <Button
                            style={globalStyles.button}
                            contentStyle={globalStyles.buttonContent}
                            mode="contained"
                            icon="file-star"
                            onPress={handleCdrInitialization}
                            disabled={!client}>
                            Iniciar
                        </Button>
                    </View>
                    <Divider style={styles.divider} />
                    <Title style={styles.newCdrMessage}>
                        Selecciona el cliente para comenzar
                    </Title>
                </View>
            )
            }
        </>
    )
}

const styles = StyleSheet.create({
    cdr: {
        height: 60,
        margin: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    buttonsContainer: {
        flexDirection: "row",
        paddingHorizontal: 20
    },
    divider: {
        marginTop: 15,
        height: 3
    },
    newCdrMessage: {
        textAlign: 'center',

    }
});

export default CheckControl;