// import { Text } from 'react-native'
import Timer from './components/Timer'
import MainScreen from './pages/MainScreen'
// import * as Font from 'expo-font'
// import { useEffect, useState } from 'react'

export default function App() {
	// const [fontsLoaded, setFontsLoaded] = useState(false)

	// useEffect(() => {
	// 	loadFonts()
	// })

	// async function loadFonts() {
	// 	await Font.loadAsync({
	// 		'Segoe UI': require('./assets/fonts/Segoe UI')
	// 	})
	// 	setFontsLoaded(true)
	// }

	// return fontsLoaded ? (
	// 	// <MainScreen/>
	// 	// <Text>Diablos...</Text>
	// 	<Timer></Timer>
	// ) : null

	return (
		<MainScreen />
	)
}