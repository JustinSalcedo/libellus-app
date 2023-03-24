import { StyleSheet, Text, View } from "react-native";
import TaskQueue from "../components/TaskQueue";
import Timer from "../components/Timer";
import MyText from "../fonts/MyText";
import Minimal from "../layouts/Minimal";

export default function MainScreen() {
    return (
        <Minimal>
            <View style={styles.container}>
                <View style={styles.top}>
                    <Timer/>
                    <View>
                        <MyText>
                            <Text style={styles.topText}>Te amo, Isita ❤️</Text>
                        </MyText>
                    </View>
                </View>
                <View style={styles.void}></View>
                <View style={styles.middle}>
                    <Text style={styles.middleText}>
                        <MyText>
                            <Text style={styles.label}>Cuanto? </Text>
                        </MyText>
                        <MyText>Infinitamente♾️</MyText>
                    </Text>
                </View>
                <View style={styles.bottom}>
                    <TaskQueue/>
                </View>
            </View>
        </Minimal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    top: {
        flex: 7,
        alignItems: "center"
    },
    topText: {
        fontSize: 2 * 16,
        textAlign: "center"
    },
    void: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    middle: {
        flex: 2,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "center"
    },
    middleText: {
        fontSize: 1.5 * 16
    },
    bottom: {
        flex: 2,
        alignItems: "center",
        justifyContent: "center"
    },
    label: {
        fontWeight: 'bold'
    }
})