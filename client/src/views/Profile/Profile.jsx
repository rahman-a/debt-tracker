import React, { useEffect } from 'react'
import style from './style.module.scss'

import Personal from './Personal'
import Address from './Address'
import Phone from './Phone'
import Documents from './Documents'
import Company from './Company'
import Social from './social'

import { Loader, HeaderAlert } from '../../components'

import { useSelector, useDispatch } from 'react-redux'
import actions from '../../actions'
import i18next from 'i18next'

const Profile = () => {
  const { loading, error, user } = useSelector((state) => state.userProfile)

  const dispatch = useDispatch()

  const lang = i18next.language

  useEffect(() => {
    dispatch(actions.users.getUserProfile())
  }, [])

  return (
    <div className={style.profile}>
      <div className='container'>
        {loading ? (
          <Loader size='7' center options={{ animation: 'border' }} />
        ) : error ? (
          <HeaderAlert type='danger' text={error} />
        ) : (
          user && (
            <div className={style.profile__wrapper}>
              <Personal
                data={{
                  code: user.code,
                  color: user.colorCode,
                  avatar: user.avatar,
                  fullName:
                    lang === 'en'
                      ? user.fullNameInEnglish
                      : user.fullNameInArabic,
                  username: user.username,
                  emails: user.emails,
                }}
              />
              <Phone
                data={{
                  insidePhones: user.insidePhones,
                  outsidePhones: user.outsidePhones,
                }}
              />
              <Address
                data={{
                  insideAddress: user.insideAddress,
                  outsideAddress: user.outsideAddress,
                  country: user.country,
                }}
              />
              <Documents
                data={[
                  { file: user['identity-front'], type: 'identity-front' },
                  { file: user['identity-back'], type: 'identity-back' },
                  { file: user.passport, type: 'passport' },
                ]}
              />
              <Company company={user.companyName} />
              <Social />
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default Profile
