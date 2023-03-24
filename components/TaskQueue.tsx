import { StyleSheet, Text, View } from "react-native";
import MyText from "../fonts/MyText";

export default function TaskQueue() {
    return (
        <View style={styles.taskQueue}>
            <View>
                <MyText>
                    <Text style={styles.prevText}>Tu</Text>
                </MyText>
            </View>
            <View style={styles.current}>
                <MyText>
                    <Text style={styles.currentText}>Eres todo</Text>
                </MyText>
            </View>
            <View>
                <MyText>
                    <Text style={styles.nextText}>Para mi 💕</Text>
                </MyText>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    taskQueue: {
        flex: 1,
        flexDirection: "row",
        position: "absolute"
    },
    prevText: {
        color: "#bbb",
        fontSize: 16
    },
    current: {
        paddingHorizontal: 16 / 2,
        marginHorizontal: 16 / 2,
        borderLeftWidth: 2,
        borderRightWidth: 2,
        borderColor: "#777"
    },
    currentText: {
        color: "#555",
        fontSize: 16
    },
    nextText: {
        color: "#777",
        fontSize: 16
    }
})