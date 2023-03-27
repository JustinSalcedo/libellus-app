import { Pressable, StyleSheet, View } from "react-native"

export default function Burger({ onPress }: { onPress: () => void }) {
    return (
        <Pressable style={styles.burger} onPress={onPress}>
            <View style={styles.loaf}></View>
            <View style={styles.loaf}></View>
            <View style={styles.loaf}></View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    burger: {
        height: 2 * 16,
        width: 2 * 16,
        paddingVertical: 6,
        paddingHorizontal: 4,
        justifyContent: "space-between"
    },
    loaf: {
        backgroundColor: "#777",
        height: 2,
        width: "100%"
    }
})