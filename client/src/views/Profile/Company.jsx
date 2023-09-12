import React from 'react'
import style from './style.module.scss'
import { Badge } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { ProfileContainer } from '@/src/components'

const Company = ({ company }) => {
  const { t } = useTranslation()
  return (
    <div className={style.profile__company}>
      <ProfileContainer title='company-works-with'>
        <div className={company ? style.profile__company_name : ''}>
          {company ? (
            <p>{company}</p>
          ) : (
            <Badge bg='danger' className='w-25'>
              {t('not-provided')}
            </Badge>
          )}
        </div>
      </ProfileContainer>
    </div>
  )
}

export default Company
