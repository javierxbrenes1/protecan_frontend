import { FC, ReactNode } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Subheading, Button } from 'react-native-paper';

import theme from "../../theme";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

type TabLayoutProps = {
    description?: string,
    children?: ReactNode | ReactNode[]
}


const TabLayout: FC<TabLayoutProps> = ({ description, children }) => {
    return (
        <KeyboardAwareScrollView style={[styles.container, styles.containerShadow]}>
            {description && (<Subheading style={styles.description}>
                {description}
            </Subheading>)}
            <View style={styles.formContainer}>
                {children}
            </View>
        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15,
        flex: 1,
        backgroundColor: '#e3dcd5',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        marginHorizontal: 5,
    },
    containerShadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 4,
    },
    description: {
        color: theme.colors.primary,
        fontWeight: 'bold',
        paddingTop: 20,
        textAlign: "center"
    },
    formContainer: {
        flex: 1,
        paddingVertical: 20
    }
})

export default TabLayout;