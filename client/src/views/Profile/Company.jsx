import React from 'react'
import style from './style.module.scss'
import {ProfileContainer} from '../../components'
const Company = ({company}) => {
    return (
        <div className={style.profile__company}>
            <ProfileContainer title='Companies work with'>
                    <div className={style.profile__company_name}>
                        <p>{company}</p>
                    </div>
            </ProfileContainer>
        </div>
    )
}

export default Company
