import { ButtonProps } from "react-native/types";
import { StyleSheet, Pressable, Text } from "react-native"
import MyText from "../fonts/MyText";

export default function MyButton({ title, onPress }: ButtonProps) {
    return <Pressable style={({ pressed }) => pressed ? [styles.button, styles.pressed] : styles.button} onPress={onPress}>
        <MyText><Text style={styles.text}>{title}</Text></MyText>
    </Pressable>
}

const styles = StyleSheet.create({
    button: {
        borderWidth: 1,
        borderColor: "#777",
        borderRadius: 4,
        paddingVertical: 2,
        paddingHorizontal: 4,
        backgroundColor: "#eee"
    },
    pressed: {
        backgroundColor: "#ddd"
    },
    text: {
        fontSize: .83 * 16
    }
})