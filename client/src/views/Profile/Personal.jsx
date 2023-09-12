import React, { useState } from 'react'
import style from './style.module.scss'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useTranslation } from 'react-i18next'
import { ProfileContainer, ProfileSegment } from '@/src/components'
import { Copy, Check } from '@/src/icons'

const Personal = ({ data }) => {
  const [isCopied, setIsCopied] = useState(false)
  const { t } = useTranslation()
  const copyIdHandler = (_) => {
    setIsCopied(true)
    setTimeout(() => {
      setIsCopied(false)
    }, 1000)
  }
  return (
    <div className={style.profile__personal}>
      <ProfileContainer
        title='personal-info'
        ribbon={{ color: data.color.code, states: data.color.state }}
      >
        <div className={style.profile__personal_info}>
          <img src={`api/files/${data.avatar}`} alt='' />
          <h2>{data.fullName}</h2>
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

        <ProfileSegment
          title='password'
          text='*************'
          type='password'
          placeholder='type-new-pass'
        />
      </ProfileContainer>
    </div>
  )
}

export default Personal
