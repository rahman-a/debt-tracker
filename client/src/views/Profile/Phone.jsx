import React from 'react'
import style from './style.module.scss'
import {ProfileContainer, ProfileSegment} from '../../components'

const Phone = () => {
    return (
        <div className={style.profile__phones}>
            <ProfileContainer title='Phones'>
                    <ProfileSegment
                        title='Phone inside UAE'
                        text='01254879362'
                    />

                    <ProfileSegment
                        title='Phone outside UAE'
                        text='01254879362'
                    />

                    <ProfileSegment
                        title='Phone outside UAE'
                        type='text'
                        placeholder='Enter your outside phone'
                    />
            </ProfileContainer>
        </div>
    )
}

export default Phone
