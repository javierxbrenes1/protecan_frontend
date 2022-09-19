import LogRocket from "@logrocket/react-native"
import { User } from "../graphqlTypes";
import enviroment from '../manifest';
import * as Application from 'expo-application';

const logger = {
    init() {
        LogRocket.init(enviroment.LOGROCKET_KEY);
    },
    logError(error: any) {
        LogRocket.captureException({ ...error, appVersion: Application.nativeApplicationVersion });
    },
    identifyUser(user: User) {
        LogRocket.identify(user.id, {
            name: user.name,
            email: user.email,
            username: user.username
        });
    }
}

export default logger;
