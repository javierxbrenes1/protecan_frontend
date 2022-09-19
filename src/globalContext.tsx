import React, { FC, useEffect, useState, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import { USER_JWT } from './constants&Types';
import jwt_decode from 'jwt-decode';
import { User } from './graphqlTypes';
import { GET_ME } from './queries';
import { useApolloClient, useLazyQuery } from '@apollo/react-hooks';


type ContextType = {
    checkingUser: boolean;
    isUserAuthenticated: boolean | null;
    jwt: string;
    handleJwt: (jwt: string) => void;
    setUserDetails: (user: User) => void;
    userDetails: User | null;
    loadingUserDetails: boolean;
    showLoading: boolean;
    setShowLoading: (showLoading: boolean) => void;
    logOut: () => void
}

const initialGlobalVal: ContextType = {
    checkingUser: true,
    isUserAuthenticated: null,
    jwt: '',
    handleJwt: () => { },
    setUserDetails: () => { },
    userDetails: null,
    loadingUserDetails: false,
    showLoading: false,
    setShowLoading: () => { },
    logOut: () => { }
};

const GlobalContext = React.createContext<ContextType>(initialGlobalVal);

export const GlobalProvider: FC<{ children: JSX.Element | JSX.Element[] }> = ({ children }) => {
    const [getUserDetails, { loading, error, data }] = useLazyQuery<{ me: User }>(GET_ME);
    const [isUserAuthenticated, setIsUserAuthenticated] = useState<boolean | null>(null);
    const [checkingUser, setCheckingUser] = useState(true);
    const [jwt, setJwt] = useState<string>('');
    const [userDetails, setUserDetails] = useState<User | null>(null);
    const [showLoading, setShowLoading] = useState(false);
    const client = useApolloClient();

    useEffect(() => {
        const init = async () => {
            const localJWT = await validateLocalJWT();
            const validJWT = !!localJWT;
            if (validJWT) {
                try {
                    getUserDetails();
                } catch (err) {
                    // todo send error to error tracker
                    console.log(err);
                }
            }
            setIsUserAuthenticated(validJWT);
            setJwt(localJWT || '');
            setCheckingUser(false);
        }
        init();
    }, []);

    useEffect(() => {
        if (!loading && error) {
            // Todo add error tracking
            console.log(error);
            setIsUserAuthenticated(false);
            setJwt('');
            return;
        }
        if (!loading && data) {
            setUserDetails(data.me);
        }
    }, [loading, error, data]);


    const handleLogOut = async () => {
        await SecureStore.deleteItemAsync(USER_JWT);
        setIsUserAuthenticated(null);
        setJwt('');
        setUserDetails(null);
        client.clearStore();
    }

    const validateLocalJWT = async (): Promise<string | null> => {
        try {
            const jwt = await SecureStore.getItemAsync(USER_JWT);
            if (!jwt) return null;
            const jwtDecoded = jwt_decode<{ id: number, iat: number, exp: number }>(jwt);
            const { exp } = jwtDecoded;
            const expDate = new Date(exp * 1000);
            const today = new Date();
            if ((today < expDate)) {
                return jwt;
            }
            await SecureStore.deleteItemAsync(USER_JWT);
            return null;
        } catch (err) {
            console.log(err);
            return null;
        }
    };

    const handleJwt = async (jwt: string) => {
        await SecureStore.setItemAsync(USER_JWT, jwt);
        setJwt(jwt);
        setIsUserAuthenticated(true);
    };

    return (
        <GlobalContext.Provider value={{
            checkingUser,
            isUserAuthenticated,
            jwt,
            handleJwt,
            setUserDetails,
            userDetails,
            loadingUserDetails: loading,
            logOut: handleLogOut,
            showLoading,
            setShowLoading
        }}>
            {children}
        </GlobalContext.Provider>
    );
};


export const useGlobal = () => useContext(GlobalContext);