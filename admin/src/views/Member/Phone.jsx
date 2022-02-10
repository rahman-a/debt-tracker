import React from 'react'
import style from './style.module.scss'
import {ProfileContainer, ProfileSegment} from '../../components'

const Phone = ({data}) => {
    return (
        <div className={style.profile__phones}>
            <ProfileContainer title='Phones'>
                    <ProfileSegment
                        title='Phones inside UAE'
                        type='phones'
                        text={data.insidePhones}
                    />
                    {
                        data.outsidePhones.length > 0
                        ? <ProfileSegment
                        title='Phones outside UAE'
                        type='outPhones'
                        text={data.outsidePhones}
                        />
                        : <ProfileSegment
                        title='Phones outside UAE'
                        type='outPhones'
                        placeholder='Enter your outside phone'
                    />
                    }
            </ProfileContainer>
        </div>
    )
}

export default Phone
