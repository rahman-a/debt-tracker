import React from 'react'
import style from './style.module.scss'
import {ProfileContainer, ProfileSegment} from '../../components'

const Address = () => {
    return (
        <div className={style.profile__address}>
            <ProfileContainer title='Addresses'>
                
                <ProfileSegment
                    title='Address in UAE'
                    text='80 Fat District Rad ST UAE'
                />

                <ProfileSegment
                    title='Address outside UAE'
                    text='80 Fat District Rad ST UAE'
                />

                <ProfileSegment
                    title='Address outside UAE'
                    type='text'
                    placeholder='Enter Your Outside Address'
                />
                
            </ProfileContainer>
        </div>
    )
}

export default Address
