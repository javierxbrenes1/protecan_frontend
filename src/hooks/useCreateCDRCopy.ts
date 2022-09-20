import { useMutation } from "@apollo/client";
import { useGlobal } from "../globalContext";
import { CreateCdrResponse } from "../graphqlTypes/responses";
import { CREATE_CDR } from "../mutations/checkControlMutations";
import { handleUpdateToCdrCache } from "../screens/CheckControlFormScreen/cdrCacheHandler";
import { CdrEntry } from "../types";
import { parseCdrCollectionToCdrEntry } from "../utils/dataMassagers";
import { logGraphqlErrors } from "../utils/errorHandler";

const useCreateCDRCopy = () => {
    const { userDetails } = useGlobal();

    const [createCdr] = useMutation<CreateCdrResponse>(CREATE_CDR, {
        update(cache, { data }) {
            handleUpdateToCdrCache(cache, data, userDetails?.id, data?.createCdr.data.attributes.client.data.id);
        },
        onError(err) {
            logGraphqlErrors(err);
        }
    });

    const handleCreateCopy = async (item: CdrEntry): Promise<CdrEntry> => {
        const { startAt, endAt, date, result, findingPlaceDescription, ...theRest } = item?.revision || {}

        if(item.entrance && Object.hasOwn(item.entrance, "__typename")) {
            // @ts-ignore
            delete item.entrance["__typename"];
        }
        if(theRest && Object.hasOwn(theRest, "__typename" )) {
            // @ts-ignore
            delete theRest["__typename"];
        }
        const data = {
            status: 'draft',
            client: item.client.id,
            user: userDetails?.id,
            entrance: item.entrance,
            revision: theRest,
            createDate: (new Date()).toISOString(),
        }

        const newItem = await createCdr({
            variables: {
                data
            }
        });

        if(!newItem.data?.createCdr.data) {
            throw new Error('Hubo un error al intentar crear el nuevo control de revision.')
        }
       return parseCdrCollectionToCdrEntry(newItem.data?.createCdr.data);

    }

    return [handleCreateCopy]
}

export default useCreateCDRCopy;