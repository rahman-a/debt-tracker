import React from 'react'
import style from './style.module.scss'
import Personal from './Personal'
import Address from './Address'
import Phone from './Phone'
import Documents from './Documents'
import Company from './Company'
import Social from './social'

const Profile = () => {
    return (
        <div className={style.profile}>
            <div className="container">
                <div className={style.profile__wrapper}>
                    <Personal/>
                    <Phone/>
                    <Address/>
                    <Documents/>
                    <Company/>
                    <Social/>
                </div>
            </div>
            
        </div>
    )
}

export default Profile
