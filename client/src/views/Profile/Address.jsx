import React from 'react'
import style from './style.module.scss'
import { ProfileContainer, ProfileSegment } from '@/src/components'

const Address = ({ data }) => {
  return (
    <div className={style.profile__address}>
      <ProfileContainer title='addresses'>
        <ProfileSegment title='country' type='country' text={data.country} />

        <ProfileSegment title='uae-addresses' text={data.insideAddress} />

        {data.outsideAddress ? (
          <ProfileSegment
            title='outside-uae-addresses'
            text={data.outsideAddress}
          />
        ) : (
          <ProfileSegment
            title='outside-uae-addresses'
            type='outAddress'
            placeholder='enter-outside-address'
          />
        )}
      </ProfileContainer>
    </div>
  )
}

export default Address
