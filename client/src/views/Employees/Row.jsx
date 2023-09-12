import React, { useState, useEffect, useRef } from 'react'
import style from './style.module.scss'
import { useNavigate } from 'react-router-dom'
import { Modal, Button, Badge } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import { Loader, SideAlert } from '@/src/components'
import { Trash } from '@/src/icons'
import actions from '@/src/actions'

const Row = ({ employee, idx }) => {
  const [toggleDelete, setToggleDelete] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const clearSetTimeout = useRef(null)
  const { message, error } = useSelector((state) => state.deleteEmployee)
  const { t } = useTranslation()

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

  const confirmDeleteUser = (_) => {
    setToggleDelete(false)
    setIsDeleting(true)
    clearSetTimeout.current = setTimeout(
      () => dispatch(actions.employees.deleteEmployee(employee._id)),
      500
    )
  }

  const initiateUserDelete = () => {
    setToggleDelete(true)
  }

  useEffect(() => {
    ;(message || error) && setIsDeleting(false)
    return () => {
      clearTimeout(clearSetTimeout.current)
    }
  }, [message, error])

  return (
    <>
      <SideAlert type='danger' text={error} isOn={error} position='right' />
      <SideAlert
        type='success'
        text={message}
        isOn={message}
        position='right'
      />
      <Modal show={toggleDelete} onHide={() => setToggleDelete(false)}>
        <Modal.Body>
          <div className={style.employees__delete}>
            <h2>{t('are-you-sure')}</h2>
            <p>
              {t('confirm-delete-notice', {
                asset: lang === 'ar' ? 'موظف' : 'The Employee',
              })}
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => setToggleDelete(false)}
            variant='success'
            size='lg'
          >
            {t('cancel')}
          </Button>
          <Button variant='danger' size='lg' onClick={confirmDeleteUser}>
            {t('delete')}
          </Button>
        </Modal.Footer>
      </Modal>
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
            {/* <span onClick={() => navigate(`/employees/${employee._id}`)}>
              <Edit />
            </span> */}
            {isDeleting ? (
              <Loader size='4' options={{ animation: 'border' }} />
            ) : (
              <span onClick={() => initiateUserDelete(employee._id)}>
                <Trash />
              </span>
            )}
          </div>
        </td>
      </tr>
    </>
  )
}

export default Row
