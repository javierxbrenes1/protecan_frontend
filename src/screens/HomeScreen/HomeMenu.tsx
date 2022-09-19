import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { faShieldDog } from '@fortawesome/free-solid-svg-icons/faShieldDog';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import theme from '../../theme';
import { useNavigation } from '@react-navigation/native';

const HomeMenu = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Card onPress={() => {
                /* @ts-ignore */
                navigation.navigate('CheckControl');
            }}
                style={styles.card}>
                <Card.Content>
                    <FontAwesomeIcon style={styles.cardContent} color={theme.colors.primary} icon={faShieldDog} size={150} />
                    <Text style={styles.template}>Control De Revisión K-9</Text>
                </Card.Content>
            </Card>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        flow: 1
    },
    card: {
        marginVertical: 20,
        flexDirection: 'column',
        alignItems: 'center'
    },
    cardContent: {
        alignSelf: 'center'
    },
    template: {
        marginTop: 10,
        fontSize: 18
    }
});

export default HomeMenu;
