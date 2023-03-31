import { Pressable, StyleSheet, Text } from "react-native";
import MyText from "../fonts/MyText";

export default function FloatingButton({ symbol, higherTop, onPress }: {
    symbol: string, onPress: () => void, higherTop?: boolean
}) {
    return (
        <Pressable onPress={onPress}
            style={higherTop ? [styles.circle, styles.higherBotton] : styles.circle}>
            <MyText><Text style={styles.symbol}>{symbol}</Text></MyText>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    circle: {
        width: 3 * 16,
        height: 3 * 16,
        borderRadius: 9999,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: "#555"
    },
    symbol: {
        fontSize: 2 * 16
    },
    higherBotton: {
        paddingBottom: 4
    }
})