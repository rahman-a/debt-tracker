import React from 'react'
import style from './style.module.scss'
import { ProfileContainer, ProfileSegment } from '../../components'
import i18next from 'i18next'
import classnames from 'classnames'

const Phone = ({ data }) => {
  const lang = i18next.language
  const profilePhonesClasses = classnames(style.profile__phones, {
    [style.profile__phones_ar]: lang === 'ar',
  })
  return (
    <div className={profilePhonesClasses}>
      <ProfileContainer title='phones'>
        <ProfileSegment
          title='uae-phones'
          type='phones'
          text={data.insidePhones}
        />
        {data.outsidePhones.length > 0 ? (
          <ProfileSegment
            title='outside-uae-phones'
            type='outPhones'
            text={data.outsidePhones}
          />
        ) : (
          <ProfileSegment
            title='outside-uae-phones'
            type='outPhones'
            placeholder='enter-outside-phone'
          />
        )}
      </ProfileContainer>
    </div>
  )
}

export default Phone
