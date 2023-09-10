import { useEffect } from 'react'
import style from './style.module.scss'
import notificationSound from '../../audio/notification.mp3'

const CustomToast = ({ data }) => {
  const playNotificationSound = (_) => {
    const audio = new Audio(notificationSound)
    audio.play()
  }

  useEffect(() => {
    playNotificationSound()
  }, [])

  return (
    <div className={style.pushNotification}>
      <figure>
        <img
          src={
            data?.user?.avatar
              ? `/api/files/${data.user.avatar}`
              : `/images/photos/photo-1.png`
          }
          alt='notification'
        />
      </figure>
      <div className={style.pushNotification__content}>
        <h3>{data?.title}</h3>
        <p>{data?.body?.substring(0, 90) + '....'}</p>
      </div>
    </div>
  )
}

export default CustomToast
