import React from 'react'
import style from './style.module.scss'
import {ProfileContainer} from '../../components'
import i18next from 'i18next'
const Company = ({company}) => {
    const lang = i18next.language
    return (
        <div className={`${style.profile__company} ${lang === 'ar' ? style.profile__company_ar :''}`}>
            <ProfileContainer title='company-works-with'>
                    <div className={style.profile__company_name}>
                        <p>{company}</p>
                    </div>
            </ProfileContainer>
        </div>
    )
}

export default Company
