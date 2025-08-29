/* eslint-disable unused-imports/no-unused-vars */
import registerForPushNotificationsAsync from '@/lib/notifications'
import { PropsWithChildren, useEffect, useState } from 'react'
import * as Notifications from 'expo-notifications'
import { supabase } from '@/lib/supabase'
import { useAuth } from './AuthProvider'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
})

const NotificationProvider = ({ children }: PropsWithChildren) => {
  const { profile } = useAuth()
  const [expoPushToken, setExpoPushToken] = useState('')
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(
    undefined,
  )

  const savePushToken = async (newToken: string) => {
    setExpoPushToken(newToken)
    if (!newToken) return

    //update token in database
    if (!profile?.id) return
    await supabase.from('profiles').update({ expo_push_token: newToken }).eq('id', profile?.id)
  }

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => savePushToken(token ?? ''))
      .catch((error: any) => setExpoPushToken(`${error}`))

    const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
      console.log('notification: ', notification)
      setNotification(notification)
    })

    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(response)
    })

    return () => {
      notificationListener.remove()
      responseListener.remove()
    }
  }, [])

  return <>{children}</>
}

export default NotificationProvider
