import { ReactNode, useState } from "react";
import { View, StyleSheet } from "react-native";
import Modal from "../components/Modal";
import Sidebar from "../components/Sidebar";
import { ViewContext } from "../contexts";
import { ModalName } from "../types";

export default function Minimal({ children }: { children: ReactNode }) {
    const [modalOn, setModalOn] = useState(false)
    const [activeModal, setActiveModal] = useState('' as ModalName)

    function handleOnClick() {
        setModalOn(false)
        setActiveModal('')
    }
    
    return (
        <ViewContext.Provider value={{
            isModalOn: modalOn, launchModal: setModalOn, activeModal, setActiveModal
        }}>
            <View style={modalOn ? styles.on : styles.off}/>
            <Modal onOverlayPress={handleOnClick} nodeKey={activeModal}/>
            <Sidebar/>
            <View style={styles.screen}>
                {children}
            </View>
        </ViewContext.Provider>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        paddingTop: "33.4%",
        paddingBottom: "22.2%",
        overflow: "hidden"
    },
    off: {
        display: "none"
    },
    on: {
        height: "100%",
        position: "absolute",
        zIndex: 2,
        width: "100%",
        backgroundColor: "hsla(235, 100%, 7%, 0.64)"
    }
})