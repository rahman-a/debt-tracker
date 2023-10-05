import React from 'react'
import classes from './style.module.scss'
import { useLocation } from 'react-router-dom'
import i18next from 'i18next'

const EmployeeHeaderData = ({ style }) => {
  const location = useLocation()
  const query = new URLSearchParams(location.search)
  const arabicName = query.get('arName')
  const englishName = query.get('enName')
  const avatarUrl = query.get('avatar')
  const lang = i18next.language
  const employeeName = lang === 'en' ? englishName : arabicName
  return (
    <div className={classes.employee} style={style}>
      <figure className={classes.employee__avatar}>
        <img src={`/api/files/${avatarUrl}`} alt={employeeName} />
      </figure>
      <h3 className={classes.employee__name}>{employeeName}</h3>
    </div>
  )
}

export default EmployeeHeaderData
