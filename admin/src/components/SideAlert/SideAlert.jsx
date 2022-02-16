import React, {useEffect, useState} from 'react';
import style from './style.module.scss'
import {Info, Check} from '../../icons'



const SideAlert = ({type, text, isOn, reset}) => {
    const [isToggle, setIsToggle] = useState(false)
    const [progressWidth, setProgressWidth] = useState(0)

  useEffect(() => {
    let toggleSideAlert;
      
    if(isOn) {
        
        setIsToggle(true)
        
        const progressInterval = setInterval(() => {
            setProgressWidth(prev => prev + 1)
        },100)
       
        toggleSideAlert =  setTimeout(() => {
          clearInterval(progressInterval)
          setProgressWidth(0)
          setIsToggle(false)
          reset()
        },10000)
      }
      return () => clearTimeout(toggleSideAlert)
  },[isOn])
  
  return <div className={style.alert} 
          style={{
            backgroundColor: type === 'danger' ? '#ffc6c6' : '#9ff9a0',
            right: isToggle ? '2rem' : '-50rem'}}>
      
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
       <div className={style.alert__progress}
       style={{
         width:`${progressWidth}%`,
         backgroundColor: type === 'danger' ? 'red' : 'green'
         }}></div>
  </div>;
};

export default SideAlert;

