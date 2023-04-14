import { useEffect, useRef, useState } from "react"
import { ITask } from "../types"
import { Platform } from "react-native"
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import { formatTimeLeft } from "../utils"

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false
    })
})

export default function Notifier({ task }: { task: ITask }) {
    const [wasNotified, setWasNotified] = useState(false)
    const [pushToken, setPushToken] = useState('')
    const [notification, setNotification] = useState(null as unknown as Notifications.Notification)

    const notificationListener = useRef(null as unknown as Notifications.Subscription)
    const responseListener = useRef(null as unknown as Notifications.Subscription)

    useEffect(() => {
        registerForPushNotificationsAsync()
            .then(token => setPushToken(token || ''))

        // Device receives notification
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
            // console.log(notification.request.trigger)
        });

        // User interacts with notification
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        if (!wasNotified && task) {
            notify(task)
            setWasNotified(true)
        }

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
        
    }, [])

    useEffect(() => {
        notify(task)
    }, [task])

    async function notify(task: ITask) {
        // Task is a gap
        if (!task.id) return

        const message = `${getLocalTime(task.start)} - ${getLocalTime(task.end)}`
        const title = task.name

        if (Platform.OS !== "web" && pushToken) {
            // showPushNotification(pushToken, title, message)

            // 1. Show initial notification
            sendInitialPushNotification()

            // 2. Schedule a countdown notification each minute
            // Prevent user from swiping away and dismiss each after a minute (?)
            
            // const minutesLeft = getMinutesLeft(task)
            // const notificationsEveryMinute = minutesLeft > 60 ? 60 : minutesLeft
            // for (let i = 1; i <= notificationsEveryMinute; i++) {
            //     schedulePushNotification({ title: formatTimeLeft((minutesLeft - i) * 60 * 1000, 'm'), body: task.name }, { seconds: 60 * i }, 59, false)
            // }
        }
    }

    // Prevent user from swiping away and enable autodismiss after three seconds.
    async function sendInitialPushNotification() {
        const body = `${getLocalTime(task.start)} - ${getLocalTime(task.end)}`
        const title = task.name
    
        await Notifications.scheduleNotificationAsync({
            content: { title, body, autoDismiss: true, sticky: false, vibrate: [0, 250, 250, 250] },
            trigger: null
        })
        setTimeout(Notifications.dismissAllNotificationsAsync, 3 * 1000)
    }

    // function showPushNotification(pushToken: string, title: string, body: string) {
    //     // create and show push notification
    //     sendPushNotification(pushToken, { title, body })
    // }

    // From LogRocket: https://blog.logrocket.com/create-send-push-notifications-react-native/
    // async function registerForPushNotificationsAsync() {
    //     let token;

    //     const { status: existingStatus } = await Notifications.getPermissionsAsync();
    //     let finalStatus = existingStatus;

    //     if (existingStatus !== 'granted') {
    //         const { status } = await Notifications.requestPermissionsAsync();
    //         finalStatus = status;
    //     }
    //     if (finalStatus !== 'granted') {
    //         console.warn('Failed to get push token for push notification!');
    //         return;
    //     }
    //     token = (await Notifications.getExpoPushTokenAsync()).data;
    //     console.log(token);

    //     return token;
    // }

    return (
        <></>
    )
}

async function schedulePushNotification({ title, body }: { title: string, body: string }, trigger: Notifications.NotificationTriggerInput, dismissAfterSecs: number, vibrate?: boolean) {
    await Notifications.scheduleNotificationAsync({
        content: { title, body, autoDismiss: true, sticky: false, vibrate: vibrate ? [0, 250, 250, 250] : [] },
        trigger
    })
    setTimeout(Notifications.dismissAllNotificationsAsync, dismissAfterSecs * 1000)
}

/* From https://docs.expo.dev/push-notifications/push-notifications-setup/#get-credentials-for-development-builds */

async function sendPushNotification(expoPushToken: string, notification: { title: string, body: string }) {
    const message = {
        to: expoPushToken,
        sound: 'default',
        ...notification,
        // data: { someData: 'goes here' },
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    });
}

async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            console.warn('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log(token);
    } else {
        console.warn('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    return token;
}

/* --- */

function getLocalTime(date: Date) {
	const hour = date.getHours() < 10 ? `0${date.getHours()}` : `${date.getHours()}`
	const minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`
	return `${hour}:${minute}`
}

function getMinutesLeft({ start, end }: ITask) {
    const msCurrentTime = Date.now()
    const msEndTime = end.getTime()
    return Math.floor((msEndTime - msCurrentTime) / 1000 / 60)
}