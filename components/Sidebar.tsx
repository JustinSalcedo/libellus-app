import { useContext, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ViewContext } from "../contexts";
import MyText from "../fonts/MyText";
import Burger from "./Burger";
import FloatingButton from "./FloatingButton";

export default function Sidebar() {
    const { setActiveModal, launchModal } = useContext(ViewContext)
    const [sidebarOn, setSidebarOn] = useState(false)

    function handleClickOnPlus() {
        setActiveModal('schedule-editor')
        launchModal(true)
    }

    function handleClickOnGear() {
        setActiveModal('settings')
        launchModal(true)
    }

    return (
        <View style={styles.tray}>
            {sidebarOn ? <>
                <View style={styles.buttons}>
                    <FloatingButton symbol="+" onPress={handleClickOnPlus} />
                    {/* <FloatingButton symbol="⟳" /> */}
                    <FloatingButton symbol="⚙" higherTop={true} onPress={handleClickOnGear} />
                </View>
                <View style={styles.hider}>
                    <Pressable onPress={() => setSidebarOn(false)} style={styles.collapse}>
                        <MyText><Text style={styles.collapseSymbol}>^</Text></MyText>
                    </Pressable>
                </View>
            </> : <View style={styles.trigger}>
                <Burger onPress={() => setSidebarOn(true)} />
            </View>}
        </View>
    )
}

const styles = StyleSheet.create({
    tray: {
        position: "absolute",
        zIndex: 1,
        width: 5 * 16,
        right: 0,
        paddingTop: 2 * 16,
        paddingRight: 16
    },
    trigger: {
        alignItems: "flex-end",
    },
    buttons: {
        paddingLeft: 16,
        height: 2 * (3 * 16) + .75 * 16, // buttons' height + row gaps
        justifyContent: "space-between"
    },
    hider: {
        paddingLeft: 16,
        paddingVertical: .25 * 16,
    },
    collapse: {
        alignItems: "center",
        height: 2.5 * 16
    },
    collapseSymbol: {
        fontSize: 2 * 16
    }
})