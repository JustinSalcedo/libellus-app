import { useContext, useState } from "react"
import { Pressable, StyleSheet, Text, View } from "react-native"
import { ViewContext } from "../contexts"
import MyText from "../fonts/MyText"
import SettingsTray from "./SettingsTray"
import TaskHistory from "./TaskHistory"

interface IComponent {
    node?: React.ReactNode
    heading: string
}

const COMPONENTS: { [key: string]: IComponent } = {
    "task-history": {
        node: <TaskHistory />,
        heading: "Task history"
    },
    // "schedule-editor": {
    //     node: <ScheduleEditor />,
    //     heading: "Add new schedule"
    // },
    // "schedule-created": {
    //     heading: "Schedule created!"
    // },
    "settings": {
        node: <SettingsTray />,
        heading: "Settings"
    }
}

export default function Modal({ onOverlayPress, heading, nodeKey, children }: {
    onOverlayPress: () => void, heading?: string, nodeKey?: string, children?: React.ReactNode
}) {
    const { isModalOn } = useContext(ViewContext)

    function renderHeading() {
        if (!(nodeKey || heading)) return ''

        return COMPONENTS[nodeKey as string].heading || heading
    }

    function renderBody() {
        if (!(nodeKey || children)) return <Text></Text>

        return COMPONENTS[nodeKey as string].node || children
    }

    return (
        <View style={isModalOn ? styles.screen : styles.off}>
            <View style={isModalOn ? styles.on : styles.off}>
                <View style={styles.header}>
                    <MyText>
                        <Text style={styles.headerText}>{renderHeading()}</Text>
                    </MyText>
                    <Pressable style={styles.cross} onPress={onOverlayPress}>
                        <MyText>
                            <Text style={styles.crossText}>x</Text>
                        </MyText>
                    </Pressable>
                </View>
                {renderBody()}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        position: "absolute",
        zIndex: 3,
        backgroundColor: "none",
        height: "100%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center"
    },
    off: {
        display: "none"
    },
    on: {
        // width: "90%",
        // height: "75%",
        overflow: "hidden",
        padding: 16,
        backgroundColor: "#fff",
        borderRadius: 16
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16
    },
    headerText: {
        fontSize: 1.5 * 16,
        fontWeight: "bold"
    },
    cross: {
        width: 24,
        height: 24,
        borderRadius: 16,
        backgroundColor: "#ffe3ff",
        alignItems: "center",
        justifyContent: "center"
    },
    crossText: {
        color: "#7e49aa",
        lineHeight: 16
    }
})