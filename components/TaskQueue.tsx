import { StyleSheet, Text, View } from "react-native";
import MyText from "../fonts/MyText";
import { ITask } from "../types";

export default function TaskQueue({ prev, next, current }: {
    prev?: ITask, current?: ITask, next?: ITask
}) {
    return (
        <View style={styles.taskQueue}>
            <View>
                <MyText>
                    <Text style={styles.prevText}>{prev ? prev.name : "..."}</Text>
                </MyText>
            </View>
            <View style={styles.current}>
                <MyText>
                    <Text style={styles.currentText}>{current ? current.name : "..."}</Text>
                </MyText>
            </View>
            <View>
                <MyText>
                    <Text style={styles.nextText}>{next ? next.name : "..."}</Text>
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