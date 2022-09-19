import { useEffect, useState } from "react"
import { useCheckControlContext } from "../CheckControlContext";

const useForm = (init: Record<string, any>) => {
    const { dataSavedOnServer } = useCheckControlContext();
    const [state, setState] = useState<Record<string, any>>(init || {});
    const [stateUpdated, setStateUpdated] = useState<Record<string, string>>({});


    useEffect(() => {
        if (dataSavedOnServer) {
            setStateUpdated({});
        }
    }, [dataSavedOnServer]);

    const updateState = (key: string, value: any) => {
        setState((prev) => {
            return {
                ...prev,
                [key]: value
            };
        });
        setStateUpdated((prev) => {
            return {
                ...prev,
                [key]: value
            }
        });
    };

    const addStateUpdated = (data: Record<string, any>) => {
        setStateUpdated((prev) => {
            return { ...prev, ...data }
        });
    }

    const handleOnChange = (prop: string) => {
        return (val: any) => {
            updateState(prop, val);
        }
    }

    const resetStateUpdated = () => {
        setStateUpdated({});
    }


    return {
        state,
        setState,
        handleOnChange,
        resetStateUpdated,
        addStateUpdated,
        stateUpdated
    }
}

export default useForm;