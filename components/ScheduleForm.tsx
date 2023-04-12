import AsyncStorage from "@react-native-async-storage/async-storage"
import { useContext, useEffect, useState } from "react"
import { NativeSyntheticEvent, Platform, ScrollView, StyleSheet, TextInput, TextInputChangeEventData, View } from "react-native"
import { ScheduleContext, SettingsContext, ViewContext } from "../contexts"
import MyText from "../fonts/MyText"
import { ITask } from "../types"
import { errorToStr, getTodayRange, validateSchedule } from "../utils"
import MyButton from "./MyButton"
import MyCheckBox from "./MyCheckBox"
import MyDateInput from "./MyDateInput"
import MyMiniButton from "./MyMiniButton"
import MySuperButton from "./MySuperButton"
import MyTimeInput, { getLocalTime, setLocalDateTime } from "./MyTimeInput"
import TaskTable from "./TaskTable"

export default function ScheduleForm() {
    const { getTheme, sRStart, sRDateRange } = useContext(SettingsContext)
    const { setSchedule: setGlobalSchedule, schedule: currSchedule, refreshSchedule } = useContext(ScheduleContext)
    const { setActiveModal, launchModal } = useContext(ViewContext)

    const startDate = sRDateRange === "custom" ? sRStart : getTodayRange().startsAt
    
    const [dateList, setDateList] = useState([getLocalDate(startDate)])
    const [scheduleGroup, setScheduleGroup] = useState({ [getLocalDate(startDate)]: [createNextTask(startDate)] })
    const [previewList, setPreviewList] = useState([] as string[])

    const [note, setNote] = useState('')
    const [preventNote, setPreventNote] = useState(false)
    const [isValidSchedule, setIsValidSchedule] = useState(false)
    const [isSorted, setIsSorted] = useState(true)
    const [isEdit, setIsEdit] = useState(false)

    useEffect(() => {
        if (!dateList.length && !Object.keys(scheduleGroup).length) {
            setNote('')
            setDateList([getLocalDate(startDate)])
            setScheduleGroup({ [getLocalDate(startDate)]: [createNextTask(startDate)] })
        }
    })

    useEffect(() => {
        if (isEdit) {
            if (!currSchedule.length) {
                setNote('No schedule set')
                setIsEdit(false)
            } else {
                const generatedGroup = scheduleToGroup(currSchedule)
                setScheduleGroup(generatedGroup)
                setDateList(Object.keys(generatedGroup))
                setNote('')
            }
        } else {
            AsyncStorage.getItem('scheduleGroup')
                .then(rawScheduleGroup => {
                    if (rawScheduleGroup) {
                        const savedScheduleGroup = splitGroupDates(generateDates(JSON.parse(rawScheduleGroup)), setNote)
                        setScheduleGroup(savedScheduleGroup)
                        setDateList(Object.keys(savedScheduleGroup))
                    }
                })
        }
    }, [isEdit])

    function shouldScroll() {
        let taskInputs = 0; let taskTableRows = 0
        Object.entries(scheduleGroup).forEach(([localDate, taskList]) => {
            if (previewList.some(previewDate => previewDate === localDate)) taskTableRows += taskList.length
            else taskInputs += taskList.length
        })
        const computedLength = 23 + 12 + (note ? (32 + 8) : 0)
            + dateList.length * (24 + 12 + 12) + (dateList.length - previewList.length) * 24
            + taskInputs * (57 + 12) + taskTableRows * 35
            + 8 + 25
        return computedLength >= 600
    }

    function onAddDateClick() {
        setDateList(dateList => {
            const lastDate = new Date(`${dateList[dateList.length - 1]} 00:00`)
            const nextDate = new Date(lastDate.getTime() + 24 * 60 * 60 * 1000)
            const initialTask = { name: '', start: nextDate, end: new Date(nextDate.getTime() + 15 * 60 * 1000) }
            setScheduleGroup(scheduleGroup => ({ ...scheduleGroup, [getLocalDate(nextDate)]: [initialTask] }))
            return [...dateList, getLocalDate(nextDate)]
        })
    }

    function onDateChange(date: Date, index: number) {
        const localDate = getLocalDate(date)
        setDateList(dateList => {
            if (dateList.includes(localDate)) {
                if (!preventNote) {
                    setNote('Date already exists')
                } else {
                    setPreventNote(false)
                }
                return dateList
            }
            setScheduleGroup(scheduleGroup => {
                const taskList = scheduleGroup[dateList[index]]
                delete scheduleGroup[dateList[index]]
                return { ...scheduleGroup, [localDate]: taskList.map(task => ({
                    ...task,
                    start: setLocalDateTime(date, getLocalTime(task.start)),
                    end: setLocalDateTime(date, getLocalTime(task.end))
                })) }
            })
            setNote('')
            const updatedDates = [...dateList.slice(0, index), localDate, ...dateList.slice(index + 1)]
            setIsSorted(isSortedDateList(updatedDates))
            return updatedDates
        })
    }

    function resortDates() {
        setDateList(dateList => dateList.sort((a, b) => (a > b) ? 1 : -1))
        setIsSorted(true)
    }

    function handleTask(localDate: string, index: number, task: ITask) {
        setScheduleGroup(scheduleGroup => {
            const updatedTaskList = [...scheduleGroup[localDate].slice(0, index), task, ...scheduleGroup[localDate].slice(index + 1)]
            try {
                validateSchedule(updatedTaskList)
                setIsValidSchedule(true)
                setNote('')
            } catch (error) {
                setNote(errorToStr(error))
                setIsValidSchedule(false)
            } finally {
                const updatedScheduleGroup = { ...scheduleGroup, [localDate]: updatedTaskList }
                if (!isEdit) AsyncStorage.setItem('scheduleGroup', JSON.stringify(updatedScheduleGroup))
                return updatedScheduleGroup
            }
        })
    }

    function addTask(localDate: string) {
        setScheduleGroup(scheduleGroup => {
            const taskList = scheduleGroup[localDate]
            const start = taskList[taskList.length - 1].end
            const nextTask = createNextTask(start)
            if (!nextTask) {
                setNote('Task is out of range. Add another date.')
                return scheduleGroup
            }
            return { ...scheduleGroup, [localDate]: [...taskList, nextTask] }
        })
    }

    function deleteTask(localDate: string, index: number) {
        setScheduleGroup(scheduleGroup => {
            const taskList = scheduleGroup[localDate]
            if (taskList.length === 1) {
                setDateList(dateList => dateList.filter(date => date !== localDate))
                delete scheduleGroup[localDate]
                return scheduleGroup
            }
            const updatedScheduleGroup = { ...scheduleGroup, [localDate]: [...taskList.slice(0, index), ...taskList.slice(index + 1)] }
            if (!isEdit) AsyncStorage.setItem('scheduleGroup', JSON.stringify(updatedScheduleGroup))
            return updatedScheduleGroup
        })
    }

    async function createSchedule() {
        try {
            const schedule = Object.values(scheduleGroup).flatMap(taskList => taskList.map(task => ({ ...task, id: `${task.start.getTime()}-${task.end.getTime()}` })))
            await AsyncStorage.setItem('schedule', JSON.stringify(schedule))
            setTimeout(() => {
                setGlobalSchedule(schedule)
                launchModal(false)
                refreshSchedule()
            }, 1000)
            setActiveModal('schedule-created')
            if (!isEdit) AsyncStorage.removeItem('scheduleGroup')
            setNote('')
        } catch (error) {
            setNote(errorToStr(error))
        }
    }

    function addDateToPreview(localDate: string, add: boolean) {
        if (add) return setPreviewList(previewList => [...previewList, localDate])
        setPreviewList(previewList => previewList.filter(previewDate => previewDate !== localDate))
    }

    function resetForm() {
        setDateList([])
        setScheduleGroup({})
        if (!isEdit) AsyncStorage.removeItem('scheduleGroup')
    }

    function renderDayTasks() {
        return dateList.map((localDate, index) => (
            <DayTasks key={index} localDate={localDate} taskList={scheduleGroup[localDate] || []}
                editDate={date => onDateChange(date, index)} handleTask={(index, task) => handleTask(localDate, index, task)}
                addTask={() => addTask(localDate)} deleteTask={index => deleteTask(localDate, index)}
                addToPreview={add => addDateToPreview(localDate, add)} />
        ))
    }

    function onCheckboxChange() {
        setIsEdit(isEdit => !isEdit)
    }

    return (
        <View style={shouldScroll() ? styles.scroller : {}}>
            <View style={styles.editCheck}>
                <MyCheckBox value={isEdit} onValueChange={onCheckboxChange} text="...or edit existing " />
            </View>
            {note ? <View style={styles.noteArea}><MyText>{note}</MyText></View> : <></> }
            {shouldScroll() ? <ScrollView>{renderDayTasks()}</ScrollView> : renderDayTasks()}
            <View style={styles.buttons}>
                <MyButton title="Reset" onPress={resetForm} />
                <MyButton title="Add date" onPress={onAddDateClick} />
                {isSorted ? <MyButton disabled={!isValidSchedule} onPress={createSchedule} title="Create" /> : <MyButton title="Sort" onPress={resortDates} /> }
            </View>
        </View>
    )
}

function DayTasks({ localDate, taskList, editDate, handleTask, addTask, deleteTask, addToPreview }: {
    localDate: string, taskList: ITask[], editDate: (e: Date) => void
    handleTask: (index: number, task: ITask) => void, addTask: () => void
    deleteTask: (index: number) => void, addToPreview: (add: boolean) => void
}) {
    const [canEdit, setCanEdit] = useState(true)

    function toggleEdit() {
        if (!taskList.some(task => !task.name)) setCanEdit(canEdit => {
            addToPreview(canEdit)
            return !canEdit
        })
    }

    function getWeekDay() {
        if (getLocalDate(new Date()) === localDate) return 'Today'
        const localeDateString = new Date(`${localDate} 00:00`).toLocaleDateString('en-US', { weekday: 'long' })
        return localeDateString.split(', ')[0]
    }

    return (
        <View style={[styles.dayTasks, (!canEdit ? styles.wide : {})]}>
            <View style={styles.dayHeader}>
                <MyText>{getWeekDay()} - </MyText>
                <MyDateInput date={new Date(`${localDate} 00:00`)} onChange={editDate} />
                <View style={styles.dayHeaderButton}>
                    <MyMiniButton onPress={toggleEdit} title={canEdit ? '✓' : '✎'} />
                </View>
            </View>
            {canEdit ? <>
                {taskList.map((task, index) => <TaskInput key={index}
                    task={task} localDate={localDate} handleTask={task => handleTask(index, task)} deleteTask={() => deleteTask(index)}
                /> )}
                <View style={styles.addTask}>
                    <MySuperButton onPress={addTask} title="+" />
                </View>
            </> : <View style={{ overflow: "scroll" }}><TaskTable schedule={taskList} showHistory={true} noDays={true} scrollable={false} /></View> }
        </View>
    )
}

function TaskInput({ task, localDate, handleTask, deleteTask }: { task: ITask, localDate: string, handleTask: (task: ITask) => void , deleteTask: () => void}) {
    function onNameChange({ nativeEvent: { text } }: NativeSyntheticEvent<TextInputChangeEventData>) {
        handleTask({ ...task, name: text })
    }

    function onStartChange(date: Date) {
        handleTask({ ...task, start: date })
    }

    function onEndChange(date: Date) {
        handleTask({ ...task, end: date })
    }

    function mergeDateAndTime(date: Date) {
        return new Date(`${localDate} ${getTime(date)}`)
    }
    
    return (
        <View style={styles.taskInput}>
            <View style={styles.nameX}>
                <TextInput style={[styles.input, styles.nameInput, (!task.name ? styles.placeholderText : {})]} placeholder="Name" onChange={onNameChange} value={task.name} />
                <View style={styles.taskButton}>
                    <MyMiniButton title="x" onPress={deleteTask} />
                </View>
            </View>
            <View style={styles.times}>
                <MyTimeInput date={task.start} onChange={date => onStartChange(mergeDateAndTime(date))} />
                <MyText>  to  </MyText>
                <MyTimeInput date={task.end} onChange={date => onEndChange(mergeDateAndTime(date))} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    scroller: {
        height: 600
    },
    wide: {
        width: 280
    },
    input: {
        borderWidth: 1,
        borderColor: "#777",
        paddingHorizontal: .25 * 16,
        borderRadius: 4
    },
    editCheck: {
        marginBottom: .75 * 16
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
    dayTasks: {
        marginBottom: .75 * 16,
        width: 248
    },
    dayHeader: {
        marginBottom: .75 * 16,
        flexDirection: "row"
    },
    dayHeaderButton: {
        marginLeft: .5 * 16
    },
    addTask: {
        alignItems: "center"
    },
    taskInput: {
        marginBottom: .75 * 16,
        width: 220
    },
    nameInput: {
        flex: 1,
        height: 1.625 * 16
    },
    placeholderText: {
        color: "#777"
    },
    taskButton: {
        marginLeft: .5 * 16
    },
    nameX: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: .5 * 16
    },
    times: {
        flexDirection: "row",
        justifyContent: "space-between",
        // width: 200
    }
})

function getLocalDate(date: Date) {
	return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

function getTime(date: Date) {
	const hour = date.getHours() < 10 ? `0${date.getHours()}` : `${date.getHours()}`
	const minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`
	return `${hour}:${minute}`
}

function generateDates(scheduleGroup: { [key: string]: ITask[] }) {
    const parsedScheduleGroup: { [key: string]: ITask[] } = {}
    Object.entries(scheduleGroup).forEach(([localDate, taskList]) => {
        parsedScheduleGroup[localDate] = taskList.map(task => ({ ...task, start: new Date(task.start), end: new Date(task.end) }))
    })
    return parsedScheduleGroup
}

function scheduleToGroup(schedule: ITask[], errorHandler?: (msg: string) => void) {
    const scheduleGroup: { [key: string]: ITask[] } = {}
    validateSchedule(schedule, errorHandler).forEach(task => {
        const startDate = getLocalDate(task.start)
        const endDate = getLocalDate(task.end)
        
        if (startDate !== endDate) {

            const days = Math.round((new Date(`${endDate} 00:00`).getTime() - new Date(`${startDate} 00:00`).getTime()) / (24 * 60 * 60 * 1000))

            let splitTasks: ITask[] = []
            for (let i = 0; i < days; i++) {
                if (i === 0) {
                    const firstTask: ITask = { ...task, start: task.start, end: new Date(`${startDate} 23:59`) }
                    scheduleGroup[startDate] = scheduleGroup[startDate] ? [...scheduleGroup[startDate], firstTask] : [firstTask]
                    splitTasks = [firstTask]
                }

                if (i === days - 1) {
                    const lastTask: ITask = { ...task, start: new Date(`${endDate} 00:00`), end: task.end }
                    scheduleGroup[endDate] = scheduleGroup[endDate] ? [...scheduleGroup[endDate], lastTask] : [lastTask]
                    splitTasks = [...splitTasks, lastTask]
                }

                if (!(i === 0) && !(i === days - 1)) {
                    const previousDate = getLocalDate(splitTasks[i - 1].start)
                    const nextDate = getLocalDate(new Date(new Date(`${previousDate} 00:00`).getTime() + 24 * 60 * 60 * 1000))
                    const nextTask = { ...task, start: new Date(`${nextDate} 00:00`), end: new Date(`${nextDate} 23:59`) }
                    scheduleGroup[nextDate] = scheduleGroup[nextDate] ? [...scheduleGroup[nextDate], nextTask] : [nextTask]
                    splitTasks = [...splitTasks, nextTask]
                }
            }
        } else {
            scheduleGroup[startDate] = scheduleGroup[startDate] ? [...scheduleGroup[startDate], task] : [task]
        }
    })

    return scheduleGroup
}

function splitGroupDates(scheduleGroup: { [key: string]: ITask[] }, errorHandler?: (msg: string) => void) {
    return scheduleToGroup(Object.values(scheduleGroup).flatMap(taskList => taskList), errorHandler)
}

function createNextTask(start: Date): ITask {
    const plus15mins = new Date(start.getTime() + 15 * 60 * 1000)
    if (getLocalDate(start) !== getLocalDate(plus15mins)) {
        const plusOneMin = new Date(start.getTime() + 60 * 1000)
        if (getLocalDate(start) !== getLocalDate(plusOneMin)) {
            return null as unknown as ITask
        }
        return { name: '', start, end: plusOneMin }
    }
    return { name: '', start, end: plus15mins }
}

function isSortedDateList(dateList: string[]) {
    return !dateList.find((localDate, index) => index && localDate < dateList[index - 1])
}