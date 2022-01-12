import React from 'react'
import style from './style.module.scss'
import {ProfileContainer} from '../../components'
const Company = () => {
    return (
        <div className={style.profile__company}>
            <ProfileContainer title='Companies work with'>
                    <div className={style.profile__company_name}>
                        <p>Company Number 1</p>
                    </div>
                    <div className={style.profile__company_name}>
                        <p>Company Number 2</p>
                    </div>
            </ProfileContainer>
        </div>
    )
}

export default Company
