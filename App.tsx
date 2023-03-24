import { useState } from 'react'
import MOCK_SCHEDULE from './MOCK_SCHEDULE'
import MainScreen from './pages/MainScreen'
import { ScheduleContext } from './contexts'

export default function App() {
    const [schedule, setSchedule] = useState(MOCK_SCHEDULE)

	return (
		<ScheduleContext.Provider value={{ schedule, setSchedule }}>
			<MainScreen />
		</ScheduleContext.Provider>
	)
}