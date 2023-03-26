import { ReactNode, useState } from "react";
import { FlatList, Pressable, SectionList, StyleSheet, Text, View } from "react-native";
import { MAX_ROWS_COUNT, MAX_TASK_NAME } from "../constants";
import MyText from "../fonts/MyText";
import { ITask } from "../types";
import { formatTimeToStr, isCurrentTask } from "../utils";

interface ITaskRow {
    name: string
    startTime: string
    endTime: string
    isCurrent?: boolean
}

interface ITaskSection {
    title: string
    data: ITaskRow[]
}

export default function TaskTable({ schedule, showHistory, noDays, scrollable }: {
    schedule: ITask[], showHistory: boolean, noDays?: boolean, scrollable?: boolean
}) {

    function renderTaskSections(schedule: ITask[], showHistory: boolean) {
        const parsedSchedule = showHistory ? schedule : schedule.filter(task => Date.now() < task.end.getTime())
        let rowsCount = 0

        if (noDays) {
            const rows: ITaskRow[] = []
            parsedSchedule.forEach(task => {
                rows.push({ name: task.name,
                    startTime: formatTimeToStr(task.start, 'en-US', true),
                    endTime: formatTimeToStr(task.end, 'en-US', true),
                    isCurrent: isCurrentTask(task)
                })
                rowsCount++
            })

            if (!scrollable || rowsCount <= MAX_ROWS_COUNT) {
                return rows.map(row => <TaskRow key={'task_' + row.startTime} {...row} /> )
            }

            return <FlatList style={(scrollable && (rowsCount > MAX_ROWS_COUNT) ? styles.scrollable75 : {})} data={rows} renderItem={({ item }) => <TaskRow {...item} /> } />
        }

        // TODO: Fix schedule for more than one week
        const today = new Date().getDay()
        let currentDay = today
        const sectionGroup: { [key: string]: ITaskRow[] } = {}
        let sectionDay = ''
        parsedSchedule.forEach(task => {
            if (currentDay !== task.start.getDay()) {
                sectionDay = today !== task.start.getDay()
                    ? task.start.toLocaleDateString('en-US', { weekday: 'long' })
                    : 'Today'
                
                currentDay = task.start.getDay()
                rowsCount++
            }

            const taskRow = {
                name: task.name,
                startTime: formatTimeToStr(task.start, 'en-US', true),
                endTime: formatTimeToStr(task.end, 'en-US', true),
                isCurrent: isCurrentTask(task)
            }
            sectionGroup[sectionDay] = sectionGroup[sectionDay] ? [...sectionGroup[sectionDay], taskRow] : [taskRow]
            rowsCount++
        })

        const sections: ITaskSection[] = Object.entries(sectionGroup).map(([sectionDay, taskRows]) => ({ title: sectionDay, data: taskRows }))
        
        if (!scrollable || rowsCount <= MAX_ROWS_COUNT) {
            let rows: ReactNode[] = []
            sections.map(({ title, data }, dayIndex) => {
                data.forEach((taskRow, index) => {
                    if (!index && title) rows.push(<DayHeader key={'date_' + dayIndex} day={title}/>)
                    rows.push(<TaskRow key={'task_' + taskRow.startTime} {...taskRow}/>)
                })
            })
            return rows.map(row => row)
        }
        return <SectionList style={styles.scrollable75} sections={sections}
            renderItem={({ item }) => <TaskRow {...item} /> }
            renderSectionHeader={({ section: { title } }) => title ? <DayHeader day={title}/> : <></> } />
}
    
    return (
        <View style={styles.table}>{renderTaskSections(schedule, showHistory)}</View>
    )
}

function DayHeader({ day }: { day: string }) {
    return (
        <View style={styles.dayHeader}>
            <MyText><Text style={styles.dayHeaderText}>{day}</Text></MyText>
        </View>
    )
}

function TaskRow({ name, startTime, endTime, isCurrent }: ITaskRow) {
    return (
        <View style={isCurrent ? [styles.row, styles.currentRow] : styles.row}>
            <TaskName name={name} isCurrent={isCurrent} />
            <View style={styles.cell}>
                <MyText>{startTime}</MyText>
            </View>
            <View style={styles.cell}>
                <MyText>{endTime}</MyText>
            </View>
        </View>
    )
}

function TaskName({ name, isCurrent }: { name: string, isCurrent?: boolean }) {
    const [isExpanded, setIsExpanded] = useState(false)

    return (
        <Pressable style={styles.taskCell} onPress={() => setIsExpanded(isExpanded => !isExpanded)}>
            <MyText><Text style={isCurrent ? styles.currentTaskText : styles.taskText}>{isExpanded ? name : trimName(name)}</Text></MyText>
        </Pressable>
    )
}

const trimName = (str: string) => str.length > MAX_TASK_NAME / 2 ? `${str.substring(0, MAX_TASK_NAME / 2 - 1)}...` : str

const styles = StyleSheet.create({
    table: {
        width: 280,
        marginTop: .4 * 16
    },
    row: {
        flex: 1,
        flexDirection: "row",
        paddingVertical: .5 * 16 - 2,
        alignItems: "center"
    },
    cell: {
        flex: 1,
        alignItems: "flex-end"
    },
    taskCell: {
        width:  7 * 16,
        overflow: "hidden"
    },
    taskText: {
        color: "#555"
    },
    currentRow: {
        backgroundColor: "#ffe3ff"
    },
    currentTaskText: {
        color: "#7e49aa"
    },
    dayHeader: {
        backgroundColor: "#eee",
        paddingVertical: .5 * 16 - 2,
    },
    dayHeaderText: {
        fontStyle: "italic",
        fontWeight: "bold",
        fontSize: .875 * 16,
        color: "#555"
    },
    scrollable75: {
        height: 600,
        overflow: "scroll"
    }
})