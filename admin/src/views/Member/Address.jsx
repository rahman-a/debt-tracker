import React from 'react'
import style from './style.module.scss'
import { ProfileContainer, ProfileSegment } from '../../components'
import i18next from 'i18next'

const Address = ({ data }) => {
  const lang = i18next.language
  return (
    <div
      className={`${style.profile__address} ${
        lang === 'ar' ? style.profile__address_ar : ''
      }`}
    >
      <ProfileContainer title='addresses'>
        <ProfileSegment title='country' type='country' text={data.country} />

        {data.insideAddress ? (
          <ProfileSegment title='uae-addresses' text={data.insideAddress} />
        ) : (
          <ProfileSegment
            title='uae-addresses'
            type='insideAddress'
            placeholder='Enter Your Inside Address'
          />
        )}

        {data.outsideAddress ? (
          <ProfileSegment
            title='outside-uae-addresses'
            text={data.outsideAddress}
          />
        ) : (
          <ProfileSegment
            title='outside-uae-addresses'
            type='outAddress'
            placeholder='Enter Your Outside Address'
          />
        )}
      </ProfileContainer>
    </div>
  )
}

export default Address
