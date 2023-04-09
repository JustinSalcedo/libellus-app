import { ChangeEvent, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker"

export default function MyTimeInput({ date, onChange } : { date: Date, onChange: (date: Date) => void }) {
    const [showTimePicker, setShowTimePicker] = useState(false)
    
    function onDateChange(e: ChangeEvent<HTMLInputElement>) {
        const { value } = e.target as { value: string }
        const fullDate = setLocalDateTime(date, value)
        onChange(fullDate)
    }

    function onTimePress() {
        setShowTimePicker(true)
    }

    function onMobileTimeChange(date: Date) {
        setShowTimePicker(false)
        onChange(date)
    }

    return Platform.OS === "web" ? (
        <input type="time" name="time" onChange={onDateChange} value={getLocalTime(date)} style={styles.webInput} />
    ) : (
        <View style={styles.container}>
            <Pressable onPress={onTimePress}style={styles.input}>
                <Text style={styles.inputText}>{formatTime(date.toLocaleTimeString())}</Text>
                {showTimePicker
                    ? <DateTimePicker value={date} mode='time' onChange={(_, date) => onMobileTimeChange(date as Date)} />
                    : <></>}
            </Pressable>
        </View>
    )
}

function formatTime(time: string) {
    const [hours, amPm] = time.split(' ')
    return hours.substring(0, hours.length - 3) + ' ' + amPm
}

const styles = StyleSheet.create({
    webInput: {
        borderRadius: 4,
        borderColor: "#777",
        borderWidth: 1,
    },
    container: {
        flexDirection: "row"
    },
    input: {
        borderColor: "#777",
        borderWidth: 1,
        paddingVertical: 2,
        paddingHorizontal: 4,
        borderRadius: 4
    },
    inputText: {
        fontFamily: "monospace"
    }
})

function getLocalTime(date: Date) {
	const hour = date.getHours() < 10 ? `0${date.getHours()}` : `${date.getHours()}`
	const minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`
	return `${hour}:${minute}`
}

function setLocalDateTime(date: Date, time: string) {
    return new Date(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${time}`)
}