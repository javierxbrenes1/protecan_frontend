import { DefaultTheme } from "react-native-paper";
import enviroment from "./manifest";

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primaryDarker: '#184260',
        primary: '#246492',
        primaryLighter: '#44b0c6',
        primaryRBA: (transparency?: number) => `rgba(36, 100, 146, ${transparency || 1})`,
        white: '#fff',
        sucess: '#195e24',
        warning: '#f2ae30'
    }

}

export default theme;