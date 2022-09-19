import { FC, useEffect, useState } from "react";
import DialogMessage from "../../components/DialogMessage";
import { useGlobal } from "../../globalContext";
import { View, StyleSheet } from "react-native";
import { TextInput, Text } from "react-native-paper";
import theme from "../../theme";
import { UPDATE_PWD } from "../../mutations/loginMutation";
import { useMutation } from "@apollo/react-hooks";
import { UpdatePwdResponse } from "../../graphqlTypes/responses";
import { logGraphqlErrors } from "../../utils/errorHandler";
import { resetApolloClient } from "../../apolloClient";


const validatePassword = (pwd: string): boolean[] => {
    return [
        pwd.length > 8, // more tha 8 characters
        !!pwd.match(/[A-Z]+/g), // has uppercase values
        !!pwd.match(/[a-z]+/g), // has lowercase values
        !!pwd.match(/[0-9]+/g), // has numbers
        !!pwd.match(/[^\w\s]+/g) // has special characters
    ]
}

const Indicator: FC<{ pass: boolean }> = ({ pass }) => {
    const icon = pass ? 'checkbox-marked-circle' : 'alert-circle';
    const color = pass ? theme.colors.sucess : theme.colors.error;
    return <TextInput.Icon size={20} icon={icon} color={color} />
}

const UpdatePassword: FC = () => {
    const { userDetails, handleJwt, setUserDetails, setShowLoading } = useGlobal();
    const [dialogShown, setDialogShown] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [password, setPassword] = useState<string>('');

    const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
    const [currentPassword, setcurrentPassword] = useState<string>('');

    const [errors, setErrors] = useState<string[]>([]);
    const [validations, setValidations] = useState({
        moreThanTen: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumber: false,
        hasSpecialChar: false
    });
    const [disableConfirm, setDisableConfirm] = useState(false);

    const [updatePwd] = useMutation<UpdatePwdResponse>(UPDATE_PWD, {
        onCompleted(data) {
            setShowLoading(false);
            handleJwt(data.updatePassword.jwt);
            setUserDetails(data.updatePassword.user);
            setErrors([]);
            resetApolloClient();
        },
        onError(error) {
            setShowLoading(false);
            const errors = logGraphqlErrors(error);
            setErrors(errors);
        }
    });

    useEffect(() => {
        const areThereMissingRules = Object.values(validations).includes(false);
        setDisableConfirm(areThereMissingRules && !!currentPassword);
    }, [validations, currentPassword]);

    const handleOnHide = () => {
        setDialogShown(true);
    }

    const handlePasswordChange = (type: 'current' | 'new') => (pwd: string) => {
        if (type === 'new') {
            setPassword(pwd);
            const [length, upper, lower, number, specialChar] = validatePassword(pwd);
            setValidations({
                moreThanTen: length,
                hasUpperCase: upper,
                hasLowerCase: lower,
                hasNumber: number,
                hasSpecialChar: specialChar
            });
        }
        if (type === 'current') {
            setcurrentPassword(pwd);
        }
    }


    const handleOnConfirm = () => {
        setShowLoading(true);
        const variables = {
            userId: userDetails?.id,
            currentPassword,
            password
        };
        updatePwd({ variables });
    }

    if (!userDetails?.isUsingDefaultPwd || dialogShown) return null;
    return (
        <DialogMessage
            show={!dialogShown}
            title="Actualiza tu Contraseña"
            mode="confirmation"
            message="Parece que estas utilizando la contraseña por default, favor de actualizar."
            onHide={handleOnHide}
            cancelText="Actualizar luego"
            confirmText="Cambiar"
            onConfirm={handleOnConfirm}
            disableConfirmButton={disableConfirm}
        >
            <View style={styles.inputContainer}>
                <TextInput
                    mode="flat"
                    label="Contraseña Actual"
                    secureTextEntry={!showCurrentPassword}
                    value={currentPassword}
                    onChangeText={handlePasswordChange('current')}
                    right={
                        <TextInput.Icon
                            onPress={() => { setShowCurrentPassword(!showCurrentPassword); }}
                            name={showCurrentPassword ? "eye-off" : "eye"} />
                    }
                    style={styles.textInput}
                />
                <TextInput
                    mode="flat"
                    label="Nueva Contraseña"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={handlePasswordChange('new')}
                    right={
                        <TextInput.Icon
                            onPress={() => { setShowPassword(!showPassword); }}
                            name={showPassword ? "eye-off" : "eye"} />
                    }
                    style={styles.textInput}
                />

                {errors.length > 0 ? <Text style={styles.error}>{errors.join('\n')}</Text> : null}
            </View>
            <View style={styles.ruleContainer}>
                <View style={styles.rule}>
                    <Indicator pass={validations.moreThanTen} />
                    <Text style={styles.ruleDescription}>Mas de 8 caracteres.</Text>
                </View>
                <View style={styles.rule}>
                    <Indicator pass={validations.hasUpperCase} />
                    <Text style={styles.ruleDescription}>Letras Mayúsculas (A-Z).</Text>
                </View>
                <View style={styles.rule}>
                    <Indicator pass={validations.hasLowerCase} />
                    <Text style={styles.ruleDescription}>Letras Minusculas (a-z).</Text>
                </View>
                <View style={styles.rule}>
                    <Indicator pass={validations.hasNumber} />
                    <Text style={styles.ruleDescription}>Números (0-9).</Text>
                </View>
                <View style={styles.rule}>
                    <Indicator pass={validations.hasSpecialChar} />
                    <Text style={styles.ruleDescription}>Caracteres Especiales (.?*&^).</Text>
                </View>

            </View>
        </DialogMessage>)
}

const styles = StyleSheet.create({
    inputContainer: {
        marginTop: 30
    },
    textInput: {
        fontSize: 20,
        marginBottom: 25,
        backgroundColor: theme.colors.white
    },
    ruleContainer: {
        marginBottom: 10
    },
    rule: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5
    },
    ruleDescription: {
        marginLeft: 24
    },
    error: {
        marginHorizontal: 20,
        color: theme.colors.error
    }
});

export default UpdatePassword;