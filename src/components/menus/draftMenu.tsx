import { useNavigation } from "@react-navigation/native";
import React, { FC } from "react";
import { Menu } from "react-native-paper";
import { CheckControlFormMode } from "../../constants&Types";
import { CdrEntry } from "../../types";
import MenuLayout from "./menuLayout";

const MenuItems: FC<{
    hideMenu?: () => void,
    item: CdrEntry,
    onDeletePress?: (item: CdrEntry) => void,
    navigation: any
}> =
    ({ hideMenu, item, onDeletePress, navigation }) => {

        return (
            <>
                <Menu.Item icon="pencil" onPress={() => {
                    if (hideMenu) hideMenu();
                    // @ts-ignore
                    navigation.navigate('CheckControlForm', {
                        mode: CheckControlFormMode.edit,
                        item
                    })
                }} title="Editar" />
                <Menu.Item
                    icon="delete-outline"
                    onPress={() => {
                        if (!onDeletePress) return;
                        if (hideMenu) hideMenu();
                        onDeletePress(item);
                    }}
                    title="Eliminar" />
            </>
        )
    }


const DraftMenu: FC<{ item: CdrEntry, onDeletePress?: (item: CdrEntry) => void }> = ({ item, onDeletePress }) => {
    const navigation = useNavigation();
    return (
        <MenuLayout>
            <MenuItems
                item={item}
                onDeletePress={onDeletePress}
                navigation={navigation}
            />
        </MenuLayout>
    )
}

export default DraftMenu;