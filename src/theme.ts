import { DefaultTheme } from "react-native-paper";

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#246492',
        primaryRBA: (transparency?: number) => `rgba(36, 100, 146, ${transparency || 1})`,
        white: '#fff',
        sucess: '#195e24'
    }

}

export default theme;