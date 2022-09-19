import { useNavigation } from "@react-navigation/native";
import { FC } from "react";
import { Menu } from "react-native-paper";
import { CheckControlFormMode } from "../../constants&Types";
import { CdrEntry } from "../../types";
import MenuLayout from "./menuLayout";


const MenuItems: FC<{
    hideMenu?: () => void,
    item: CdrEntry,
    navigation: any,
    downloadPdf: () => void
}> =
    ({ hideMenu, item, navigation, downloadPdf }) => {

        return (
            <>
                <Menu.Item icon="eye" onPress={() => {
                    if (hideMenu) hideMenu();
                    // @ts-ignore
                    navigation.navigate('CheckControlForm', {
                        mode: CheckControlFormMode.view,
                        item
                    })
                }} title="Ver" />

                {item.report && <Menu.Item
                    icon="file-pdf-box"
                    onPress={() => {
                        if (hideMenu) hideMenu();
                        downloadPdf();
                    }}
                    title="Descargar Reporte" />}
            </>
        )
    }

const CdrMenu: FC<{ item: CdrEntry, downloadPdf: (item: CdrEntry) => void }> = ({ item, downloadPdf }) => {
    const navigation = useNavigation();

    const handleDownloadPdf = () => {
        downloadPdf(item);
    }

    return (
        <MenuLayout>
            <MenuItems item={item} navigation={navigation} downloadPdf={handleDownloadPdf} />
        </MenuLayout>
    )
}
export default CdrMenu;