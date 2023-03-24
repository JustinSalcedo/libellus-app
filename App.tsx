import { useEffect, useState } from 'react'
import MOCK_SCHEDULE from './MOCK_SCHEDULE'
import MainScreen from './pages/MainScreen'
import { ScheduleContext } from './contexts'
import { ITask } from './types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { validateSchedule } from './utils'

export default function App() {
    const [schedule, setSchedule] = useState([] as ITask[])
    const [hasLoaded, setHasLoaded] = useState(false)

	useEffect(() => {
		if (!schedule.length) AsyncStorage.setItem('schedule', JSON.stringify(MOCK_SCHEDULE))
			.then(() => setHasLoaded(false))
	})

	useEffect(() => {
		if (!hasLoaded) AsyncStorage.getItem('schedule')
			.then(localSchedule => {
				if (localSchedule) {
                    setSchedule(validateSchedule(formatSchedule(JSON.parse(localSchedule))))
                    setHasLoaded(true)
				}
			})
			.catch(e => e)
	}, [hasLoaded])

	return (
		<ScheduleContext.Provider value={{ schedule, setSchedule }}>
			<MainScreen />
		</ScheduleContext.Provider>
	)
}

function formatSchedule(localSchedule: ITask[]) {
    return localSchedule.map(task => ({ ...task, start: new Date(task.start), end: new Date(task.end) }))
}