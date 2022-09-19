import React, { FC, useState } from 'react';
import { View, StyleSheet, Dimensions, Image } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import Screen from '../../components/Screen';
import theme from '../../theme';
import { LOGIN } from '../../mutations/loginMutation';
import { useMutation } from '@apollo/react-hooks';
import { ApolloError } from 'apollo-client';
import { useEffect } from 'react';
import { useGlobal } from '../../globalContext';
import { User } from '../../graphqlTypes';
import DialogMessage from '../../components/DialogMessage';
import { LinearGradient } from 'expo-linear-gradient';
import logger from '../../utils/logger';
import * as Application from 'expo-application';

type LoginMutationDataType = {
    login: {
        jwt: string;
        user: User
    }
}

const errorMessages: Record<string, string> = {
    'BAD_USER_INPUT': 'Usuario o Contraseña incorrectos',
    'FALLBACK': 'Hubo un error intentando iniciar sesion ERROR.'
}

const getErrorMessage = (err?: ApolloError) => {
    if (!err) return '';
    const { code } = err?.graphQLErrors[0]?.extensions || {};
    if (!code || !errorMessages[code]) {
        return errorMessages['FALLBACK'].replace('ERROR', err.message || '');
    }
    return errorMessages[code];
}

const LoginScreen: FC = () => {
    const [identifier, setIdentifier] = useState<string | undefined>(undefined);
    const [password, setPassword] = useState<string | undefined>(undefined);
    const [executeLogin, { data, loading, error }] = useMutation<LoginMutationDataType>(LOGIN);

    const [isThereAnError, setIsthereAnError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { handleJwt, setUserDetails } = useGlobal();

    useEffect(() => {
        setIsthereAnError(!loading && !!error);
        if (!loading && !error && data) {
            // put the result data into the global context
            const { login: { jwt, user } } = data;
            handleJwt(jwt);
            setUserDetails(user);
            logger.identifyUser(user);
        }
        if (error) {
            logger.logError(error);
        }
    }, [loading, error, data]);

    const handleChange = (type: 'identifier' | 'password') => {
        return (text: string): void => {
            if (type === 'identifier') {
                setIdentifier(text);
                return;
            }
            setPassword(text);
        }
    }

    const handleLogin = () => {
        if (loading) return;
        executeLogin({
            variables: {
                identifier,
                password
            },
        }).catch(() => { });
    }

    return (
        <Screen style={styles.container}>
            <LinearGradient
                style={styles.background}
                colors={['#184260', '#246492', '#44b0c6']} />
            <View style={styles.iconContainer}>
                <Image style={styles.icon} source={require('../../assets/protecan-logo.png')} />
            </View>
            <View style={styles.form}>
                <TextInput
                    mode="flat"
                    label="Usuario/Email"
                    value={identifier}
                    onChangeText={handleChange('identifier')}
                    style={styles.textInput}
                />

                <TextInput
                    mode="flat"
                    label="Contraseña"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={handleChange('password')}
                    right={
                        <TextInput.Icon
                            onPress={() => { setShowPassword(!showPassword); }}
                            name={showPassword ? "eye-off" : "eye"} />
                    }
                    style={styles.textInput}
                />
                <Button
                    style={styles.button}
                    labelStyle={styles.labelButton}
                    loading={loading}
                    disabled={(!identifier && !password) || loading}
                    onPress={handleLogin}
                    mode="contained">
                    Ingresar
                </Button>
            </View>
            <View style={styles.disclaimer}>
                <Text style={styles.disclaimerText}>Protecan Seguridad</Text>
                {Application.nativeApplicationVersion && <Text style={styles.disclaimerText}>Version: {Application.nativeApplicationVersion}</Text>}
            </View>
            <DialogMessage
                title="Error"
                message={getErrorMessage(error)}
                show={isThereAnError}
                onHide={() => { setIsthereAnError(false); }}
            />
        </Screen>
    );
}

const styles = StyleSheet.create({
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: Dimensions.get('screen').height
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    form: {
        flex: 1,
        padding: 20
    },
    textInput: {
        fontSize: 20,
        marginBottom: 25
    },
    button: {
        marginTop: 15,
        color: theme.colors.primary,
        backgroundColor: theme.colors.white,
        padding: 5,
        borderRadius: 50
    },
    labelButton: {
        color: theme.colors.primary,
        fontSize: 20
    },
    iconContainer: {
        flex: 1,
        alignSelf: 'center',
        paddingVertical: 40,
        alignContent: 'center',
        justifyContent: 'center'

    },
    icon: {
        width: 350,
        height: 100
    },
    disclaimer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 20
    },
    disclaimerText: {
        color: theme.colors.white,
        fontSize: 14
    },
    error: {
        color: theme.colors.white,
        textDecorationColor: theme.colors.error,
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 5
    }
});

export default LoginScreen;