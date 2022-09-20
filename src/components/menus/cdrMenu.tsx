import { useNavigation } from "@react-navigation/native";
import { FC, useState } from "react";
import { Menu } from "react-native-paper";
import { CheckControlFormMode } from "../../constants&Types";
import { useGlobal } from "../../globalContext";
import { CdrEntry } from "../../types";
import MenuLayout from "./menuLayout";


const MenuItems: FC<{
    hideMenu?: () => void,
    item: CdrEntry,
    navigation: any,
    downloadPdf: () => void,
    createCopy: () => Promise<CdrEntry>
}> =
    ({ hideMenu, item, navigation, downloadPdf, createCopy }) => {
        const {setShowLoading} = useGlobal();

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

                <Menu.Item icon="content-copy" onPress={async () => {
                    if (hideMenu) hideMenu();
                    setShowLoading(true);
                        try{
                            const newItem = await createCopy();
                    // @ts-ignore
                        navigation.navigate('CheckControlForm', {
                            mode: CheckControlFormMode.edit,
                            item: newItem
                        })
                    }catch(err) {
                        console.log(err);
                    }finally {
                        setShowLoading(false);
                    }
                }} title="Usar como Template" />
            </>
        )
    }

const CdrMenu: FC<{ 
    item: CdrEntry, 
    downloadPdf: (item: CdrEntry) => void, 
    createCopy: (item: CdrEntry) => Promise<CdrEntry> }> = ({ item, downloadPdf, createCopy }) => {
    const navigation = useNavigation();

    const handleDownloadPdf = () => {
        downloadPdf(item);
    }

    const handleCreateCopy = async () => {
        const result = await createCopy(item);
        return result;
    }

    return (
        <MenuLayout>
            <MenuItems item={item} 
            navigation={navigation} 
            downloadPdf={handleDownloadPdf} 
            createCopy={handleCreateCopy} />
        </MenuLayout>
    )
}
export default CdrMenu;