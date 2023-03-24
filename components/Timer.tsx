import { StyleSheet, Text, View } from "react-native";
import MyText from "../fonts/MyText";

export default function Timer() {
    return (
        <View style={styles.timer}>
            <MyText>
                <Text style={styles.timerText}>30:05</Text>
            </MyText>
        </View>
    )
}

const styles = StyleSheet.create({
    timer: {
        height: 280,
        width: 248,
        alignItems: "center",
        justifyContent: "center"
    },
    timerText: {
        fontSize: 4 * 16
    }
})