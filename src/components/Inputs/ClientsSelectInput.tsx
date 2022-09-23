import { FC, useEffect, useState } from "react";
import { parseClientsForSelection } from '../../utils/dataMassagers';
import { useGlobal } from '../../globalContext';
import { useQuery } from '@apollo/react-hooks';
import { GET_CLIENTS } from '../../queries';
import { GetClientsType } from '../../graphqlTypes/responses';
import RNPicker from "./RNPicker";
import { logGraphqlErrors } from "../../utils/errorHandler";

const ClientsSelectInput: FC<{ label: string, value: string, onChange: (value: string, label: string) => void, returnIdOnly?: boolean }> = ({ label, value, onChange }) => {
    const [clients, setClients] = useState<{ value: string, label: string }[]>([]);
    const { userDetails, setShowLoading } = useGlobal();

    const { loading } = useQuery<GetClientsType>(GET_CLIENTS, {
        variables: { id: userDetails?.id },
        onCompleted(data) {
            const clientsList = parseClientsForSelection(data);
            setClients(clientsList);
        },
        onError(error) {
            logGraphqlErrors(error);
        }
    });

    useEffect(() => {
        setShowLoading(loading);
    }, [loading]);

    const handleOnChange = (value: string) => {
        const option = clients.find((c) => c.value === value);
        onChange(value, option?.label || value);
    }

    return (
        <RNPicker 
        options={clients}
         placeholder={label} 
         value={value} 
         onSelection={handleOnChange}
         style={{marginBottom: 10}}
        />
    )
};

export default ClientsSelectInput;