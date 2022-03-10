import React from 'react'
import style from './style.module.scss'
import {useTranslation} from 'react-i18next'
import {ProfileContainer} from '../../components'

const Social = () => {
    
    const {t} = useTranslation()
    return (
        <div className={style.profile__social}>
            <ProfileContainer title='social-media'>
                <div className={style.profile__social_wrapper}>
                    <h3>{t('share-on')}</h3>
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

export default Social
