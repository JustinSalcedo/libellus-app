import { useEffect, useState } from 'react'
import MainScreen from './pages/MainScreen'
import { ScheduleContext, SettingsContext } from './contexts'
import { DateRangeMode, EditorMode, ISettings, ITask, Theme } from './types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getDefaultSettings, getTaskQueue, getTodayRange, validateSchedule } from './utils'
import ScheduleComplete from './pages/ScheduleComplete'
import LoadScreen from './pages/LoadScreen'
import { Appearance } from 'react-native'
const { startsAt, endsAt } = getTodayRange()

export default function App() {
    const [schedule, setSchedule] = useState([] as ITask[])
    const [hasLoaded, setHasLoaded] = useState(false)

    const [dateRange, setDateRange] = useState('custom' as DateRangeMode)
	const [startDate, setStartDate] = useState(startsAt)
	const [endDate, setEndDate] = useState(endsAt)

    const [theme, setTheme] = useState('system' as Theme)
    const [editor, setEditor] = useState('form' as EditorMode)

    const [hasLoadedSettings, setHasLoadedSettings] = useState(false)

    useEffect(() => {
		if (!hasLoadedSettings) recoverSettings()
			.then(recoveredSettings => {
				const { sRDateRange, sRStart, sREnd, theme, editor } = recoveredSettings
				setDateRange(sRDateRange); setStartDate(sRStart); setEndDate(sREnd); setTheme(theme); setEditor(editor)
				setHasLoadedSettings(true)
			})
	})

	useEffect(() => {
		if (!hasLoaded) AsyncStorage.getItem('schedule')
			.then(localSchedule => {
				if (localSchedule) {
                    setSchedule(validateSchedule(formatSchedule(JSON.parse(localSchedule))))
                    setHasLoaded(true)
				} else setHasLoaded(true)
			})
			.catch(e => e)
	}, [hasLoaded])

    async function storeSettings() {
        const settings: ISettings = { sRDateRange: dateRange, sRStart: startDate, sREnd: endDate, theme, editor }
        await AsyncStorage.setItem('settings', JSON.stringify(settings))
    }

    async function recoverSettings(): Promise<ISettings> {
        const rawSettings = await AsyncStorage.getItem('settings')
        if (rawSettings) {
            const validSettings = validateSettings(JSON.parse(rawSettings) as Partial<ISettings>)
            if (validSettings) return validSettings
        }
        await AsyncStorage.clear()
        return getDefaultSettings()
    }

    function validateSettings(rawSettings: Partial<ISettings>) {
        const validKeys = ['sRDateRange', 'sRStart', 'sREnd', 'theme', 'editor']
        let isInvalid = false
        const validSettings = getDefaultSettings()

        Object.entries(rawSettings).every(([key, value]) => {
            // 1. Invalid key
            if (!validKeys.find(validKey => validKey === key)) {
                isInvalid = true
                return false
            }

            if (key === 'sRStart') {
                const startDate = new Date(value)

                // 2. Invalid date
                if (!startDate.getTime()) {
                    isInvalid = true
                    return false
                }

                validSettings.sRStart = startDate
                return true
            }

            if (key === 'sREnd') {
                const endDate = new Date(value)

                // 2. Invalid date
                if (!startDate.getTime()) {
                    isInvalid = true
                    return false
                }

                validSettings.sREnd = endDate
                return true
            }

            // @ts-ignore
            if (value) validSettings[key] = value

            return true
        })

        return isInvalid ? null : validSettings
    }

    function setSRRangeDates({ sRStart, sREnd }: { sRStart: Date, sREnd: Date }) {
        if (sREnd > sRStart) {
            setStartDate(sRStart); setEndDate(sREnd)
        }
    }

    function getTheme(): Theme {
        if (theme === 'system') {
            if (Appearance.getColorScheme() === "dark") return 'dark'
            return 'light'
        }

        return theme
    }

    const isActiveSchedule = () => {
        const { currentTask, nextTask } = getTaskQueue(validateSchedule(schedule), true)
        return schedule.length && (currentTask || nextTask)
    }

	return (
        <SettingsContext.Provider value={{ sRDateRange: dateRange, sRStart: startDate, sREnd: endDate, setSRRangeMode: setDateRange,
            setSRRangeDates, theme, getTheme, setTheme, editor, setEditor, saveSettings: storeSettings }}>
            <ScheduleContext.Provider value={{ schedule, setSchedule }}>
                {!hasLoaded ? <LoadScreen/> : (schedule.length && isActiveSchedule() ? <MainScreen/> : <ScheduleComplete/>)} 
            </ScheduleContext.Provider>
        </SettingsContext.Provider>
	)
}

function formatSchedule(localSchedule: ITask[]) {
    return localSchedule.map(task => ({ ...task, start: new Date(task.start), end: new Date(task.end) }))
}