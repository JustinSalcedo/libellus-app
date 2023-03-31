import { ChangeEvent, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker"

export default function MyDateTimeInput({ date, onChange } : { date: Date, onChange: (date: Date) => void }) {
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [showTimePicker, setShowTimePicker] = useState(false)
    
    function onDateChange(e: ChangeEvent<HTMLInputElement>) {
        const { value } = e.target as { value: string }
        const fullDate = new Date(value)
        onChange(fullDate)
    }

    function onDatePress() {
        setShowDatePicker(true)
    }

    function onTimePress() {
        setShowTimePicker(true)
    }

    function onMobileDateChange(date: Date) {
        setShowDatePicker(false)
        onChange(date)
    }

    function onMobileTimeChange(date: Date) {
        setShowTimePicker(false)
        onChange(date)
    }

    return Platform.OS === "web" ? (
        <input type="datetime-local" name="start" onChange={onDateChange} value={getLocalDatetime(date)} style={styles.webInput} />
    ) : (
        <View style={styles.container}>
            <Pressable onPress={onDatePress}style={[styles.input, styles.dateInput]}>
                <Text style={styles.inputText}>{date.toLocaleDateString()}</Text>
                {showDatePicker
                    ? <DateTimePicker value={date} mode='date' onChange={(_, date) =>  onMobileDateChange(date as Date)} />
                    : <></>}
            </Pressable>
            <Pressable onPress={onTimePress}style={[styles.input, styles.timeInput]}>
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
        paddingHorizontal: 4
    },
    inputText: {
        fontFamily: "monospace"
    },
    dateInput: {
        borderRightWidth: 0,
        borderBottomLeftRadius: 4,
        borderTopLeftRadius: 4
    },
    timeInput: {
        borderLeftWidth: 0,
        borderBottomRightRadius: 4,
        borderTopRightRadius: 4
    }
})

function getLocalDatetime(date: Date) {
	const month = date.getMonth() < 9 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`
	const dateNum = date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`
	const hour = date.getHours() < 10 ? `0${date.getHours()}` : `${date.getHours()}`
	const minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`
	return `${date.getFullYear()}-${month}-${dateNum}T${hour}:${minute}`
}