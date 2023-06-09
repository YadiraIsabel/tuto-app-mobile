import AsyncStorage from "@react-native-community/async-storage";
import { environment } from "../../../../environments/environment";

const TokenRepository = {
    getToken: async () => await AsyncStorage.getItem(environment.TOKEN_FIELD),
    clearToken: async () => await AsyncStorage.clear(),
    persistToken: async (token) => await AsyncStorage.setItem(environment.TOKEN_FIELD, token),
}
export default TokenRepository;