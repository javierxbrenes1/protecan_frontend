import { createContext, useContext } from "react";
import { CDR_STATUS, CheckControlFormMode } from "../../constants&Types";
import { EntranceComponent, RevisionComponent } from "../../graphqlTypes";
import { CdrEntry } from "../../types";

interface ICheckControlForm {
    cdrCreated: boolean,
    cdrItem?: CdrEntry;
    dataSavedOnServer: boolean;
    handleCdrInitialization: () => void;
    mode: CheckControlFormMode,
    itemStatus?: CDR_STATUS,
    subscribeData: (entry: 'cdr' | 'entrance' | 'revision', details: Record<string, any>) => void,
    enableSendProccess: (canSendCdr: boolean) => void
};

export interface ICheckControlDetails {
    details: {
        entrance: EntranceComponent,
        revision: RevisionComponent
    }
}

const contextDefault: ICheckControlForm = {
    cdrCreated: false,
    cdrItem: undefined,
    dataSavedOnServer: false,
    handleCdrInitialization: () => null,
    mode: CheckControlFormMode.add,
    subscribeData: () => null,
    enableSendProccess: () => null
}

export const detailsContextDefault: ICheckControlDetails = {
    details: {
        entrance: {
            driver: '',
            identificationType: 'cedula',
            identification: '',
            transporter: '',
            truckPlate: '',
            truckCountry: '',
            containerNumber: '',
            vehicleType: '',
            place: '',
            buildingType: '',
            observations: '',
        },
        revision: {
            guideName: '',
            revisionLabelNumber: '',
            findingPlaceDescription: '',
            result: '',
            canName: '',
            canChipNumber: ''
        }
    }
}


export const CheckControlFormContext = createContext<ICheckControlForm>(contextDefault);


export const CheckControlDetailsContext = createContext<ICheckControlDetails>(detailsContextDefault);

export const useCheckControlContext = () => useContext(CheckControlFormContext);
export const useCheckcontrolDetailsContext = () => useContext(CheckControlDetailsContext);