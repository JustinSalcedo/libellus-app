import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

export default function Centered({ children }: { children: ReactNode }) {
    return (
        <View style={styles.screen}>{children}</View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        justifyContent: "center"
    }
})