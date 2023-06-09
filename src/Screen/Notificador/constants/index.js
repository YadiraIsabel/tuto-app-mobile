import { Dimensions } from "react-native";
import { isWeb } from "../utils";

export const ElementsText = {
    AUTOPLAY: "AutoPlay",
};
export const window = isWeb
    ? {
        ...Dimensions.get("window"),
        width: 375,
    }
    : Dimensions.get("window");
export const getRandomColor = () => {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}