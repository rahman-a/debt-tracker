import React, { useState } from 'react'
import style from './style.module.scss'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { ProfileContainer, ProfileSegment, EditMember } from '../../components'
import { Copy, Check, Wrench } from '../../icons'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import classnames from 'classnames'

const Personal = ({ data }) => {
  const [isCopied, setIsCopied] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const { t } = useTranslation()
  const lang = i18next.language

  const profilePersonalClasses = classnames(style.profile__personal, {
    [style.profile__personal_ar]: lang === 'ar',
  })

  const copyIdHandler = (_) => {
    setIsCopied(true)
    setTimeout(() => {
      setIsCopied(false)
    }, 1000)
  }
  return (
    <>
      <EditMember isEdit={isEdit} setIsEdit={setIsEdit} type='name' />
      <div className={profilePersonalClasses}>
        <ProfileContainer
          title='personal-info'
          ribbon={{ color: data.color.code, states: data.color.state }}
        >
          <div className={style.profile__personal_info}>
            {data.isProvider && (
              <div className={style.profile__personal_provider}>
                <span>
                  <Wrench />
                </span>
                <p> {t('provider')} </p>
              </div>
            )}
            <img src={`api/files/${data.avatar}`} alt='' />
            {data.fullName ? (
              <h2>{data.fullName}</h2>
            ) : (
              <h2
                className={style.profile__personal_edit}
                onClick={() => setIsEdit(true)}
              >
                enter member name
              </h2>
            )}
            <p>
              <span>{t('username')}</span>: <span>{data.username}</span>
            </p>
            <p>
              <span>{t('id')}</span>: <span>{data.code}</span>
              &nbsp;
              <CopyToClipboard text={data.code} onCopy={copyIdHandler}>
                <span> {isCopied ? <Check /> : <Copy />} </span>
              </CopyToClipboard>
            </p>
          </div>

          <ProfileSegment title='email' type='email' text={data.emails} />
        </ProfileContainer>
      </div>
    </>
  )
}

export default Personal
