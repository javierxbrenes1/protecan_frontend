import React, { FC, ReactNode } from 'react';
import { View, SafeAreaView, Platform, StatusBar, ViewStyle, StyleSheet } from 'react-native';


const styles = StyleSheet.create({
    container: {
        marginTop: StatusBar.currentHeight
    }
});

/**
 * Screen Wrapper to apply padding space on status bar
 */
const Screen: FC<{ style?: ViewStyle | ViewStyle[], children: React.ReactNode }> = (props) => {
    if (Platform.OS === 'ios') {
        return (
            <SafeAreaView style={props.style}>
                {props.children}
            </SafeAreaView>
        );
    }

    return (
        <View style={[styles.container, props.style]}>
            {props.children}
        </View>
    );
}

export default React.memo(Screen)
    ;