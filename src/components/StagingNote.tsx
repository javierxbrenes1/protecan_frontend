import enviroment from "../manifest"
import { Text } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import theme from "../theme";

const StagingNote = () => {
    if(enviroment.IS_PRODUCTION) return null;
    return  <Text style={styles.stagingNote}>Atencion: Esta usando una version de pruebas</Text>;
}

const styles = StyleSheet.create({
    stagingNote: {
        color: theme.colors.warning,
        fontSize: 18,
        textAlign: 'center',
        marginVertical: 10
    }
});

export default StagingNote;