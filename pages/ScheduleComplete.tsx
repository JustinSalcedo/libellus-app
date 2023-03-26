import { Platform, StyleSheet, Text, View } from "react-native";
import MyButton from "../components/MyButton";
import MyText from "../fonts/MyText";
import Minimal from "../layouts/Minimal";

export default function ScheduleComplete() {
    function onAddNewTasks() {
        return
    }

    return (
        <Minimal>
            <View style={styles.container}>
                <View style={styles.message}>
                    <View style={styles.messageContainer}>
                        <Text style={styles.messageText}>
                            <MyText>
                                <Text style={styles.headerText}>Schedule finished{Platform.OS === "web" ? ' ' : ''}</Text>
                            </MyText>
                        </Text>
                        <Text style={[styles.messageText, styles.checkmark]}>✔️</Text>
                    </View>
                </View>
                <View style={styles.action}>
                    <MyButton onPress={onAddNewTasks} title={'Add new tasks'} />
                </View>
                <View style={styles.note}>
                    <MyText>
                        <Text style={styles.noteText}>No more schedules</Text>
                    </MyText>
                </View>
                <View style={styles.schedule}>
                    <MyText>
                        <Text style={styles.scheduleText}>Default tasklist</Text>
                    </MyText>
                </View>
            </View>
        </Minimal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    message: {
        flex: 7,
        alignItems: "center",
        flexDirection: "column"
    },
    messageContainer: {
        width: 248,
        marginVertical: 2.34 * 16,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    },
    messageText: {
        textAlign: "center"
    },
    headerText: {
        fontSize: 2.34 * 16,
        fontWeight: "bold"
    },
    checkmark: {
        fontSize: 4 * 16
    },
    action: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    note: {
        flex: 2,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "center"
    },
    noteText: {
        fontSize: 1.5 * 16
    },
    schedule: {
        flex: 2,
        alignItems: "center",
        justifyContent: "center"
    },
    scheduleText: {
        fontSize: 16
    }
})