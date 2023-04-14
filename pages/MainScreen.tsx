import { useContext, useEffect, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import TaskQueue from "../components/TaskQueue";
import Timer from "../components/Timer";
import { ScheduleContext } from "../contexts";
import MyText from "../fonts/MyText";
import Minimal from "../layouts/Minimal";
import { ITask } from "../types";
import { getTaskQueue } from "../utils";
import LoadScreen from "./LoadScreen";
import Notifier from "../components/Notifier";
import ScheduleNotifier from "../components/ScheduleNotifier";

export default function MainScreen() {
    const { schedule, refreshSchedule } = useContext(ScheduleContext)

    const [timer, setTimer] = useState(null as unknown as number)
    const [prevTask, setPrevTask] = useState(null as unknown as ITask)
    const [currentTask, setCurrentTask] = useState(null as unknown as ITask)
    const [nextTask, setNextTask] = useState(null as unknown as ITask)

    const [isActive, setIsActive] = useState(true)

    const tick = () => {
        const { prevTask: prev, currentTask: curr, nextTask: next } = getTaskQueue(schedule)
        if (!curr) setIsActive(false)
        if (currentTask && curr && ((!currentTask.id && !curr.id) || (currentTask.id && curr.id && currentTask.id === curr.id))) return
        setPrevTask(prev); setCurrentTask(curr); setNextTask(next);
    }

    useEffect(() => {
        // TODO: Clear interval before new task
        setTimer(setInterval(tick, 1000))

        // TODO: Notifications
        // if (!wasNotified && currentTask) {
        //     notify(currentTask)
        //     setWasNotified(true)
        // }

        return clearInterval(timer)
    }, [currentTask])

    useEffect(() => {
        if (!isActive) return refreshSchedule()
    }, [isActive])

    function nullifyGaps(task: ITask) {
        if (!task || task.name === "Chill") return null as unknown as ITask

        return task
    }

    return currentTask ? (
        <Minimal>
            <ScheduleNotifier />
            {/* {currentTask.id ? <Notifier task={currentTask}/> : <></> } */}
            <View style={styles.container}>
                <View style={styles.top}>
                    {currentTask ? (
                        <>
                            <Timer task={currentTask} />
                            <View>
                                <MyText>
                                    <Text style={styles.topText}>{currentTask.name}</Text>
                                </MyText>
                            </View>
                        </>
                    ) : false}
                </View>
                <View style={styles.void}></View>
                <View style={styles.middle}>
                    {nextTask ? (
                        <>
                            <MyText>
                                <Text style={[styles.middleText, styles.label]}>Next: </Text>
                            </MyText>
                            <MyText>
                                <Text style={styles.middleText}>{nextTask.name}</Text>
                            </MyText>
                        </>
                    ) : ( <MyText><Text style={[styles.middleText, styles.lastTask]}>Last task</Text></MyText> )}
                </View>
                <View style={styles.bottom}>
                    <TaskQueue prev={nullifyGaps(prevTask)} current={nullifyGaps(currentTask)} next={nullifyGaps(nextTask)}/>
                </View>
            </View>
        </Minimal>
    ) : <LoadScreen />
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    top: {
        flex: 7,
        alignItems: "center"
    },
    topText: {
        fontSize: 2 * 16,
        textAlign: "center"
    },
    void: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    middle: {
        flex: 2,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "center"
    },
    middleText: {
        fontSize: 1.5 * 16
    },
    bottom: {
        flex: 2,
        alignItems: "center",
        justifyContent: "center"
    },
    label: {
        fontWeight: 'bold'
    },
    lastTask: {
        fontStyle: 'italic'
    }
})