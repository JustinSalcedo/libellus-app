import { ButtonProps, Platform } from "react-native";
import { StyleSheet, Pressable, Text } from "react-native"

export default function MySuperButton({ title, onPress }: ButtonProps) {
    return <Pressable style={({ pressed }) => pressed ? [styles.button, styles.pressed] : styles.button} onPress={onPress}>
        <Text style={styles.text}>{title}</Text>
    </Pressable>
}

const styles = StyleSheet.create({
    button: {
        width: 80,
        height: 24,
        borderColor: "#777",
        borderWidth: 1,
        borderRadius: 4,
        paddingVertical: 2,
        paddingHorizontal: 4,
        alignItems: "center"
    },
    pressed: {
        backgroundColor: "#ddd"
    },
    text: {
        fontSize: .83 * 16,
        fontFamily: Platform.OS === 'web'
            ? "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
            : 'sans-serif'
    }
})