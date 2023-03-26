import { useContext } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ViewContext } from "../contexts";
import MyText from "../fonts/MyText";
import { ITask } from "../types";

export default function TaskQueue({ prev, next, current }: {
    prev?: ITask, current?: ITask, next?: ITask
}) {
    const { setActiveModal, launchModal } = useContext(ViewContext)

    function handleOnClick() {
        setActiveModal('task-history')
        launchModal(true)
    }

    return (
        <Pressable style={styles.taskQueue} onPress={handleOnClick}>
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
        </Pressable>
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