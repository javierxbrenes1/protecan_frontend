import 'react-native-gesture-handler';
import React, { FC } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../HomeScreen';
import CheckControlScreen from '../CheckControlScreen';
import CheckControlFormScreen from '../CheckControlFormScreen';
import theme from '../../theme';
import PrincipalHeaderMenu from '../../components/PrincipalHeaderMenu';
import { useGlobal } from '../../globalContext';
import Loading from '../../components/Loading';
import FlashMessage from "react-native-flash-message";
import enviroment from '../../manifest';
import StagingNote from '../../components/StagingNote';

const Stack = createNativeStackNavigator();

const screenOptions = {
    headerStyle: {
        backgroundColor: theme.colors.primary,
    },
    headerTitleStyle: {
        color: theme.colors.white
    },
    headerTintColor: theme.colors.white,
    headerRight: () => { return <PrincipalHeaderMenu /> }
};

const PrincipalScreen: FC = () => {
    const { showLoading } = useGlobal();

    return (
        <>
            {showLoading && <Loading asCover />}
            <FlashMessage position="top" statusBarHeight={50} />
            <NavigationContainer>
                {/* @ts-ignore */}
                <Stack.Navigator initialRouteName='Home' screenOptions={screenOptions}>
                    <Stack.Screen
                        name="Home"
                        component={HomeScreen}
                        options={{ title: '' }}
                    />
                    <Stack.Screen
                        name="CheckControl"
                        component={CheckControlScreen}
                        options={{ title: 'Control de revisión k-9', headerTitleAlign: 'center', }} />
                    <Stack.Screen
                        name="CheckControlForm"
                        component={CheckControlFormScreen}
                        options={{ title: 'Control de revisión k-9', headerTitleAlign: 'center' }} />
                </Stack.Navigator>
            </NavigationContainer>
        </>
    );
}


export default PrincipalScreen;