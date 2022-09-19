import React, { ReactNode, FC } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Menu, List, Divider, Text } from 'react-native-paper';
import { useGlobal } from '../globalContext';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons/faRightFromBracket'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

type ItemType = {
    children: ReactNode,
    text: string,
    includeDivider?: boolean
    onPress?: () => void
}
const Item: FC<ItemType> =
    ({ children, text, includeDivider, onPress }) => {
        return (
            <TouchableOpacity activeOpacity={0} onPress={onPress} >
                <View style={styles.item}>
                    {children}
                    <Text style={styles.itemText}>{text}</Text>
                </View>
                {includeDivider && <Divider />}
            </TouchableOpacity>
        );
    }

const PrincipalHeaderMenu: FC = () => {
    const { userDetails, logOut } = useGlobal();
    const [visible, setVisible] = React.useState(false);

    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    return (
        <Menu
            style={styles.menu}
            visible={visible}
            onDismiss={closeMenu}
            anchor={
                <TouchableOpacity activeOpacity={0} onPress={openMenu}>
                    <Image
                        style={styles.userIcon}
                        source={{ uri: `https://ui-avatars.com/api/?name=${userDetails?.name}` }}
                    />
                </TouchableOpacity>
            }>
            <Item text="Cerrar Sesion" onPress={logOut}>
                <FontAwesomeIcon icon={faRightFromBracket} />
            </Item>
        </Menu>

    );
};

const styles = StyleSheet.create({
    userIcon: {
        width: 35,
        height: 35,
        borderRadius: 100
    },
    menu: {
        marginTop: 40,
    },
    item: {
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    itemText: {
        marginLeft: 10
    }
})

export default PrincipalHeaderMenu;