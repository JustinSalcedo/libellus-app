import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import MyText from "../fonts/MyText";
import { ITask } from "../types";
import { getTimeLeft } from "../utils";

export default function Timer({ task }: { task: ITask }) {
    const [timer, setTimer] = useState(null as unknown as number)
    const [timeLeft, setTimeLeft] = useState('0:00')

    const tick = () => {
        const timeLeft = getTimeLeft(task, 's', true)
        setTimeLeft(timeLeft)
        // TODO: Set timer in push notification
        // document.title = `${timeLeft} - ${task.name} | Libellus`
    }

    useEffect(() => {
        setTimer(setInterval(tick, 1000))

        return clearInterval(timer)
    }, [task])

    return (
        <View style={styles.timer}>
            <MyText>
                <Text style={styles.timerText}>{timeLeft}</Text>
            </MyText>
        </View>
    )
}

const styles = StyleSheet.create({
    timer: {
        height: 280,
        width: 248,
        alignItems: "center",
        justifyContent: "center"
    },
    timerText: {
        fontSize: 4 * 16
    }
})