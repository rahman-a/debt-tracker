import React from 'react'
import style from './style.module.scss'
import {Ribbon} from '../../components'

const ProfileContainer = ({children, title, ribbon, className}) => {

    return (
        <div className={`${style.profileContainer} ${className ? className :''}`}>
            <h2>{title}</h2>
            <div className={style.profileContainer_data}>
                {ribbon 
                && <Ribbon color={ribbon.color} states={ribbon.states}/>}
                {children}
            </div>
        </div>
    )
}

export default ProfileContainer
