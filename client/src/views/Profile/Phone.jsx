import React from 'react'
import style from './style.module.scss'
import {ProfileContainer, ProfileSegment} from '../../components'

const Phone = ({data}) => {
    return (
        <div className={style.profile__phones}>
            <ProfileContainer title='phones'>
                    <ProfileSegment
                        title='uae-phones'
                        type='phones'
                        text={data.insidePhones}
                    />
                    {
                        data.outsidePhones.length > 0
                        ? <ProfileSegment
                        title='outside-uae-phones'
                        type='outPhones'
                        placeholder='enter-outside-phone'
                        text={data.outsidePhones}
                        />
                        : <ProfileSegment
                        title='outside-uae-phones'
                        type='outPhones'
                        placeholder='enter-outside-phone'
                    />
                    }
                    

                   
            </ProfileContainer>
        </div>
    )
}

export default Phone
