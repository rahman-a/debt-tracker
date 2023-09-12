import React from 'react'
import style from './style.module.scss'
import i18next from 'i18next'
import classnames from 'classnames'
import { ProfileContainer, ProfileSegment } from '@/src/components'

const Address = ({ data }) => {
  const lang = i18next.language
  const profileAddressClasses = classnames(style.profile__address, {
    [style.profile__address_ar]: lang === 'ar',
  })
  return (
    <div className={profileAddressClasses}>
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
