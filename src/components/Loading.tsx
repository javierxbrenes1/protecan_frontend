import React, { FC } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import theme from '../theme';
import Screen from './Screen';



const Loading: FC<{ asCover?: boolean }> = ({ asCover }) => {
    return (
        <Screen style={[styles.container, ...asCover ? [styles.asCover] : []]}>
            <ActivityIndicator animating color={theme.colors.white} size="large" />
        </Screen>);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center'
    },
    asCover: {
        position: 'absolute',
        backgroundColor: theme.colors.primaryRBA(0.7),
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').height,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000
    }
});

export default Loading;