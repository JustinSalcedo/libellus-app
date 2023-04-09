import { ChangeEvent, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker"

export default function MyDateInput({ date, onChange } : { date: Date, onChange: (date: Date) => void }) {
    const [showDatePicker, setShowDatePicker] = useState(false)
    
    function onDateChange(e: ChangeEvent<HTMLInputElement>) {
        const { value } = e.target as { value: string }
        const fullDate = new Date(`${value} 0:00`)
        onChange(fullDate)
    }

    function onDatePress() {
        setShowDatePicker(true)
    }

    function onMobileDateChange(date: Date) {
        setShowDatePicker(false)
        onChange(date)
    }

    return Platform.OS === "web" ? (
        <input type="date" name="date" onChange={onDateChange} value={getLocalDatetime(date)} style={styles.webInput} />
    ) : (
        <View style={styles.container}>
            <Pressable onPress={onDatePress}style={styles.input}>
                <Text style={styles.inputText}>{date.toLocaleDateString()}</Text>
                {showDatePicker
                    ? <DateTimePicker value={date} mode='date' onChange={(_, date) =>  onMobileDateChange(date as Date)} />
                    : <></>}
            </Pressable>
        </View>
    )
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

function getLocalDatetime(date: Date) {
	const month = date.getMonth() < 9 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`
	const dateNum = date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`
	return `${date.getFullYear()}-${month}-${dateNum}`
}