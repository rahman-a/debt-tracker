import React from 'react'
import style from './style.module.scss'
import {Placeholder} from 'react-bootstrap'

const LoadingTimeLine = () => {
  return (
    <div className={style.dashboard__timeline_item} style={{width:'100%'}}>
        <div className={style.dashboard__timeline_dot} style={{backgroundColor:'#ccc'}}></div>
        <div className={style.dashboard__timeline_content} style={{width:'100%'}}>
               <Placeholder as='h3' size='sm' animation='glow'>
                   <Placeholder xs={12}/>
               </Placeholder>
                <Placeholder as='p' size='xs' animation='glow'>
                   <Placeholder xs={12}/>
               </Placeholder>
        </div>
    </div>
  )
}

export default LoadingTimeLine