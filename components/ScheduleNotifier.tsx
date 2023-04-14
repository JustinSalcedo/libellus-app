import { useContext, useEffect, useRef, useState } from "react"
import { ScheduleContext } from "../contexts"
import { registerForPushNotificationsAsync } from "../utils"
import * as Notifications from 'expo-notifications'
import { ITask } from "../types"

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false
    })
})

const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK'

Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK)

export default function ScheduleNotifier() {
    const { schedule } = useContext(ScheduleContext)
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

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
        
    }, [])

    useEffect(() => {
        notify(schedule)

        // return cancelNotifications()
    }, [schedule])

    async function notify(schedule: ITask[]) {
        await Notifications.cancelAllScheduledNotificationsAsync()
        schedule.forEach(async task => await sendStartingPushNotification(task))
    }

    // Prevent user from swiping away and enable autodismiss after three seconds.
    async function sendStartingPushNotification(task: ITask) {
        const body = `${getLocalTime(task.start)} - ${getLocalTime(task.end)}`
        const title = task.name
    
        await Notifications.scheduleNotificationAsync({
            content: { title, body, autoDismiss: true, sticky: false, vibrate: [0, 250, 250, 250] },
            trigger: task.start
        })
        setTimeout(Notifications.dismissAllNotificationsAsync, task.start.getTime() - Date.now() + 3 * 1000)
    }

    return (<></>)
}

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