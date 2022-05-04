import React, { useState, useEffect, useRef } from 'react';
import style from './style.module.scss'
import {useNavigate} from 'react-router-dom'
import notificationSound from '../../audio/notification.mp3'

let spaceBetweenNotifications = 60

const PushNotification = ({idx, data}) => {
    const [toggleNotification, setToggleNotification] = useState(null)
    const [bottomPosition, setBottomPosition] = useState('5rem')
    const notificationRef = useRef(null)
    const navigate = useNavigate()
    
    const defineBottomPosition = _ => {
        const containerHeight = notificationRef.current.getBoundingClientRect().height 
        setBottomPosition(idx * containerHeight + spaceBetweenNotifications + 'px')
        spaceBetweenNotifications = idx >= 1
        ? spaceBetweenNotifications + 10 
        : 60
    }

    const playNotificationSound = _ => {
        const audio = new Audio(notificationSound)
        audio.play()
    }
    useEffect(() => {
        if(data && toggleNotification === '5rem') {
            playNotificationSound()
        } 
        toggleNotification === '-50rem'
        && setTimeout(() => navigate('/notifications'),400) 
    },[data, toggleNotification])

    useEffect(() => {
        defineBottomPosition()
        setToggleNotification('5rem')
    },[])

  return <div className={style.pushNotification}
  style={{
      right: toggleNotification, 
      bottom: idx > 0 ? bottomPosition : '5rem'
    }}
  onClick={() => setToggleNotification('-50rem')} ref={notificationRef}>
      {/* <button onClick={playNotificationSound}></button> */}
      
      <figure>
            <img src={
              data.user.avatar 
              ?`/api/files/${data.user.avatar}`
              :`/images/photos/photo-1.png`
            } alt="notification" />
      </figure>
      <div className={style.pushNotification__content}>
          <h3>{data.title}</h3>
          <p>
              {data.body.substring(0, 90) + '....'}
          </p>
      </div>
  </div>;
};

export default PushNotification;
