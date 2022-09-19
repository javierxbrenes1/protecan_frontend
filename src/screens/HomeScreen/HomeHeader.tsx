import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Divider } from 'react-native-paper';
import { useGlobal } from '../../globalContext';
import { faSun } from '@fortawesome/free-solid-svg-icons/faSun';
import { faCloudMoon } from '@fortawesome/free-solid-svg-icons/faCloudMoon';
import { faCloudSun } from '@fortawesome/free-solid-svg-icons/faCloudSun';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

const determineTimeFrame = (): 'morning' | 'afternoon' | 'night' => {
    const date = new Date();

    const hour = date.getHours();
    if (hour >= 5 && hour < 12) {
        return 'morning'
    } else if (hour >= 12 && hour < 18) {
        return 'afternoon'
    }
    return 'night'
}

const timeIcons = {
    morning: faSun,
    afternoon: faCloudSun,
    night: faCloudMoon
}

const greetings = {
    morning: 'Buenos Dias,',
    afternoon: 'Buenas Tardes,',
    night: 'Buenas Noches'
}


const HomeHeader = () => {
    const { userDetails } = useGlobal();
    const timeFrame = determineTimeFrame();

    return (
        <View style={styles.container}>
            <View style={styles.details}>
                <View style={styles.welcome}>
                    <FontAwesomeIcon icon={timeIcons[timeFrame]} size={30} />
                    <Text style={styles.greeting}>{greetings[timeFrame]}</Text>
                </View>
                <Text style={styles.name}>{userDetails?.name}</Text>
                <Divider style={{ margin: 20 }} />
                <Text style={styles.title}>Bienvenido a Protecan Seguridad, ingresa a alguno de nuestros servicios.</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingHorizontal: 5,
        alignItems: 'center',
        shadowColor: '#44b0c6',

    },
    title: {
        fontSize: 16,
    },
    details: {
        marginHorizontal: 20,
        marginVertical: 10
    },
    welcome: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    greeting: {
        fontSize: 30,
        fontWeight: 'bold',
        marginLeft: 5
    },
    name: {
        fontSize: 25,
    }
});

export default HomeHeader;
