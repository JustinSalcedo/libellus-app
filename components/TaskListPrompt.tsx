import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext, useEffect, useState } from "react";
import { NativeSyntheticEvent, ScrollView, StyleSheet, Text, TextInput, TextInputChangeEventData, View } from "react-native";
import { ScheduleContext, SettingsContext, ViewContext } from "../contexts";
import MyText from "../fonts/MyText";
import { DateRangeMode, ITask } from "../types";
import { errorToStr, getTodayRange, validateSchedule } from "../utils";
import MyButton from "./MyButton";
import MyCheckBox from "./MyCheckBox";
import TaskTable from "./TaskTable";

export default function TaskListPrompt() {
    const { sRDateRange, sRStart, sREnd, getTheme } = useContext(SettingsContext)
    const { setSchedule: setGlobalSchedule, schedule: currSchedule } = useContext(ScheduleContext)
    const { setActiveModal, launchModal } = useContext(ViewContext)

    const [schedule, setSchedule] = useState(null as unknown as ITask[])
    const [isEdit, setIsEdit] = useState(false)
    const [prompt, setPrompt] = useState('')
    const [wasPreviewed, setWasPreviewed] = useState(false)
    const [note, setNote] = useState('')

    useEffect(() => {
        if (isEdit) {
            if (!currSchedule.length) {
                setNote('No schedule set')
                setIsEdit(false)
            } else {
                const generatedPrompt = scheduleToPrompt(currSchedule)
                setPrompt(generatedPrompt)
                setNote('')
            }
        } else {
            AsyncStorage.getItem('prompt')
                .then(savedPrompt => {
                    if (savedPrompt) setPrompt(savedPrompt)
                })
        }
    }, [isEdit])

    const scrollHeight = 600 - (23 + 8 + 145 + (note ? (31 + 8) : 0)
        + 8 + 25 + + 8 + 23)

    function shouldScroll() {
        return (schedule ? (schedule.length * 35) : 0) >= scrollHeight
    }

    function previewSchedule() {
        if (!prompt) return false

        try {
            setSchedule(validateSchedule(generateFromScratch(parsePrompt(prompt), { sRDateRange, sRStart, sREnd }, setNote)))
            setWasPreviewed(true)
            setNote('')
        } catch (error) {
            setNote(errorToStr(error))
        }
    }

    function parsePrompt(text: string) {
        return text.trim().split(',').map(arg => arg.trim())
    }

    async function createSchedule() {
        if (!schedule || !schedule.length) return

        try {
            await AsyncStorage.setItem('schedule', JSON.stringify(schedule))
            setTimeout(() => {
                setGlobalSchedule(schedule)
                launchModal(false)
            }, 1000)
            setActiveModal('schedule-created')
            if (!isEdit) AsyncStorage.removeItem('prompt')
            setNote('')
        } catch (error) {
            setNote(errorToStr(error))
        }
    }

    function resetPrompt() {
        setSchedule(null as unknown as ITask[])
        setPrompt('')
        if (!isEdit) AsyncStorage.removeItem('prompt')
    }

    function onPromptChange({ nativeEvent: { text } }: NativeSyntheticEvent<TextInputChangeEventData>) {
        setPrompt(text)
        setWasPreviewed(false) // prompt was altered
        if (!isEdit) AsyncStorage.setItem('prompt', text)
    }

    function onCheckboxChange() {
        setIsEdit(isEdit => !isEdit)
    }

    return (
        <View>
            <View style={styles.editCheck}>
                <MyCheckBox text="...or edit existing " value={isEdit} onValueChange={onCheckboxChange} />
            </View>
            <View style={styles.flexer}>
                <MyText>Task list:</MyText>
                <TextInput style={styles.prompt} multiline numberOfLines={6}
                    value={prompt} onChange={onPromptChange} />
            </View>
            {note ? <View style={styles.noteArea}><MyText>{note}</MyText></View> : <></> }
            <View style={styles.buttons}>
                <MyButton title="Reset" onPress={resetPrompt}/>
                <MyButton disabled={!prompt} onPress={previewSchedule} title="Preview" />
                <MyButton disabled={!wasPreviewed} onPress={createSchedule} title="Create" />
            </View>
            { schedule ? 
            <View style={[styles.taskPreview, (shouldScroll() ? { height: scrollHeight } : {})]}>
                <View style={styles.header}>
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
                {shouldScroll() ? <ScrollView>
                    <TaskTable schedule={schedule} showHistory={true} />
                </ScrollView> : <TaskTable schedule={schedule} showHistory={true} /> }
            </View> : <></>}
        </View>
    )
}

const styles = StyleSheet.create({
    scroller: {
        height: 600
    },
    editCheck: {
        marginBottom: .5 * 16
    },
    flexer: {

    },
    prompt: {
        width: 280,
        height: 110,
        borderColor: "#777",
        borderWidth: 1,
        marginTop: .25 * 16,
        marginBottom: .5 * 16,
        padding: .25 * 16,
        fontFamily: "monospace"
    },
    noteArea: {
        backgroundColor: "#eee",
        padding: .25 * 16,
        marginBottom: .5 * 16
    },
    buttons: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: .5 * 16
    },
    taskPreview: {
        overflow: "scroll"
    },
    header: {
        marginTop: .5 * 16
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
})

function generateFromScratch(taskList: string[], scheduleRange: { sRDateRange: DateRangeMode, sRStart: Date, sREnd: Date }, errorHandler?: (errorMsg: string) => void) {
    const schedule = []

    let { sRDateRange, sRStart, sREnd } = scheduleRange
    if (sRDateRange === "today") {
        const { startsAt, endsAt } = getTodayRange()
        sRStart = startsAt; sREnd = endsAt
    }
    let lastTimestamp = sRStart
    const timestampLimit = sREnd

    for (let index = 0; index < taskList.length; index++) {
        const taskName = taskList[index];
        const timespanInMin = parseInt(taskList[index + 1])

        if (index % 2 || !timespanInMin) continue;

        if (!(typeof taskName === 'string')) throw new Error(`Task '${taskName}' has invalid name or type`)
        if (!(typeof timespanInMin === 'number')) throw new Error(`Task '${taskName}' misses a timespan`)

        if (!taskName) {
            lastTimestamp = new Date(lastTimestamp.getTime() + timespanInMin * 60 * 1000)
            continue;
        }

        const task = generateTask(taskName, timespanInMin, lastTimestamp)

        if (task.end > timestampLimit) {
            if (errorHandler) errorHandler(`Task '${task.name}' ${(taskList.length - 2 === index)
                ? 'exceeds the timespan and was skipped'
                : `and other ${Math.floor((taskList.length - index - 1) / 2)} exceed the timespan and were skipped`
            }`)
            break;
        }

        schedule.push(task)
        lastTimestamp = task.end
    }

    return validateSchedule(schedule)
}

function generateTask(name: string, timespanInMin: number, lastTimestamp: Date) {
    return {
        name,
        start: lastTimestamp,
        end: new Date(lastTimestamp.getTime() + timespanInMin * 60 * 1000)
    } as ITask
}

function scheduleToPrompt(schedule: ITask[]) {
    return schedule
        .map(({name, start, end}, index) => {
            let prefix = ''
            if (index && (start.getTime() !== schedule[index - 1].end.getTime()))
                prefix = `, ${Math.floor((start.getTime() - schedule[index - 1].end.getTime()) / 1000 / 60)}, `
            return prefix + `${name}, ${Math.floor((end.getTime() - start.getTime()) / 1000 / 60)}`
        })
        .join(', ')
}