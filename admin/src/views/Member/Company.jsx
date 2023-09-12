import React, { useState } from 'react'
import style from './style.module.scss'
import i18next from 'i18next'
import { Badge } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import classnames from 'classnames'
import { ProfileContainer, EditMember } from '@/src/components'
import { Plus } from '@/src/icons'

const Company = ({ company }) => {
  const [isEdit, setIsEdit] = useState(false)
  const lang = i18next.language
  const { t } = useTranslation()
  const profileCompanyClasses = classnames(style.profile__company, {
    [style.profile__company_ar]: lang === 'ar',
  })
  return (
    <>
      <EditMember isEdit={isEdit} setIsEdit={setIsEdit} type='company' />
      <div className={profileCompanyClasses}>
        <ProfileContainer title='company-works-with'>
          <div className={company ? style.profile__company_name : ''}>
            {company ? (
              <p>{company}</p>
            ) : (
              <div className={style.profile__company_edit}>
                <Badge bg='danger'>{t('not-provided')}</Badge>
                <span onClick={() => setIsEdit(true)}>
                  <Plus />
                </span>
              </div>
            )}
          </div>
        </ProfileContainer>
      </div>
    </>
  )
}

export default Company
