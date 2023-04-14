import { Platform } from "react-native"
import { MAX_TASK_NAME } from "./constants"
import { ISettings, ITask } from "./types"
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'

const DEF_GAP = { name: "Chill" }

export function getTimeLeft(task: ITask, unit: 's' | 'm', positiveOnly?: boolean) {
    const msCurrentTime = Date.now()
    const msEndTime = task.end.getTime()
    const msTimeLeft = msEndTime - msCurrentTime

    if (positiveOnly && msTimeLeft < 0) return formatTimeLeft(0, unit)
    return formatTimeLeft(msEndTime - msCurrentTime, unit)
}

export function formatTimeLeft(timeInMs: number, unit: 's' | 'm') {
    let timeInSec = Math.floor(timeInMs / 1000)
    let timeHours = Math.floor(timeInSec / 3600)
    let timeString = timeHours
        ? `${prependZero(timeHours)}:${prependZero(Math.floor(timeInSec % 3600 / 60))}`
        : prependZero(Math.floor(timeInSec % 3600 / 60))

    if (unit === 's') {
        timeString = `${timeString}:${prependZero(timeInSec % 60)}`
    }

    return timeString
}

function prependZero(unit: number) {
    if (unit < 10) return '0' + unit
    return unit.toString()
}

// validate schedule (unsorted)
export function validateSchedule(unSchedule: ITask[], errorHandler?: (msg: string) => void): ITask[] {
    // Case 0: there are no tasks
    if (!unSchedule.length) throw new Error('Empty schedule');

    const schedule = unSchedule.sort((a, b) => a.start.getTime() - b.start.getTime())

    let errorMessage = ''

    schedule.every((task, index) => {
        const startTime = task.start.getTime()
        const endTime = task.end.getTime()

        // Case 0: task has a valid name
        if (!taskHasValidName(task)) {
            errorMessage = `Task ${task.name ? (`'${task.name}'`) : (`#${index}`)} has invalid name`
            return false
        }

        // Case 1: there's an invalid task
        if (!isValidTask(task)) {
            errorMessage = `Task '${task.name}' has invalid timestamp`
            return false
        }

        // Case 2: a task ends before it starts
        if (startTime > endTime) {
            errorMessage = `Task '${task.name}' ends before it starts`
            return false
        }

        // Case 3: a task overlaps another one
        if (index > 0 && startTime < schedule[index - 1].end.getTime()) {
            errorMessage = `Task '${task.name}' ovelaps '${schedule[index - 1].name}'`
            return false
        }
        
        return true
    })

    if (!errorMessage) return schedule
    if (errorHandler) {
        errorHandler(errorMessage)
        return schedule
    }
    throw new Error(errorMessage)
}

export function isValidTask(task: ITask) {
    const notEmptyOrNull = task.name && task.start && task.end
    const isValidTime = !!task.start.getTime() && !!task.end.getTime()
    return taskHasValidName(task) && notEmptyOrNull && isValidTime
}

function taskHasValidName(task: ITask) {
    return task.name && task.name.length <= MAX_TASK_NAME
}

export function getVirtualSchedule(schedule: ITask[]) {
    const virtualList: ITask[] = []

    // insert initial task gap so a virtual schedule is never empty
    if (schedule.length) {
        const firstTaskDate = schedule[0].start.toLocaleDateString()
        virtualList.push({ ...DEF_GAP, start: new Date(firstTaskDate), end: schedule[0].start })
    } else {
        const { startsAt: todayStart, endsAt: todayEnd } = getTodayRange()
        virtualList.push({ ...DEF_GAP, start: todayStart, end: todayEnd })
    }

    validateSchedule(schedule).forEach((task, index) => {
        virtualList.push(task)
        
        if (index < schedule.length - 1 && task.end.getTime() !== schedule[index + 1].start.getTime()) {
            virtualList.push({ ...DEF_GAP, start: task.end, end: schedule[index + 1].start })
        }
    })
    
    return virtualList
}

// get previous, current, and next task
export function getTaskQueue(schedule: ITask[], strict?: boolean) {
    const time  = new Date()
    const currentIndex = getCurrentTaskIndex(schedule, time)

    // assumes the schedule is time sorted
    const sublist = {
        prevTask: schedule[currentIndex - 1],
        currentTask: schedule[currentIndex],
        nextTask: schedule[currentIndex + 1]
    }

    if (strict) {
        if (currentIndex === -1) sublist.currentTask = null as unknown as ITask

        const nextIndex = schedule.findIndex(task => time < task.start)
        if (nextIndex !== -1) sublist.nextTask = schedule[nextIndex]
        else sublist.nextTask = null as unknown as ITask

        const prevTask = [...schedule].reverse().find(task => time > task.end)
        if (prevTask) sublist.prevTask = prevTask
        else sublist.prevTask = null as unknown as ITask

        return sublist
    }

    if (currentIndex === -1) {
        // Case 1: [0, 0, 1]
        const nextIndex = schedule.findIndex(task => time < task.start)
        if (nextIndex !== -1) {
            sublist.currentTask = {
                ...DEF_GAP,
                start: schedule[nextIndex - 1] ? schedule[nextIndex - 1].end : new Date(new Date().toLocaleDateString()),
                end: schedule[nextIndex].start
            },
            sublist.nextTask = schedule[nextIndex]
        }

        // Case 2: [1, 0, 1]
        const prevTask = [...schedule].reverse().find(task => time > task.end)
        if (prevTask) {
            sublist.prevTask = prevTask
        }
    }

    return sublist
}

function getCurrentTaskIndex(schedule: ITask[], timestamp: Date) {
    return schedule.findIndex(task => isTaskInTime(task, timestamp))
}

function isTaskInTime(task: ITask, timestamp: Date) {
    return timestamp >= task.start && timestamp < task.end
}

export function getCurrentTask(schedule: ITask[]) {
    return schedule.find(task => new Date() >= task.start && new Date() < task.end)
}

// get formatted time
export function formatTimeToStr(timestamp: Date, locale: string, is12hr: boolean) {
    return timestamp.toLocaleString(locale, { hour: 'numeric', minute: 'numeric', hour12: is12hr })
}

export function isCurrentTask(task: ITask) {
    return new Date() >= task.start && new Date() < task.end
}

export function timelineIncludesToday(timeline: ITask[]) {
    const { startsAt, endsAt } = getTodayRange()
    return timeline.some(task => (task.start >= startsAt && task.start < endsAt)
        || (task.end >= startsAt && task.end < endsAt))
}

export function getTodayRange() {
    const now = new Date()
    const today = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} 0:00`
    const startsAt = new Date(today)
    const endsAt = new Date(startsAt.getTime() + 24 * 60 * 60 * 1000)
    return { startsAt, endsAt }
}

// Layout

function getLocalDate(date: Date) {
	const month = date.getMonth() < 9 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`
	const dateNum = date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`
	return `${date.getFullYear()}-${month}-${dateNum}`
}

export function countRows(sortedSchedule: ITask[], showHistory: boolean) {
    let rowsCount = 0

    const parsedSchedule = showHistory ? sortedSchedule : sortedSchedule.filter(task => Date.now() < task.end.getTime())
    const startDate = getLocalDate(parsedSchedule[0].start)
    const endDate = getLocalDate(parsedSchedule[parsedSchedule.length - 1].start)

    if (startDate !== endDate) {
        rowsCount += Math.round((new Date(`${endDate} 00:00`).getTime() - new Date(`${startDate} 00:00`).getTime()) / (24 * 60 * 60 * 1000))
    }

    rowsCount += parsedSchedule.length
    return rowsCount
}

export function getDefaultSettings(): ISettings {
    const { startsAt, endsAt } = getTodayRange()

    return {
        sRDateRange: 'today',
        sRStart: startsAt,
        sREnd: endsAt,
        theme: 'system',
        editor: 'form'
    }
}

// Notifications

export async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            console.warn('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log(token);
    } else {
        console.warn('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    return token;
}

// Misc

export function errorToStr(error: any) {
    if (typeof error === 'string') return error
    if (error instanceof Error) return error.message
    return 'Undefined error'
}