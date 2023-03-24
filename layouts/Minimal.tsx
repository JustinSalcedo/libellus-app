import { ReactNode } from "react";
import { View, StyleSheet } from "react-native";

export default function Minimal({ children }: { children: ReactNode }) {
    return (
        <View style={styles.screen}>
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        paddingTop: "33.4%",
        paddingBottom: "22.2%"
    }
})