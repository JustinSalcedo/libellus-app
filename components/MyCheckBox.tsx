import Checkbox, { CheckboxProps } from "expo-checkbox"
import { StyleSheet, Text, View } from "react-native"
import MyText from "../fonts/MyText"

export default function MyCheckBox({ text, value, onValueChange } : CheckboxProps & { text: string }) {
    return (
        <View style={styles.container}>
            <MyText><Text style={styles.text}>{text}</Text></MyText>
            <Checkbox value={value} onValueChange={onValueChange}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center"
    },
    text: {
        fontSize: 16
    }
})