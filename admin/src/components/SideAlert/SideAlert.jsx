import React, {useEffect, useState} from 'react';
import style from './style.module.scss'
import {Info, Check} from '../../icons'

const SideAlert = ({type, text, isOn, position, time, reset}) => {
    const [isToggle, setIsToggle] = useState(false)
  
  const getStyle = _ => {
    let style = {
      backgroundColor: type === 'danger' ? '#ffc6c6' : '#9ff9a0',
      right: isToggle ? '2rem' : '-50rem'
    }
    if(position === 'left') {
      style.right = 'unset'
      style.left = isToggle ? '2rem' : '-50rem'
    }

    return style
  }

  const closeSideAlert = _ => {
    setIsToggle(false)
    reset && setTimeout(() => reset(),250)
  }
  
    useEffect(() => {
      const period = time ? time : 10000
      if(isOn) {
        setIsToggle(true)
        setTimeout(() => {
          setIsToggle(false)
        },period)
        reset && setTimeout(() => reset(), period + 500)
      }
  },[isOn])
  
  return <div className={style.alert} 
          style={getStyle()}
          onClick={closeSideAlert}>
      
      <p style={{color: type === 'danger' ? '#700202' : '#065601'}}>
        <span>
          {
            type === 'danger'
            ? <Info/> 
            : <Check/>
          }
        </span>
        <i> {text} </i>
      </p>

  </div>;
};

export default SideAlert;

