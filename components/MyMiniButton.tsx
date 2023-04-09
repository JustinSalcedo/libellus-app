import { ButtonProps, Platform } from "react-native";
import { StyleSheet, Pressable, Text } from "react-native"

export default function MyMiniButton({ title, onPress }: ButtonProps) {
    return <Pressable style={({ pressed }) => pressed ? [styles.button, styles.pressed] : styles.button} onPress={onPress}>
        <Text style={styles.text}>{title}</Text>
    </Pressable>
}

const styles = StyleSheet.create({
    button: {
        width: 20,
        height: 24,
        borderRadius: 4,
        paddingVertical: 2,
        paddingHorizontal: 4,
        backgroundColor: "#eee",
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