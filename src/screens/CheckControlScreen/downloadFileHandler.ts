
import * as FileSystem from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import { showMessage } from 'react-native-flash-message';
import logger from '../../utils/logger';
import { CdrEntry } from "../../types";
import * as SecureStore from 'expo-secure-store';
import theme from '../../theme';
import { Platform } from 'react-native';
import * as Linking from 'expo-linking';

const USER_PERMISSION_KEY = 'USER_PERMISSION_KEY';

const openPdf = async (uri: string) => {
    await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
        data: uri,
        flags: 1,
        type: 'application/pdf'
    })
}

export const downloadPdf = async (item: CdrEntry) => {
    if(Platform.OS === 'ios') {
        if (!item?.report?.name) return;
        Linking.openURL(item.report.url);
        return;
    }

    const savedDirectoryPermission = await SecureStore.getItemAsync(USER_PERMISSION_KEY);
    let perm = savedDirectoryPermission ? JSON.parse(savedDirectoryPermission) : null;
    // todo make sure the folder exists
    if (!perm || !perm.granted) {
        perm = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        await SecureStore.setItemAsync(USER_PERMISSION_KEY, JSON.stringify(perm));
        if (!perm.granted) {
            return;
        }
    }

    if (!item?.report?.name) return;
    try {
        const existingReports = await FileSystem.StorageAccessFramework.readDirectoryAsync(perm.directoryUri);
        const alreadySavedReport = existingReports.find((r) => r.includes(item.report?.name || ''));
        if (alreadySavedReport) {
            await openPdf(alreadySavedReport);
            return;
        }
        const saveName = `${FileSystem.documentDirectory}${item.report.name}`
        const downloadedFile = await FileSystem.downloadAsync(item.report.url, saveName);
        if (downloadedFile.status != 200) {
            showMessage({
                message: `Hubo un error descargando el archivo, intenta de nuevo.`,
                type: 'danger',
                icon: 'auto',
                backgroundColor: theme.colors.error
            });
            return;
        }
        const fileString = await FileSystem.readAsStringAsync(downloadedFile.uri, { encoding: FileSystem.EncodingType.Base64 });
        const newFileUri = await FileSystem.StorageAccessFramework.createFileAsync(perm.directoryUri, item.report.name, 'application/pdf');

        await FileSystem.writeAsStringAsync(newFileUri, fileString, { encoding: FileSystem.EncodingType.Base64 });
        showMessage(
            {
                message: `Archivo ${item.report?.name} descargado.`,
                type: 'success',
                icon: 'auto',
                backgroundColor: theme.colors.sucess
            }
        );
        await openPdf(newFileUri);
    } catch (err: any) {
        logger.logError(err);
        showMessage({
            message: `Hubo un error: ${err.message}.\nPresiona este mensaje para hacerlo desaparecer.`,
            type: 'danger',
            icon: 'auto',
            autoHide: false,
            backgroundColor: theme.colors.error
        })
    }
};