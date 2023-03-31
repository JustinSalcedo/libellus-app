import { StyleSheet, Text, View } from "react-native";
import MyText from "../fonts/MyText";
import { RadioButtonProps, RadioGroup } from "react-native-radio-buttons-group";
import { useContext, useEffect, useState } from "react";
import { SettingsContext } from "../contexts";
import MyDateTimeInput from "./MyDateTimeInput";
import { DateRangeMode, Theme } from "../types";

export default function SettingsTray() {
	const { sRDateRange, sRStart, sREnd, setSRRangeMode, setSRRangeDates, theme, setTheme, saveSettings } = useContext(SettingsContext)

    const [startDate, setStartDate] = useState(sRStart)
    const [endDate, setEndDate] = useState(sREnd)

    const [note, setNote] = useState('')
	const [noteCode, setNoteCode] = useState('schedule-range')

    useEffect(() => {
        return exitSettings()
    })

    function onDateRadioChange(radioButtonsArray: RadioButtonProps[]) {
        const { value } = radioButtonsArray.find(({ selected }) => selected) as RadioButtonProps
        setSRRangeMode(value as DateRangeMode)
    }

    function onDateInputChange(date: Date, label: 'start' | 'end') {
        if (label === 'start') {
            setStartDate(() => {
                if (endDate <= date) triggerNote('Invalid date range', 'schedule-range')
                else triggerNote('', '')
                return date
            })
        }

        if (label == 'end') {
            setEndDate(() => {
                if (date <= startDate) triggerNote('Invalid date range', 'schedule-range')
                else triggerNote('', '')
                return date
            })
        }
    }

	function triggerNote(note: string, noteCode: string) {
		setNote(note); setNoteCode(noteCode)
	}

    const todayRadioButton = (): RadioButtonProps => ({  ...radioStyles, id: '1', label: 'Today', value: 'today', selected: sRDateRange === 'today' })
    const customRadioButton = (): RadioButtonProps => ({ ...radioStyles, id: '2', label: 'Custom', value: 'custom', selected: sRDateRange === 'custom' })

    function onThemeRadioChange(radioButtonsArray: RadioButtonProps[]) {
        const { value } = radioButtonsArray.find(({ selected }) => selected) as RadioButtonProps
        setTheme(value as Theme)
    }

    const lightRadioButton = (): RadioButtonProps => ({ ...radioStyles, id: '1', label: 'Light', value: 'light', selected: theme === 'light' })
    const darkRadioButton = (): RadioButtonProps => ({ ...radioStyles, id: '2', label: 'Dark', value: 'dark', selected: theme === 'dark' })
    const systemRadioButton = (): RadioButtonProps => ({ ...radioStyles, id: '3', label: 'System', value: 'system', selected: theme === 'system' })

    function exitSettings() {
        setSRRangeDates({ sRStart: startDate, sREnd: endDate })
        saveSettings()
    }

    return (
        <View style={styles.container}>
            <View style={styles.heading}>
                <MyText><Text style={styles.headingText}>Schedule</Text></MyText>
            </View>
            <View style={styles.paragraph}>
                <MyText>Timeline date range</MyText>
            </View>
            <View style={styles.spacer}>
                <RadioGroup layout="row" radioButtons={[todayRadioButton(), customRadioButton()]} onPress={onDateRadioChange} />
            </View>
            { sRDateRange === 'custom'
                ? <>
                    {(note && noteCode === 'schedule-range')
                        ? <View style={styles.noteArea}>
                            <MyText>{note}</MyText>
                        </View>
                        : <></>}
                    <View style={[styles.flexer, { marginBottom: .5 * 16 }]}>
                        <View style={styles.inputLabel}>
                            <MyText>Start:</MyText>
                        </View>
                        <MyDateTimeInput date={startDate} onChange={date => onDateInputChange(date, 'start')}/>
                    </View>
                    <View style={styles.flexer}>
                        <View style={styles.inputLabel}>
                            <MyText>End:</MyText>
                        </View>
                        <MyDateTimeInput date={endDate} onChange={date => onDateInputChange(date, 'end')}/>
                    </View>
                </>
                : <></>
            }
            <View style={styles.heading}>
                <MyText><Text style={styles.headingText}>Appearance</Text></MyText>
            </View>
            <View style={styles.paragraph}>
                <MyText>Theme</MyText>
            </View>
            <View style={styles.spacer}>
                <RadioGroup layout="row" radioButtons={[lightRadioButton(), darkRadioButton(), systemRadioButton()]} onPress={onThemeRadioChange} />
            </View>
        </View>
    )
}

const radioStyles: Partial<RadioButtonProps> = { borderColor: "#7e49aa", color: "#7e49aa", size: 16, containerStyle: { alignItems: "center" }, labelStyle: { fontSize: 16 } }

const styles = StyleSheet.create({
    container:{
        width: 280
    },
    heading: {
        backgroundColor: "#eee",
        paddingLeft: .5 * 16
    },
    headingText: {
        color: "#555",
        fontSize: 1.17 * 16,
        fontWeight: "bold"
    },
    paragraph: {
        paddingVertical: 16
    },
    spacer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: .5 * 16
    },
    flexer: {
        flexDirection: "row"
    },
    // half: {
    //     width: "50%"
    // },
    // halfArea: {
    //     width: "90%"
    // },
    noteArea: {
        backgroundColor: "#eee",
        padding: .25 * 16,
        marginBottom: .5 * 16
    },
    inputLabel: {
        flex: 1
    }
})