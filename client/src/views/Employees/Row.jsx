// @ts-nocheck
import React from 'react'
import style from './style.module.scss'
import { Badge } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import i18next from 'i18next'
import { SideAlert } from '@/src/components'
import { EmployeeActions } from '@/src/components'
const Row = ({ employee, idx }) => {
  const { message, error } = useSelector((state) => state.deleteEmployee)

  const lang = i18next.language
  const variant = {
    '#037A12': { color: 'success', text: lang === 'ar' ? 'مؤهل' : 'OK' },
    '#fffb00': { color: 'warning', text: lang === 'ar' ? 'تحذير' : 'WARNING' },
    '#ec4a0d': { color: 'danger', text: lang === 'ar' ? 'خطر' : 'DANGER' },
  }

  const dateFormat = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }

  return (
    <>
      <SideAlert type='danger' text={error} isOn={error} position='right' />
      <SideAlert
        type='success'
        text={message}
        isOn={message}
        position='right'
      />

      <tr>
        <td> {idx + 1} </td>

        <td>{employee.code}</td>

        <td style={{ position: 'relative' }}>
          <div className={style.employees__provider}>
            <p>
              {lang === 'ar'
                ? employee.fullNameInArabic
                : employee.fullNameInEnglish}
            </p>
          </div>
        </td>

        <td style={{ padding: '0' }}>
          <div className={style.employees__photo}>
            <img
              src={`/api/files/${employee.avatar}`}
              alt={employee.fullNameInEnglish}
            />
          </div>
        </td>

        <td>
          {new Date(employee.createdAt).toLocaleDateString('en-US', dateFormat)}
        </td>

        <td style={{ padding: '0' }}>
          <div className={style.employees__code}>
            <Badge bg={variant[employee.status]?.color}>
              {variant[employee.status]?.text}
            </Badge>
          </div>
        </td>

        <td style={{ padding: 0 }}>
          <div className={style.employees__actions}>
            <EmployeeActions employee={employee} />
          </div>
        </td>
      </tr>
    </>
  )
}

export default Row
