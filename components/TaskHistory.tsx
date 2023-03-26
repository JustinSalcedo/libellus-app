import { StyleSheet, Text, View } from "react-native";
import { useContext, useState } from "react";
import { ScheduleContext } from "../contexts";
import MyText from "../fonts/MyText";
import MyCheckBox from "./MyCheckBox";
import TaskTable from "./TaskTable";

export default function TaskHistory() {
    const { schedule } = useContext(ScheduleContext)

    const [showHistory, setShowHistory] = useState(false)

    function handleCheckbox() {
        setShowHistory(showHistory => !showHistory)
    }

    return (
        <View style={styles.history}>
            <View style={styles.header}>
                <MyCheckBox text="Show past tasks: " value={showHistory} onValueChange={handleCheckbox} />
                <View style={styles.tableHeader}>
                    <View style={styles.headerVoid}></View>
                    <View style={styles.headerCell}>
                        <MyText>
                            <Text style={styles.cellText}>start</Text>
                        </MyText>
                    </View>
                    <View style={styles.headerCell}>
                        <MyText>
                            <Text style={styles.cellText}>end</Text>
                        </MyText>
                    </View>
                </View>
            </View>
            <TaskTable schedule={schedule} showHistory={showHistory} scrollable={true} />
        </View>
    )
}

const styles = StyleSheet.create({
    history: {
        overflow: "scroll"
    },
    header: {
        // width: 248
    },
    tableHeader: {
        flexDirection: "row"
    },
    headerVoid: {
        width: 7 * 16
    },
    headerCell: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-end"
    },
    cellText: {
        color: "#777",
        textTransform: "uppercase",
        fontSize: .875 * 16,
        fontWeight: "bold"
    },
    scrollable75: {
        height: 600
    }
})