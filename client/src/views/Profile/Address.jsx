import React from 'react'
import style from './style.module.scss'
import {ProfileContainer, ProfileSegment} from '../../components'

const Address = ({data}) => {
    return (
        <div className={style.profile__address}>
            <ProfileContainer title='Addresses'>
                
                <ProfileSegment
                    title='Country'
                    type='country'
                    text={data.country}
                />
                
                
                <ProfileSegment
                    title='Addresses in UAE'
                    text={data.insideAddress}
                />

                {
                    data.outsideAddress 
                    ?   <ProfileSegment
                        title='Addresses outside UAE'
                        text={data.outsideAddress }
                        />
                    :   <ProfileSegment
                        title='Addresses outside UAE'
                        type='outAddress'
                        placeholder='Enter Your Outside Address'
                        />
                }
                

                
                
            </ProfileContainer>
        </div>
    )
}

export default Address
