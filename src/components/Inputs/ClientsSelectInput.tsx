import { FC, useEffect, useState } from "react";
import { parseClientsForSelection } from '../../utils/dataMassagers';
import { useGlobal } from '../../globalContext';
import { useQuery } from '@apollo/react-hooks';
import { GET_CLIENTS } from '../../queries';
import { GetClientsType } from '../../graphqlTypes/responses';
import Picker from "./Picker";
import { logGraphqlErrors } from "../../utils/errorHandler";

const ClientsSelectInput: FC<{ label: string, value: string, onChange: (value: string, label: string) => void, returnIdOnly?: boolean }> = ({ label, value, onChange, returnIdOnly }) => {
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


    return (
        <Picker options={clients} placeholder={label} value={value} onSelection={onChange} />
    )
};

export default ClientsSelectInput;