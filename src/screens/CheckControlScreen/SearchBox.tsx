import React, { useState, FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { cdrStatesOptions } from '../../constants&Types';
import { Button, Divider } from 'react-native-paper';
import { ClientsSelectInput } from '../../components/Inputs';
import RNPicker from '../../components/Inputs/RNPicker';
import globalStyles from '../../globalStyles';

interface SearchBoxProps {
    onSearch: (client: string, status: string) => void
}

const SearchBox: FC<SearchBoxProps> = ({ onSearch }) => {
    const [selectedClient, setSelectedClient] = useState<string>('')
    const [selectedStatus, setSelectedStatus] = useState('');

    const handleSelection = (type: 'client' | 'status') => (value: string) => {
        if (type === 'client') {
            setSelectedClient(value);
            return;
        }
        setSelectedStatus(value);
    }

    return (
        <>
            <View>
                <ClientsSelectInput
                    returnIdOnly
                    label='Selecciona el Cliente'
                    value={selectedClient}
                    onChange={handleSelection('client')} />
                <RNPicker
                    placeholder='Selecciona el Estado'
                    value={selectedStatus}
                    onSelection={handleSelection('status')}
                    options={cdrStatesOptions}
                />
                <Button style={styles.searchButton}
                    contentStyle={globalStyles.buttonContent}
                    icon="shield-search" mode="contained"
                    onPress={() => { onSearch(selectedClient, selectedStatus) }}
                >
                    Buscar
                </Button>
                <Divider />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    searchButton: {
        height: 60,
        justifyContent: 'center',
        marginVertical: 10,
        borderRadius: 50,
        fontSize: 14
    },
});

export default SearchBox;