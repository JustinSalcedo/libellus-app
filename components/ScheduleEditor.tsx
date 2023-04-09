import { useContext, useEffect } from "react"
import { StyleSheet, View } from "react-native"
import { RadioButtonProps, RadioGroup } from "react-native-radio-buttons-group"
import { SettingsContext } from "../contexts"
import { EditorMode } from "../types"
import ScheduleForm from "./ScheduleForm"

export default function ScheduleEditor() {
    const { editor, setEditor, saveSettings } = useContext(SettingsContext)

    useEffect(() => {
        return exitEditor()
    })

    function onEditorRadioChange(radioButtonsArray: RadioButtonProps[]) {
        const { value } = radioButtonsArray.find(({ selected }) => selected) as RadioButtonProps
        setEditor(value as EditorMode)
    }

    const formRadioButton = (): RadioButtonProps => ({ ...radioStyles, id: '1', label: 'Form', value: 'form', selected: editor === 'form' })
    const promptRadioButton = (): RadioButtonProps => ({ ...radioStyles, id: '2', label: 'Prompt', value: 'prompt', selected: editor === 'prompt' })

    function exitEditor() {
        saveSettings()
    }

    return (
        <>
            <View style={styles.spacer}>
                <RadioGroup layout="row" radioButtons={[formRadioButton(), promptRadioButton()]} onPress={onEditorRadioChange} />
            </View>
            {editor === 'form' ? <ScheduleForm /> : <></> }
        </>
    )
}

const radioStyles: Partial<RadioButtonProps> = { borderColor: "#7e49aa", color: "#7e49aa", size: 16, containerStyle: { alignItems: "center" }, labelStyle: { fontSize: 16 } }

const styles = StyleSheet.create({
    spacer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: .5 * 16
    }
})