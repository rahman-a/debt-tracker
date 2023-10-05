// @ts-nocheck
import React, { useEffect, useState } from 'react'
import style from './style.module.scss'
import i18next from 'i18next'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import Personal from './Personal'
import Address from './Address'
import Phone from './Phone'
import Documents from './Documents'
import Company from './Company'
import Social from './social'
import { Loader, HeaderAlert } from '@/src/components'
import actions from '@/src/actions'

const Profile = () => {
  const [isEmployee, setIsEmployee] = useState(false)
  const { loading, error, user } = useSelector((state) => state.userProfile)

  const dispatch = useDispatch()

  const { id } = useParams()

  const lang = i18next.language

  useEffect(() => {
    dispatch(actions.users.getUserProfile(id))
    id ? setIsEmployee(true) : setIsEmployee(false)
  }, [id])

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
                isEmployee={isEmployee}
              />
              <Phone
                data={{
                  insidePhones: user.insidePhones,
                  outsidePhones: user.outsidePhones,
                }}
                isEmployee={isEmployee}
              />
              <Address
                data={{
                  insideAddress: user.insideAddress,
                  outsideAddress: user.outsideAddress,
                  country: user.country,
                }}
                isEmployee={isEmployee}
              />
              <Documents
                data={[
                  { file: user['identity-front'], type: 'identity-front' },
                  { file: user['identity-back'], type: 'identity-back' },
                  { file: user.passport, type: 'passport' },
                ]}
                isEmployee={isEmployee}
              />
              {/* <Company company={user.companyName} /> */}
              {!isEmployee && <Social />}
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default Profile
