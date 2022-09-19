import { useEffect, useState } from 'react';
import { BottomNavigation } from 'react-native-paper';
import { CheckControlDetailsContext, detailsContextDefault, ICheckControlDetails, useCheckControlContext } from './CheckControlContext';
import Revision from './Revision';
import Entrance from './Entrance';
import { logGraphqlErrors } from '../../utils/errorHandler';
import { useQuery } from '@apollo/react-hooks';
import { GetCdrResponse } from '../../graphqlTypes/responses';
import { GET_CDR } from '../../queries';
import { useGlobal } from '../../globalContext';

const routes = [
    { key: 'entrance', title: 'Entrada', icon: 'login', color: "#184260" },
    { key: 'revision', title: 'Revisión', icon: 'truck-check', color: '#246492' }
]


const renderScene = BottomNavigation.SceneMap({
    entrance: Entrance,
    revision: Revision
});

const canSendCdr = (obj: ICheckControlDetails) => {
    const { entrance, revision } = obj.details;
    const requiredInputs = Object.keys(entrance).length
        + Object.keys(revision).length;

    let elementsWithValues = Object.values(entrance).filter(Boolean).length
        + Object.values(revision).filter(Boolean).length;
    return requiredInputs <= elementsWithValues;
}

const FormsNavigation = () => {
    const [index, setIndex] = useState(0);
    const { setShowLoading } = useGlobal();
    const { cdrItem, enableSendProccess } = useCheckControlContext();
    const [details, setDetails] = useState(detailsContextDefault);

    const { loading } = useQuery<GetCdrResponse>(GET_CDR, {
        variables: {
            id: cdrItem?.id
        },
        onCompleted(data) {
            const {
                entrance,
                revision,
            } = data.cdr.data.attributes || {};

            // need to delete this property to be hable to save the info correctly
            delete entrance?.__typename;
            delete revision?.__typename;

            const newDetails = {
                details: {
                    entrance: entrance || detailsContextDefault.details.entrance,
                    revision: revision || detailsContextDefault.details.revision,
                }
            }
            setDetails(newDetails);
        },
        onError(err) {
            logGraphqlErrors(err);
        }
    });

    useEffect(() => {
        setShowLoading(loading);
    }, [loading]);

    useEffect(() => {
        enableSendProccess(canSendCdr(details));
    }, [details]);

    return (
        <CheckControlDetailsContext.Provider value={details}>
            <BottomNavigation
                navigationState={{ index, routes }}
                onIndexChange={setIndex}
                renderScene={renderScene}
            />
        </CheckControlDetailsContext.Provider>
    )
}

export default FormsNavigation;