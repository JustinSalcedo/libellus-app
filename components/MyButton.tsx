import { ButtonProps, Platform } from "react-native";
import { StyleSheet, Pressable, Text } from "react-native"

export default function MyButton({ title, onPress, disabled }: ButtonProps) {
    return <Pressable style={({ pressed }) => disabled ? [styles.button, styles.disabled] : (pressed ? [styles.button, styles.pressed] : styles.button)} disabled={disabled} onPress={onPress}>
        <Text style={disabled ? [styles.text, styles.disabledText] : styles.text}>{title}</Text>
    </Pressable>
}

const styles = StyleSheet.create({
    button: {
        borderWidth: 1,
        borderColor: "#777",
        borderRadius: 4,
        paddingVertical: 2,
        paddingHorizontal: 4,
        backgroundColor: "#eee",
        alignItems: "center"
    },
    disabled: {
        backgroundColor: "#fff"
    },
    pressed: {
        backgroundColor: "#ddd"
    },
    text: {
        fontSize: .83 * 16,
        fontFamily: Platform.OS === 'web'
            ? "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
            : 'sans-serif'
    },
    disabledText: {
        color: "#777"
    }
})