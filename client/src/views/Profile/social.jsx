import React from 'react'
import style from './style.module.scss'
import {ProfileContainer} from '../../components'

const social = () => {
    return (
        <div className={style.profile__social}>
            <ProfileContainer title='social media'>
                <div className={style.profile__social_wrapper}>
                    <h3>Share on</h3>
                    <span>
                        <img src="/images/facebook.png" alt="facebook" />
                    </span>
                    <span>
                        <img src="/images/whatsapp.png" alt="whatsapp" />
                    </span>
                </div>
            </ProfileContainer>
        </div>
    )
}

export default social
