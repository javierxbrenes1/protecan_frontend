import React from "react";
import { faBomb } from "@fortawesome/free-solid-svg-icons";
import { StyleSheet, ScrollView } from "react-native";
import Screen from "./Screen";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import theme from "../theme";
import { Text, Title, Button } from "react-native-paper";
import logger from "../utils/logger";

const ErrorBoundaryHandler = (props: { error: Error, resetError: Function }) => {

    const handleResetPress = () => {
        logger.logError(props.error);
        props.resetError()
    }

    return (
        <Screen style={styles.container}>
            <FontAwesomeIcon icon={faBomb} size={100} color={theme.colors.primary} />
            <Title style={styles.title}>Parece que hubo un error.</Title>
            <ScrollView style={{ flex: 1 }}>
                <Text style={styles.errorDetail}>{props.error.toString()}</Text>
            </ScrollView>
            <Button
                onPress={handleResetPress}
                mode='contained'
                style={styles.button}
                labelStyle={styles.buttonLabel}
            >
                Intenta nuevamente
            </Button>
        </Screen>
    )
};


const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        paddingVertical: 40
    },
    errorDetail: {
        fontSize: 20,
        fontStyle: 'italic'
    },
    title: {
        fontSize: 35,
        marginVertical: 30,
        padding: 10,
        textAlign: 'center'
    },
    button: {
        borderRadius: 50,
    },
    buttonLabel: {
        fontSize: 20,
    }
});

export default ErrorBoundaryHandler;