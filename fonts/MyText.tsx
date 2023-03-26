import { ReactNode } from "react";
import { Platform, Text } from "react-native";

export default function MyText({ children }: { children: ReactNode }) {
    return (
        <Text style={{
            fontFamily: Platform.OS === 'web'
                ? "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                : 'sans-serif',
            fontSize: 16
        }}>{children}</Text>
    )
}