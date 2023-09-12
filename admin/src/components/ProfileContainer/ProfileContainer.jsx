import React from 'react'
import style from './style.module.scss'
import { useTranslation } from 'react-i18next'
import { Ribbon } from '@/src/components'

const ProfileContainer = ({ children, title, ribbon, className }) => {
  const { t } = useTranslation()
  return (
    <div className={`${style.profileContainer} ${className ? className : ''}`}>
      <h2>{t(title)}</h2>
      <div className={style.profileContainer_data}>
        {ribbon && <Ribbon color={ribbon.color} states={ribbon.states} />}
        {children}
      </div>
    </div>
  )
}

export default ProfileContainer
